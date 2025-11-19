import { prisma } from '@notionchartkit/db';
import { Client } from '@notionhq/client';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET /api/datasets/:id/properties - Get Notion database properties
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Fetch dataset with connection
    const dataset = await prisma.dataset.findUnique({
      where: { id },
      include: {
        connection: true,
      },
    });

    if (!dataset) {
      return NextResponse.json({ error: 'Dataset not found' }, { status: 404 });
    }

    // Initialize Notion client
    const notion = new Client({
      auth: dataset.connection.accessToken,
    });

    // Fetch database schema
    const database = await notion.databases.retrieve({
      database_id: dataset.databaseId,
    });

    // Extract property names and types
    const properties = Object.entries(database.properties).map(([name, prop]) => ({
      name,
      type: prop.type,
      id: prop.id,
    }));

    return NextResponse.json({ properties });
  } catch (error) {
    console.error('Failed to fetch database properties:', error);
    return NextResponse.json({ error: 'Failed to fetch database properties' }, { status: 500 });
  }
}
