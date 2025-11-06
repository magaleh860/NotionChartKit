import { type NextRequest, NextResponse } from 'next/server';

// GET /api/charts/:id - Get chart data
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    // TODO: Fetch chart data from Redis cache or regenerate

    return NextResponse.json({
      id,
      type: 'bar',
      data: [],
      metadata: {},
    });
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to fetch chart' }, { status: 500 });
  }
}
