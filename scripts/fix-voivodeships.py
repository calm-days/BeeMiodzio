#!/usr/bin/env python3
"""
Fix voivodeship labels in pasieki.json (re-fetch filter pages with correct mapping)
+ backfill missing voivodeships via postal code prefix.
"""
import re
import json
import csv
from pathlib import Path
from urllib.request import Request, urlopen
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE = "https://www.portalpszczelarski.pl"
UA = "Mozilla/5.0 (compatible; PasiekiScraper/1.0; research)"
OUT = Path(__file__).parent.parent / "data" / "pasieki"

VOIVODESHIP = {
    2: "pomorskie", 3: "lubelskie", 4: "mazowieckie", 5: "podlaskie",
    6: "swietokrzyskie", 7: "malopolskie", 8: "wielkopolskie", 9: "kujawsko-pomorskie",
    10: "lodzkie", 11: "slaskie", 12: "warminsko-mazurskie", 13: "podkarpackie",
    14: "dolnoslaskie", 15: "opolskie", 16: "lubuskie", 17: "zachodniopomorskie",
}

# Postal code prefix -> voivodeship (fallback)
POSTAL_TO_WOJ = {}
for prefix, woj in [
    (range(0, 10), "mazowieckie"),
    (range(10, 15), "warminsko-mazurskie"),
    (range(15, 20), "podlaskie"),
    (range(20, 25), "lubelskie"),
    (range(25, 30), "swietokrzyskie"),
    (range(30, 35), "malopolskie"),
    (range(35, 40), "podkarpackie"),
    (range(40, 47), "slaskie"),
    (range(47, 50), "opolskie"),
    (range(50, 60), "dolnoslaskie"),
    (range(60, 65), "wielkopolskie"),
    (range(65, 70), "lubuskie"),
    (range(70, 80), "zachodniopomorskie"),
    (range(80, 85), "pomorskie"),
    (range(85, 90), "kujawsko-pomorskie"),
    (range(90, 100), "lodzkie"),
]:
    for p in prefix:
        POSTAL_TO_WOJ[f"{p:02d}"] = woj

def fetch(url):
    try:
        req = Request(url, headers={"User-Agent": UA, "Referer": f"{BASE}/mapa.html"})
        with urlopen(req, timeout=20) as r:
            return r.read().decode("utf-8", errors="replace")
    except Exception:
        return None

MARKER_RE = re.compile(r'\[\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*(\d+)\s*,\s*"([^"]+)"\s*\]')

def rebuild_woj_map():
    print("Rebuilding voivodeship map...", flush=True)
    woj_map = {}
    for woj_id, woj_slug in VOIVODESHIP.items():
        txt = fetch(f"{BASE}/mapa/pasieki/{woj_id}/{woj_slug}.html")
        if not txt:
            continue
        for m in MARKER_RE.finditer(txt):
            woj_map[int(m.group(3))] = woj_slug
        last = re.findall(rf"mapa/pasieki-{woj_id}/pokaz/(\d+)\.html", txt)
        max_page = max((int(x) for x in last), default=0)
        for n in range(1, max_page + 1):
            pt = fetch(f"{BASE}/mapa/pasieki-{woj_id}/pokaz/{n}.html")
            if not pt:
                continue
            for link in re.findall(r'href="pasieka/(\d+)/[^"]+"', pt):
                woj_map[int(link)] = woj_slug
        count = sum(1 for v in woj_map.values() if v == woj_slug)
        print(f"  {woj_slug:<22} {count:>5}", flush=True)
    return woj_map

def postal_fallback(postal):
    if not postal or len(postal) < 2:
        return None
    return POSTAL_TO_WOJ.get(postal[:2])

def main():
    data = json.load(open(OUT / "pasieki.json"))
    print(f"Loaded {len(data)} records", flush=True)

    woj_map = rebuild_woj_map()

    # Apply fixes
    changed_woj = 0
    backfilled = 0
    for r in data:
        correct_woj = woj_map.get(r["id"])
        if correct_woj and correct_woj != r.get("voivodeship"):
            r["voivodeship"] = correct_woj
            changed_woj += 1
        elif not r.get("voivodeship"):
            fb = postal_fallback(r.get("postal_code"))
            if fb:
                r["voivodeship"] = fb
                r["voivodeship_source"] = "postal_code"
                backfilled += 1

    print(f"\nCorrected voivodeship labels: {changed_woj}", flush=True)
    print(f"Backfilled from postal code:  {backfilled}", flush=True)

    # Rewrite outputs
    data.sort(key=lambda x: x["id"])
    with open(OUT / "pasieki.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    fields = [
        "id", "slug", "name", "voivodeship", "postal_code", "locality", "street",
        "address_raw", "license_no", "scope", "lat", "lng", "detail_url"
    ]
    with open(OUT / "pasieki.csv", "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        for r in data:
            w.writerow({k: r.get(k, "") for k in fields})

    # Final stats
    from collections import Counter
    woj = Counter(r.get("voivodeship") or "(brak)" for r in data)
    print("\n=== FINAL STATS ===", flush=True)
    for w, c in woj.most_common():
        print(f"  {w:<22} {c:>5}", flush=True)
    missing = sum(1 for r in data if not r.get("voivodeship"))
    print(f"\nStill missing voivodeship: {missing}", flush=True)

if __name__ == "__main__":
    main()
