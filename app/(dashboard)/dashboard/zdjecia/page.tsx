import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ZdjeciaPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold">Zdjęcia i aktualizacje</h1>
      <Card>
        <CardHeader>
          <CardTitle>Ostatnie aktualizacje</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Lista fotorelacji — placeholder</p>
        </CardContent>
      </Card>
    </div>
  );
}
