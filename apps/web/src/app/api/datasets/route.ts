import { CreateDatasetSchema } from '@notionchartkit/contracts';
import { prisma } from '@notionchartkit/db';
import { type NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

// GET /api/datasets - List all datasets
export async function GET(_request: NextRequest) {
  try {
    const datasets = await prisma.dataset.findMany({
      include: {
        connection: {
          select: {
            workspaceName: true,
            workspaceIcon: true,
          },
        },
        _count: {
          select: {
            charts: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ datasets });
  } catch (error) {
    console.error('Failed to fetch datasets:', error);
    return NextResponse.json({ error: 'Failed to fetch datasets' }, { status: 500 });
  }
}

// POST /api/datasets - Create new dataset
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body with Zod schema
    const validatedData = CreateDatasetSchema.parse(body);

    // Get userId from request body (sent from client with session data)
    const userId = body.userId as string;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized - userId required' }, { status: 401 });
    }

    // Create dataset in database
    const dataset = await prisma.dataset.create({
      data: {
        name: validatedData.name,
        databaseId: validatedData.databaseId,
        connectionId: validatedData.connectionId,
        userId: userId,
        config: validatedData.config,
        refreshIntervalMinutes: validatedData.refreshIntervalMinutes,
      },
      include: {
        connection: true,
      },
    });

    return NextResponse.json({ dataset }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Failed to create dataset:', error);
    return NextResponse.json({ error: 'Failed to create dataset' }, { status: 500 });
  }
}
