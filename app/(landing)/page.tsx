import Link from "next/link";

import { AnimatedHeading } from "@/components/animated-heading";
import { FaqItem } from "@/components/faq-item";
import { HeroConfigurator } from "@/components/hero-configurator";
import { PrezentSection } from "@/components/prezent-section";
import { StepsSection } from "@/components/steps-section";
import { TaryfySection } from "@/components/taryfy-section";
import { TimelineSection } from "@/components/timeline-section";

/* ─── Jak to dziala ─── */

const howItWorks = [
  {
    title: "Kupujesz udział w prawdziwym ulu na polskiej pasiece.",
    text: "Od razu dostajesz certyfikat pszczelarza – cyfrowy albo w eleganckim pudełku na prezent wraz z porcją miodu na początek.",
  },
  {
    title: "Twój ul stoi na stacjonarnej leśnej pasiece na Dolnym Śląsku.",
    text: "Naniesiemy numer, który sam wybierzesz — po nim znajdziesz go na fotkach albo kiedy przyjedziesz na pasiekę osobiście. Pszczelarz Piotr opiekuje się nim codziennie, a Ty widzisz to w raportach.",
  },
  {
    title: "Oglądasz, jak powstaje Twój miód przez cały sezon z bliska.",
    text: "My opiekujemy się pasieką. Ty widzisz wszystko w panelu klienta: 2 kamery – panorama na całą pasiekę i na pszczoły z bliska, a do tego raporty z pasieki. Bez kombinezonu, bez wyjazdów, bez użądleń :)",
  },
  {
    title: "Dostajesz miód prosto pod drzwi.",
    text: "Jesienią personalizujesz słoiki: ponad 10 gotowych etykiet z Twoim imieniem albo wgrywasz własny design.",
  },
];

/* ─── Timeline ─── */

const timelineSteps = [
  {
    label: "Po zakupie",
    text: "Dostajesz dostęp do panelu swojego ula — stamtąd śledzisz wszystko, co dzieje się na pasiece.",
  },
  {
    label: "W ciągu tygodnia",
    text: "Dostajesz paczkę powitalną: certyfikat pszczelarza, słoiczek miodu na dobry początek i mały prezent od pszczół :)",
  },
  {
    label: "Czekając na sezon",
    text: "Na pasiece cisza — pszczoły odpoczywają po sezonie. Ale w Twoim panelu sporo się dzieje: wybierasz słoiczki, projektujesz etykiety (gotowe z Twoim imieniem albo własny design) i poznajesz świat pszczół od kuchni.",
  },
  {
    label: "Kwiecień — maj",
    text: "Pszczoły się budzą! Regularnie dostajesz zdjęcia i filmy z pasieki i okolicy — widzisz, jak Twój ul zaczyna nowy sezon.",
  },
  {
    label: "Czerwiec — sierpień",
    text: "Pszczoły zbierają nektar, Twój ul przybiera na wadze — kilogram po kilogramie. Śledzisz to w panelu, a na kamerach widzisz, ile ruchu mają pszczoły.",
  },
  {
    label: "Koniec września",
    text: "Czas na zbiór! Rozlewamy go do słoiczków, naklejamy etykiety, które wybrałeś, i wysyłamy.",
  },
];

/* ─── Comparison table ─── */

const comparisonRows = [
  { bad: "Ultrafiltracja usuwa pyłek", good: "Miód surowy, niefiltrowany" },
  { bad: "Nie wiesz skąd jest", good: "2 kamery na żywo z pasieki" },
  { bad: "Anonimowa fabryka", good: "Pszczelarz Piotr, którego widzisz codziennie" },
  { bad: "Plastikowe ule, chemia", good: "Drewniane ule, naturalna ochrona" },
  { bad: "Pszczoły karmione syropem", good: "Pszczoły zimują na własnym miodzie" },
  { bad: "Etykieta — jedyny dowód", good: "Badanie laboratoryjne w panelu klienta" },
  { bad: "Słoiczek jak każdy inny", good: "Słoiczki z Twoim imieniem — albo z własnym designem" },
];

/* ─── Pricing ─── */

const plans: {
  name: string;
  price: string;
  renewal: string;
  honey: string;
  features: string[];
  extras?: string[];
  subtitle?: string;
  highlighted?: boolean;
}[] = [
  {
    name: "Cały ul",
    price: "5 900",
    renewal: "3 900 zł/rok",
    honey: "Do 15–20 kg miodu rocznie",
    features: [
      "Rok obsługi na pasiece i fasowka miodu",
      "Panel klienta z 2 kamerami (panorama + makro) i raportami",
      "Ponad 10 designów etykiet z personalizacją",
    ],
    extras: [
      "Wybór numeru ula",
      "Możliwość brandowania ula",
    ],
    highlighted: true,
  },
  {
    name: "⅓ ula",
    price: "899",
    renewal: "599 zł/rok",
    honey: "Do 5–7 kg miodu rocznie",
    features: [
      "Rok obsługi na pasiece i fasowka miodu",
      "Panel klienta z 2 kamerami (panorama + makro) i raportami",
      "Ponad 10 designów etykiet z personalizacją",
      "Elektroniczny certyfikat pszczelarza",
    ],
  },
  {
    name: "⅛ ula",
    subtitle: "taryfa na start",
    price: "399",
    renewal: "249 zł/rok",
    honey: "Do 2–3 kg miodu rocznie",
    features: [
      "Rok obsługi na pasiece i fasowka miodu",
      "Panel klienta z 2 kamerami (panorama + makro) i raportami",
      "Ponad 10 designów etykiet z personalizacją",
      "Elektroniczny certyfikat pszczelarza",
    ],
  },
];

/* ─── FAQ ─── */

const faqItems: { q: string; a: React.ReactNode }[] = [
  {
    q: "Za co dokładnie płacę?",
    a: (
      <>
        <p className="mb-3">Po pierwsze — kupujesz udział w prawdziwym ulu. Jest Twój, płacisz raz. Jak mieszkanie, tylko dla pszczół.</p>
        <p className="mb-3">Po drugie — co roku płacisz za opiekę nad pszczołami, zbiór miodu, fasowkę, etykiety i dostawę. To jest Twoje roczne obsługiwanie.</p>
        <p>A najważniejsze: koszt miodu dla Ciebie = koszt obsługi. I wychodzi taniej niż BIO ze sklepu.</p>
      </>
    ),
  },
  {
    q: "Co wchodzi w cenę obsługi?",
    a: (
      <>
        <p className="mb-3">W tę niewielką kwotę wchodzi wszystko, czego potrzebuje ul:</p>
        <ul className="list-none space-y-1.5">
          <li>— Ekologiczna opieka weterynaryjna i regularne przeglądy pszczół. Bez chemii.</li>
          <li>— Amortyzacja sprzętu i części ula.</li>
          <li>— Rozszerzanie bazy miododajnej — sadzimy nowe gatunki roślin, które kwitną w różnych terminach, żeby pszczoły miały co zbierać przez cały sezon.</li>
          <li>— Fasowka miodu w słoiczki (standardowo 250g, mniejszy format za niewielką dopłatę).</li>
          <li>— Etykiety z Twoim imieniem — wybierasz z naszego katalogu albo wgrywasz swój design.</li>
          <li>— Badanie laboratoryjne każdej partii.</li>
          <li>— Dostawa pod Twoje drzwi.</li>
        </ul>
      </>
    ),
  },
  {
    q: "Kto opiekuje się moimi pszczołami?",
    a: "Pszczelarz Piotr — konkretny człowiek, którego widzisz na kamerze, w raportach i na zdjęciach z pasieki. Prowadzi stacjonarną leśną pasiekę na Dolnym Śląsku od lat. Drewniane ule, naturalna ochrona, zero chemii. Pszczoły zimują na własnym miodzie — nie na syropie cukrowym. Zna każdy ul osobiście.",
  },
  {
    q: "Kiedy i jak dostanę miód?",
    a: (
      <>
        <p className="mb-3">Zbieramy miód najpozniej jak pozwala pogoda — żeby dojrzał w plastrach, bo to ważne dla jakości. Standardowo paczka wychodzi we wrześniu–październiku. W środku: Twoje słoiczki z etykietami, wynik badania laboratoryjnego i kartka od pszczół :)</p>
        <p className="mb-2">Masz kilka opcji odbioru:</p>
        <ul className="list-none space-y-1">
          <li>— Cały miód naraz, jedną paczką</li>
          <li>— Równe porcje co miesiąc albo co kwartał</li>
          <li>— Dopłacasz za przechowywanie i zamawiasz kiedy chcesz, choćby po jednym słoiczku</li>
        </ul>
      </>
    ),
  },
  {
    q: "Dlaczego nie sprzedajecie po prostu miodu?",
    a: (
      <>
        <p className="mb-3">Główny powód — to nieinteresujące.</p>
        <p className="mb-3">Dla nas — bo zamiast myśleć o cenach, oszczędzaniu i reklamach, wolimy zajmować się pasieką. To wszystko zamienia się w troskę o pieniądze, a nie o pszczoły.</p>
        <p className="mb-3">Dla Ciebie — bo miód można kupić wszędzie, zjeść i zapomnieć. Bardzo ekscytujące! (nie)</p>
        <p>A my chcemy, żeby to było coś więcej. Żebyś widział jak powstaje, kibicował pszczołom i otwierał paczkę jesienią z zupełnie innym uczuciem niż cokolwiek ze sklepu. Cała przygoda — nawet z dalekiego miasta.</p>
      </>
    ),
  },
  {
    q: "A jeśli miodu będzie mało?",
    a: (
      <>
        <p className="mb-3">Zbiory zależą od pogody. Jeśli jest optymalna przez cały sezon — kwitnie maksymalnie dużo roślin i pszczoły mogą do nich polecieć.</p>
        <p>Nasze leśne pszczoły zbierają nektar z 30+ gatunków roślin miododajnych. Kwitną w różnych terminach, więc totalny nieurodzaj to ogromna rzadkość. Pasiekę chroni bioróżnorodność, którą aktywnie wspieramy — sadzimy nowe gatunki na naszej polanie.</p>
      </>
    ),
  },
  {
    q: "Miód się skrystalizował — wyrzucać?",
    a: "Wręcz przeciwnie — to znak, że jest prawdziwy i nieprzetworzony. Żeby go rozpuścić, wstaw słoiczek do ciepłej wody (max 40°C) na kilkanaście minut. Nie do mikrofali — traci właściwości.",
  },
  {
    q: "Mogę wybrać design etykiet? A zrobić swój?",
    a: (
      <>
        <p className="mb-3">Tak! Mamy ponad 10 gotowych szablonów — jeden lepszy od drugiego. W każdy wstawiasz swoje imię, nazwę lub logo. Chcesz coś swojego? Wgrywasz własny design w panelu klienta.</p>
        <p>Ważne: liczba różnych designów w jednej partii miodu zależy od Twojej taryfy.</p>
      </>
    ),
  },
  {
    q: "Tyle miodu nie zjem!",
    a: (
      <>
        <p className="mb-3">Zjesz :) U nas na przykład ponad połowa miodu idzie na napoje. A miód z pasieki jest tak dobry, że świetnie smakuje nawet sam — no, albo z chlebem. Większość naszych klientów planuje &bdquo;zapas na rok&rdquo; i wraca po więcej po dwóch miesiącach.</p>
        <p>Poza tym — słoiczki z Twoim imieniem i oryginalnym designem to gotowy prezent na każdą okazję. I uwierz — obdarowani potem sami pytają, skąd to masz. 100%.</p>
      </>
    ),
  },
  {
    q: "Po co mojej firmie paseka?",
    a: (
      <>
        <p className="mb-3">W biurze może wisieć certyfikat pasieki, a na Instagramie — aktualności z ula.</p>
        <p className="mb-3">Każde negocjacje pójdą lepiej, jeśli podarujesz partnerom słoiczek miodu z zabawną etykietą z własnej pasieki.</p>
        <p className="mb-3">Można częstować gości, klientów, pracowników.</p>
        <p>Ul z logo Twojej firmy, miód w słoiczkach z firmową etykietą, link do kamery na Waszą stronę — ESG, które Twoi klienci widzą na własne oczy.</p>
      </>
    ),
  },
];

/* ─── Page ─── */

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <HeroConfigurator />

      {/* Jak to działa */}
      <StepsSection steps={howItWorks} />

      {/* Content sections */}
      <div className="relative z-10">
        {/* Co odróżnia nasz miód */}
        <section className="container-page py-24">
          <AnimatedHeading
            line1="Co Odróżnia"
            line2Before="Nasz"
            line2After="Miód?"
          />

          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
            {/* Text column */}
            <div className="lg:w-1/2">
              <p className="mb-6 text-muted-foreground">
                Większość miodu z supermarketu przechodzi ultrafiltrację &mdash;
                proces, który usuwa pyłek, a razem z nim właściwości zdrowotne
                i jakikolwiek ślad pochodzenia. Wygląda pięknie na półce, ale nie
                wiadomo ani skąd jest, ani co w nim zostało. Do tego ponad 50%
                tego miodu pochodzi z Chin.
              </p>

              <Link
                href="/dlaczego-miod-jest-zdrowy"
                className="mb-8 inline-block text-sm font-medium underline underline-offset-4 hover:text-foreground/80"
              >
                Dowiedz się więcej o właściwościach zdrowotnych miodu &rarr;
              </Link>

              <p className="text-muted-foreground">
                Nasz miód jest inny. Jedna rodzinna pasieka na Dolnym Śląsku,
                pszczoły, które codziennie widzisz na kamerach. Bez importu, bez
                mieszanek, bez syropów, bez ultrafiltracji. Co roku trafia do
                akredytowanego laboratorium &mdash; więc wiesz dokładnie, co
                trafia do Twojego słoiczka.
              </p>
            </div>

            {/* Comparison table */}
            <div className="overflow-hidden rounded-2xl border lg:w-1/2">
              <div className="grid grid-cols-2">
                <div className="bg-destructive/10 p-4 text-center text-sm font-semibold uppercase tracking-wider text-destructive">
                  &#10007; Miód z półki
                </div>
                <div className="bg-emerald-500/10 p-4 text-center text-sm font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  &#10003; Miód z BeeMiodzio
                </div>
              </div>
              {comparisonRows.map((row, i) => (
                <div key={i} className="grid grid-cols-2 border-t">
                  <div className="p-4 text-sm text-muted-foreground">
                    {row.bad}
                  </div>
                  <div className="border-l p-4 text-sm font-medium">
                    {row.good}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Co i kiedy dostaniesz */}
        <TimelineSection steps={timelineSteps} />

        {/* Prezent, który trwa cały rok */}
        <PrezentSection />

        {/* Taryfy */}
        <TaryfySection plans={plans} />

        {/* FAQ */}
        <section className="container-page py-24">
          <h2 className="mb-4 text-center font-heading text-3xl tracking-tight md:text-4xl">
            FAQ
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-muted-foreground">
            Odpowiedzi na najczęściej zadawane pytania o pasiekę, miód
            i pszczoły.
          </p>
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            {faqItems.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
