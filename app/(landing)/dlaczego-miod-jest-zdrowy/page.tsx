import Link from "next/link";

const sources = [
  {
    id: 1,
    label: "Porównanie wpływu cukru i miodu na masę ciała u myszy",
    journal: "The Journal of Food Science and Nutrition",
    href: "https://www.sciencedirect.com/science/article/abs/pii/S027153171000254X?via%3Dihub",
  },
  {
    id: 2,
    label: "Wpływ miodu na masę ciała, stany zapalne i trójglicerydy u ludzi",
    journal: "Journal of Medicinal Food",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5848643/",
  },
  {
    id: 3,
    label: "Miód vs inne źródła cukrów — kontrola glikemii",
    journal: "Journal of the American College of Nutrition",
    href: "https://www.liebertpub.com/doi/10.1089/109662004322984789",
  },
  {
    id: 4,
    label: "Wpływ miodu na profil lipidowy",
    journal: "Nutrition Reviews",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9149702/",
  },
  {
    id: 5,
    label: "Miód wzmacnia endogenne systemy antyoksydacyjne",
    journal: "Molecules",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5822819/",
  },
  {
    id: 6,
    label: "Długoterminowe spożycie miodu a przewlekły stan zapalny",
    journal: "Nutrients",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8788442/",
  },
  {
    id: 7,
    label: "Przegląd Cochrane'a — miód w gojeniu ran i oparzeń",
    journal: "Cochrane Database of Systematic Reviews",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9719456/",
  },
  {
    id: 8,
    label: "Miód w leczeniu infekcji górnych dróg oddechowych",
    journal: "BMJ Evidence-Based Medicine",
    href: "https://ebm.bmj.com/content/26/2/57.long",
  },
  {
    id: 9,
    label: "Wpływ miodu na sytość",
    journal: "Journal of the American College of Nutrition",
    href: "https://www.tandfonline.com/doi/full/10.1080/07315724.2010.10719885",
  },
  {
    id: 10,
    label: "Miód jako fundament ewolucji ludzkiego mózgu",
    journal: "Smithsonian Magazine",
    href: "https://www.smithsonianmag.com/smart-news/honey-was-the-wonder-food-that-fueled-human-evolution-and-now-its-disappearing-44399150/",
  },
  {
    id: 11,
    label: "70% miodu sklepowego w USA nie zawiera pyłku",
    journal: "Food Safety News",
    href: "https://www.foodsafetynews.com/2011/11/tests-show-most-store-honey-isnt-honey/",
  },
];

function Ref({ n }: { n: number }) {
  return (
    <a
      href={`#zrodlo-${n}`}
      className="ml-0.5 inline-flex size-5 items-center justify-center rounded-full bg-amber-400/80 text-[10px] font-semibold leading-none text-amber-950 no-underline transition-colors hover:bg-amber-400"
    >
      {n}
    </a>
  );
}

export default function DlaczegoMiodPage() {
  return (
    <article className="container-page py-16">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-8 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          &larr; Strona główna
        </Link>

        <h1 className="mb-6 font-heading text-4xl tracking-tight md:text-5xl">
          Dlaczego miód jest zdrowy?
        </h1>

        <p className="mb-12 text-lg text-muted-foreground">
          Z każdym rokiem mamy coraz więcej danych, które pokazują, że miód
          i cukier — to zupełnie inne historie. Tak, w składzie są dość
          podobne. Ale to, co robią z organizmem, różni
          się <strong className="text-foreground">diametralnie</strong>.
        </p>

        {/* Mniej tłuszczu */}
        <section className="mb-12">
          <h2 className="mb-4 font-heading text-2xl tracking-tight">
            Mniej tłuszczu, mniej wagi
          </h2>
          <p className="mb-4 text-muted-foreground">
            Pierwsze poszlaki widzimy w badaniach na myszach<Ref n={1} />.
            Dwie grupy karmimy identycznie — jedyna różnica to źródło
            węglowodanów: cukier vs miód.
          </p>
          <p className="mb-4 text-muted-foreground">
            Drobna zmiana. Ale po miesiącu myszy na miodzie przytyły
            o <strong className="text-foreground">15% mniej</strong> i miały
            o <strong className="text-foreground">20% mniej tłuszczu trzewnego</strong>.
            To ten tłuszcz, który otacza narządy wewnętrzne — i to właśnie on
            najbardziej szkodzi zdrowiu na dłuższą metę.
          </p>
          <p className="text-muted-foreground">
            A co u ludzi? W badaniu z 2008 roku<Ref n={2} /> uczestnicy
            otrzymywali albo 70&nbsp;g cukru, albo 70&nbsp;g miodu dziennie.
            Grupa miodowa schudła więcej, obniżyła markery stanu zapalnego,
            a poziom trójglicerydów we krwi spadł
            o <strong className="text-foreground">11%</strong>. Dla kontekstu —
            to naprawdę duży i zaskakujący wynik.
          </p>
        </section>

        {/* Cukier we krwi */}
        <section className="mb-12">
          <h2 className="mb-4 font-heading text-2xl tracking-tight">
            Lepiej kontroluje cukier we krwi
          </h2>
          <p className="text-muted-foreground">
            Miód lepiej niż jakiekolwiek inne połączenie cukrów reguluje
            poziom glukozy we krwi<Ref n={3} />. Więc jeśli szukacie, czym
            osłodzić herbatę — miód jest bezkonkurencyjny.
          </p>
        </section>

        {/* Profil lipidowy */}
        <section className="mb-12">
          <h2 className="mb-4 font-heading text-2xl tracking-tight">
            Poprawia profil lipidowy
          </h2>
          <p className="text-muted-foreground">
            Miód zwiększa poziom &bdquo;dobrego&rdquo; cholesterolu (HDL),
            obniża &bdquo;zły&rdquo; (LDL), zmniejsza stężenie trójglicerydów
            i utlenionego cholesterolu<Ref n={4} />. W skrócie — krew
            dziękuje.
          </p>
        </section>

        {/* Antyoksydant */}
        <section className="mb-12">
          <h2 className="mb-4 font-heading text-2xl tracking-tight">
            Naturalny antyoksydant
          </h2>
          <p className="text-muted-foreground">
            Miód nie tylko zawiera antyoksydanty — on wzmacnia wasze własne,
            wewnętrzne systemy antyoksydacyjne<Ref n={5} />. Ludzie, którzy
            jedli miód przez 6 miesięcy, mieli mniej przewlekłego stanu
            zapalnego w organizmie<Ref n={6} />. A kiedy przestali — stres
            oksydacyjny wracał do starych, nieprzyjemnie wysokich wartości.
          </p>
        </section>

        {/* Rany */}
        <section className="mb-12">
          <h2 className="mb-4 font-heading text-2xl tracking-tight">
            Goi rany lepiej niż antyseptyki
          </h2>
          <p className="text-muted-foreground">
            Tu zrobiło się naprawdę ciekawie. Według przeglądu
            Cochrane&apos;a<Ref n={7} /> — a to najwyższa półka w świecie
            naukowych dowodów — miód lepiej goi rany pooperacyjne niż
            antyseptyki i szybciej leczy oparzenia niż środki farmaceutyczne.
            Serio.
          </p>
        </section>

        {/* Przeziębienie */}
        <section className="mb-12">
          <h2 className="mb-4 font-heading text-2xl tracking-tight">
            Pomaga przy przeziębieniu
          </h2>
          <p className="text-muted-foreground">
            Babcia miała rację. Miód naprawdę pomaga przy
            przeziębieniu<Ref n={8} /> — i to nie placebo, a potwierdzony
            naukowo efekt. Herbata z miodem na jesień? Absolutna baza.
          </p>
        </section>

        {/* Sytość */}
        <section className="mb-12">
          <h2 className="mb-4 font-heading text-2xl tracking-tight">
            Daje sytość, nie głód
          </h2>
          <p className="text-muted-foreground">
            Pewnie słyszeliście, że cukier psuje kontrolę apetytu — po
            słodkim chce się jeszcze więcej słodkiego. Z miodem jest
            odwrotnie: zwiększa uczucie sytości<Ref n={9} />. Mniej chce się
            podjadać. Fajna sprawa.
          </p>
        </section>

        {/* Ewolucja */}
        <section className="mb-12">
          <h2 className="mb-4 font-heading text-2xl tracking-tight">
            Miód uczynił nas ludźmi
          </h2>
          <p className="text-muted-foreground">
            To brzmi górnolotnie, ale wielu naukowców naprawdę tak
            uważa<Ref n={10} />. Miód — niezwykle kaloryczny — dostarczał
            energię potrzebną do gwałtownego rozwoju mózgu naszych przodków.
            Jedliśmy go miliony lat i nasz organizm reaguje na niego zupełnie
            inaczej niż na izolowane cukry z fabryki.
          </p>
        </section>

        {/* Caveat */}
        <section className="mb-12 rounded-2xl border border-amber-400/30 bg-amber-400/5 p-6">
          <h2 className="mb-4 font-heading text-2xl tracking-tight">
            Ale wciąż to cukier
          </h2>
          <p className="mb-4 text-muted-foreground">
            To bardzo ważne. Miód — mimo wszystkich zalet — to nadal cukier.
            Nie można go jeść dużo.
          </p>
          <p className="mb-4 text-lg font-medium">
            1–2 łyżki stołowe dziennie — to maksimum.
          </p>
          <p className="text-muted-foreground">
            To około 130&nbsp;kcal. Trzeba to uwzględnić w diecie — albo coś
            innego zabrać, albo spalić. Traktujcie miód nie
            jako &bdquo;nowy cukier&rdquo;, ale jako suplement, który
            stosujecie w małych dawkach. Jak każdy inny dobry suplement.
          </p>
        </section>

        {/* Jaki miód */}
        <section className="mb-12">
          <h2 className="mb-4 font-heading text-2xl tracking-tight">
            Jaki miód wybrać?
          </h2>
          <p className="mb-4 text-muted-foreground">
            Najlepszy to surowy, nieprzetworzony miód gryczany — ma najwięcej
            antyoksydantów. Drugi w kolejności — manuka.
          </p>
          <p className="text-muted-foreground">
            Ale kluczowe jest
            jedno: <strong className="text-foreground">miód musi być prawdziwy</strong>.
            A to wcale nie jest oczywiste.
          </p>
        </section>

        {/* Problem sklepowy */}
        <section className="mb-16">
          <h2 className="mb-4 font-heading text-2xl tracking-tight">
            Problem miodu ze sklepu
          </h2>
          <p className="mb-4 text-muted-foreground">
            Żeby wyprodukować pół litra miodu, potrzeba około 500 pszczół
            pracujących przez 2 tygodnie. Dlatego producenci masowego miodu
            dodają do niego wszystko: wypełniacze, czysty cukier, zamienniki.
          </p>
          <p className="mb-4 text-muted-foreground">
            70% miodu na półkach sklepów w USA nie da się nazwać
            miodem<Ref n={11} /> — nie zawiera pyłku, bo przeszedł
            ultra-filtrację, która niszczy jego podstawową strukturę.
          </p>
          <p className="text-muted-foreground">
            W Polsce sytuacja wygląda podobnie. Dobry miód kosztuje i nie
            jest łatwy do znalezienia — chyba że znasz
            pszczelarza&nbsp;;-)
          </p>
        </section>

        {/* Źródła */}
        <section className="border-t border-border pt-10">
          <h2 className="mb-6 font-heading text-xl tracking-tight">
            Źródła
          </h2>
          <ol className="space-y-3">
            {sources.map((s) => (
              <li key={s.id} id={`zrodlo-${s.id}`} className="flex gap-3 text-sm">
                <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-400/80 text-[10px] font-semibold leading-none text-amber-950">
                  {s.id}
                </span>
                <span className="text-muted-foreground">
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-foreground"
                  >
                    {s.label}
                  </a>
                  {" — "}
                  <span className="italic">{s.journal}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  );
}
