// Public embed page
export default function EmbedPage({ params }: { params: { publicKey: string } }) {
  const { publicKey } = params;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="bg-white border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Chart Embed: {publicKey}</h2>
          <div className="h-96 bg-muted rounded flex items-center justify-center">
            <p className="text-muted-foreground">Chart visualization will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
