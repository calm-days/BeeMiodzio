import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold">Twój panel</h1>
      <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Twój ul</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Ul #3 — Lipowa Pasieka</p>
              <Badge className="mt-2">Aktywna subskrypcja</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Waga ula</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">42.3 kg</p>
              <p className="text-sm text-muted-foreground">Ostatni odczyt: dziś 08:00</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Następna dostawa</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Sierpień 2025</p>
              <p className="text-sm text-muted-foreground">Szacunkowo 2.5 kg miodu</p>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
