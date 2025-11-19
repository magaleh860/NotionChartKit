import { CreateChartSchema } from '@notionchartkit/contracts';
import { prisma } from '@notionchartkit/db';
import { type NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

// GET /api/charts/:id - Get chart data
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Fetch chart with associated dataset
    const chart = await prisma.chart.findUnique({
      where: { id },
      include: {
        dataset: {
          include: {
            connection: true,
          },
        },
      },
    });

    if (!chart) {
      return NextResponse.json({ error: 'Chart not found' }, { status: 404 });
    }

    // Return chart with full metadata
    return NextResponse.json({
      id: chart.id,
      publicKey: chart.publicKey,
      type: chart.type,
      metadata: chart.metadata,
      isPublic: chart.isPublic,
      dataset: {
        id: chart.dataset.id,
        name: chart.dataset.name,
        databaseId: chart.dataset.databaseId,
      },
    });
  } catch (error) {
    console.error('Failed to fetch chart:', error);
    return NextResponse.json({ error: 'Failed to fetch chart' }, { status: 500 });
  }
}

// PATCH /api/charts/:id - Update chart
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();

    // Check if chart exists
    const existingChart = await prisma.chart.findUnique({
      where: { id },
    });

    if (!existingChart) {
      return NextResponse.json({ error: 'Chart not found' }, { status: 404 });
    }

    // Update chart
    const chart = await prisma.chart.update({
      where: { id },
      data: {
        type: body.type,
        metadata: body.metadata || {},
        isPublic: body.isPublic,
      },
      include: {
        dataset: true,
      },
    });

    return NextResponse.json({ chart });
  } catch (error) {
    console.error('Failed to update chart:', error);
    return NextResponse.json({ error: 'Failed to update chart' }, { status: 500 });
  }
}

// POST /api/charts - Create new chart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body with Zod schema
    const validatedData = CreateChartSchema.parse(body);

    // Verify dataset exists
    const dataset = await prisma.dataset.findUnique({
      where: { id: validatedData.datasetId },
    });

    if (!dataset) {
      return NextResponse.json({ error: 'Dataset not found' }, { status: 404 });
    }

    // Generate embed code
    const embedCode = `<iframe src="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/e/{{publicKey}}" width="100%" height="400" frameborder="0"></iframe>`;

    // Create chart in database
    const chart = await prisma.chart.create({
      data: {
        datasetId: validatedData.datasetId,
        type: validatedData.type,
        metadata: validatedData.metadata || {},
        isPublic: validatedData.isPublic,
        embedCode,
      },
      include: {
        dataset: true,
      },
    });

    // Update embed code with actual publicKey
    const updatedEmbedCode = embedCode.replace('{{publicKey}}', chart.publicKey);
    await prisma.chart.update({
      where: { id: chart.id },
      data: { embedCode: updatedEmbedCode },
    });

    return NextResponse.json(
      {
        chart: {
          ...chart,
          embedCode: updatedEmbedCode,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Failed to create chart:', error);
    return NextResponse.json({ error: 'Failed to create chart' }, { status: 500 });
  }
}
