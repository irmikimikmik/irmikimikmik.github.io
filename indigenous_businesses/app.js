/* BC Indigenous Business Listings — Visualized (in-browser Babel, no build step)
   Data is fetched live from the Government of BC's open data CSV at runtime —
   nothing here is a local snapshot, so the tool always reflects the Province's
   current published listings. */

const { useState, useEffect, useMemo, useRef } = React;

const CSV_URL = 'https://catalogue.data.gov.bc.ca/dataset/bdc81d33-1ab5-4882-9764-8701e8971bb7/resource/f805f66e-8294-4f8d-bdd9-2400eb3938d0/download/bcindigenousbusinesslistings3.csv';

const PAGE_SIZE = 24;

/* ---------- CSV parsing (lenient: a `"` only opens a quoted field if it's the
   first character of that field — matches Excel/Python csv dialect) ---------- */
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  let i = 0;
  const n = text.length;
  while (i < n) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
        inQuotes = false; i += 1; continue;
      }
      field += c; i += 1; continue;
    }
    if (c === '"' && field === '') { inQuotes = true; i += 1; continue; }
    if (c === ',') { row.push(field); field = ''; i += 1; continue; }
    if (c === '\r') { i += 1; continue; }
    if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; i += 1; continue; }
    field += c; i += 1;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function cleanField(v) {
  if (v == null) return '';
  return String(v).replace(/^﻿/, '').trim();
}

function emptyToNull(v) {
  const s = cleanField(v);
  return s === '' ? null : s;
}

function normalizeUrl(v) {
  const s = emptyToNull(v);
  if (!s) return null;
  return /^https?:\/\//i.test(s) ? s : `https://${s}`;
}

function normalizeRegion(raw) {
  const s = cleanField(raw);
  if (s === '') return 'Unspecified';
  if (/vancouver island/i.test(s)) return 'Vancouver Island / Coast';
  return s;
}

function normalizeType(raw) {
  let s = cleanField(raw).replace(/^:\s*/, '');
  if (s === '') return 'Unspecified';
  if (s === 'Partnershp') return 'Partnership';
  if (/^Community Owned/i.test(s)) return 'Community Owned';
  return s;
}

function normalizeSector(raw) {
  let s = cleanField(raw);
  if (s === '') return { code: null, label: 'Unspecified' };
  s = s.replace(/[‐-―]/g, '-').replace(/\s+/g, ' ');
  const m = s.match(/^(\d+(?:-\d+)?)\s*-\s*(.+)$/);
  if (m) return { code: m[1], label: m[2].trim() };
  return { code: null, label: s };
}

function rowsToRecords(csvText) {
  const raw = parseCSV(csvText).filter((r) => r.length > 1 || (r.length === 1 && r[0] !== ''));
  const header = raw.shift().map(cleanField);
  return raw.map((r) => {
    const row = {};
    header.forEach((key, idx) => { row[key] = r[idx]; });
    const lat = parseFloat(row['Latitude']);
    const lng = parseFloat(row['Longitude']);
    const sector = normalizeSector(row['Industry Sector']);
    return {
      name: cleanField(row['Business Name']) || 'Unnamed business',
      description: cleanField(row['Description']),
      address: cleanField(row['Address']),
      postalCode: emptyToNull(row['Postal Code']),
      email: emptyToNull(row['Email']),
      phone: emptyToNull(row['Phone']),
      website: normalizeUrl(row['Web Site']),
      city: cleanField(row['City']),
      lat: Number.isFinite(lat) ? lat : null,
      lng: Number.isFinite(lng) ? lng : null,
      region: normalizeRegion(row['Region']),
      type: normalizeType(row['Type']),
      sector: sector.label,
      yearFormed: emptyToNull(row['Year Formed']),
      employees: emptyToNull(row['Number of Employees']),
      contactName: emptyToNull(row['Primary Contact']),
      contactTitle: emptyToNull(row['Contact Title']),
      updated: emptyToNull(row['When Updated']),
    };
  });
}

/* ---------- Aggregation helpers ---------- */
function aggregateBy(records, keyFn) {
  const counts = new Map();
  records.forEach((r) => {
    const k = keyFn(r);
    counts.set(k, (counts.get(k) || 0) + 1);
  });
  return Array.from(counts.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

function topNWithOther(rows, n) {
  if (rows.length <= n) return rows;
  const top = rows.slice(0, n);
  const otherTotal = rows.slice(n).reduce((s, r) => s + r.value, 0);
  return [...top, { label: 'Other', value: otherTotal }];
}

/* ---------- Components ---------- */
function StatTiles({ records }) {
  const regions = new Set(records.map((r) => r.region)).size;
  const sectors = new Set(records.map((r) => r.sector)).size;
  const withSite = records.filter((r) => r.website).length;
  const pctSite = records.length ? Math.round((withSite / records.length) * 100) : 0;

  const tiles = [
    { label: 'Businesses shown', value: records.length.toLocaleString('en-CA') },
    { label: 'Regions represented', value: regions.toLocaleString('en-CA') },
    { label: 'Industry sectors', value: sectors.toLocaleString('en-CA') },
    { label: 'Have a website', value: `${pctSite}%` },
  ];

  return (
    <div className="bb-stats">
      {tiles.map((t) => (
        <div className="bb-stat-tile" key={t.label}>
          <div className="bb-stat-label">{t.label}</div>
          <div className="bb-stat-value">{t.value}</div>
        </div>
      ))}
    </div>
  );
}

function FiltersPanel({ search, setSearch, region, setRegion, sector, setSector, type, setType, regionOptions, sectorOptions, typeOptions, onReset }) {
  return (
    <div className="bb-filters">
      <div className="bb-field bb-field-wide">
        <label htmlFor="bb-search">Search businesses</label>
        <input id="bb-search" type="text" placeholder="Name, description, or city"
          value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="bb-field">
        <label htmlFor="bb-region">Region</label>
        <select id="bb-region" value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="all">All regions</option>
          {regionOptions.map((r) => <option key={r.label} value={r.label}>{r.label} ({r.value})</option>)}
        </select>
      </div>
      <div className="bb-field">
        <label htmlFor="bb-sector">Industry sector</label>
        <select id="bb-sector" value={sector} onChange={(e) => setSector(e.target.value)}>
          <option value="all">All sectors</option>
          {sectorOptions.map((s) => <option key={s.label} value={s.label}>{s.label} ({s.value})</option>)}
        </select>
      </div>
      <div className="bb-field">
        <label htmlFor="bb-type">Business type</label>
        <select id="bb-type" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="all">All types</option>
          {typeOptions.map((t) => <option key={t.label} value={t.label}>{t.label} ({t.value})</option>)}
        </select>
      </div>
      <button type="button" className="bb-reset-btn" onClick={onReset}>Reset filters</button>
    </div>
  );
}

function BarChart({ title, rows }) {
  const max = rows.reduce((m, r) => Math.max(m, r.value), 0) || 1;
  return (
    <div className="bb-chart-card">
      <div className="bb-chart-title">{title}</div>
      {rows.length === 0 ? (
        <div className="bb-empty">No data for the current filters.</div>
      ) : rows.map((r) => (
        <div className="bb-bar-row" key={r.label} title={`${r.label}: ${r.value.toLocaleString('en-CA')}`}>
          <div className="bb-bar-label">{r.label}</div>
          <div className="bb-bar-track">
            <div className="bb-bar-fill" style={{ width: `${(r.value / max) * 100}%` }} />
          </div>
          <div className="bb-bar-value">{r.value.toLocaleString('en-CA')}</div>
        </div>
      ))}
    </div>
  );
}

function clusterIconFn(cluster) {
  const count = cluster.getChildCount();
  // Sequential indigo ramp (light -> dark = few -> many businesses). Each tier's
  // text color is chosen per-fill so it clears 4.5:1 contrast (verified: #6366f1
  // failed AA against both white and dark text, hence #4f46e5 for the "large" tier).
  let bg = '#a5b4fc', fg = '#0d1117', size = 32;
  if (count >= 200) { bg = '#4338ca'; fg = '#ffffff'; size = 52; }
  else if (count >= 50) { bg = '#4f46e5'; fg = '#ffffff'; size = 44; }
  else if (count >= 10) { bg = '#818cf8'; fg = '#0d1117'; size = 38; }
  return L.divIcon({
    html: `<div class="bb-cluster-icon" style="width:${size}px;height:${size}px;background:${bg};color:${fg};">${count}</div>`,
    className: '',
    iconSize: L.point(size, size),
  });
}

function buildPopupNode(r) {
  const wrap = document.createElement('div');

  const h4 = document.createElement('h4');
  h4.textContent = r.name;
  wrap.appendChild(h4);

  const meta = document.createElement('p');
  meta.textContent = [r.city, r.region].filter(Boolean).join(' · ');
  wrap.appendChild(meta);

  const sectorP = document.createElement('p');
  sectorP.textContent = [r.sector, r.type].filter(Boolean).join(' · ');
  wrap.appendChild(sectorP);

  if (r.website) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = r.website;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = 'Website';
    p.appendChild(a);
    wrap.appendChild(p);
  }

  return wrap;
}

function MapView({ records }) {
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const clusterRef = useRef(null);

  useEffect(() => {
    const map = L.map(mapDivRef.current, { scrollWheelZoom: false }).setView([54.5, -125], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);
    const cluster = L.markerClusterGroup({ iconCreateFunction: clusterIconFn, maxClusterRadius: 50 });
    map.addLayer(cluster);
    mapRef.current = map;
    clusterRef.current = cluster;
    return () => { map.remove(); };
  }, []);

  useEffect(() => {
    const cluster = clusterRef.current;
    if (!cluster) return;
    cluster.clearLayers();
    records.forEach((r) => {
      if (r.lat == null || r.lng == null) return;
      const marker = L.circleMarker([r.lat, r.lng], {
        radius: 6, weight: 1, color: '#0d1117', fillColor: '#818cf8', fillOpacity: 0.9,
      });
      marker.bindPopup(buildPopupNode(r));
      cluster.addLayer(marker);
    });
  }, [records]);

  return <div className="bb-map" ref={mapDivRef} />;
}

function BusinessCard({ r }) {
  return (
    <div className="bb-card">
      <div className="bb-card-name">
        {r.website
          ? <a href={r.website} target="_blank" rel="noopener noreferrer">{r.name}</a>
          : r.name}
      </div>
      <div className="bb-card-meta">{[r.city, r.region].filter(Boolean).join(' · ')}</div>
      {r.description && <div className="bb-card-desc">{r.description}</div>}
      <div className="bb-card-tags">
        <span className="bb-tag-mini">{r.sector}</span>
        <span className="bb-tag-mini">{r.type}</span>
        {r.employees && <span className="bb-tag-mini">{r.employees} employees</span>}
        {r.yearFormed && <span className="bb-tag-mini">Est. {r.yearFormed}</span>}
      </div>
      <div className="bb-card-links">
        {r.website && <a href={r.website} target="_blank" rel="noopener noreferrer">Website</a>}
        {r.email && <a href={`mailto:${r.email}`}>Email</a>}
        {r.phone && <a href={`tel:${r.phone}`}>{r.phone}</a>}
      </div>
    </div>
  );
}

function App() {
  const [records, setRecords] = useState(null);
  const [loadError, setLoadError] = useState(null);

  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('all');
  const [sector, setSector] = useState('all');
  const [type, setType] = useState('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    fetch(CSV_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Could not load the BC dataset (${res.status})`);
        return res.text();
      })
      .then((text) => setRecords(rowsToRecords(text)))
      .catch((err) => setLoadError(err.message));
  }, []);

  const allRecords = records || [];

  const regionOptions = useMemo(() => aggregateBy(allRecords, (r) => r.region), [allRecords]);
  const sectorOptions = useMemo(() => aggregateBy(allRecords, (r) => r.sector), [allRecords]);
  const typeOptions = useMemo(() => aggregateBy(allRecords, (r) => r.type), [allRecords]);

  const filteredRecords = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allRecords.filter((r) => {
      if (region !== 'all' && r.region !== region) return false;
      if (sector !== 'all' && r.sector !== sector) return false;
      if (type !== 'all' && r.type !== type) return false;
      if (q === '') return true;
      return r.name.toLowerCase().includes(q)
        || r.description.toLowerCase().includes(q)
        || r.city.toLowerCase().includes(q);
    });
  }, [allRecords, search, region, sector, type]);

  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [search, region, sector, type]);

  const regionChartRows = useMemo(() => aggregateBy(filteredRecords, (r) => r.region), [filteredRecords]);
  const sectorChartRows = useMemo(() => topNWithOther(aggregateBy(filteredRecords, (r) => r.sector), 10), [filteredRecords]);

  const resetFilters = () => { setSearch(''); setRegion('all'); setSector('all'); setType('all'); };

  if (loadError) {
    return <div className="bb-loading">Couldn't load the BC government dataset: {loadError}</div>;
  }
  if (!records) {
    return <div className="bb-loading">Loading businesses&hellip;</div>;
  }

  return (
    <>
      <section className="bb-intro">
        <div className="bb-eyebrow">Government of BC Open Data</div>
        <h1 className="bb-title">BC Indigenous Business Listings, Visualized</h1>
        <p className="bb-subtitle">
          An interactive map and dashboard of Indigenous-owned businesses across British Columbia —
          filter by region, industry sector, or business type, or search by name.
        </p>
        <p className="bb-disclaimer">
          Business listings visualized from the <a href="https://catalogue.data.gov.bc.ca/dataset/bc-indigenous-business-listings" target="_blank" rel="noopener noreferrer">Government of British Columbia Open Data Catalogue — BC Indigenous Business Listings</a> dataset,
          released under the <a href="https://www2.gov.bc.ca/gov/content/data/policy-standards/open-data/open-government-licence-bc" target="_blank" rel="noopener noreferrer">Open Government Licence &ndash; British Columbia</a>. Fetched live on each visit — always confirm details directly with the business.
        </p>
      </section>

      <StatTiles records={filteredRecords} />

      <FiltersPanel
        search={search} setSearch={setSearch}
        region={region} setRegion={setRegion}
        sector={sector} setSector={setSector}
        type={type} setType={setType}
        regionOptions={regionOptions} sectorOptions={sectorOptions} typeOptions={typeOptions}
        onReset={resetFilters}
      />

      <div className="bb-charts">
        <BarChart title="Businesses by region" rows={regionChartRows} />
        <BarChart title="Businesses by industry sector (top 10)" rows={sectorChartRows} />
      </div>

      <div className="bb-map-card">
        <div className="bb-map-title">Map</div>
        <MapView records={filteredRecords} />
      </div>

      <div className="bb-result-count">
        Showing {Math.min(visibleCount, filteredRecords.length).toLocaleString('en-CA')} of {filteredRecords.length.toLocaleString('en-CA')} businesses
      </div>

      {filteredRecords.length === 0 ? (
        <div className="bb-empty">No businesses match your current filters.</div>
      ) : (
        <>
          <div className="bb-results-grid">
            {filteredRecords.slice(0, visibleCount).map((r, i) => <BusinessCard key={`${r.name}-${i}`} r={r} />)}
          </div>
          {visibleCount < filteredRecords.length && (
            <button type="button" className="bb-load-more" onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}>
              Show more
            </button>
          )}
        </>
      )}
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('bb-root'));
root.render(<App />);
