import React, { useEffect, useState } from 'react';

// ─── Static Data ─────────────────────────────────────────────────────────────

const CATEGORIES = ['Strength', 'Cardio', 'Mobility', 'HIIT', 'Olympic'];

const EXERCISES_BY_CATEGORY = {
  Strength: ['Bench Press', 'Squat', 'Deadlift', 'Overhead Press', 'Barbell Row', 'Pull-Up', 'Dip', 'Lunge'],
  Cardio: ['Running', 'Cycling', 'Rowing', 'Jump Rope', 'Stair Climber', 'Elliptical'],
  Mobility: ['Hip Flexor Stretch', 'Thoracic Rotation', 'Pigeon Pose', "World's Greatest Stretch", 'Cat-Cow'],
  HIIT: ['Burpee', 'Box Jump', 'Mountain Climber', 'Kettlebell Swing', 'Battle Ropes', 'Sled Push'],
  Olympic: ['Clean & Jerk', 'Snatch', 'Power Clean', 'Hang Clean', 'Push Press', 'Front Squat'],
};
const PLACEHOLDER = { sets: 'Sets', reps: 'Reps', load: 'Load / Duration' };

const WORKOUT_LOGS_KEY =  'WorkoutLogs'; //'workoutLogs';
const WORKOUT_PLANS_KEY = 'plans'; // 'workoutPlans';

async function readDBArray(key) {
  if (typeof window === 'undefined') return [];
  if (key === 'WorkoutLogs') return [];
  
  try {
    const res = await fetch(`http://localhost:3001/${key}`, {
      credentials: 'include'
    });

    if (!res.ok) throw new Error("Failed to fetch");





  const result = await res.json();


const end = result.plans.map(plan => ({
  id: plan.id,
  name: plan.planname,
  exercises: plan.exercises,
  created_at: plan.created_at,
}));


  return end;
    //console.log(`readDBArray result:`, result);
    //return result.plans || result.plan || [];   // handle both response shapes

  } catch (err) {
    console.error('here', err);
    return [];
  }
};

function readLocalStorageArray(key) {
  /*if (typeof window === 'undefined') return [];

  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
    */
   return [];
}

function saveLocalStorageArray(key, value) {
  /*
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
  */
}

 /*   const planLog = {
      id: `${Date.now()}-${Math.random()}`,
      type: 'plan',
      name: planName,
      exercises: planExercises.map(exercise => ({
        name: exercise.name || '',
        sets: exercise.sets || '',
        reps: exercise.reps || '',
      })),
      time: timestamp,
      date: date,
    };
*/
async function saveDBArray(key, value){
  if (typeof window === 'undefined') return;

  if (value === []) return;
  try {

    // step 1 — save the plan
    let res = await fetch(`http://localhost:3001/LW/add/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        date: value.date,
        duration_minutes: value.load,
        created_at: value.time,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.error || "Failed to save plan");
      return;
    }

    const data = await res.json();
    const planId = data.Sesh[0].id;   //  grab id from { plan: [{ id: 21 }] }

    // step 2: save each exercise using planId
    for (const exercise of value.exercises) {
      let exRes = await fetch('http://localhost:3001/LW/add/EX', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          plan_id: planId,        // join with plan
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          load: exercise.load,

        }),
      });

      if (!exRes.ok) {
        const exErr = await exRes.json();
        alert(exErr.error || "Failed to save exercise");
        return;
      }

      const exData = await exRes.json();
      console.log('exercise saved:', exData);
    }

    console.log('all done!');

  } catch (err) {
    console.error('error saving plan:', err);
  }
};

function getDateTimeLocalNow() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function createTimestamp(selectedDateTime) {
  const logDate = selectedDateTime ? new Date(selectedDateTime) : new Date();

  return {
    timestamp: logDate.toISOString(),
    date: logDate.toISOString().slice(0, 10),
  };
}

function getPlanName(plan, index) {
  return plan?.name || plan?.planName || plan?.title || `Workout Plan ${index + 1}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LW() {
  const [logMode, setLogMode] = useState('quick');
  const [category, setCategory] = useState('');
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [load, setLoad] = useState('');
  const [selectedPlanIndex, setSelectedPlanIndex] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const [logDateTime, setLogDateTime] = useState(() => getDateTimeLocalNow());
  // add this back in if the backend fails to work
  // const [plans, setPlans] = useState(() => readLocalStorageArray(WORKOUT_PLANS_KEY));
  // const [workoutLogs, setWorkoutLogs] = useState(() => readLocalStorageArray(WORKOUT_LOGS_KEY));

   const [plans, setPlans] = useState([]);
   useEffect(() => {
       readDBArray('plans').then(fetchedPlans => {
         setPlans(fetchedPlans);
       });
     }, []);
     const [workoutLogs, setWorkoutLogs] = useState([]);
useEffect(() => {
  async function loadLogs() {
    const logs = await readDBArray(WORKOUT_LOGS_KEY);
    setWorkoutLogs(logs);
  }

  loadLogs();
}, []);
   //const [workoutLogs, setWorkoutLogs] = useState(() => readDBArray(WORKOUT_LOGS_KEY));


   
  // useEffect(() => {
  //  saveDBArray(WORKOUT_PLANS_KEY, plans, selectedPlan);
  // }, [plans]);

  useEffect(() => {
    saveLocalStorageArray(WORKOUT_LOGS_KEY, workoutLogs);
  }, [workoutLogs]);

  const exerciseOptions = category ? EXERCISES_BY_CATEGORY[category] : [];
  const selectedPlan = selectedPlanIndex !== '' ? plans[Number(selectedPlanIndex)] : null;

  const resetQuickLogFields = () => {
    setCategory('');
    setExerciseName('');
    setSets('');
    setReps('');
    setLoad('');
  };

  const appendWorkoutLog = (newLog) => {
    setWorkoutLogs(prev => [...prev, newLog]);
  };

  const handleQuickLogSubmit = () => {
    if (!category || !exerciseName || !sets || !reps || !load) {
      setStatusMessage('Please choose a category and exercise, then enter sets, reps, and load/duration.');
      return;
    }

    const { timestamp, date } = createTimestamp(logDateTime);


const quickLog = {
  id: `${Date.now()}-${Math.random()}`,
  type: 'quick',
  name: category,
  exercises: [
    {
      name: exerciseName,
      sets: sets,
      reps: reps,
      load: load,
    },
  ],
  time: timestamp,
  date: date,
};

    appendWorkoutLog(quickLog);
    resetQuickLogFields();
    setLogDateTime(getDateTimeLocalNow());
    setStatusMessage(`${exerciseName} was logged for ${date}.`);
    
    // New might break something 
  
    saveDBArray(WORKOUT_LOGS_KEY, quickLog)
  };

  const handlePlanLogSubmit = () => {
    if (!selectedPlan) {
      setStatusMessage('Please select a workout plan before confirming.');
      return;
    }

    const planExercises = Array.isArray(selectedPlan.exercises) ? selectedPlan.exercises : [];

    if (planExercises.length === 0) {
      setStatusMessage('The selected workout plan does not have any exercises to log.');
      return;
    }

    const { timestamp, date } = createTimestamp(logDateTime);
    const planName = getPlanName(selectedPlan, Number(selectedPlanIndex));

    const planLog = {
      id: `${Date.now()}-${Math.random()}`,
      type: 'plan',
      name: planName,
      exercises: planExercises.map(exercise => ({
        name: exercise.name || '',
        sets: exercise.sets || '',
        reps: exercise.reps || '',
      })),
      time: timestamp,
      date: date,
    };

    appendWorkoutLog(planLog);
    setSelectedPlanIndex('');
    setLogDateTime(getDateTimeLocalNow());
    setStatusMessage(`${planName} was logged for ${date}.`);
    saveDBArray(WORKOUT_PLANS_KEY, planLog);

  };

  const refreshPlansFromStorage = () => {
    setPlans(readLocalStorageArray(WORKOUT_PLANS_KEY));
    setSelectedPlanIndex('');
    setStatusMessage('Workout plans were refreshed from local storage.');
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>LOG WORKOUT</h1>

      <div style={styles.modeRow}>
        <button
          type="button"
          onClick={() => {
            setLogMode('quick');
            setStatusMessage('');
          }}
          style={{
            ...styles.modeButton,
            ...(logMode === 'quick' ? styles.activeModeButton : {}),
          }}
        >
          Quick Log
        </button>

        <button
          type="button"
          onClick={() => {
            setLogMode('plan');
            setStatusMessage('');
          }}
          style={{
            ...styles.modeButton,
            ...(logMode === 'plan' ? styles.activeModeButton : {}),
          }}
        >
          Log From Plan
        </button>
      </div>

      {logMode === 'quick' ? (
        <section style={styles.card}>
          <div style={styles.sectionHeaderRow}>
            <div>
              <h2 style={styles.sectionHeading}>Quick Log</h2>
              <p style={styles.helperText}>Manually log one exercise with sets, reps, and load or duration.</p>
            </div>
          </div>

          <div style={styles.formGrid}>
            <label style={styles.fieldLabel}>
              Category
              <select
                value={category}
                onChange={e => {
                  setCategory(e.target.value);
                  setExerciseName('');
                }}
                style={styles.select}
              >
                <option value="" disabled>Category</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>

            <label style={styles.fieldLabel}>
              Exercise
              <select
                value={exerciseName}
                onChange={e => setExerciseName(e.target.value)}
                style={styles.select}
                disabled={!category}
              >
                <option value="" disabled>
                  {category ? 'Select exercise' : 'Pick a category first'}
                </option>
                {exerciseOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </label>

            <label style={styles.fieldLabel}>
              Sets
              <input
                type="number"
                min="0"
                value={sets}
                onChange={e => setSets(e.target.value)}
                placeholder={PLACEHOLDER.sets}
                style={styles.input}
              />
            </label>

            <label style={styles.fieldLabel}>
              Reps
              <input
                type="number"
                min="0"
                value={reps}
                onChange={e => setReps(e.target.value)}
                placeholder={PLACEHOLDER.reps}
                style={styles.input}
              />
            </label>

            <label style={{ ...styles.fieldLabel, gridColumn: '1 / -1' }}>
              Load / Duration
              <input
                type="text"
                value={load}
                onChange={e => setLoad(e.target.value)}
                placeholder={PLACEHOLDER.load}
                style={styles.input}
              />
            </label>

            <label style={{ ...styles.fieldLabel, gridColumn: '1 / -1' }}>
                Workout Date / Time
                <input
                    type="datetime-local"
                    value={logDateTime}
                    onChange={e => setLogDateTime(e.target.value)}
                    style={styles.input}
                />
            </label>
          </div>

          <button type="button" onClick={handleQuickLogSubmit} style={styles.primaryBtn}>
            Confirm Quick Log
          </button>
        </section>
      ) : (
        <section style={styles.card}>
          <div style={styles.sectionHeaderRow}>
            <div>
              <h2 style={styles.sectionHeading}>Log From Workout Plan</h2>
              <p style={styles.helperText}>Choose one saved workout plan and confirm to log all of its exercises.</p>
            </div>

            {/* <button type="button" onClick={refreshPlansFromStorage} style={styles.secondaryBtn}>
              Refresh Plans
            </button> */}
          </div>

          {plans.length === 0 ? (
            <div style={styles.emptyState}>
              No workout plans were found in local storage under <strong>workoutPlans</strong>.
            </div>
          ) : (
            <div style={styles.planList}>
              {plans.map((plan, index) => {
                const planName = getPlanName(plan, index);
                const planExercises = Array.isArray(plan.exercises) ? plan.exercises : [];

                return (
                  <label
                    key={`${planName}-${index}`}
                    style={{
                      ...styles.planCard,
                      ...(selectedPlanIndex === String(index) ? styles.selectedPlanCard : {}),
                    }}
                  >
                    <div style={styles.planHeader}>
                      <input
                        type="radio"
                        name="selectedWorkoutPlan"
                        value={index}
                        checked={selectedPlanIndex === String(index)}
                        onChange={e => setSelectedPlanIndex(e.target.value)}
                      />
                      <span style={styles.planName}>{planName}</span>
                    </div>

                    {planExercises.length > 0 ? (
                      <ul style={styles.exercisePreviewList}>
                        {planExercises.map((exercise, exerciseIndex) => (
                          <li key={`${exercise.name}-${exerciseIndex}`} style={styles.exercisePreviewItem}>
                            <span>{exercise.name || `Exercise ${exerciseIndex + 1}`}</span>
                            <span style={styles.exerciseMeta}>
                              {exercise.sets || 0} sets × {exercise.reps || 0} reps
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p style={styles.helperText}>This plan does not have any exercises yet.</p>
                    )}
                  </label>
                );
              })}
            </div>
          )}

          {selectedPlan && (
            <div style={styles.confirmBox}>
              <strong>Ready to log:</strong> {getPlanName(selectedPlan, Number(selectedPlanIndex))}
            </div>
          )}

          <label style={{...styles.fieldLabel, marginBottom: 14 }}>
            Workout Date / Time 
            <input 
                type="datetime-local"
                value={logDateTime}
                onChange={e => setLogDateTime(e.target.value)}
                style={styles.input}
            />
          </label>

          <button
            type="button"
            onClick={handlePlanLogSubmit}
            disabled={!selectedPlan}
            style={{
              ...styles.primaryBtn,
              opacity: selectedPlan ? 1 : 0.45,
              cursor: selectedPlan ? 'pointer' : 'not-allowed',
            }}
          >
            Confirm Plan Log
          </button>
        </section>
      )}

      {statusMessage && <p style={styles.statusMessage}>{statusMessage}</p>}
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = {
  page: {
    backgroundColor: '#0E0E0E',
    minHeight: '100vh',
    padding: '40px 32px',
    fontFamily: "'Lexend', sans-serif",
    color: '#fff',
    boxSizing: 'border-box',
    marginTop: '40px',
  },

  heading: {
    fontSize: 22,
    fontWeight: 900,
    letterSpacing: '0.08em',
    color: '#F6FFC0',
    marginBottom: 28,
  },

  modeRow: {
    display: 'flex',
    gap: 12,
    marginBottom: 20,
    flexWrap: 'wrap',
  },

  modeButton: {
    backgroundColor: '#212020',
    border: '1px solid #3a3a3a',
    borderRadius: 10,
    color: '#888',
    fontSize: 14,
    fontWeight: 700,
    fontFamily: "'Lexend', sans-serif",
    padding: '10px 20px',
    cursor: 'pointer',
    letterSpacing: '0.05em',
    transition: 'background-color 0.15s, border-color 0.15s, color 0.15s',
  },

  activeModeButton: {
    backgroundColor: '#2c2c2b',
    borderColor: '#DAF900',
    color: '#DAF900',
  },

  card: {
    backgroundColor: '#171717',
    border: '1px solid #2a2a2a',
    borderRadius: 16,
    padding: 20,
    maxWidth: 900,
  },

  sectionHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 20,
    flexWrap: 'wrap',
  },

  sectionHeading: {
    color: '#F6FFC0',
    fontSize: 18,
    fontWeight: 800,
    margin: '0 0 6px',
  },

  helperText: {
    color: '#aaa',
    fontSize: 13,
    lineHeight: 1.45,
    margin: 0,
  },

  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 14,
    marginBottom: 20,
  },

  fieldLabel: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    color: '#888',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },

  select: {
    width: '100%',
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
    boxSizing: 'border-box',
  },

  input: {
    width: '100%',
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

  primaryBtn: {
    marginTop: 4,
    backgroundColor: 'transparent',
    border: '1px solid #DAF900',
    borderRadius: 10,
    color: '#DAF900',
    fontSize: 14,
    fontWeight: 700,
    fontFamily: "'Lexend', sans-serif",
    padding: '10px 20px',
    cursor: 'pointer',
    letterSpacing: '0.05em',
    transition: 'background-color 0.15s',
  },

  secondaryBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #3a3a3a',
    borderRadius: 10,
    color: '#ccc',
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "'Lexend', sans-serif",
    padding: '8px 14px',
    cursor: 'pointer',
  },

  planList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginBottom: 16,
  },

  planCard: {
    display: 'block',
    backgroundColor: '#212020',
    border: '1px solid #2a2a2a',
    borderRadius: 12,
    padding: '14px 16px',
    cursor: 'pointer',
  },

  selectedPlanCard: {
    borderColor: '#DAF900',
    boxShadow: '0 0 0 1px rgba(218, 249, 0, 0.2)',
  },

  planHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },

  planName: {
    color: '#F6FFC0',
    fontSize: 15,
    fontWeight: 800,
  },

  exercisePreviewList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },

  exercisePreviewItem: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    color: '#fff',
    fontSize: 13,
    borderTop: '1px solid #2a2a2a',
    paddingTop: 8,
    flexWrap: 'wrap',
  },

  exerciseMeta: {
    color: '#aaa',
  },

  confirmBox: {
    backgroundColor: '#212020',
    border: '1px solid #3a3a3a',
    borderRadius: 10,
    color: '#ddd',
    fontSize: 13,
    padding: '10px 12px',
    marginBottom: 14,
  },

  emptyState: {
    backgroundColor: '#212020',
    border: '1px solid #2a2a2a',
    borderRadius: 12,
    color: '#aaa',
    fontSize: 14,
    padding: 16,
    marginBottom: 16,
  },

  statusMessage: {
    maxWidth: 900,
    backgroundColor: '#212020',
    border: '1px solid #2a2a2a',
    borderRadius: 10,
    color: '#F6FFC0',
    fontSize: 14,
    padding: '12px 14px',
    marginTop: 16,
  },
};