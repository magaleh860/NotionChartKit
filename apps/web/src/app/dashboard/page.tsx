export default function DashboardPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 border border-border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Datasets</h2>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-muted-foreground mt-2">Connected datasets</p>
          </div>
          <div className="p-6 border border-border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Charts</h2>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-muted-foreground mt-2">Active charts</p>
          </div>
          <div className="p-6 border border-border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Embeds</h2>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-muted-foreground mt-2">Total embeds</p>
          </div>
        </div>
      </div>
    </div>
  );
}
