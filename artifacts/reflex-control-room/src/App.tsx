import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import API_BASE_URL from "./config/api";

type Screen = "home" | "dashboard" | "dispatcher" | "deliveries" | "riders" | "rider-portal";
type Status = "PENDING" | "ASSIGNED" | "PICKED_UP" | "DELIVERED" | "CANCELLED";
type Rider = { id: string; name: string; phone?: string; email?: string; initials?: string; area?: string; activeDeliveries?: number; status?: string };
type Delivery = { id: string; customerName: string; customerPhone?: string; deliveryAddress?: string; address?: string; itemDescription?: string; status: Status; retailer?: { id: string; name: string }; rider?: Rider | null; riderId?: string | null; createdAt: string; updatedAt?: string };
type ApiResult<T> = { success: boolean; data?: T; error?: { message?: string; code?: string } };

const RIDER_TOKEN = "riderToken";
const DISPATCHER_TOKEN = "dispatcherToken";

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const authToken = token || localStorage.getItem(DISPATCHER_TOKEN) || undefined;
  if (authToken) headers.set("Authorization", `Bearer ${authToken}`);
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error("The Reflex API could not be reached. Check the live backend connection.");
  }
  const result = (await response.json().catch(() => null)) as ApiResult<T> | null;
  if (!response.ok || !result?.success || result.data === undefined) {
    const error = new Error(result?.error?.message || `Request failed (${response.status}).`);
    (error as Error & { status?: number; code?: string }).status = response.status;
    (error as Error & { status?: number; code?: string }).code = result?.error?.code;
    throw error;
  }
  return result.data;
}

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const paths: Record<string, string> = {
    grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
    activity: "M3 12h4l2-7 4 14 2-7h6",
    package: "m21 8-9 5-9-5 9-5 9 5ZM3 8v8l9 5 9-5V8M12 13v8",
    users: "M9 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 19c.5-3 2.5-5 6-5s5.5 2 6 5M16 4a3 3 0 0 1 0 6M17 14c2 .5 3.5 2 4 5",
    arrow: "M5 12h14m-6-6 6 6-6 6",
    check: "m5 12 4 4L19 6",
    menu: "M4 7h16M4 12h16M4 17h16",
    refresh: "M20 11a8 8 0 1 0 2 5m-2-5h-5m5 0V6",
    close: "m6 6 12 12M18 6 6 18",
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name] || paths.activity} /></svg>;
}

function Status({ status }: { status: string }) {
  return <span className={`status status-${status.toLowerCase()}`}><span />{status.replaceAll("_", " ")}</span>;
}

function Home({ go }: { go: (screen: Screen) => void }) {
  return <div className="home-page">
    <section className="home-hero">
      <div className="home-hero-content">
        <div className="home-brand"><div className="brand-mark">R</div><div><strong>Reflex</strong><span>Readiness &amp; Delivery Operations</span></div></div>
        <div className="home-copy">
          <p className="eyebrow">Last-mile operations platform</p>
          <h1>Move every delivery<span>with confidence.</span></h1>
          <p className="home-description">Reflex gives delivery teams one clear view of their operations — from dispatch and rider availability to delivery completion.</p>
          <div className="home-actions"><button className="primary-button home-primary" onClick={() => go("dashboard")}>Enter Control Room <span>→</span></button><button className="secondary-button home-secondary" onClick={() => go("dispatcher")}>Dispatcher Portal</button><button className="secondary-button home-secondary" onClick={() => go("rider-portal")}>Rider Portal</button></div>
        </div>
        <div className="home-meta"><span><i className="status-dot" />System operational</span><span>REFLEX SPRINT · 2026</span></div>
      </div>
      <div className="home-visual"><div className="operations-card">
        <div className="operations-card-header"><div><p>Live operations</p><strong>Control Room</strong></div><span className="live-indicator"><span className="status-dot" />Live</span></div>
        <div className="operations-metric"><span>Network performance</span><strong>Live</strong></div>
        <div className="operations-progress"><div className="progress-label"><span>Operational health</span><strong>Healthy</strong></div><div className="progress-track"><span style={{ width: "100%" }} /></div></div>
        <div className="operations-list"><div className="operation-row"><span className="operation-icon">↗</span><div><strong>Assignment desk</strong><span>Dispatch riders in real time</span></div><span className="operation-status">Live</span></div><div className="operation-row"><span className="operation-icon delivered">✓</span><div><strong>Rider portal</strong><span>Pick up and complete deliveries</span></div><span className="operation-status complete">Ready</span></div></div>
        <button className="operations-link" onClick={() => go("dashboard")}>Open operations →</button>
      </div></div>
    </section>
    <section className="home-bottom"><div className="home-feature"><span>01</span><div><strong>One operational view</strong><p>See deliveries, riders and network health in one place.</p></div></div><div className="home-feature"><span>02</span><div><strong>Real-time decisions</strong><p>Assign work quickly and keep every handoff visible.</p></div></div><div className="home-feature"><span>03</span><div><strong>Built for every role</strong><p>Dispatchers and riders get focused tools for their work.</p></div></div></section>
  </div>;
}

function Login({ onSuccess, onHome }: { onSuccess: (token: string) => void; onHome: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const data = await request<{ token: string; user: { role: string } }>("/auth/login", { method: "POST", body: JSON.stringify({ email: email.trim(), password }) });
      if (data.user.role !== "RIDER") throw new Error("This account is not authorized for the Rider Portal.");
      localStorage.setItem(RIDER_TOKEN, data.token); onSuccess(data.token);
    } catch (e) { setError(e instanceof Error ? e.message : "Sign in failed."); }
    finally { setLoading(false); }
  }
  return <div className="rider-login-page"><div className="rider-login-card">
    <button className="rider-back-home" onClick={onHome}><Icon name="arrow" size={14} /> Back to home</button>
    <div className="rider-login-brand"><div className="brand-mark">R</div><div><strong>Reflex</strong><span>Rider Portal</span></div></div>
    <div className="rider-login-heading"><p className="eyebrow">Rider portal</p><h2>Welcome back.</h2><p>Sign in to view and manage your assigned deliveries.</p></div>
    <form className="rider-login-form" onSubmit={submit}>
      <label className="form-field"><span>Email address</span><input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required /></label>
      <label className="form-field"><span>Password</span><input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required /></label>
      {error && <div className="login-error"><span>!</span>{error}</div>}
      <button className="primary-button login-button" disabled={loading}>{loading ? "Signing in..." : "Sign in"}<span>→</span></button>
    </form><p className="rider-login-footer">Reflex last-mile operations</p>
  </div></div>;
}

function DispatcherLogin({ onSuccess, onHome }: { onSuccess: (token: string) => void; onHome: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const data = await request<{ token: string; user: { role: string } }>("/auth/login", { method: "POST", body: JSON.stringify({ email: email.trim(), password }) });
      if (data.user.role !== "DISPATCHER") throw new Error("This account is not authorized for the Dispatcher Portal.");
      localStorage.setItem(DISPATCHER_TOKEN, data.token); onSuccess(data.token);
    } catch (e) { setError(e instanceof Error ? e.message : "Sign in failed."); }
    finally { setLoading(false); }
  }
  return <div className="rider-login-page"><div className="rider-login-card">
    <button className="rider-back-home" onClick={onHome}><Icon name="arrow" size={14} /> Back to home</button>
    <div className="rider-login-brand"><div className="brand-mark">R</div><div><strong>Reflex</strong><span>Dispatcher Portal</span></div></div>
    <div className="rider-login-heading"><p className="eyebrow">Dispatcher portal</p><h2>Dispatch with confidence.</h2><p>Sign in to assign live deliveries to real riders.</p></div>
    <form className="rider-login-form" onSubmit={submit}>
      <label className="form-field"><span>Email address</span><input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="username" required /></label>
      <label className="form-field"><span>Password</span><input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required /></label>
      {error && <div className="login-error"><span>!</span>{error}</div>}
      <button className="primary-button login-button" disabled={loading}>{loading ? "Signing in..." : "Open Dispatcher Portal"}<span>→</span></button>
    </form><p className="rider-login-footer">Reflex last-mile operations</p>
  </div></div>;
}

function RiderPortal({ onHome }: { onHome: () => void }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(RIDER_TOKEN));
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [action, setAction] = useState<string | null>(null);
  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true); setError("");
    try { const data = await request<{ deliveries: Delivery[] }>("/deliveries", {}, token); setDeliveries(data.deliveries || []); }
    catch (e) { const err = e as Error & { status?: number }; if (err.status === 401 || err.status === 403) { localStorage.removeItem(RIDER_TOKEN); setToken(null); } setError(e instanceof Error ? e.message : "Could not load deliveries."); }
    finally { setLoading(false); }
  }, [token]);
  useEffect(() => { void load(); }, [load]);
  async function advance(d: Delivery) {
    if (!token) return;
    const next: Status = d.status === "ASSIGNED" ? "PICKED_UP" : "DELIVERED";
    setAction(d.id); setError("");
    try { await request(`/deliveries/${d.id}/status`, { method: "PATCH", body: JSON.stringify({ status: next }) }, token); await load(); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not update status."); }
    finally { setAction(null); }
  }
  if (!token) return <Login onSuccess={setToken} onHome={onHome} />;
  const active = deliveries.filter(d => d.status === "ASSIGNED" || d.status === "PICKED_UP").length;
  const completed = deliveries.filter(d => d.status === "DELIVERED").length;
  return <div className="rider-page">
    <button className="rider-back-home rider-back-home-light" onClick={onHome}><Icon name="arrow" size={14} /> Back to home</button>
    <div className="page-intro"><div><p className="eyebrow">Rider portal</p><h2>My Deliveries</h2><p>Stay on top of deliveries currently assigned to you.</p></div><div className="rider-header-actions"><div className="rider-online"><span className="status-dot" />Online</div><button className="secondary-button compact-button" onClick={() => { localStorage.removeItem(RIDER_TOKEN); setToken(null); setDeliveries([]); }}>Sign out</button></div></div>
    <div className="mini-stats rider-stats"><div className="mini-stat"><span>Total deliveries</span><strong>{deliveries.length}</strong></div><div className="mini-stat"><span>Active</span><strong>{active}</strong></div><div className="mini-stat success"><span>Completed</span><strong>{completed}</strong></div></div>
    {error && <div className="error-state rider-error"><strong>Delivery update issue</strong><span>{error}</span><button className="secondary-button" onClick={() => void load()}>Try again</button></div>}
    {loading ? <div className="loading-state"><span className="loading-spinner" /> Loading your deliveries...</div> : <section className="panel"><div className="panel-header"><div><p className="eyebrow">Your queue</p><h3>Assigned deliveries</h3><p className="panel-subtitle">Follow the sequence: Picked Up → Delivered.</p></div><span className="panel-count">{deliveries.length} deliveries</span></div>
      {deliveries.length === 0 ? <div className="empty-state rider-empty"><div className="empty-icon">✓</div><strong>You&apos;re all caught up</strong><p>There are no deliveries assigned to you right now.</p></div> : <div className="rider-delivery-list">{deliveries.map(d => <article className="rider-delivery-card" key={d.id}><div className="rider-delivery-main"><div className="rider-delivery-icon">{d.status === "DELIVERED" ? "✓" : "↗"}</div><div className="rider-delivery-info"><div className="rider-delivery-title"><strong>{d.itemDescription || "Delivery"}</strong><span className="delivery-id">{d.id}</span></div><div className="rider-delivery-meta"><span><b>Destination</b>{d.deliveryAddress || d.address || "—"}</span><span><b>Retailer</b>{d.retailer?.name || "Reflex"}</span></div></div></div><div className="rider-delivery-actions"><Status status={d.status} />{(d.status === "ASSIGNED" || d.status === "PICKED_UP") && <button className="primary-button compact-button" disabled={action === d.id} onClick={() => void advance(d)}>{action === d.id ? "Saving..." : d.status === "ASSIGNED" ? "Picked Up" : "Delivered"}<span>→</span></button>}</div></article>)}</div>}
    </section>}
  </div>;
}

const navItems = [["dashboard", "Overview", "Network pulse", "grid"], ["deliveries", "Deliveries", "Live register", "package"], ["riders", "Riders", "Fleet readiness", "users"]] as const;

function DeliveryDetails({ delivery, onClose }: { delivery: Delivery; onClose: () => void }) {
  return <div className="delivery-detail-overlay" role="presentation" onMouseDown={onClose}>
    <section className="delivery-detail-modal" role="dialog" aria-modal="true" aria-labelledby="delivery-detail-title" onMouseDown={event => event.stopPropagation()}>
      <div className="panel-header"><div><p className="eyebrow">Delivery details</p><h3 id="delivery-detail-title">{delivery.id}</h3></div><button className="icon-button" onClick={onClose} aria-label="Close"><Icon name="close" size={16} /></button></div>
      <div className="delivery-detail-grid">
        <div><span>Customer</span><strong>{delivery.customerName}</strong></div>
        <div><span>Status</span><Status status={delivery.status} /></div>
        <div><span>Destination</span><strong>{delivery.deliveryAddress || delivery.address || "—"}</strong></div>
        <div><span>Rider</span><strong>{delivery.rider?.name || "Unassigned"}</strong></div>
        <div><span>Retailer</span><strong>{delivery.retailer?.name || "—"}</strong></div>
        <div><span>Items</span><strong>{delivery.itemDescription || "—"}</strong></div>
        <div><span>Customer phone</span><strong>{delivery.customerPhone || "—"}</strong></div>
        <div><span>Last updated</span><strong>{delivery.updatedAt ? new Date(delivery.updatedAt).toLocaleString() : "—"}</strong></div>
      </div>
    </section>
  </div>;
}

function DeliveriesWorkspace({ deliveries, query, setQuery, statusFilter, setStatusFilter, loading, load, onInspect }: { deliveries: Delivery[]; query: string; setQuery: (value: string) => void; statusFilter: Status | "ALL"; setStatusFilter: (value: Status | "ALL") => void; loading: boolean; load: () => void; onInspect: (delivery: Delivery) => void }) {
  const filtered = useMemo(() => deliveries.filter(delivery => {
    const normalizedQuery = query.trim().toLowerCase();
    const matchesSearch = !normalizedQuery || `${delivery.id} ${delivery.customerName} ${delivery.deliveryAddress || delivery.address || ""} ${delivery.rider?.name || ""}`.toLowerCase().includes(normalizedQuery);
    return matchesSearch && (statusFilter === "ALL" || delivery.status === statusFilter);
  }), [deliveries, query, statusFilter]);
  const activeCount = deliveries.filter(d => d.status === "ASSIGNED" || d.status === "PICKED_UP").length;
  const deliveredCount = deliveries.filter(d => d.status === "DELIVERED").length;
  const attentionCount = deliveries.filter(d => d.status === "PENDING" || d.status === "CANCELLED").length;
  return <div className="deliveries-page">
    <div className="page-intro"><div><p className="eyebrow">Delivery management</p><h2>Deliveries</h2><p>Monitor, filter and manage current delivery activity.</p></div><button type="button" className="secondary-button compact-button" onClick={load} disabled={loading}><Icon name="refresh" size={14} /> {loading ? "Refreshing..." : "Refresh"}</button></div>
    <div className="mini-stats">
      <div className="mini-stat"><span>Total</span><strong>{deliveries.length}</strong></div>
      <div className="mini-stat"><span>Active</span><strong>{activeCount}</strong></div>
      <div className="mini-stat success"><span>Delivered</span><strong>{deliveredCount}</strong></div>
      <div className="mini-stat warning"><span>Needs attention</span><strong>{attentionCount}</strong></div>
    </div>
    <section className="panel">
      <div className="panel-header"><div><p className="eyebrow">Live register</p><h3>All deliveries</h3><p className="panel-subtitle">{filtered.length} deliveries matching your view.</p></div><span className="live-indicator"><span className="status-dot" />Monitoring</span></div>
      <div className="filters">
        <label className="search-field"><span className="sr-only">Search deliveries</span><span className="search-icon">⌕</span><input type="search" placeholder="Search delivery, customer or location..." value={query} onChange={event => setQuery(event.target.value)} /></label>
        <label className="filter-control"><span>Status</span><select value={statusFilter} onChange={event => setStatusFilter(event.target.value as Status | "ALL")}><option value="ALL">All statuses</option><option value="PENDING">Pending</option><option value="ASSIGNED">Assigned</option><option value="PICKED_UP">Picked up</option><option value="DELIVERED">Delivered</option><option value="CANCELLED">Cancelled</option></select></label>
      </div>
      <div className="table-wrap"><table><thead><tr><th>ID</th><th>Customer</th><th>Destination</th><th>Rider</th><th>Status</th><th>Details</th></tr></thead><tbody>{filtered.map(delivery => <tr key={delivery.id}><td><b>{delivery.id}</b></td><td>{delivery.customerName}</td><td>{delivery.deliveryAddress || delivery.address || "—"}</td><td>{delivery.rider?.name || "Unassigned"}</td><td><Status status={delivery.status} /></td><td><button type="button" className="secondary-button compact-button" onClick={() => onInspect(delivery)}>Inspect</button></td></tr>)}</tbody></table>{filtered.length === 0 && <div className="empty-state"><strong>No matching deliveries</strong><p>Try 