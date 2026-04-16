import { Card, CardContent } from "@/components/ui/card";
import { Megaphone } from "lucide-react";

export default function Campaigns() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Campaigns & Analytics</h1>
        <p className="text-sm text-muted-foreground">Campaign performance tracking and insights</p>
      </div>

      <Card>
        <CardContent className="py-20 flex flex-col items-center justify-center text-center gap-4">
          <div className="h-14 w-14 rounded-full bg-accent flex items-center justify-center">
            <Megaphone className="h-7 w-7 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-base">No campaign data available</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Campaign data will appear here once connected to your campaign tracking system.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
