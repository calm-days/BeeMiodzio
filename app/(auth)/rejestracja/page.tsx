import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function RejestracjaPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-2xl">Rejestracja</CardTitle>
        <CardDescription>Utwórz konto BeeSharing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input type="text" placeholder="Imię i nazwisko" />
        <Input type="email" placeholder="twoj@email.pl" />
        <Button className="w-full">Zarejestruj się</Button>
        <p className="text-center text-sm text-muted-foreground">
          Masz już konto?{" "}
          <Link href="/logowanie" className="text-primary hover:underline">
            Zaloguj się
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
