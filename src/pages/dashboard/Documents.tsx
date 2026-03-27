import DashboardLayout from "@/components/DashboardLayout";
import { Download, FileText, FileCheck, FileSpreadsheet, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboardData } from "@/hooks/useDashboardData";

const iconMap = { report: FileText, agreement: FileCheck, certificate: Award, assessment: FileSpreadsheet };

const Documents = () => {
  const { data, isLoading } = useDashboardData();

  if (isLoading || !data) {
    return (
      <DashboardLayout>
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">Loading documents...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-navy">Documents</h1>
        <p className="text-muted-foreground">Download documents related to your completed sessions.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.documents.map((doc) => {
          const Icon = iconMap[doc.type];
          return (
            <div key={doc.id} className="rounded-lg border border-border bg-card p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">{doc.type}</span>
              </div>
              <h4 className="mt-3 text-sm font-semibold text-foreground">{doc.title}</h4>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>{doc.dateAdded}</span>
                <span>{doc.fileSize}</span>
              </div>
              {doc.sessionRelated && (
                <p className="mt-1 text-xs text-muted-foreground">Related to Session {doc.sessionRelated}</p>
              )}
              <Button variant="outline" size="sm" className="mt-3 w-full gap-2">
                <Download className="h-3 w-3" /> Download
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  </DashboardLayout>
  );
};

export default Documents;
