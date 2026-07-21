/* Indigenous Catering Budget Calculator — React app (in-browser Babel, no build step)
   Data is fetched and parsed from master_indigenous_catering.csv at runtime — nothing
   here is hardcoded, so updating the CSV is enough to update the tool. */

const { useState, useEffect, useMemo } = React;

const CSV_PATH = './master_indigenous_catering.csv';

const HEADER = ['Business', 'ContactEmail', 'ContactPhone', 'ItemName', 'ItemType', 'MealType',
  'ServingSize', 'ServingSizeUnit', 'PricePerUnit', 'TotalPrice', 'MinimumOrderAmount',
  'MinimumOrderType', 'DeliveryAvailable', 'DeliveryMinimum', 'DeliveryZone',
  'PickupAvailable', 'DepositPercentage', 'DepositDays', 'PaymentMethods',
  'DietaryNotes', 'Description', 'Notes'];

const BIZ_ID = {
  'Friendship Catering': 'friendship',
  'Salish Catering': 'salish',
  'Salmon n Bannock': 'salmonnbannock',
  'Cedar Feast House': 'cedar',
};

const BIZ_COLOR = {
  friendship: '#2f6b4f',
  salish: '#8a4b2c',
  salmonnbannock: '#a3324f',
  cedar: '#3f5c7a',
};

/* ---------- Business finance rules (not structured data in the CSV's free-text notes) ---------- */
const FINANCE_RULES = {
  friendship: {
    gratuityPct: 15, taxPct: 0,
    gratuityLabel: '15% gratuity', taxLabel: null,
  },
  salish: {
    gratuityPct: 20, taxPct: 5,
    gratuityLabel: '20% gratuity', taxLabel: '5% GST (PST also applies to liquor, not included)',
  },
  salmonnbannock: {
    gratuityPct: null, taxPct: null,
    gratuityLabel: 'Gratuity varies — confirm with caterer', taxLabel: null,
  },
  cedar: {
    gratuityPct: null, taxPct: null,
    gratuityLabel: 'Pricing not published — contact for quote', taxLabel: null,
  },
};

const MEAL_OPTIONS = [
  { value: 'all', label: 'All meal types' },
  { value: 'Breakfast', label: 'Breakfast' },
  { value: 'Lunch', label: 'Lunch' },
  { value: 'Dinner', label: 'Dinner' },
  { value: 'Reception', label: 'Reception / Snacks' },
];

const MEAL_MATCH = {
  Breakfast: ['Breakfast'],
  Lunch: ['Lunch'],
  Dinner: ['Dinner'],
  Reception: ['Reception', 'Beverage', 'Dessert'],
};

/* ---------- CSV parsing ---------- */
// RFC4180-ish, but matches Excel/Python csv's lenient rule: a `"` only starts a
// quoted field if it's the first character of that field, otherwise it's literal
// (the source sheet has a few rows with a stray trailing quote in one column).
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
  let s = String(v).trim();
  if (s.endsWith('"') && !s.startsWith('"')) s = s.slice(0, -1);
  return s;
}

function numOrNone(v) {
  const s = cleanField(v);
  if (s === '' || s === 'N/A' || s === 'TBD' || s === 'Unknown' || s === 'Varies') return null;
  const n = Number(s);
  return Number.isNaN(n) ? null : n;
}

function boolOrNone(v) {
  const s = cleanField(v);
  if (s === 'Yes') return true;
  if (s === 'No') return false;
  return null;
}

function parseDietary(raw) {
  const rawClean = cleanField(raw);
  const low = rawClean.toLowerCase();
  return {
    vegan: low.includes('vegan'),
    vegetarian: low.includes('vegan') || low.includes('vegetarian'),
    glutenFree: low.includes('gluten-free') || low.includes('gluten free'),
    varies: low === 'varies',
    raw: rawClean === 'N/A' ? '' : rawClean,
  };
}

function buildCateringData(csvText) {
  const rawRows = parseCSV(csvText).filter((r) => r.length > 1 || (r.length === 1 && r[0] !== ''));
  rawRows.shift(); // header row

  const businesses = {};
  const items = [];
  let itemCounter = 0;

  rawRows.forEach((r) => {
    while (r.length < HEADER.length) r.push('');
    const row = {};
    HEADER.forEach((key, idx) => { row[key] = cleanField(r[idx]); });

    const bizId = BIZ_ID[row.Business];
    if (!bizId) return;

    if (row.ItemName === 'CATERING_CONSTRAINT') {
      businesses[bizId] = {
        id: bizId,
        name: row.Business,
        color: BIZ_COLOR[bizId],
        contactEmail: row.ContactEmail && row.ContactEmail !== 'N/A' ? row.ContactEmail : null,
        contactPhone: row.ContactPhone && row.ContactPhone !== 'N/A' ? row.ContactPhone : null,
        minimumOrderAmount: row.MinimumOrderAmount === 'TBD' ? null : numOrNone(row.MinimumOrderAmount),
        minimumOrderType: row.MinimumOrderType,
        deliveryAvailable: boolOrNone(row.DeliveryAvailable),
        deliveryMinimum: numOrNone(row.DeliveryMinimum),
        deliveryZone: row.DeliveryZone && row.DeliveryZone !== 'Unknown' ? row.DeliveryZone : null,
        pickupAvailable: boolOrNone(row.PickupAvailable),
        depositPercentage: numOrNone(row.DepositPercentage),
        depositDays: row.DepositDays,
        paymentMethods: row.PaymentMethods && row.PaymentMethods !== 'Unknown' ? row.PaymentMethods : null,
        fullNote: row.Description,
        criticalNote: row.Notes,
      };
      return;
    }

    itemCounter += 1;
    items.push({
      id: `${bizId}-${itemCounter}`,
      businessId: bizId,
      itemName: row.ItemName,
      itemType: row.ItemType,
      mealType: row.MealType,
      servingSize: numOrNone(row.ServingSize) || 1,
      servingSizeUnit: row.ServingSizeUnit,
      pricePerUnit: numOrNone(row.PricePerUnit),
      totalPrice: numOrNone(row.TotalPrice),
      minimumOrderAmount: numOrNone(row.MinimumOrderAmount),
      minimumOrderType: (row.MinimumOrderType !== 'TBD' && row.MinimumOrderType !== 'Unknown') ? row.MinimumOrderType : null,
      deliveryAvailable: boolOrNone(row.DeliveryAvailable),
      pickupAvailable: boolOrNone(row.PickupAvailable),
      dietary: parseDietary(row.DietaryNotes),
      description: row.Description,
      notes: row.Notes,
      priceTBD: row.PricePerUnit === 'TBD',
    });
  });

  return { businesses: Object.values(businesses), items };
}

/* ---------- Helpers ---------- */
function fmtMoney(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  return n.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function isPersonUnit(unit) {
  const u = (unit || '').toLowerCase();
  return u === 'person' || u === 'people';
}

function packsForMinimum(item) {
  if (!item.minimumOrderAmount || !item.servingSize) return 1;
  return Math.max(1, Math.ceil(item.minimumOrderAmount / item.servingSize));
}

function suggestedQty(item, headcount) {
  const minPacks = packsForMinimum(item);
  if (isPersonUnit(item.servingSizeUnit) && headcount > 0) {
    const basePacks = Math.max(1, Math.ceil(headcount / item.servingSize));
    return Math.max(minPacks, basePacks);
  }
  return minPacks;
}

function passesMeal(item, mealFilter) {
  if (mealFilter === 'all') return true;
  return (MEAL_MATCH[mealFilter] || []).includes(item.mealType);
}

function passesDietary(item, dietary) {
  const active = Object.keys(dietary).filter((k) => dietary[k]);
  if (active.length === 0) return true;
  // Items whose ingredients "vary" can't be guaranteed to meet a restriction — hide when a filter is active.
  if (item.dietary.varies) return false;
  return active.every((k) => item.dietary[k] === true);
}

function passesDelivery(item, deliveryPref) {
  if (deliveryPref === 'either') return true;
  if (deliveryPref === 'delivery') return item.deliveryAvailable !== false;
  if (deliveryPref === 'pickup') return item.pickupAvailable !== false;
  return true;
}

function businessMeetsHeadcountMin(business, headcount) {
  if (business.minimumOrderType === 'people' && business.minimumOrderAmount) {
    return headcount >= business.minimumOrderAmount;
  }
  return true;
}

function budgetBelowMinimum(business, budgetNum) {
  if (budgetNum == null) return false;
  if (business.minimumOrderType === 'dollars' && business.minimumOrderAmount) {
    return budgetNum < business.minimumOrderAmount;
  }
  return false;
}

function useCartComputation(cart, items, businesses, headcount) {
  return useMemo(() => {
    const byBiz = {};
    businesses.forEach((b) => { byBiz[b.id] = { business: b, lines: [], subtotal: 0 }; });

    items.forEach((item) => {
      const qty = cart[item.id] || 0;
      if (qty <= 0) return;
      const unitPrice = item.totalPrice != null ? item.totalPrice : item.pricePerUnit;
      if (unitPrice == null) return;
      const lineTotal = unitPrice * qty;
      byBiz[item.businessId].lines.push({ item, qty, lineTotal });
      byBiz[item.businessId].subtotal += lineTotal;
    });

    let grandSubtotal = 0, grandGratuity = 0, grandTax = 0;

    const bizSummaries = Object.values(byBiz)
      .filter((b) => b.lines.length > 0)
      .map((b) => {
        const rules = FINANCE_RULES[b.business.id] || {};
        const gratuity = rules.gratuityPct ? b.subtotal * rules.gratuityPct / 100 : 0;
        const tax = rules.taxPct ? b.subtotal * rules.taxPct / 100 : 0;
        const total = b.subtotal + gratuity + tax;
        grandSubtotal += b.subtotal; grandGratuity += gratuity; grandTax += tax;
        const meetsDollarMin = b.business.minimumOrderType === 'dollars'
          ? b.subtotal >= b.business.minimumOrderAmount : true;
        const meetsHeadcountMin = businessMeetsHeadcountMin(b.business, headcount);
        return { ...b, rules, gratuity, tax, total, meetsDollarMin, meetsHeadcountMin };
      });

    return { bizSummaries, grandSubtotal, grandGratuity, grandTax, grandTotal: grandSubtotal + grandGratuity + grandTax };
  }, [cart, items, businesses, headcount]);
}

/* ---------- Components ---------- */

function FiltersPanel({ budget, setBudget, headcount, setHeadcount, mealFilter, setMealFilter, dietary, setDietary, deliveryPref, setDeliveryPref }) {
  const toggleDietary = (key) => setDietary((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="cc-filters">
      <div className="cc-field">
        <label htmlFor="cc-budget">Budget (CAD)</label>
        <input id="cc-budget" type="number" min="0" placeholder="e.g. 800"
          value={budget} onChange={(e) => setBudget(e.target.value)} />
      </div>
      <div className="cc-field">
        <label htmlFor="cc-headcount"># of attendees</label>
        <input id="cc-headcount" type="number" min="1"
          value={headcount} onChange={(e) => setHeadcount(e.target.value)} />
      </div>
      <div className="cc-field">
        <label htmlFor="cc-meal">Meal type</label>
        <select id="cc-meal" value={mealFilter} onChange={(e) => setMealFilter(e.target.value)}>
          {MEAL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <div className="cc-field">
        <label>Delivery preference</label>
        <div className="cc-radio-row">
          {[['either', 'Either'], ['delivery', 'Delivery'], ['pickup', 'Pickup']].map(([val, label]) => (
            <label key={val} className={'cc-chip-toggle' + (deliveryPref === val ? ' active' : '')}>
              <input type="radio" name="delivery" style={{ display: 'none' }}
                checked={deliveryPref === val} onChange={() => setDeliveryPref(val)} />
              {label}
            </label>
          ))}
        </div>
      </div>
      <div className="cc-field cc-field-wide">
        <label>Dietary restrictions</label>
        <div className="cc-checkbox-row">
          {[['vegan', 'Vegan'], ['vegetarian', 'Vegetarian'], ['glutenFree', 'Gluten-free']].map(([key, label]) => (
            <label key={key} className={'cc-chip-toggle' + (dietary[key] ? ' active' : '')}>
              <input type="checkbox" style={{ display: 'none' }}
                checked={dietary[key]} onChange={() => toggleDietary(key)} />
              {label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function MinBadge({ business }) {
  if (business.minimumOrderType === 'dollars') {
    return <span className="cc-badge">Min {fmtMoney(business.minimumOrderAmount)}</span>;
  }
  if (business.minimumOrderType === 'people') {
    return <span className="cc-badge">Min {business.minimumOrderAmount} guests</span>;
  }
  return <span className="cc-badge cc-badge-warn">Minimum: TBD</span>;
}

function ItemCard({ item, qty, setQty, headcount, business }) {
  const price = item.totalPrice != null ? item.totalPrice : item.pricePerUnit;
  const minPacks = packsForMinimum(item);
  const inCart = qty > 0;

  const handleAdd = () => setQty(suggestedQty(item, headcount));
  const handleInc = () => setQty(qty + 1);
  const handleDec = () => {
    const next = qty - 1;
    setQty(next < minPacks ? 0 : next);
  };

  return (
    <div className={'cc-item' + (inCart ? ' cc-item-in-cart' : '')}>
      <div className="cc-item-top">
        <div className="cc-item-name">{item.itemName}</div>
        {item.priceTBD
          ? <span className="cc-item-price-tbd">Contact for quote</span>
          : <span className="cc-item-price">{fmtMoney(price)}</span>}
      </div>
      <div className="cc-item-unit">
        per {item.servingSize} {item.servingSizeUnit}
        {item.minimumOrderAmount && item.minimumOrderAmount > item.servingSize
          ? ` · min order ${item.minimumOrderAmount} ${item.minimumOrderType}` : ''}
      </div>
      {item.description && <div className="cc-item-desc">{item.description}</div>}
      <div className="cc-item-tags">
        {item.dietary.vegan && <span className="cc-tag-mini cc-tag-veg">Vegan</span>}
        {!item.dietary.vegan && item.dietary.vegetarian && <span className="cc-tag-mini cc-tag-veg">Vegetarian</span>}
        {item.dietary.glutenFree && <span className="cc-tag-mini cc-tag-gf">Gluten-free</span>}
        {item.dietary.varies && <span className="cc-tag-mini">Varies — confirm</span>}
        {!item.dietary.vegan && !item.dietary.vegetarian && !item.dietary.varies && item.dietary.raw &&
          <span className="cc-tag-mini">{item.dietary.raw}</span>}
      </div>
      <div className="cc-item-actions">
        {item.priceTBD ? (
          <a className="cc-quote-link"
            href={`mailto:${business.contactEmail || ''}?subject=${encodeURIComponent('Quote request: ' + item.itemName)}`}>
            Request quote
          </a>
        ) : inCart ? (
          <div className="cc-qty-stepper">
            <button className="cc-qty-btn" onClick={handleDec} aria-label="Decrease quantity">−</button>
            <span className="cc-qty-val">{qty}</span>
            <button className="cc-qty-btn" onClick={handleInc} aria-label="Increase quantity">+</button>
          </div>
        ) : (
          <button className="cc-add-btn" onClick={handleAdd}>+ Add</button>
        )}
        {minPacks > 1 && !item.priceTBD && <span className="cc-min-note">min {minPacks}×</span>}
      </div>
    </div>
  );
}

function BusinessSection({ business, items, mealFilter, dietary, deliveryPref, cart, setQty, headcount, budgetNum }) {
  const filteredItems = items.filter((i) =>
    passesMeal(i, mealFilter) && passesDietary(i, dietary) && passesDelivery(i, deliveryPref));

  const headcountOk = businessMeetsHeadcountMin(business, headcount);
  const belowBudgetMin = budgetBelowMinimum(business, budgetNum);
  const hasNoItems = items.length === 0;

  return (
    <div className={'cc-business' + (!headcountOk ? ' cc-business-disabled' : '')} style={{ '--biz-color': business.color }}>
      <div className="cc-business-head">
        <div>
          <div className="cc-business-name"><span className="cc-dot" />{business.name}</div>
          <div className="cc-business-contact">
            {business.contactEmail && <a href={`mailto:${business.contactEmail}`}>{business.contactEmail}</a>}
            {business.contactPhone && <a href={`tel:${business.contactPhone}`}>{business.contactPhone}</a>}
          </div>
        </div>
        <div className="cc-badges">
          <MinBadge business={business} />
          {business.deliveryZone && <span className="cc-badge">{business.deliveryZone}</span>}
          {business.depositPercentage != null && <span className="cc-badge">{business.depositPercentage}% deposit</span>}
          {business.paymentMethods && <span className="cc-badge">{business.paymentMethods}</span>}
        </div>
      </div>

      {business.criticalNote && <div className="cc-critical-note">{business.criticalNote}</div>}
      {!headcountOk && (
        <div className="cc-business-unavailable">
          Requires a minimum of {business.minimumOrderAmount} guests — increase headcount to unlock this caterer.
        </div>
      )}
      {belowBudgetMin && (
        <div className="cc-business-unavailable">
          Your budget ({fmtMoney(budgetNum)}) is below this caterer's {fmtMoney(business.minimumOrderAmount)} order minimum.
        </div>
      )}
      {hasNoItems && (
        <div className="cc-no-items">No published menu items on file for this business — contact them directly for their current menu and a quote.</div>
      )}
      {!hasNoItems && filteredItems.length === 0 && (
        <div className="cc-no-items">No items match your current filters.</div>
      )}
      {!hasNoItems && filteredItems.length > 0 && (
        <div className="cc-item-grid">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} qty={cart[item.id] || 0}
              setQty={(q) => setQty(item.id, q)} headcount={headcount} business={business} />
          ))}
        </div>
      )}
    </div>
  );
}

function CartSidebar({ bizSummaries, grandTotal, headcount, budgetNum, setQty }) {
  const perPerson = headcount > 0 ? grandTotal / headcount : null;
  const overBudget = budgetNum != null && grandTotal > budgetNum;

  return (
    <aside className="cc-cart" id="cart-section">
      <h2>Your package</h2>
      {bizSummaries.length === 0 ? (
        <div className="cc-cart-empty">No items added yet. Browse the menus and click "+ Add" to build your package.</div>
      ) : (
        <>
          {bizSummaries.map((b) => (
            <div className="cc-cart-biz" key={b.business.id}>
              <div className="cc-cart-biz-name" style={{ color: b.business.color }}>{b.business.name}</div>
              {b.lines.map((l) => (
                <div className="cc-cart-line" key={l.item.id}>
                  <span className="cc-cart-line-name">{l.qty}× {l.item.itemName}</span>
                  <span>
                    {fmtMoney(l.lineTotal)}
                    <button className="cc-cart-line-remove" onClick={() => setQty(l.item.id, 0)} aria-label="Remove item">✕</button>
                  </span>
                </div>
              ))}
              <div className="cc-cart-subtotal-row"><span>Subtotal</span><span>{fmtMoney(b.subtotal)}</span></div>
              <div className="cc-cart-subtotal-row">
                <span>{b.rules.gratuityLabel}</span>
                <span>{b.rules.gratuityPct ? fmtMoney(b.gratuity) : '—'}</span>
              </div>
              {b.rules.taxPct ? (
                <div className="cc-cart-subtotal-row"><span>{b.rules.taxLabel}</span><span>{fmtMoney(b.tax)}</span></div>
              ) : null}
              <div className="cc-cart-biz-total"><span>Total</span><span>{fmtMoney(b.total)}</span></div>
              {!b.meetsDollarMin && (
                <div className="cc-cart-warn">
                  Add {fmtMoney(b.business.minimumOrderAmount - b.subtotal)} more to meet the {fmtMoney(b.business.minimumOrderAmount)} minimum.
                </div>
              )}
              {!b.meetsHeadcountMin && (
                <div className="cc-cart-warn">This caterer requires a minimum of {b.business.minimumOrderAmount} guests.</div>
              )}
              {b.business.depositPercentage != null && (
                <div className="cc-cart-warn">
                  Deposit: {b.business.depositPercentage}% due at booking
                  {b.business.depositDays && b.business.depositDays !== 'Varies' ? ` (within ${b.business.depositDays} days)` : ''}
                  {' '}— {fmtMoney(b.total * b.business.depositPercentage / 100)}
                </div>
              )}
            </div>
          ))}
          <div className="cc-cart-divider" />
          <div className="cc-cart-grand"><span>Estimated total</span><span>{fmtMoney(grandTotal)}</span></div>
          {perPerson != null && (
            <div className="cc-cart-perperson">≈ {fmtMoney(perPerson)} per person ({headcount} attendees)</div>
          )}
          {budgetNum != null && (
            <div className={'cc-budget-status ' + (overBudget ? 'cc-budget-over' : 'cc-budget-ok')}>
              {overBudget
                ? `Over budget by ${fmtMoney(grandTotal - budgetNum)}`
                : `Within budget — ${fmtMoney(budgetNum - grandTotal)} remaining`}
            </div>
          )}
        </>
      )}
    </aside>
  );
}

function App() {
  const [data, setData] = useState(null);
  const [loadError, setLoadError] = useState(null);

  const [budget, setBudget] = useState('');
  const [headcount, setHeadcount] = useState('20');
  const [mealFilter, setMealFilter] = useState('all');
  const [dietary, setDietary] = useState({ vegan: false, vegetarian: false, glutenFree: false });
  const [deliveryPref, setDeliveryPref] = useState('either');
  const [cart, setCart] = useState({});

  useEffect(() => {
    fetch(CSV_PATH)
      .then((res) => {
        if (!res.ok) throw new Error(`Could not load ${CSV_PATH} (${res.status})`);
        return res.text();
      })
      .then((text) => setData(buildCateringData(text)))
      .catch((err) => setLoadError(err.message));
  }, []);

  const headcountNum = headcount === '' ? 0 : Number(headcount);
  const budgetNum = budget === '' || Number.isNaN(Number(budget)) ? null : Number(budget);

  const setQty = (itemId, qty) => {
    setCart((prev) => {
      const next = { ...prev };
      if (qty <= 0) delete next[itemId]; else next[itemId] = qty;
      return next;
    });
  };

  const businesses = data ? data.businesses : [];
  const items = data ? data.items : [];
  const { bizSummaries, grandTotal } = useCartComputation(cart, items, businesses, headcountNum);
  const totalItemCount = Object.values(cart).reduce((a, b) => a + b, 0);

  if (loadError) {
    return <div className="cc-loading">Couldn't load the menu data: {loadError}</div>;
  }
  if (!data) {
    return <div className="cc-loading">Loading calculator&hellip;</div>;
  }

  return (
    <>
      <section className="cc-intro">
        <div className="cc-eyebrow">UBC Student Clubs &amp; Event Organizers</div>
        <h1 className="cc-title">Indigenous Catering Budget Calculator</h1>
        <p className="cc-subtitle">
          Compare menus from four Indigenous-owned Vancouver-area caterers, filter by budget, headcount,
          meal type, and dietary needs, then build a custom package with a running cost estimate.
        </p>
        <div className="cc-disclaimer">
          Menu items, prices, and policies are read live from the source spreadsheet and may be out of date.
          Treat all totals as estimates!! Please confirm final pricing, availability, and dietary details directly
          with the caterer before booking.
        </div>
      </section>

      <FiltersPanel
        budget={budget} setBudget={setBudget}
        headcount={headcount} setHeadcount={setHeadcount}
        mealFilter={mealFilter} setMealFilter={setMealFilter}
        dietary={dietary} setDietary={setDietary}
        deliveryPref={deliveryPref} setDeliveryPref={setDeliveryPref}
      />

      <div className="cc-layout">
        <div className="cc-main">
          {businesses.map((biz) => (
            <BusinessSection
              key={biz.id}
              business={biz}
              items={items.filter((i) => i.businessId === biz.id)}
              mealFilter={mealFilter}
              dietary={dietary}
              deliveryPref={deliveryPref}
              cart={cart}
              setQty={setQty}
              headcount={headcountNum}
              budgetNum={budgetNum}
            />
          ))}
        </div>

        <CartSidebar
          bizSummaries={bizSummaries}
          grandTotal={grandTotal}
          headcount={headcountNum}
          budgetNum={budgetNum}
          setQty={setQty}
        />
      </div>

      {totalItemCount > 0 && (
        <a href="#cart-section" className="cc-mobile-total-bar">
          <span>{totalItemCount} item{totalItemCount !== 1 ? 's' : ''} · view package</span>
          <strong>{fmtMoney(grandTotal)}</strong>
        </a>
      )}
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('catering-root'));
root.render(<App />);
