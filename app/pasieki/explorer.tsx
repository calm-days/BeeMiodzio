"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Search, MapPin, ExternalLink, X } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Leaflet is loaded dynamically to avoid SSR window access.
type LeafletModule = typeof import("leaflet");

type SlimRow = {
  i: number;  // id
  s: string;  // slug
  n: string;  // name
  w: string | null;  // voivodeship
  p: string | null;  // postal_code
  l: string | null;  // locality
  t: string | null;  // street
  c: string | null;  // license_no
  z: string | null;  // scope
  y: number | null;  // lat
  x: number | null;  // lng
};

type Pasieka = {
  id: number;
  slug: string;
  name: string;
  voivodeship: string | null;
  postalCode: string | null;
  locality: string | null;
  street: string | null;
  licenseNo: string | null;
  scope: string | null;
  lat: number | null;
  lng: number | null;
  detailUrl: string;
};

const VOIVODESHIPS = [
  "dolnoslaskie", "kujawsko-pomorskie", "lubelskie", "lubuskie",
  "lodzkie", "malopolskie", "mazowieckie", "opolskie",
  "podkarpackie", "podlaskie", "pomorskie", "slaskie",
  "swietokrzyskie", "warminsko-mazurskie", "wielkopolskie", "zachodniopomorskie",
];

const VOIV_LABEL: Record<string, string> = {
  "dolnoslaskie": "dolnośląskie",
  "kujawsko-pomorskie": "kujawsko-pomorskie",
  "lubelskie": "lubelskie",
  "lubuskie": "lubuskie",
  "lodzkie": "łódzkie",
  "malopolskie": "małopolskie",
  "mazowieckie": "mazowieckie",
  "opolskie": "opolskie",
  "podkarpackie": "podkarpackie",
  "podlaskie": "podlaskie",
  "pomorskie": "pomorskie",
  "slaskie": "śląskie",
  "swietokrzyskie": "świętokrzyskie",
  "warminsko-mazurskie": "warmińsko-mazurskie",
  "wielkopolskie": "wielkopolskie",
  "zachodniopomorskie": "zachodniopomorskie",
};

const PAGE_SIZE = 100;

function expand(r: SlimRow): Pasieka {
  return {
    id: r.i,
    slug: r.s,
    name: r.n,
    voivodeship: r.w,
    postalCode: r.p,
    locality: r.l,
    street: r.t,
    licenseNo: r.c,
    scope: r.z,
    lat: r.y,
    lng: r.x,
    detailUrl: `https://www.portalpszczelarski.pl/pasieka/${r.i}/${r.s}.html`,
  };
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function PasiekiExplorer() {
  const [rows, setRows] = useState<Pasieka[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [voiv, setVoiv] = useState<string>("");
  const [onlyWithGps, setOnlyWithGps] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Load data
  useEffect(() => {
    let cancelled = false;
    fetch("/data/pasieki.json")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<SlimRow[]>;
      })
      .then((data) => {
        if (cancelled) return;
        setRows(data.map(expand));
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Filter
  const filtered = useMemo(() => {
    if (!rows) return [];
    const needle = normalize(search.trim());
    return rows.filter((r) => {
      if (voiv && r.voivodeship !== voiv) return false;
      if (onlyWithGps && (r.lat === null || r.lng === null)) return false;
      if (needle) {
        const hay = normalize(
          `${r.name} ${r.locality ?? ""} ${r.street ?? ""} ${r.postalCode ?? ""} ${r.licenseNo ?? ""}`
        );
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [rows, search, voiv, onlyWithGps]);

  // Reset pagination on filter change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, voiv, onlyWithGps]);

  // When a marker is clicked for a row beyond the visible window,
  // expand the list so that the row is rendered (and can be scrolled to).
  useEffect(() => {
    if (selectedId === null || filtered.length === 0) return;
    const index = filtered.findIndex((r) => r.id === selectedId);
    if (index === -1) return;
    if (index >= visibleCount) {
      // Round up to next PAGE_SIZE boundary so we don't reveal exactly one extra row.
      const next = Math.ceil((index + 1) / PAGE_SIZE) * PAGE_SIZE;
      setVisibleCount(next);
    }
  }, [selectedId, filtered, visibleCount]);

  const visibleRows = filtered.slice(0, visibleCount);
  const mapRows = useMemo(
    () => filtered.filter((r) => r.lat !== null && r.lng !== null).slice(0, 2000),
    [filtered]
  );

  return (
    <div className="flex flex-col h-screen">
      <Header total={rows?.length ?? 0} filtered={filtered.length} />
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[460px_1fr] overflow-hidden">
        <aside className="flex flex-col border-r border-zinc-200 bg-white overflow-hidden">
          <Filters
            search={search}
            setSearch={setSearch}
            voiv={voiv}
            setVoiv={setVoiv}
            onlyWithGps={onlyWithGps}
            setOnlyWithGps={setOnlyWithGps}
          />
          <List
            rows={visibleRows}
            total={filtered.length}
            visibleCount={visibleCount}
            onLoadMore={() => setVisibleCount((c) => c + PAGE_SIZE)}
            selectedId={selectedId}
            onSelect={setSelectedId}
            loading={rows === null}
            error={error}
          />
        </aside>
        <section className="relative bg-zinc-100">
          <MapView
            rows={mapRows}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </section>
      </div>
    </div>
  );
}

function Header({ total, filtered }: { total: number; filtered: number }) {
  return (
    <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-3">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="text-sm text-zinc-500 hover:text-zinc-900 transition"
        >
          ← Strona główna
        </Link>
        <span className="text-zinc-300">|</span>
        <h1 className="font-semibold text-zinc-900">Baza pasiek — Polska</h1>
      </div>
      <div className="text-sm text-zinc-500">
        {total > 0 && (
          <>
            <span className="font-medium text-zinc-900">{filtered.toLocaleString("pl-PL")}</span>
            {filtered !== total && <> z {total.toLocaleString("pl-PL")}</>} pasiek
          </>
        )}
      </div>
    </header>
  );
}

function Filters({
  search,
  setSearch,
  voiv,
  setVoiv,
  onlyWithGps,
  setOnlyWithGps,
}: {
  search: string;
  setSearch: (v: string) => void;
  voiv: string;
  setVoiv: (v: string) => void;
  onlyWithGps: boolean;
  setOnlyWithGps: (v: boolean) => void;
}) {
  return (
    <div className="border-b border-zinc-200 p-4 space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <input
          type="search"
          placeholder="Szukaj nazwiska, miasta, licencji..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-9 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
            aria-label="Wyczyść"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <select
          value={voiv}
          onChange={(e) => setVoiv(e.target.value)}
          className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        >
          <option value="">Wszystkie województwa</option>
          {VOIVODESHIPS.map((w) => (
            <option key={w} value={w}>
              {VOIV_LABEL[w] ?? w}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={onlyWithGps}
          onChange={(e) => setOnlyWithGps(e.target.checked)}
          className="h-4 w-4 rounded border-zinc-300 text-amber-600 focus:ring-amber-500"
        />
        Tylko z koordynatami na mapie
      </label>
    </div>
  );
}

function List({
  rows,
  total,
  visibleCount,
  onLoadMore,
  selectedId,
  onSelect,
  loading,
  error,
}: {
  rows: Pasieka[];
  total: number;
  visibleCount: number;
  onLoadMore: () => void;
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  loading: boolean;
  error: string | null;
}) {
  const selectedRef = useRef<HTMLLIElement>(null);

  // Re-runs when selectedId changes OR when rows are re-rendered (e.g. after
  // visibleCount expansion triggered by a marker click on a row beyond the page).
  useEffect(() => {
    if (selectedId === null || !selectedRef.current) return;
    selectedRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [selectedId, rows]);

  if (error) {
    return (
      <div className="p-6 text-sm text-red-600">
        Błąd ładowania: {error}
      </div>
    );
  }
  if (loading) {
    return (
      <div className="p-6 text-sm text-zinc-500">Ładowanie danych...</div>
    );
  }
  if (rows.length === 0) {
    return (
      <div className="p-6 text-sm text-zinc-500">
        Brak wyników dla bieżących filtrów.
      </div>
    );
  }

  return (
    <ul className="flex-1 overflow-y-auto divide-y divide-zinc-100">
      {rows.map((r) => {
        const isSelected = r.id === selectedId;
        return (
          <li
            key={r.id}
            ref={isSelected ? selectedRef : null}
            className={cn(
              "group cursor-pointer px-4 py-3 transition",
              isSelected
                ? "bg-amber-50 border-l-4 border-amber-500"
                : "hover:bg-zinc-50 border-l-4 border-transparent"
            )}
            onClick={() => onSelect(r.id === selectedId ? null : r.id)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="font-medium text-zinc-900 truncate">{r.name}</div>
                <div className="mt-0.5 text-xs text-zinc-500 flex items-center gap-1">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">
                    {[r.postalCode, r.locality, r.street].filter(Boolean).join(" ")}
                  </span>
                </div>
                {r.licenseNo && (
                  <div className="mt-1 text-xs text-zinc-400 font-mono">
                    nr wet.: {r.licenseNo}
                  </div>
                )}
                {r.voivodeship && (
                  <span className="mt-2 inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600">
                    {VOIV_LABEL[r.voivodeship] ?? r.voivodeship}
                  </span>
                )}
              </div>
              <a
                href={r.detailUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-amber-600 transition"
                title="Otwórz wizytówkę"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </li>
        );
      })}
      {visibleCount < total && (
        <li className="p-4">
          <button
            onClick={onLoadMore}
            className="w-full rounded-lg border border-zinc-200 bg-white py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition"
          >
            Pokaż kolejne {Math.min(PAGE_SIZE, total - visibleCount)} z {total - visibleCount}
          </button>
        </li>
      )}
    </ul>
  );
}

function MapView({
  rows,
  selectedId,
  onSelect,
}: {
  rows: Pasieka[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<ReturnType<LeafletModule["map"]> | null>(null);
  const markersLayerRef = useRef<ReturnType<LeafletModule["layerGroup"]> | null>(null);
  const markerByIdRef = useRef<Map<number, ReturnType<LeafletModule["circleMarker"]>>>(new Map());
  const leafletRef = useRef<LeafletModule | null>(null);
  const [ready, setReady] = useState(false);

  // Init map once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current) return;
      leafletRef.current = L;
      const map = L.map(containerRef.current, {
        preferCanvas: true,
        zoomControl: true,
      }).setView([52.1, 19.4], 6);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        maxZoom: 18,
      }).addTo(map);
      const layer = L.layerGroup().addTo(map);
      mapRef.current = map;
      markersLayerRef.current = layer;
      setReady(true);
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
      markerByIdRef.current.clear();
    };
  }, []);

  // Update markers on data change + fit bounds to visible set
  useEffect(() => {
    const L = leafletRef.current;
    const layer = markersLayerRef.current;
    const map = mapRef.current;
    if (!ready || !L || !layer || !map) return;
    layer.clearLayers();
    markerByIdRef.current.clear();
    const coords: [number, number][] = [];
    for (const r of rows) {
      if (r.lat === null || r.lng === null) continue;
      const marker = L.circleMarker([r.lat, r.lng], {
        radius: 5,
        color: "#b45309",
        fillColor: "#f59e0b",
        fillOpacity: 0.85,
        weight: 1,
      });
      marker.bindTooltip(r.name, { direction: "top", offset: [0, -6] });
      marker.on("click", () => onSelect(r.id));
      layer.addLayer(marker);
      markerByIdRef.current.set(r.id, marker);
      coords.push([r.lat, r.lng]);
    }
    if (coords.length > 0 && coords.length < 3000) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13, animate: true });
    }
  }, [rows, ready, onSelect]);

  // Fly to selected marker and restyle
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!ready || !L || !map) return;
    // Restyle all
    for (const [id, marker] of markerByIdRef.current) {
      marker.setStyle(
        id === selectedId
          ? { radius: 9, color: "#7c2d12", fillColor: "#fbbf24", fillOpacity: 1, weight: 2 }
          : { radius: 5, color: "#b45309", fillColor: "#f59e0b", fillOpacity: 0.85, weight: 1 }
      );
    }
    if (selectedId === null) return;
    const marker = markerByIdRef.current.get(selectedId);
    if (marker) {
      const latlng = marker.getLatLng();
      map.flyTo(latlng, Math.max(map.getZoom(), 12), { duration: 0.8 });
    }
  }, [selectedId, ready]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
      <div className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-white/90 px-2 py-1 text-xs text-zinc-500 shadow-sm">
        {rows.length.toLocaleString("pl-PL")} markerów na mapie
      </div>
    </div>
  );
}
