import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@notionchartkit/db';
import { CreateChartSchema } from '@notionchartkit/contracts';
import { ZodError } from 'zod';

// GET /api/charts - List all charts
export async function GET(_request: NextRequest) {
  try {
    const charts = await prisma.chart.findMany({
      include: {
        dataset: {
          include: {
            connection: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ charts });
  } catch (error) {
    console.error('Failed to fetch charts:', error);
    return NextResponse.json({ error: 'Failed to fetch charts' }, { status: 500 });
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

    return NextResponse.json({ 
      chart: {
        ...chart,
        embedCode: updatedEmbedCode,
      }
    }, { status: 201 });
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
