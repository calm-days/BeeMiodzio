import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold">Panel administracyjny</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-sm text-muted-foreground">Aktywni klienci</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">12</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm text-muted-foreground">Ule</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">8</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm text-muted-foreground">Zamówienia (ten miesiąc)</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">3</p></CardContent>
        </Card>
      </div>
    </div>
  );
}
