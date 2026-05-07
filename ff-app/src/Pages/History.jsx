import { useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

function getCalendarDays(year, month) {
  const firstDay   = new Date(year, month, 1).getDay();
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

export function History() {
  const today = new Date();
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  const cells  = getCalendarDays(viewYear, viewMonth);
  const isToday = (cell) =>
    cell.currentMonth &&
    cell.day   === today.getDate() &&
    viewMonth  === today.getMonth() &&
    viewYear   === today.getFullYear();

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.topRow}>
        <div>
          <h1 style={s.heading}>
            <span style={{ color: '#fff' }}>HISTORY</span>
            <span style={{ color: '#DFFF00' }}>.</span>
          </h1>
          <p style={s.subtitle}>
            Track your training sessions and progress over time.
          </p>
        </div>
      </div>

      {/* Calendar */}
      <div style={s.card}>
        <div style={s.nav}>
          <span style={s.monthLabel}>
            {MONTHS[viewMonth].toUpperCase()} {viewYear}
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={s.navBtn} onClick={prevMonth}>
              <ChevronLeftIcon style={{ fontSize: 20 }} />
            </button>
            <button style={s.navBtn} onClick={nextMonth}>
              <ChevronRightIcon style={{ fontSize: 20 }} />
            </button>
          </div>
        </div>

        <div style={s.grid}>
          {DAYS.map(d => (
            <div key={d} style={s.dayHeader}>{d}</div>
          ))}
          {cells.map((cell, i) => (
            <div
              key={i}
              style={{
                ...s.cell,
                backgroundColor: isToday(cell) ? '#DFFF00' : 'transparent',
                color: isToday(cell) ? '#000' : cell.currentMonth ? '#fff' : '#333',
                fontWeight: isToday(cell) ? 700 : 400,
              }}
            >
              {cell.day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    paddingLeft: 290,
    paddingRight: 40,
    paddingTop: 40,
    paddingBottom: 64,
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#000',
    color: '#fff',
    boxSizing: 'border-box',
    fontFamily: "'lexend', sans-serif",
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 36,
    paddingTop: 30,
  },
  heading: {
    fontSize: 48,
    fontWeight: 900,
    margin: '0 0 10px',
    letterSpacing: 2,
    lineHeight: 1,
    textTransform: 'uppercase',
  },
  subtitle: {
    color: '#ADAAAA',
    fontSize: 13,
    margin: 0,
    lineHeight: 1.6,
  },
  card: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: 14,
    padding: '28px 32px',
    maxWidth: 520,
    fontFamily: "'lexend', sans-serif",
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  monthLabel: {
    fontSize: 18,
    fontWeight: 700,
    color: '#fff',
    letterSpacing: 1,
  },
  navBtn: {
    background: 'none',
    border: '1px solid #2a2a2a',
    borderRadius: 6,
    color: '#aaa',
    cursor: 'pointer',
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 4,
  },
  dayHeader: {
    textAlign: 'center',
    fontSize: 11,
    color: '#555',
    letterSpacing: 0.8,
    paddingBottom: 10,
    textTransform: 'uppercase',
  },
  cell: {
    textAlign: 'center',
    padding: '10px 0',
    borderRadius: 8,
    fontSize: 14,
    cursor: 'default',
  },
};

export default History;
