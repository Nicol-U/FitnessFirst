import { useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { height } from "@mui/system";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function getCalendarDays(year, month) {
  const firstDay    = new Date(year, month, 1).getDay();
  const startOffset = (firstDay + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev  = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = startOffset - 1; i >= 0; i--)
    cells.push({ day: daysInPrev - i, currentMonth: false });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ day: d, currentMonth: true });
  while (cells.length % 7 !== 0)
    cells.push({ day: cells.length - daysInMonth - startOffset + 1, currentMonth: false });
  return cells;
}

function toDateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatDisplayDate(dateStr) {
  const [y, m, d] = dateStr.split("-");
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

export function History() {
  const today = new Date();
  const [viewYear,      setViewYear]      = useState(today.getFullYear());
  const [viewMonth,     setViewMonth]     = useState(today.getMonth());
  const [selectedDate,  setSelectedDate]  = useState(null);

  const log = (() => {
    try { return JSON.parse(localStorage.getItem("workoutLog")) || []; }
    catch { return []; }
  })();

  const logDates = new Set(log.map((e) => e.date));

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  }

  const cells = getCalendarDays(viewYear, viewMonth);

  const isToday = (cell) =>
    cell.currentMonth &&
    cell.day  === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear  === today.getFullYear();

  const isSelected = (cell) =>
    cell.currentMonth &&
    selectedDate === toDateStr(viewYear, viewMonth, cell.day);

  const hasLog = (cell) =>
    cell.currentMonth &&
    logDates.has(toDateStr(viewYear, viewMonth, cell.day));

  function handleDayClick(cell) {
    if (!cell.currentMonth) return;
    const ds = toDateStr(viewYear, viewMonth, cell.day);
    setSelectedDate((prev) => (prev === ds ? null : ds));
  }

  const filteredLog = selectedDate
    ? log.filter((e) => e.date === selectedDate)
    : [...log].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.topRow}>
        <div>
          <h1 style={s.heading}>
            <span style={{ color: "#fff" }}>HISTORY</span>
            <span style={{ color: "#DFFF00" }}>.</span>
          </h1>
          <p style={s.subtitle}>Track your training sessions and progress over time.</p>
        </div>
      </div>

      {/* Two-column layout */}
      <div style={s.columns}>
        {/* Calendar */}
        <div style={s.card}>
          <div style={s.nav}>
            <span style={s.monthLabel}>{MONTHS[viewMonth].toUpperCase()} {viewYear}</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={s.navBtn} onClick={prevMonth}>
                <ChevronLeftIcon style={{ fontSize: 20 }} />
              </button>
              <button style={s.navBtn} onClick={nextMonth}>
                <ChevronRightIcon style={{ fontSize: 20 }} />
              </button>
            </div>
          </div>

          <div style={s.grid}>
            {DAYS.map((d) => (
              <div key={d} style={s.dayHeader}>{d}</div>
            ))}
            {cells.map((cell, i) => (
              <div
                key={i}
                onClick={() => handleDayClick(cell)}
                style={{
                  ...s.cell,
                  cursor: cell.currentMonth ? "pointer" : "default",
                  backgroundColor: isSelected(cell)
                    ? "#DFFF00"
                    : isToday(cell)
                    ? "#2a2a2a"
                    : "transparent",
                  color: isSelected(cell)
                    ? "#000"
                    : cell.currentMonth
                    ? "#fff"
                    : "#333",
                  fontWeight: isSelected(cell) || isToday(cell) ? 700 : 400,
                  outline: isToday(cell) && !isSelected(cell) ? "1px solid #DFFF00" : "none",
                }}
              >
                {cell.day}
                {hasLog(cell) && (
                  <div style={{
                    ...s.dot,
                    backgroundColor: isSelected(cell) ? "#000" : "#DFFF00",
                  }} />
                )}
              </div>
            ))}
          </div>

          {selectedDate && (
            <button style={s.clearBtn} onClick={() => setSelectedDate(null)}>
              Clear filter
            </button>
          )}
        </div>

        {/* Workout log */}
        <div style={s.logPanel}>
          <p style={s.logTitle}>
            {selectedDate ? formatDisplayDate(selectedDate) : "ALL SESSIONS"}
          </p>

          {filteredLog.length === 0 ? (
            <div style={s.empty}>
              <p style={s.emptyText}>No workouts logged{selectedDate ? " on this day" : " yet"}.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filteredLog.map((entry) => (
                <div key={entry.id} style={s.logCard}>
                  <div style={s.logCardHeader}>
                    <div style={s.logIcon}>
                      <FitnessCenterIcon style={{ fontSize: 18, color: "#DFFF00" }} />
                    </div>
                    <div>
                      <p style={s.logPlanName}>{entry.planName}</p>
                      <p style={s.logDate}>{formatDisplayDate(entry.date)}</p>
                    </div>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <div style={s.exHeader}>
                      <span style={{ flex: 3 }}>Exercise</span>
                      <span style={{ flex: 1, textAlign: "center" }}>Sets</span>
                      <span style={{ flex: 1, textAlign: "center" }}>Reps</span>
                    </div>
                    {entry.exercises.map((ex, i) => (
                      <div key={i} style={s.exRow}>
                        <span style={{ flex: 3 }}>{ex.name}</span>
                        <span style={{ flex: 1, textAlign: "center" }}>{ex.sets}</span>
                        <span style={{ flex: 1, textAlign: "center" }}>{ex.reps}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    paddingLeft: 40,
    paddingRight: 40,
    //paddingTop: 10,
    paddingBottom: 64,
    minHeight: "100vh",
    width: "100%",
    backgroundColor: "#000",
    color: "#fff",
    boxSizing: "border-box",
    fontFamily: "'lexend', sans-serif",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 36,
    paddingTop: 30,
  },
  heading: {
    fontSize: "clamp(28px, 5vw, 48px)",  /* responsive font size */
    fontWeight: 900,
    margin: "0 0 10px",
    letterSpacing: 2,
    lineHeight: 1,
    textTransform: "uppercase",
  },
  subtitle: {
    color: "#ADAAAA",
    fontSize: 13,
    margin: 0,
    lineHeight: 1.6,
  },
  columns: {
    display: "flex",
    gap: 24,
    alignItems: "flex-start",
    flexWrap: "wrap",         /* allows stacking */
  },
   card: {
    backgroundColor: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: 14,
    padding: "28px 32px",
    flexShrink: 0,
    width: "100%",            /* fluid instead of fixed 420px */
    maxWidth: 420,            /* caps at 420px on large screens */
    boxSizing: "border-box",
    fontFamily: "'lexend', sans-serif",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  monthLabel: {
    fontSize: 18,
    fontWeight: 700,
    color: "#fff",
    letterSpacing: 1,
  },
  navBtn: {
    background: "none",
    border: "1px solid #2a2a2a",
    borderRadius: 6,
    color: "#aaa",
    cursor: "pointer",
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: 4,
  },
  dayHeader: {
    textAlign: "center",
    fontSize: 11,
    color: "#555",
    letterSpacing: 0.8,
    paddingBottom: 10,
    textTransform: "uppercase",
  },
  cell: {
    textAlign: "center",
    padding: "10px 0 6px",
    borderRadius: 8,
    fontSize: 14,
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: "50%",
    marginTop: 3,
  },
  clearBtn: {
    marginTop: 16,
    background: "none",
    border: "1px solid #2a2a2a",
    borderRadius: 6,
    color: "#666",
    fontSize: 12,
    cursor: "pointer",
    padding: "6px 14px",
    fontFamily: "'lexend', sans-serif",
  },
  
  logPanel: {
    flex: 1,
    minWidth: 0,
    width: "100%",            /* full width when stacked */
    boxSizing: "border-box",
  },
  logTitle: {
    fontSize: 11,
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 14,
    marginTop: 0,
  },
  empty: {
    backgroundColor: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: 14,
    padding: "40px 24px",
    textAlign: "center",
  },
  emptyText: {
    color: "#444",
    fontSize: 14,
    margin: 0,
  },
  logCard: {
    backgroundColor: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: 12,
    padding: "16px 20px",
  },
  logCardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  logIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#DFFF0022",
    border: "1px solid #DFFF0055",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logPlanName: {
    fontSize: 15,
    fontWeight: 600,
    color: "#fff",
    margin: 0,
  },
  logDate: {
    fontSize: 12,
    color: "#555",
    margin: "2px 0 0",
  },
  exHeader: {
    display: "flex",
    gap: 8,
    fontSize: 11,
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
    paddingLeft: 2,
  },
  exRow: {
    display: "flex",
    gap: 8,
    padding: "6px 2px",
    borderBottom: "1px solid #222",
    fontSize: 13,
    color: "#ccc",
  },
};

export default History;
