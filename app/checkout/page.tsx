import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CheckoutPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 py-16">
      <h1 className="font-heading text-3xl font-bold">Zamówienie</h1>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Podsumowanie</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Tutaj będzie wybór taryfy, dodatkowych opcji i przejście do Stripe Checkout.
          </p>
          <Button className="w-full">Przejdź do płatności (Stripe)</Button>
          <Button render={<Link href="/" />} variant="outline" className="w-full">
            Wróć na stronę główną
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
