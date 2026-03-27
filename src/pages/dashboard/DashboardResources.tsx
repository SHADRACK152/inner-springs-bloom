import DashboardLayout from "@/components/DashboardLayout";
import { FileText, Video, BookOpen, FileSpreadsheet, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboardData } from "@/hooks/useDashboardData";

const iconMap = { article: FileText, video: Video, guide: BookOpen, worksheet: FileSpreadsheet };

const DashboardResources = () => {
  const { data, isLoading } = useDashboardData();

  if (isLoading || !data) {
    return (
      <DashboardLayout>
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">Loading resources...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-navy">Resources</h1>
        <p className="text-muted-foreground">Helpful materials to support your growth journey.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.resources.map((r) => {
          const Icon = iconMap[r.type];
          return (
            <div key={r.id} className="rounded-lg border border-border bg-card p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-xs font-medium uppercase tracking-wider text-primary">{r.type}</span>
              </div>
              <h4 className="text-sm font-semibold text-foreground">{r.title}</h4>
              <p className="mt-1 text-xs text-muted-foreground">{r.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{r.category}</span>
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  <ExternalLink className="h-3 w-3" /> View
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </DashboardLayout>
  );
};

export default DashboardResources;
