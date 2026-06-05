import { useState, useEffect } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { height } from "@mui/system";
import { useTheme } from '../Components/ThemeContext';

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

function normalizeDate(dateStr) {
  if (!dateStr) return null;
  return dateStr.slice(0, 10);  
}

function formatDisplayDate(dateStr) {
  if (!dateStr) return "No Date";

  const date = new Date(dateStr);

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function DayBanner({ log, selectedDate, theme }) {
  if (!log || log.length === 0) return null;

  const totalSessions = log.length;
  const totalExercises = log.reduce((acc, session) => 
    acc + (session.exercises?.length || 0), 0
  );
  const totalSets = log.reduce((acc, session) =>
    acc + (session.exercises?.reduce((a, ex) => a + (Number(ex.sets) || 0), 0) || 0), 0
  );

  // bar graph data
  const bars = [
    { label: 'Sessions', value: totalSessions, max: 5,  color: '#DFFF00' },
    { label: 'Exercises', value: totalExercises, max: 20, color: '#0891b2' },
    { label: 'Total Sets', value: totalSets, max: 50, color: '#9333ea' },
  ];

  return (
    <div style={{
      backgroundColor: theme.pageBg, //'#1a1a1a',
      border: `1px solid ${theme.watermark}`, // #2a2a2a,
      borderRadius: 12,
      padding: '16px 20px',
      marginBottom: 16,
    }}>
      {/* title */}
      <p style={{
        fontSize: 11,
        color: theme.accent, //'#555',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        margin: '0 0 14px',
      }}>
        {selectedDate ? formatDisplayDate(selectedDate) : 'All Time'} — Summary
      </p>

      {/* stat pills */}
      <div style={{
        display: 'flex',
        gap: 12,
        marginBottom: 16,
        flexWrap: 'wrap',
      }}>
        {[
          { label: 'Sessions',  value: totalSessions },
          { label: 'Exercises', value: totalExercises },
          { label: 'Sets',      value: totalSets },
        ].map(({ label, value }) => (
          <div key={label} style={{
            backgroundColor: theme.cardBorder, //'#212020',
            border: `1px solid ${theme.watermark}`,// #2a2a2a,
            borderRadius: 8,
            padding: '8px 14px',
            textAlign: 'center',
          }}>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: theme.accent }}>{value}</p>
            <p style={{ margin: 0, fontSize: 10, color: theme.toggleNotDone, textTransform: 'uppercase', letterSpacing: 0.8 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* bar graph */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {bars.map(({ label, value, max, color }) => {
          const pct = Math.min((value / max) * 100, 100);
          return (
            <div key={label}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 4,
              }}>
                <span style={{ fontSize: 11, color: theme.accent/*'#888'*/, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                  {label}
                </span>
                <span style={{ fontSize: 11, color: theme.text/*'#fff'*/, fontWeight: 700 }}>
                  {value}
                </span>
              </div>
              {/* bar track */}
              <div style={{
                height: 6,
                backgroundColor: theme.cardBorder, //'#2a2a2a',
                borderRadius: 4,
                overflow: 'hidden',
              }}>
                {/* fill */}
                <div style={{
                  height: '100%',
                  width: `${pct}%`,
                  backgroundColor: color,
                  borderRadius: 4,
                  transition: 'width 0.4s ease',
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function History() {
  const today = new Date();
  const [viewYear,     setViewYear]     = useState(today.getFullYear());
  const [viewMonth,    setViewMonth]    = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [log,          setLog]          = useState([]);
  const [logDates,     setLogDates]     = useState(new Set());
  const [loading,      setLoading]      = useState(false);
 
  const { theme, darkMode, setDarkMode } = useTheme();

  const s = styles(theme);
  
  // fetch all date and separate from date 
useEffect(() => {
fetch(`${process.env.REACT_APP_API_URL}/workoutsessions/dates`, { credentials: 'include' })
  .then(res => res.json())
  .then(data => {
    setLogDates(new Set((data.dates || []).map(d => 
      typeof d === 'object' ? normalizeDate(d.date) : normalizeDate(d)
    )));
  })
    .catch(err => console.error('failed to fetch dates:', err));
}, []); // just in case array

// RE-fetch sessions when date changes
useEffect(() => {
  setLoading(true);

  const url = selectedDate
    ? `${process.env.REACT_APP_API_URL}/workoutsessions?date=${selectedDate}`
    : `${process.env.REACT_APP_API_URL}/workoutsessions`;

  fetch(url, { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
      console.log('sessions response:', data);  // check RES
      setLog(data.sessions || []);
    })
    .catch(err => console.error('failed to fetch sessions:', err))
    .finally(() => setLoading(false));

}, [selectedDate]);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
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
    setSelectedDate(prev => prev === ds ? null : ds);
  }

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.topRow}>
        <div>
          <h1 style={s.heading}>
            <span style={{ color: theme.text /*"#fff"*/ }}>HISTORY</span>
            <span style={{ color:  theme.accent }}>.</span>
          </h1>
          <p style={s.subtitle}>Track your training sessions and progress over time.</p>
        </div>
      </div>

      {/* Two-column layout */}
      <div style={s.columns} className="history-columns">
        
        {/* Calendar */}
        <div style={s.card} className="history-card">
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
                  // FIX LATTER MAYBE
                  cursor: cell.currentMonth ? "pointer" : "default",
                  backgroundColor: isSelected(cell) ? "#DFFF00" : isToday(cell) ? theme.muted : "transparent",
                  color: isSelected(cell) ? "#000" : cell.currentMonth ? theme.text : "#333",
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
{  /* graph banner here */}
          <DayBanner log={log} selectedDate={selectedDate} theme = {theme}/>
          {loading ? (
            <div style={s.empty}>
              <p style={s.emptyText}>Loading...</p>
            </div>
          ) : log.length === 0 ? (
            <div style={s.empty}>
              <p style={s.emptyText}>No workouts logged{selectedDate ? " on this day" : " yet"}.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {log.map((entry) => (
                <div key={entry.id} style={s.logCard}>
                  <div style={s.logCardHeader}>
                    <div style={s.logIcon}>
                      <FitnessCenterIcon style={{ fontSize: 18, color: "#DFFF00" }} />
                    </div>
                    <div>
                      {/* show plan name for plan logs, cat for quick logs */}
                      <p style={s.logPlanName}>
                        {entry.session_type === 'plan' ? entry.plan_name : `Quick Log`}
                      </p>
                      <p style={s.logDate}>{formatDisplayDate(entry.logged_at?.slice(0, 10) || entry.date)}</p>
                    </div>
                  </div>

                  {entry.notes && (
                    <p style={{ color: theme.toggleOffKnob /* '#888'*/, fontSize: 12, margin: '6px 0 0' }}>{entry.notes}</p>
                  )}

                  <div style={{ marginTop: 10 }}>
                    <div style={s.exHeader}>
                      <span style={{ flex: 3 }}>Exercise</span>
                      <span style={{ flex: 1, textAlign: "center" }}>Sets</span>
                      <span style={{ flex: 1, textAlign: "center" }}>Reps</span>
                      <span style={{ flex: 1, textAlign: "center" }}>Load</span>
                    </div>
                    {entry.exercises.map((ex, i) => (
                      <div key={i} style={s.exRow}>
                        <span style={{ flex: 3 }}>
                          {ex.name}
                          {ex.category && (
                            <span style={{ color: theme.inputBorder, fontSize: 11, marginLeft: 6 }}>
                              {ex.category}
                            </span>
                          )}
                        </span>
                        <span style={{ flex: 1, textAlign: "center" }}>{ex.sets}</span>
                        <span style={{ flex: 1, textAlign: "center" }}>{ex.reps}</span>
                        <span style={{ flex: 1, textAlign: "center" }}>{ex.load ?? '—'}</span>
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

const styles = (theme) => ({
  page: {
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 64,
    minHeight: "100vh",
    width: "100%",
    backgroundColor: theme.pageBg,
    color: theme.text,
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
    fontSize: "clamp(28px, 5vw, 48px)",
    fontWeight: 900,
    margin: "0 0 10px",
    letterSpacing: 2,
    lineHeight: 1,
    textTransform: "uppercase",
    color: theme.text,
  },
  subtitle: {
    color: theme.muted,
    fontSize: 13,
    margin: 0,
    lineHeight: 1.6,
  },
  columns: {
    display: "flex",
    gap: 24,
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  card: {
    backgroundColor: theme.cardBg,
    border: `1px solid ${theme.cardBorder}`,
    borderRadius: 14,
    padding: "28px 32px",
    flexShrink: 0,
    width: "100%",
    maxWidth: 420,
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
    color: theme.text,
    letterSpacing: 1,
  },
  navBtn: {
    background: "none",
    border: `1px solid ${theme.cardBorder}`,
    borderRadius: 6,
    color: theme.muted,
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
    color: theme.muted,
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
    border: `1px solid ${theme.cardBorder}`,
    borderRadius: 6,
    color: theme.muted,
    fontSize: 12,
    cursor: "pointer",
    padding: "6px 14px",
    fontFamily: "'lexend', sans-serif",
  },
  logPanel: {
    flex: 1,
    minWidth: 0,
    width: "100%",
    boxSizing: "border-box",
  },
  logTitle: {
    fontSize: 11,
    color: theme.muted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 14,
    marginTop: 0,
  },
  empty: {
    backgroundColor: theme.cardBg,
    border: `1px solid ${theme.cardBorder}`,
    borderRadius: 14,
    padding: "40px 24px",
    textAlign: "center",
  },
  emptyText: {
    color: theme.accented,
    fontSize: 14,
    margin: 0,
  },
  logCard: {
    backgroundColor: theme.cardBg,
    border: `1px solid ${theme.cardBorder}`,
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
    backgroundColor: `${theme.accent}22`,
    border: `1px solid ${theme.accent}55`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logPlanName: {
    fontSize: 15,
    fontWeight: 600,
    color: theme.text,
    margin: 0,
  },
  logDate: {
    fontSize: 12,
    color: theme.muted,
    margin: "2px 0 0",
  },
  exHeader: {
    display: "flex",
    gap: 8,
    fontSize: 11,
    color: theme.muted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
    paddingLeft: 2,
  },
  exRow: {
    display: "flex",
    gap: 8,
    padding: "6px 2px",
    borderBottom: `1px solid ${theme.cardBorder}`,
    fontSize: 13,
    color: theme.text,
  },
});

export default History;
