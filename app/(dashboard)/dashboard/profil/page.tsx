import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function ProfilPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold">Profil</h1>
        <Card>
          <CardHeader>
            <CardTitle>Dane osobowe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Imię i nazwisko" defaultValue="Jan Kowalski" />
            <Input placeholder="Email" defaultValue="jan@example.pl" />
            <Button>Zapisz zmiany</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Subskrypcja</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Badge>1/3 ula</Badge>
              <span className="text-sm text-muted-foreground">Aktywna do: 2026-03-29</span>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
