import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { BeeTrail } from "@/components/bee-trail";
import { AnimatedHeading } from "@/components/animated-heading";
import { FaqItem } from "@/components/faq-item";
import { HeroConfigurator } from "@/components/hero-configurator";


const timelineSteps = [
  {
    label: "Po zakupie",
    text: "Otrzymasz dostęp do strony swojej pasieki. Stamtąd będziesz nią zarządzać i śledzić nowości.",
  },
  {
    label: "W ciągu tygodnia",
    text: "Otrzymasz pierwszą przesyłkę z certyfikatem pszczelarza, parą słoiczków miodu z pasieki i fajny prezent od pszczół.",
  },
  {
    label: "Czekając na sezon",
    text: "Wybierzesz wygląd etykiet, zdecydujesz, co zrobić z miodem, i dowiesz się wielu ciekawych rzeczy o pszczołach.",
  },
  {
    label: "Kwiecień — maj",
    text: "Pasieka budzi się do życia. Regularnie przesyłamy ładne fotoreportaże i klimatyczne filmy z pasieki i okolicy.",
  },
  {
    label: "Czerwiec — sierpień",
    text: "Pszczoły zbierają nektar, a Ty śledzisz codzienny przyrost wagi ula i pracę pasieki — przez transmisje online 24/7.",
  },
  {
    label: "Koniec września",
    text: "Czas na zbiór miodu! Rozlejemy go do słoików, nakleimy etykiety z wybranym przez Ciebie designem i wyślemy.",
  },
];

const faqItems = [
  {
    q: "Za co dokładnie płacę?",
    a: "Kupujesz ul — jest Twój, płacisz za niego raz. Co roku płacisz za obsługę ula, opiekę nad pszczołami, zbiór i pakowanie miodu. Możesz sprzedać swój ul albo podarować go przyjacielowi. Koszt miodu dla Ciebie równa się kosztowi obsługi — a to jest naprawdę tanio!",
  },
  {
    q: "Kto i jak będzie opiekować się moimi pszczołami?",
    a: "Mamy na imię Misza i Artiom. Obaj z Petersburga, obaj z branży IT, obaj kochamy przyrodę, las i to wszystko. Misza przeprowadził się tu na stałe 5 lat temu. Artiom — web designer i art director, przeprowadził się na południe rok wcześniej razem z rodziną. Z chęci podzielenia się tymi wrażeniami narodził się Pszczelosharing.",
  },
  {
    q: "Jak i kiedy mogę odebrać swoje zbiory?",
    a: "Zbiory zbieramy jak najpóźniej, żeby miód zdążył dojrzeć. Możesz odebrać cały miód od razu, otrzymywać go w porcjach co miesiąc lub co 4 miesiące, albo dopłacić za przechowywanie i odbierać w dowolnym momencie.",
  },
  {
    q: "Dlaczego po prostu nie sprzedajecie miodu?",
    a: "To jest nieinteresujące. Chce się zrobić coś nowego — żeby to nie był po prostu zjedzony miód, a cała przygoda! Nawet kupujących z dalekich miast chce się uczynić współuczestnikami tego procesu.",
  },
  {
    q: "Co wchodzi w koszt obsługi?",
    a: "Ekologiczna obsługa weterynaryjna, amortyzacja sprzętu, rozszerzanie bazy pożytkowej dla pszczół, pakowanie miodu, wybór z katalogu wzorów naklejek i dostawa miodu do firmy transportowej.",
  },
  {
    q: "Tyle nie zjem, co robić z miodem?",
    a: "Miód z pasieki jest tak smaczny, że u kupujących kończy się znacznie wcześniej, niż się spodziewali. Poza tym miód z Twoją etykietą to ciekawy prezent dla znajomych i rodziny na każdą okazję.",
  },
  {
    q: "A co jeśli pszczoły nic nie zbiorą?",
    a: "Leśne pszczoły zbierają miód z 30+ gatunków roślin pożytkowych. Rośliny zakwitają stopniowo, więc pasieka jest chroniona przed nieurodzajem dzięki bioróżnorodności, którą wspieramy, sadząc nowe gatunki.",
  },
  {
    q: "Czy mogę wybierać oprawę graficzną słoików?",
    a: "Tak! Masz dostęp do katalogu wzorów naklejek. W wybrany wzór można wstawić swoje imię, nazwę lub logo. Za dopłatą możliwe jest stworzenie wzoru specjalnie dla Ciebie.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <HeroConfigurator />

      {/* A po co mi to? — zigzag cards */}
      <section className="relative container-page py-24">
        <h2 className="mb-16 text-center font-heading text-3xl tracking-tight md:text-4xl">
          A po co mi to?
        </h2>

        <div className="relative mx-auto max-w-5xl">
          <BeeTrail />
          <div className="flex flex-col gap-20">
          {/* Card 1 — right */}
          <div className="flex justify-end">
            <div className="w-full max-w-lg rounded-2xl border bg-card p-8">
              <div className="mb-5 aspect-square w-full rounded-xl bg-muted" />
              <h3 className="mb-2 font-heading text-2xl tracking-tight">Obserwujesz. Smakujesz. Resztą zajmujemy się my.</h3>
              <p className="text-muted-foreground">
                Przyjemność posiadania, ale bez obowiązków. Bez użądleń, bez
                kombinezonu, bez kursu pszczelarskiego. Ty dostajesz roczny zapas
                miodu — bez stresu i bez szukania &bdquo;tego dobrego&rdquo; na targu.
              </p>
            </div>
          </div>

          {/* Card 2 — left */}
          <div className="flex justify-start">
            <div className="w-full max-w-lg rounded-2xl border bg-card p-8">
              <div className="mb-5 aspect-square w-full rounded-xl bg-muted" />
              <h3 className="mb-2 font-heading text-2xl tracking-tight">Prezent, który naprawdę zaskakuje.</h3>
              <p className="text-muted-foreground">
                Spersonalizowane słoiki z Twojej pasieki — prezent, o którym się
                opowiada. 30+ gotowych etykiet albo Twój własny projekt. A przy
                okazji — nowy temat do rozmów na każdej imprezie.
              </p>
            </div>
          </div>

          {/* Card 3 — right */}
          <div className="flex justify-end">
            <div className="w-full max-w-lg rounded-2xl border bg-card p-8">
              <div className="mb-5 aspect-square w-full rounded-xl bg-muted" />
              <h3 className="mb-2 font-heading text-2xl tracking-tight">Inwestycja w zdrowie. Nie kolejny słoik z półki.</h3>
              <p className="mb-4 text-muted-foreground">
                Zakup ula to inwestycja w zdrowie rodziny. Większość miodu
                z supermarketu przechodzi filtrację, która usuwa pyłek — a bez
                pyłku nie da się nawet ustalić, skąd pochodzi. Nasz miód jest
                badany co roku w laboratorium. Wiesz, co jesz.
              </p>
              <Link href="/dlaczego-miod-jest-zdrowy" className="text-sm font-medium underline underline-offset-4 hover:text-foreground/80">
                Dlaczego miód jest zdrowy &rarr;
              </Link>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Content sections */}
      <div className="relative z-10">
        {/* O pasiece */}
        <section className="container-page py-24">
          <div className="">
            <h2 className="mb-4 font-heading text-3xl tracking-tight md:text-4xl">
              O pasiece
            </h2>
            <p className="mb-2 text-lg font-medium text-muted-foreground">
              Igor Zwonik — pierwszy chmurowy pszczelarz Pszczołosharingu
            </p>
            <p className="mb-6 text-muted-foreground">
              Pasieka znajduje się na małej polanie w lesie Przedgórza
              Kaukaskiego, na północnym zboczu 250-metrowego wzgórza, z dala od
              tras i miast. To bardzo dobrze wpływa na zdrowie pszczół i jakość
              miodu.
            </p>
            <p className="mb-6 text-2xl font-medium">
              6 km — odległość do najbliższego miasteczka
            </p>
            <p className="mb-6 text-muted-foreground">
              To dosłownie &bdquo;domowa&rdquo; pasieka — nasz dom stoi 50 m od
              uli, pszczoły są zawsze pod okiem. To nie jest historia o biznesie
              z plastikowymi ulami i wypożyczonymi pszczołami na przyczepie
              pośród zatrutych pól.
            </p>
            <p className="text-muted-foreground">
              Możesz przyjechać na pasiekę i zobaczyć wszystko na własne oczy.
              Na przykład po drodze nad morze.
            </p>
          </div>
        </section>

        {/* Domowe Znaczy Lepsze */}
        <section className="container-page py-24">
          <div className="">
            <AnimatedHeading
              line1="Domowe"
              line2Before="Znaczy"
              line2After="Lepsze"
            />
            <p className="mb-10 text-muted-foreground">
              Czym domowa truskawka różni się od sklepowej? Głębią smaku,
              czystością od chemii i przytulnością ręcznej roboty. Z miodem jest
              tak samo! Podejście przemysłowe — to troska o pieniądze. My
              natomiast przede wszystkim dbamy o właściwości miodu i pszczoły.
            </p>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
                <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-destructive">
                  Podejście przemysłowe
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Chemiczne antybiotyki</li>
                  <li>Pszczoły wożone po polach rolniczych</li>
                  <li>Rozcieńczony miód</li>
                  <li>Pełny zabór miodu od pszczół</li>
                  <li>Plastikowe ule</li>
                  <li>Miód z cukru</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Jak robimy my
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Roślinne &bdquo;antybiotyki&rdquo;</li>
                  <li>Pasieka stacjonarna — nie niepokoimy pszczół</li>
                  <li>Naturalny miód</li>
                  <li>Zostawiamy pszczołom miód na zimę</li>
                  <li>Drewniane ule</li>
                  <li>Miód z nektaru kwiatów i drzew</li>
                </ul>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Takiego produktu nie kupisz na marketplace, w sklepie ani na targu.
            </p>
          </div>
        </section>

        {/* Jaki smak ma miód leśny */}
        <section className="container-page py-24">
          <div className="">
            <h2 className="mb-4 font-heading text-3xl tracking-tight md:text-4xl">
              Jaki smak ma miód leśny
            </h2>
            <p className="mb-4 text-muted-foreground">
              Miód z pasieki — przejrzysty, płynny i lekki, jak akacjowy. Bardzo
              aromatyczny, pachnie kwiatami. Miód jest zrobiony z nektaru wielu
              roślin miododajnych, dlatego ma bardzo głęboki smak. Nie jest zbyt
              słodki i odrobinę cierpki.
            </p>
            <p className="text-muted-foreground">
              Świetnie pasuje do serów, chleba, nadaje się do wypieków... Ale
              dzięki delikatnemu smakowi czasem chce się go po prostu jeść bez
              niczego, popijając wodą, delektując się aromatem minionego lata.
            </p>
          </div>
        </section>

        {/* Co i kiedy otrzymasz — timeline */}
        <section className="container-page py-24">
          <div className="">
            <h2 className="mb-10 font-heading text-3xl tracking-tight md:text-4xl">
              Co i kiedy otrzymasz
            </h2>
            <div className="relative space-y-8 border-l-2 border-border pl-8">
              {timelineSteps.map((step) => (
                <div key={step.label} className="relative">
                  <div className="absolute -left-[calc(2rem+5px)] top-1.5 size-2.5 rounded-full bg-foreground" />
                  <p className="mb-1 text-sm font-semibold uppercase tracking-wider">
                    {step.label}
                  </p>
                  <p className="text-muted-foreground">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Podarować pasiekę */}
        <section className="container-page py-24">
          <div className="">
            <h2 className="mb-4 font-heading text-3xl tracking-tight md:text-4xl">
              Podarować pasiekę
            </h2>
            <p className="mb-4 text-lg text-muted-foreground">
              Wręczasz piękne pudełko z pysznym miodem, imiennym certyfikatem i
              miłymi drobiazgami. Chmurowa pasieka — najbardziej niespodziewany,
              niezaprzeczalnie solidny i ekologiczny prezent!
            </p>
            <p className="mb-4 text-muted-foreground">
              Ul możesz podarować nawet wtedy, gdy jesteście w różnych miastach.
              Zaznacz opcję &bdquo;Ten ul będzie prezentem&rdquo; przy składaniu
              zamówienia, a my skontaktujemy się z Tobą.
            </p>
            <p className="mb-4 text-muted-foreground">
              Przez cały rok będą cieszyć wieści z pasieki, a jesienią nadejdzie
              upragniony miód. I przez cały ten czas ta osoba będzie o Tobie
              pamiętać!
            </p>
            <p className="text-muted-foreground">
              Jeśli jesteście w różnych miastach — w wybranym momencie wyślesz
              tej osobie elektroniczne życzenia z pszczółkami i link do
              prezentu-ula. Po rejestracji potwierdzi adres, a my wyślemy
              certyfikat i pudełko prezentowe.
            </p>
          </div>
        </section>

        {/* Pasieka dla firmy */}
        <section className="container-page py-24">
          <div className="">
            <h2 className="mb-4 font-heading text-3xl tracking-tight md:text-4xl">
              Pasieka dla firmy
            </h2>
            <p className="mb-10 text-muted-foreground">
              Utrzymywanie własnego ula na eko-pasiece jest o wiele fajniejsze
              niż utrzymywanie szopa w zoo. Otrzymasz unikalny markowy miód i
              wesprzycie inicjatywę ekologiczną. Do tego wiadomości z pasieki to
              oryginalny pretekst do komunikacji.
            </p>

            <div className="grid gap-6 sm:grid-cols-2">
              {[
                {
                  title: "Kawiarnie i coffeeshopy",
                  text: "Klienci docenią obecność eko-produktów własnej produkcji.",
                },
                {
                  title: "Hotele",
                  text: "Markowy miód w porcjowanych opakowaniach — nietypowy komplement dla gościa.",
                },
                {
                  title: "Szkoły prywatne",
                  text: "Dzieci chętnie dowiadują się, jak powstaje miód, a potem go jedzą.",
                },
                {
                  title: "Dowolny biznes",
                  text: "Miód można sprzedawać pod własną marką (marża od 35%).",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border bg-card p-6"
                >
                  <p className="mb-2 font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="container-page py-24">
          <h2 className="mb-4 text-center font-heading text-3xl tracking-tight md:text-4xl">
            FAQ
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-muted-foreground">
            Odpowiedzi na najczęściej zadawane pytania o pasiekę, miód i pszczoły.
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
