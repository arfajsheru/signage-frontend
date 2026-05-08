export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
      <div className="grid auto-rows-min gap-6 md:grid-cols-3">
        <div className="aspect-video rounded-2xl bg-muted/50 border border-border/50 flex flex-col items-center justify-center p-6 text-center">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          </div>
          <h3 className="text-sm font-medium">Active Displays</h3>
          <p className="text-2xl font-bold mt-1">12</p>
        </div>
        <div className="aspect-video rounded-2xl bg-muted/50 border border-border/50 flex flex-col items-center justify-center p-6 text-center">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <div className="h-2 w-2 rounded-full bg-green-500" />
          </div>
          <h3 className="text-sm font-medium">Uptime</h3>
          <p className="text-2xl font-bold mt-1">99.9%</p>
        </div>
        <div className="aspect-video rounded-2xl bg-muted/50 border border-border/50 flex flex-col items-center justify-center p-6 text-center">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
          </div>
          <h3 className="text-sm font-medium">Content Sync</h3>
          <p className="text-2xl font-bold mt-1">Synced</p>
        </div>
      </div>
      <div className="min-h-[400px] flex-1 rounded-2xl bg-muted/30 border border-border/50 md:min-h-min p-8 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-xl font-semibold tracking-tight">System Health</h2>
          <p className="text-muted-foreground text-sm mt-1">Real-time status of your signage network.</p>
          
          <div className="mt-8 grid gap-4 max-w-2xl">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 rounded-lg bg-background border border-border/40 flex items-center px-4 justify-between animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium">Terminal Node {i}00{i}</span>
                </div>
                <span className="text-xs text-muted-foreground">Connected</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 bg-primary/5 rounded-full blur-3xl" />
      </div>
    </div>
  )
}
