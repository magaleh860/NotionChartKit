import { ChartRenderer } from '@/components/chart-renderer';
import { prisma } from '@notionchartkit/db';
import { notFound } from 'next/navigation';

interface EmbedPageProps {
  params: {
    publicKey: string;
  };
}

export default async function EmbedPage({ params }: EmbedPageProps) {
  const { publicKey } = params;

  // Fetch chart by public key
  const chart = await prisma.chart.findUnique({
    where: { publicKey },
    include: {
      dataset: {
        include: {
          connection: true,
        },
      },
    },
  });

  if (!chart) {
    notFound();
  }

  // Increment view count
  await prisma.chart.update({
    where: { id: chart.id },
    data: { viewCount: { increment: 1 } },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900">
            {(chart.metadata as { title?: string } | null)?.title || chart.dataset.name}
          </h1>
        </div>

        <ChartRenderer chartId={chart.id} height={500} showTitle={false} />

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>
              <span className="font-medium">{chart.viewCount + 1}</span> views
            </div>
            <div>
              Chart type: <span className="font-medium capitalize">{chart.type}</span>
            </div>
            <div>Updated: {new Date(chart.updatedAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
