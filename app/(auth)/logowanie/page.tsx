import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function LogowaniePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-2xl">Zaloguj się</CardTitle>
        <CardDescription>Wpisz email, aby otrzymać magic link</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input type="email" placeholder="twoj@email.pl" />
        <Button className="w-full">Wyślij link logowania</Button>
        <p className="text-center text-sm text-muted-foreground">
          Nie masz konta?{" "}
          <Link href="/rejestracja" className="text-primary hover:underline">
            Zarejestruj się
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
