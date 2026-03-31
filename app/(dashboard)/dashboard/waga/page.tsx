import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WagaPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold">Waga ula</h1>
      <Card>
        <CardHeader>
          <CardTitle>Wykres wagi — ostatnie 7 dni</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center rounded-lg bg-muted">
            <p className="text-muted-foreground">Recharts wykres — placeholder</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
