import { useState } from "react";
import {
  LayoutDashboard, CalendarDays, Users, Clock, Settings,
  ChevronDown, Bell, Search, TrendingUp, UserCheck,
  AlertCircle, ArrowUpRight, MoreHorizontal, ChevronRight,
  LogOut, Star, Utensils, MapPin, Phone, Mail,
  CheckCircle2, XCircle, Timer, Filter, Download
} from "lucide-react";

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: "Tableau de bord", active: true },
  { icon: CalendarDays,    label: "Réservations",    badge: 4 },
  { icon: Utensils,        label: "Tables" },
  { icon: Clock,           label: "Planning" },
  { icon: Users,           label: "Clients" },
  { icon: Settings,        label: "Paramètres" },
];

const STATS = [
  { label: "Réservations aujourd'hui", value: "24",  sub: "+3 vs hier",    icon: CalendarDays, color: "#2b2118", light: "rgba(43,33,24,0.06)"  },
  { label: "Couverts total",           value: "186", sub: "+12% ce mois",  icon: Users,        color: "#059669", light: "rgba(5,150,105,0.08)"  },
  { label: "En attente",               value: "7",   sub: "À confirmer",   icon: Timer,        color: "#d97706", light: "rgba(217,119,6,0.08)"  },
  { label: "Confirmées",               value: "17",  sub: "Pour ce soir",  icon: CheckCircle2, color: "#2563eb", light: "rgba(37,99,235,0.08)"  },
];

const RESERVATIONS = [
  { id: 1,  name: "Ahmed Benali",    guests: 4, time: "19:00", table: "T-04", service: "A la Carte",        status: "confirmed", phone: "+212 6XX XXX XXX" },
  { id: 2,  name: "Sara Moussaoui",  guests: 2, time: "19:30", table: "T-02", service: "Formule Midi",      status: "pending",   phone: "+212 6XX XXX XXX" },
  { id: 3,  name: "Karim Idrissi",   guests: 6, time: "20:00", table: "T-07", service: "A la Carte",        status: "confirmed", phone: "+212 6XX XXX XXX" },
  { id: 4,  name: "Nadia Chaoui",    guests: 3, time: "20:30", table: "T-03", service: "A la Carte",        status: "confirmed", phone: "+212 6XX XXX XXX" },
  { id: 5,  name: "Omar Fassi",      guests: 5, time: "21:00", table: "T-09", service: "Formule Midi",      status: "cancelled", phone: "+212 6XX XXX XXX" },
  { id: 6,  name: "Fatima Zahra",    guests: 2, time: "21:30", table: "T-01", service: "A la Carte",        status: "pending",   phone: "+212 6XX XXX XXX" },
  { id: 7,  name: "Youssef Alami",   guests: 4, time: "22:00", table: "T-05", service: "A la Carte",        status: "confirmed", phone: "+212 6XX XXX XXX" },
];

const ACTIVITY = [
  { text: "Nouvelle réservation — Ahmed Benali",   time: "il y a 2 min",  type: "new"      },
  { text: "Confirmée — Sara Moussaoui (19:30)",     time: "il y a 8 min",  type: "confirm"  },
  { text: "Annulée — Omar Fassi (21:00)",           time: "il y a 15 min", type: "cancel"   },
  { text: "Modification — Karim Idrissi (6 pers)",  time: "il y a 32 min", type: "edit"     },
  { text: "Nouvelle réservation — Nadia Chaoui",   time: "il y a 1h",     type: "new"      },
];

const STATUS = {
  confirmed: { label: "Confirmée",  bg: "#dcfce7", color: "#16a34a", icon: CheckCircle2 },
  pending:   { label: "En attente", bg: "#fef9c3", color: "#ca8a04", icon: Timer        },
  cancelled: { label: "Annulée",    bg: "#fee2e2", color: "#dc2626", icon: XCircle      },
};

const ACTIVITY_COLORS = {
  new:     { dot: "#2563eb", bg: "rgba(37,99,235,0.08)"  },
  confirm: { dot: "#16a34a", bg: "rgba(22,163,74,0.08)"  },
  cancel:  { dot: "#dc2626", bg: "rgba(220,38,38,0.08)"  },
  edit:    { dot: "#d97706", bg: "rgba(217,119,6,0.08)"  },
};

export default function App() {
  const [activeNav, setActiveNav] = useState(0);
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = filterStatus === "all"
    ? RESERVATIONS
    : RESERVATIONS.filter(r => r.status === filterStatus);

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", display: "flex", minHeight: "100vh", backgroundColor: "#2b2118" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(200,169,126,0.2); border-radius: 2px; }
        .nav-item { transition: all 0.15s ease; cursor: pointer; }
        .nav-item:hover { background: rgba(255,255,255,0.06) !important; color: rgba(255,255,255,0.8) !important; }
        .stat-card { transition: all 0.2s ease; cursor: default; }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08) !important; }
        .row-hover:hover { background: #f8fafc !important; }
        .btn-filter { transition: all 0.15s ease; cursor: pointer; }
        .btn-filter:hover { border-color: #2b2118 !important; color: #2b2118 !important; }
        .activity-item { transition: background 0.15s ease; }
        .activity-item:hover { background: #f8fafc; border-radius: 12px; }
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside style={{ width: 240, display: "flex", flexDirection: "column", flexShrink: 0, padding: "0 12px" }}>

        {/* Brand */}
        <div style={{ padding: "28px 12px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: "rgba(200,169,126,0.15)", border: "1px solid rgba(200,169,126,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Utensils size={22} color="#c8a97e" />
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#fff", fontSize: 14, fontWeight: 700, lineHeight: 1.2 }}>Dal Corso</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 3 }}>
                <MapPin size={10} color="rgba(200,169,126,0.6)" />
                <p style={{ color: "rgba(200,169,126,0.6)", fontSize: 11, fontWeight: 500 }}>Marrakech</p>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 0", display: "flex", flexDirection: "column", gap: 2 }}>
          {SIDEBAR_ITEMS.map((item, i) => {
            const Icon = item.icon;
            const isActive = activeNav === i;
            return (
              <div
                key={i}
                className="nav-item"
                onClick={() => setActiveNav(i)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 14px", borderRadius: 12,
                  backgroundColor: isActive ? "#c8a97e" : "transparent",
                  color: isActive ? "#fff" : "rgba(255,255,255,0.4)",
                  fontSize: 13, fontWeight: isActive ? 600 : 500,
                  position: "relative",
                }}
              >
                <Icon size={17} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span style={{ backgroundColor: isActive ? "rgba(255,255,255,0.25)" : "#c8a97e", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20 }}>
                    {item.badge}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* User */}
        <div style={{ padding: "12px 0 20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="nav-item" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 12, color: "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 500 }}>
            <LogOut size={17} />
            <span>Déconnexion</span>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Topbar */}
        <header style={{ backgroundColor: "#2b2118", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div>
            <h2 style={{ color: "#fff", fontSize: 15, fontWeight: 700 }}>Tableau de bord</h2>
            <p style={{ color: "rgba(200,169,126,0.55)", fontSize: 11, fontWeight: 500, marginTop: 1 }}>
              {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <Search size={14} color="rgba(255,255,255,0.3)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input
                placeholder="Rechercher..."
                style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "8px 14px 8px 34px", color: "#fff", fontSize: 13, outline: "none", width: 200 }}
              />
            </div>

            {/* Bell */}
            <div style={{ position: "relative", width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Bell size={16} color="rgba(200,169,126,0.8)" />
              <span style={{ position: "absolute", top: 7, right: 7, width: 7, height: 7, borderRadius: "50%", backgroundColor: "#c8a97e", border: "1.5px solid #2b2118" }} />
            </div>

            {/* Divider */}
            <div style={{ width: 1, height: 24, backgroundColor: "rgba(255,255,255,0.08)" }} />

            {/* Profile */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px", borderRadius: 10, cursor: "pointer" }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: "rgba(200,169,126,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#c8a97e", fontSize: 12, fontWeight: 800 }}>DC</span>
              </div>
              <div>
                <p style={{ color: "#fff", fontSize: 12, fontWeight: 700, lineHeight: 1.2 }}>Dal Corso</p>
                <p style={{ color: "rgba(200,169,126,0.55)", fontSize: 10, lineHeight: 1.2 }}>Admin</p>
              </div>
              <ChevronDown size={13} color="rgba(200,169,126,0.5)" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, backgroundColor: "#f8fafc", borderRadius: "28px 0 0 0", overflow: "auto", padding: "32px" }}>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
            {STATS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="stat-card" style={{ backgroundColor: "#fff", borderRadius: 20, padding: "22px 24px", border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: s.light, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={19} color={s.color} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, backgroundColor: "#f1f5f9", borderRadius: 8, padding: "4px 8px" }}>
                      <TrendingUp size={10} color="#64748b" />
                      <span style={{ fontSize: 10, fontWeight: 600, color: "#64748b" }}>{s.sub}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", lineHeight: 1, marginBottom: 6 }}>{s.value}</p>
                  <p style={{ fontSize: 12, fontWeight: 500, color: "#94a3b8" }}>{s.label}</p>
                </div>
              );
            })}
          </div>

          {/* Main grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>

            {/* Reservations table */}
            <div style={{ backgroundColor: "#fff", borderRadius: 20, border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", overflow: "hidden" }}>

              {/* Table header */}
              <div style={{ padding: "20px 24px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f8fafc" }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Réservations du jour</h3>
                  <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{filtered.length} réservations</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {["all", "confirmed", "pending", "cancelled"].map(f => (
                    <button
                      key={f}
                      className="btn-filter"
                      onClick={() => setFilterStatus(f)}
                      style={{
                        padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer",
                        backgroundColor: filterStatus === f ? "#2b2118" : "transparent",
                        color: filterStatus === f ? "#fff" : "#94a3b8",
                        border: `1px solid ${filterStatus === f ? "#2b2118" : "#e2e8f0"}`,
                      }}
                    >
                      {f === "all" ? "Tous" : f === "confirmed" ? "Confirmées" : f === "pending" ? "En attente" : "Annulées"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc" }}>
                    {["Client", "Heure", "Couverts", "Table", "Formule", "Statut", ""].map((h, i) => (
                      <th key={i} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => {
                    const s = STATUS[r.status];
                    const SIcon = s.icon;
                    return (
                      <tr key={r.id} className="row-hover" style={{ borderTop: "1px solid #f8fafc", transition: "background 0.15s" }}>
                        <td style={{ padding: "13px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <span style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>{r.name.split(" ").map(n => n[0]).join("").slice(0,2)}</span>
                            </div>
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{r.name}</p>
                              <p style={{ fontSize: 11, color: "#94a3b8" }}>{r.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "13px 16px" }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", fontFamily: "'DM Mono', monospace" }}>{r.time}</span>
                        </td>
                        <td style={{ padding: "13px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <Users size={13} color="#94a3b8" />
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>{r.guests}</span>
                          </div>
                        </td>
                        <td style={{ padding: "13px 16px" }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#475569", backgroundColor: "#f1f5f9", padding: "3px 8px", borderRadius: 6 }}>{r.table}</span>
                        </td>
                        <td style={{ padding: "13px 16px" }}>
                          <span style={{ fontSize: 12, color: "#64748b" }}>{r.service}</span>
                        </td>
                        <td style={{ padding: "13px 16px" }}>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, backgroundColor: s.bg, padding: "4px 10px", borderRadius: 8 }}>
                            <SIcon size={12} color={s.color} />
                            <span style={{ fontSize: 11, fontWeight: 700, color: s.color }}>{s.label}</span>
                          </div>
                        </td>
                        <td style={{ padding: "13px 16px" }}>
                          <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 6 }}>
                            <MoreHorizontal size={16} color="#cbd5e1" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Right column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Upcoming */}
              <div style={{ backgroundColor: "#fff", borderRadius: 20, border: "1px solid #f1f5f9", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Prochaines</h3>
                  <ChevronRight size={15} color="#94a3b8" style={{ cursor: "pointer" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {RESERVATIONS.slice(0, 4).map((r, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 12, backgroundColor: "#f8fafc" }}>
                      <div style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: "#fff", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: "#475569" }}>{r.time}</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 1 }}>
                          <Users size={9} color="#94a3b8" />
                          <span style={{ fontSize: 10, color: "#94a3b8" }}>{r.guests} pers · {r.table}</span>
                        </div>
                      </div>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: STATUS[r.status].color, flexShrink: 0 }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity */}
              <div style={{ backgroundColor: "#fff", borderRadius: 20, border: "1px solid #f1f5f9", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Activité</h3>
                  <span style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", backgroundColor: "#f1f5f9", padding: "3px 8px", borderRadius: 6 }}>Aujourd'hui</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {ACTIVITY.map((a, i) => {
                    const c = ACTIVITY_COLORS[a.type];
                    return (
                      <div key={i} className="activity-item" style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 6px" }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: c.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                          <div style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: c.dot }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 12, fontWeight: 500, color: "#334155", lineHeight: 1.4 }}>{a.text}</p>
                          <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>{a.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}