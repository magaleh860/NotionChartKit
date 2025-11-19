import { authOptions } from '@/lib/auth';
import { prisma } from '@notionchartkit/db';
import { getServerSession } from 'next-auth';
import { type NextRequest, NextResponse } from 'next/server';

// GET /api/notion/databases - List user's accessible Notion databases
export async function GET(_request: NextRequest) {
  try {
    // Get authenticated user session
    const session = await getServerSession(authOptions);

    if (!session?.user?.dbUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's Notion connection to retrieve access token
    const connection = await prisma.notionConnection.findFirst({
      where: { userId: session.user.dbUserId },
    });

    if (!connection) {
      return NextResponse.json(
        { error: 'No Notion connection found. Please reconnect your account.' },
        { status: 404 }
      );
    }

    // Fetch databases from Notion API using the search endpoint
    // This returns all databases the integration has access to
    const response = await fetch('https://api.notion.com/v1/search', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${connection.accessToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          value: 'database',
          property: 'object',
        },
        sort: {
          direction: 'descending',
          timestamp: 'last_edited_time',
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Notion API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to fetch databases from Notion', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Transform the response to return only relevant database info
    const databases = data.results.map((db: NotionDatabase) => ({
      id: db.id,
      title: extractDatabaseTitle(db),
      icon: db.icon,
      lastEditedTime: db.last_edited_time,
      url: db.url,
    }));

    return NextResponse.json({ databases });
  } catch (error) {
    console.error('Failed to fetch Notion databases:', error);
    return NextResponse.json({ error: 'Failed to fetch databases' }, { status: 500 });
  }
}

// Helper function to extract database title from Notion response
function extractDatabaseTitle(database: NotionDatabase): string {
  if (!database.title || database.title.length === 0) {
    return 'Untitled';
  }

  // Notion titles are rich text arrays
  return database.title.map((t) => t.plain_text).join('');
}

// Type definitions for Notion API response
interface NotionDatabase {
  id: string;
  title: Array<{
    plain_text: string;
  }>;
  icon?: {
    type: string;
    emoji?: string;
    external?: { url: string };
    file?: { url: string };
  };
  last_edited_time: string;
  url: string;
}
