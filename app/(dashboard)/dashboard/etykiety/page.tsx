import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EtykietyPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold">Etykiety</h1>
      <Card>
        <CardHeader>
          <CardTitle>Wybierz design etykiety</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Katalog etykiet — placeholder</p>
        </CardContent>
      </Card>
    </div>
  );
}
