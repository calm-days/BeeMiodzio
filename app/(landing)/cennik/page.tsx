import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const plans = [
  { name: "1/8 ula", price: "349 zł", description: "Idealny na start" },
  { name: "1/3 ula", price: "899 zł", description: "Najwięcej miodu" },
  { name: "Cały ul (B2B)", price: "4 900 zł", description: "Dla firm" },
];

export default function CennikPage() {
  return (
    <section className="container-page py-16">
      <h1 className="mb-8 text-center font-heading text-4xl font-bold">Cennik</h1>
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name}>
            <CardHeader>
              <CardTitle className="font-heading">{plan.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-3xl font-bold text-primary">{plan.price}</p>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
              <Button render={<Link href="/checkout" />} className="w-full">
                Wybierz
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
