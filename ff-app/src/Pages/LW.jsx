import Sidebar from '../Components/Sidebar';
import React, { useState } from 'react';

// ─── Static Data ─────────────────────────────────────────────────────────────

const CATEGORIES = ['Strength', 'Cardio', 'Mobility', 'HIIT', 'Olympic'];

const EXERCISES_BY_CATEGORY = {
  Strength: ['Bench Press', 'Squat', 'Deadlift', 'Overhead Press', 'Barbell Row', 'Pull-Up', 'Dip', 'Lunge'],
  Cardio:   ['Running', 'Cycling', 'Rowing', 'Jump Rope', 'Stair Climber', 'Elliptical'],
  Mobility: ['Hip Flexor Stretch', 'Thoracic Rotation', 'Pigeon Pose', "World's Greatest Stretch", 'Cat-Cow'],
  HIIT:     ['Burpee', 'Box Jump', 'Mountain Climber', 'Kettlebell Swing', 'Battle Ropes', 'Sled Push'],
  Olympic:  ['Clean & Jerk', 'Snatch', 'Power Clean', 'Hang Clean', 'Push Press', 'Front Squat'],
};

const PLACEHOLDER = { sets: 'Sets', reps: 'Reps', load: 'Load / Duration' };

function newExercise() {
  return { id: Date.now() + Math.random(), name: '', sets: '', reps: '', load: '' };
}

// ─── Component ────────────────────────────────────────────────────────────────

  export function LW() {
  const [category,  setCategory]  = useState('');
  const [planName,  setPlanName]  = useState('');
  const [exercises, setExercises] = useState([newExercise()]);

  // Current exercise list for the selected category
  const exerciseOptions = category ? EXERCISES_BY_CATEGORY[category] : [];

  const updateExercise = (id, field, value) => {
    setExercises(prev =>
      prev.map(ex => ex.id === id ? { ...ex, [field]: value } : ex)
    );
  };

  const addExercise = () => {
    setExercises(prev => [...prev, newExercise()]);
  };

  const deleteExercise = (id) => {
    setExercises(prev => prev.filter(ex => ex.id !== id));
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>WORKOUT PLAN BUILDER</h1>

      {/* ── Top row: category + plan name ── */}
      <div style={styles.topRow}>
        <select
          value={category}
          onChange={e => {
            setCategory(e.target.value);
            // Reset exercise names when category changes
            setExercises(prev => prev.map(ex => ({ ...ex, name: '' })));
          }}
          style={{ ...styles.select, minWidth: 160 }}
        >
          <option value="" disabled>Category</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <input
          type="text"
          value={planName}
          onChange={e => setPlanName(e.target.value)}
          placeholder="Add qualitative data: energy 
levels, soreness, specific 
challenges..."
          style={{ ...styles.input, flex: 1 }}
        />
      </div>

      {/* ── Column headers ── */}
      <div style={styles.headerRow}>
        <span style={{ ...styles.colLabel, flex: '0 0 200px' }}>Exercise</span>
        {/*<span style={{ ...styles.colLabel, flex: '0 0 80px'  }}>Sets</span>
        <span style={{ ...styles.colLabel, flex: '0 0 80px'  }}>Reps</span>
        <span style={{ ...styles.colLabel, flex: 1           }}>Load / Duration</span>
        */}
        <span style={{ width: 72 }} />
      </div>

      {/* ── Exercise rows ── */}
      <div style={styles.list}>
        {exercises.map((ex, i) => (
          <div key={ex.id} style={styles.row}>

            {/* Exercise dropdown */}
            <select
              value={ex.name}
              onChange={e => updateExercise(ex.id, 'name', e.target.value)}
              style={{ ...styles.select, flex: '0 0 200px' }}
            >
              <option value="" disabled>
                {category ? 'Select exercise' : 'Pick a category first'}
              </option>
              {exerciseOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>

            {/* Sets */}
            <input
              type="number"
              min="0"
              value={ex.sets}
              onChange={e => updateExercise(ex.id, 'sets', e.target.value)}
              placeholder={PLACEHOLDER.sets}
              style={{ ...styles.input, flex: '0 0 80px' }}
            />

            {/* Reps */}
            <input
              type="number"
              min="0"
              value={ex.reps}
              onChange={e => updateExercise(ex.id, 'reps', e.target.value)}
              placeholder={PLACEHOLDER.reps}
              style={{ ...styles.input, flex: '0 0 80px' }}
            />

            {/* Load / Duration */}
            <input
              type="text"
              value={ex.load}
              onChange={e => updateExercise(ex.id, 'load', e.target.value)}
              placeholder={PLACEHOLDER.load}
              style={{ ...styles.input, flex: 1 }}
            />

            {/* Delete */}
            <button
              onClick={() => deleteExercise(ex.id)}
              disabled={exercises.length === 1}
              style={{
                ...styles.deleteBtn,
                opacity: exercises.length === 1 ? 0.3 : 1,
                cursor:  exercises.length === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* ── Add exercise ── */}
      <button onClick={addExercise} style={styles.addBtn}>
        + Add Exercise
      </button>
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = {
  page: {
    backgroundColor: '#0E0E0',
    minHeight: '100vh',
    padding: '40px 32px',
    fontFamily: "'Lexend', sans-serif",
    color: '#fff',
    boxSizing: 'border-box',
    marginTop: "40px"
  },

  heading: {
    fontSize: 22,
    fontWeight: 900,
    letterSpacing: '0.08em',
    color: '#F6FFC0',
    marginBottom: 28,
  },

  topRow: {
    display: 'flex',
    gap: 12,
    marginBottom: 24,
    flexWrap: 'wrap',
  },

  headerRow: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 2,
  },

  colLabel: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.1em',
    color: '#888',
    textTransform: 'uppercase',
  },

  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },

  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#212020',
    border: '1px solid #2a2a2a',
    borderRadius: 12,
    padding: '10px 14px',
    flexWrap: 'wrap',
  },

  select: {
    backgroundColor: '#2c2c2b',
    border: '1px solid #3a3a3a',
    borderRadius: 8,
    color: '#fff',
    fontSize: 14,
    padding: '8px 10px',
    outline: 'none',
    fontFamily: "'Lexend', sans-serif",
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
    paddingRight: 28,
    cursor: 'pointer',
  },

  input: {
    backgroundColor: '#2c2c2b',
    border: '1px solid #3a3a3a',
    borderRadius: 8,
    color: '#fff',
    fontSize: 14,
    padding: '8px 10px',
    outline: 'none',
    fontFamily: "'Lexend', sans-serif",
    boxSizing: 'border-box',
    minWidth: 60,
  },

  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    border: '1px solid #3a3a3a',
    backgroundColor: 'transparent',
    color: '#888',
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'border-color 0.15s, color 0.15s',
  },

  addBtn: {
    marginTop: 16,
    backgroundColor: 'transparent',
    border: '1px solid #DAF900',
    borderRadius: 10,
    color: '#DAF900',
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "'Lexend', sans-serif",
    padding: '10px 20px',
    cursor: 'pointer',
    letterSpacing: '0.05em',
    transition: 'background-color 0.15s',
  },
};






