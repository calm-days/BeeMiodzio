#!/usr/bin/env python3
"""
One-shot scraper for portalpszczelarski.pl - all Polish beekeepers (pasieki).
Source: public veterinary registry republished with publisher's consent.
Output: data/pasieki/pasieki.json + pasieki.csv
"""
import re
import json
import csv
import time
import sys
import html as html_mod
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE = "https://www.portalpszczelarski.pl"
UA = "Mozilla/5.0 (compatible; PasiekiScraper/1.0; research)"
REFERER = f"{BASE}/mapa.html"
OUT_DIR = Path(__file__).parent.parent / "data" / "pasieki"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# Voivodeship ID → slug (observed from /mapa.html nav)
# Canonical mapping from /mapa.html nav
VOIVODESHIP = {
    2: "pomorskie", 3: "lubelskie", 4: "mazowieckie", 5: "podlaskie",
    6: "swietokrzyskie", 7: "malopolskie", 8: "wielkopolskie", 9: "kujawsko-pomorskie",
    10: "lodzkie", 11: "slaskie", 12: "warminsko-mazurskie", 13: "podkarpackie",
    14: "dolnoslaskie", 15: "opolskie", 16: "lubuskie", 17: "zachodniopomorskie",
}

def fetch(url, referer=None, retries=3, timeout=20):
    for attempt in range(retries):
        try:
            headers = {"User-Agent": UA}
            if referer:
                headers["Referer"] = referer
            req = Request(url, headers=headers)
            with urlopen(req, timeout=timeout) as r:
                return r.read().decode("utf-8", errors="replace")
        except (URLError, HTTPError, TimeoutError) as e:
            if attempt == retries - 1:
                return None
            time.sleep(0.5 * (attempt + 1))
    return None

def clean(s):
    if s is None:
        return None
    s = html_mod.unescape(s)
    s = re.sub(r"<[^>]+>", "", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s or None

# =========================================================================
# Phase 1 — sitemap → all (id, slug) pairs
# =========================================================================
def phase1_sitemap():
    print("[1/4] Fetching sitemap...", flush=True)
    sm = fetch(f"{BASE}/sitemap.xml")
    if not sm:
        print("  ERROR: sitemap unreachable", flush=True)
        sys.exit(1)
    matches = re.findall(
        r"<loc>http://www\.portalpszczelarski\.pl/pasieka/(\d+)/([^<]+)\.html</loc>",
        sm,
    )
    ids = {int(i): s for i, s in matches}
    print(f"  -> {len(ids)} pasieka URLs found in sitemap", flush=True)
    return ids

# =========================================================================
# Phase 2 — map pages → GPS + voivodeship per id
# =========================================================================
MARKER_RE = re.compile(r'\[\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*(\d+)\s*,\s*"([^"]+)"\s*\]')

def fetch_map_page(path):
    txt = fetch(f"{BASE}/{path}")
    if not txt:
        return []
    return [
        (int(m.group(3)), float(m.group(1)), float(m.group(2)), m.group(4))
        for m in MARKER_RE.finditer(txt)
    ]

def phase2_gps():
    print("[2/4] Fetching map pages for GPS (375 pages)...", flush=True)
    gps = {}
    pages = [f"mapa/pasieki-0/{n}.html" for n in range(375)]
    done = 0
    with ThreadPoolExecutor(max_workers=8) as ex:
        futures = {ex.submit(fetch_map_page, p): p for p in pages}
        for fut in as_completed(futures):
            for id_, lat, lng, slug in fut.result():
                gps[id_] = {"lat": lat, "lng": lng, "slug_map": slug}
            done += 1
            if done % 50 == 0:
                print(f"  progress: {done}/375 pages, {len(gps)} coords", flush=True)
    print(f"  -> {len(gps)} coords collected", flush=True)
    return gps

# =========================================================================
# Phase 2b — voivodeship per id (map filter pages)
# =========================================================================
def phase2b_voivodeship():
    print("[2b/4] Fetching voivodeship filter pages (17 voivodeships)...", flush=True)
    woj_map = {}  # id -> woj_slug
    for woj_id, woj_slug in VOIVODESHIP.items():
        txt = fetch(f"{BASE}/mapa/pasieki/{woj_id}/{woj_slug}.html")
        if not txt:
            continue
        # Main page gives first 14 markers
        for m in MARKER_RE.finditer(txt):
            id_ = int(m.group(3))
            woj_map[id_] = woj_slug
        # Paginated list under pasieki-<wojid>/pokaz/<n>.html
        last_m = re.findall(rf"mapa/pasieki-{woj_id}/pokaz/(\d+)\.html", txt)
        if last_m:
            max_page = max(int(x) for x in last_m)
        else:
            max_page = 0
        # Iterate pokaz pages
        for n in range(1, max_page + 1):
            pt = fetch(f"{BASE}/mapa/pasieki-{woj_id}/pokaz/{n}.html")
            if not pt:
                continue
            for link in re.findall(r'href="pasieka/(\d+)/[^"]+"', pt):
                woj_map[int(link)] = woj_slug
        print(f"  {woj_slug}: total {sum(1 for v in woj_map.values() if v == woj_slug)}", flush=True)
    print(f"  -> {len(woj_map)} ids mapped to voivodeships", flush=True)
    return woj_map

# =========================================================================
# Phase 3 — api/pasieka.php?r=<id> → details
# =========================================================================
H3_RE = re.compile(r"<h3>(.*?)</h3>", re.DOTALL)
P_RE = re.compile(r"<p>(.*?)</p>", re.DOTALL)
POSTAL_RE = re.compile(r"(\d{2}-\d{3})")

def parse_fragment(frag):
    if not frag:
        return None
    name = clean(H3_RE.search(frag).group(1)) if H3_RE.search(frag) else None
    if not name:
        return None
    paras = [clean(p) for p in P_RE.findall(frag)]
    paras = [p for p in paras if p]
    addr, lic, scope = None, None, None
    for p in paras:
        if POSTAL_RE.search(p) and not addr:
            addr = p
        elif "licencji weterynaryjnej" in p.lower():
            m = re.search(r"licencji weterynaryjnej:\s*(.+)", p, re.IGNORECASE)
            if m:
                lic = m.group(1).strip()
        elif p.lower().startswith("zakres"):
            m = re.match(r"zakres:\s*(.+)", p, re.IGNORECASE)
            if m:
                scope = m.group(1).strip()
    postal = POSTAL_RE.search(addr).group(1) if addr else None
    # Remainder after postal code
    locality = None
    street = None
    if addr and postal:
        rest = addr.replace(postal, "", 1).strip().strip(",")
        # Heuristic split: comma separates locality from street; else look for "ul." marker
        if "," in rest:
            locality, street = [x.strip() for x in rest.split(",", 1)]
        elif re.search(r"\bul\.", rest):
            idx = rest.index("ul.")
            locality = rest[:idx].strip()
            street = rest[idx:].strip()
        else:
            locality = rest
    return {
        "name": name,
        "address_raw": addr,
        "postal_code": postal,
        "locality": locality,
        "street": street,
        "license_no": lic,
        "scope": scope,
    }

def fetch_detail(id_):
    frag = fetch(f"{BASE}/api/pasieka.php?r={id_}", referer=REFERER)
    return id_, parse_fragment(frag)

def phase3_details(ids, gps, woj_map):
    print(f"[3/4] Fetching details for {len(ids)} pasieki...", flush=True)
    records = []
    done = 0
    ckpt_path = OUT_DIR / "pasieki.checkpoint.json"
    with ThreadPoolExecutor(max_workers=12) as ex:
        futures = {ex.submit(fetch_detail, id_): id_ for id_ in ids.keys()}
        for fut in as_completed(futures):
            id_, data = fut.result()
            if data:
                g = gps.get(id_, {})
                records.append({
                    "id": id_,
                    "slug": ids[id_],
                    "name": data["name"],
                    "address_raw": data["address_raw"],
                    "postal_code": data["postal_code"],
                    "locality": data["locality"],
                    "street": data["street"],
                    "license_no": data["license_no"],
                    "scope": data["scope"],
                    "voivodeship": woj_map.get(id_),
                    "lat": g.get("lat"),
                    "lng": g.get("lng"),
                    "detail_url": f"{BASE}/pasieka/{id_}/{ids[id_]}.html",
                })
            done += 1
            if done % 500 == 0 or done == len(ids):
                print(f"  progress: {done}/{len(ids)} fetched, {len(records)} valid", flush=True)
                # checkpoint snapshot
                recs_sorted = sorted(records, key=lambda x: x["id"])
                with open(ckpt_path, "w", encoding="utf-8") as f:
                    json.dump(recs_sorted, f, ensure_ascii=False)
    records.sort(key=lambda x: x["id"])
    print(f"  -> {len(records)} valid records", flush=True)
    if ckpt_path.exists():
        ckpt_path.unlink()
    return records

# =========================================================================
# Phase 4 — write JSON + CSV
# =========================================================================
def phase4_write(records):
    print("[4/4] Writing outputs...", flush=True)
    json_path = OUT_DIR / "pasieki.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)
    csv_path = OUT_DIR / "pasieki.csv"
    fields = [
        "id", "slug", "name", "voivodeship", "postal_code", "locality", "street",
        "address_raw", "license_no", "scope", "lat", "lng", "detail_url"
    ]
    with open(csv_path, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        for r in records:
            w.writerow({k: r.get(k, "") for k in fields})
    print(f"  JSON: {json_path} ({json_path.stat().st_size:,} B)", flush=True)
    print(f"  CSV:  {csv_path} ({csv_path.stat().st_size:,} B)", flush=True)

# =========================================================================
# Stats
# =========================================================================
def print_stats(records):
    print("\n=== STATS ===", flush=True)
    print(f"Total records: {len(records)}", flush=True)
    from collections import Counter
    woj = Counter(r.get("voivodeship") or "(brak)" for r in records)
    for w, c in woj.most_common():
        print(f"  {w:<22} {c:>5}", flush=True)
    missing_gps = sum(1 for r in records if r["lat"] is None)
    missing_postal = sum(1 for r in records if not r["postal_code"])
    missing_woj = sum(1 for r in records if not r["voivodeship"])
    print(f"\nMissing GPS:        {missing_gps} ({missing_gps/len(records):.0%})", flush=True)
    print(f"Missing postal:     {missing_postal} ({missing_postal/len(records):.0%})", flush=True)
    print(f"Missing voivodeship:{missing_woj} ({missing_woj/len(records):.0%})", flush=True)

if __name__ == "__main__":
    t0 = time.time()
    ids = phase1_sitemap()
    gps = phase2_gps()
    woj_map = phase2b_voivodeship()
    records = phase3_details(ids, gps, woj_map)
    phase4_write(records)
    print_stats(records)
    print(f"\n[OK] Done in {time.time()-t0:.1f}s", flush=True)
