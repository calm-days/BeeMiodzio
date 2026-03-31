import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function KameryPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold">Kamery</h1>
      <Card>
        <CardHeader>
          <CardTitle>Ul #3 — Kamera na żywo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex aspect-video items-center justify-center rounded-lg bg-muted">
            <p className="text-muted-foreground">Odtwarzacz HLS — placeholder</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
