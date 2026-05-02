import { useState, useEffect } from "react";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import PoolIcon from "@mui/icons-material/Pool";
import SportsMartialArtsIcon from "@mui/icons-material/SportsMartialArts";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const ICON_OPTIONS = [
  { key: "dumbbell", Component: FitnessCenterIcon },
  { key: "run", Component: DirectionsRunIcon },
  { key: "yoga", Component: SelfImprovementIcon },
  { key: "cardio", Component: FavoriteIcon },
  { key: "bike", Component: DirectionsBikeIcon },
  { key: "swim", Component: PoolIcon },
  { key: "martial", Component: SportsMartialArtsIcon },
  { key: "fire", Component: WhatshotIcon },
];

const COLOR_OPTIONS = [
  "#2563eb",
  "#0891b2",
  "#16a34a",
  "#DFFF00",
  "#d97706",
  "#dc2626",
  "#9333ea",
  "#ec4899",
];

const DEFAULT_ICON = "dumbbell";
const DEFAULT_COLOR = "#2563eb";
const emptyExercise = () => ({ name: "", sets: "", reps: "" });

function PlanIcon({ iconKey, color, size = 22 }) {
  const match = ICON_OPTIONS.find((o) => o.key === iconKey) || ICON_OPTIONS[0];
  return <match.Component style={{ color, fontSize: size }} />;
}

export function LogWorkoutPlan() {
  const [plans, setPlans] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("workoutPlans")) || [];
    } catch {
      return [];
    }
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [planName, setPlanName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(DEFAULT_ICON);
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLOR);
  const [exercises, setExercises] = useState([emptyExercise()]);
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("workoutPlans", JSON.stringify(plans));
  }, [plans]);

  function openModal() {
    setEditingId(null);
    setPlanName("");
    setSelectedIcon(DEFAULT_ICON);
    setSelectedColor(DEFAULT_COLOR);
    setExercises([emptyExercise()]);
    setError("");
    setModalOpen(true);
  }

  function openEditModal(e, plan) {
    e.stopPropagation();
    setEditingId(plan.id);
    setPlanName(plan.name);
    setSelectedIcon(plan.icon || DEFAULT_ICON);
    setSelectedColor(plan.color || DEFAULT_COLOR);
    setExercises(plan.exercises.map((ex) => ({ ...ex })));
    setError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
  }

  function updateExercise(index, field, value) {
    setExercises((prev) =>
      prev.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex)),
    );
  }

  function handleSave() {
    if (!planName.trim()) {
      setError("Plan name is required.");
      return;
    }
    const filled = exercises.filter((ex) => ex.name.trim());
    if (filled.length === 0) {
      setError("Add at least one exercise.");
      return;
    }
    for (const ex of filled) {
      if (!ex.sets || !ex.reps) {
        setError("Fill in sets and reps for every exercise.");
        return;
      }
    }
    if (editingId !== null) {
      setPlans((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                name: planName.trim(),
                icon: selectedIcon,
                color: selectedColor,
                exercises: filled,
              }
            : p,
        ),
      );
    } else {
      setPlans((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: planName.trim(),
          icon: selectedIcon,
          color: selectedColor,
          exercises: filled,
        },
      ]);
    }
    closeModal();
  }

  function deletePlan(e, id) {
    e.stopPropagation();
    setPlans((prev) => prev.filter((p) => p.id !== id));
    if (expandedPlan === id) setExpandedPlan(null);
  }

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.topRow}>
        <div>
          <h1 style={s.heading}>
            <span style={{ color: "#fff" }}>WORKOUT </span>
            <span style={{ color: "#DFFF00" }}>PLANS</span>
          </h1>
          <p style={s.subtitle}>
            Curated protocols for peak athletic performance.
            <br />
            Manage your active training cycles here.
          </p>
        </div>
        <button style={s.addBtn} onClick={openModal}>
          <AddIcon style={{ fontSize: 18, marginRight: 6 }} /> ADD WORKOUT PLAN
        </button>
      </div>

      {/* Plans list */}
      {plans.length === 0 ? (
        <div style={s.empty}>
          <p style={s.emptyText}>No plans yet.</p>
          <p style={s.emptyHint}>
            Click{" "}
            <strong style={{ color: "#DFFF00" }}>+ ADD WORKOUT PLAN</strong> to
            get started.
          </p>
        </div>
      ) : (
        <div style={s.planList}>
          {plans.map((plan) => {
            const color = plan.color || DEFAULT_COLOR;
            const isExpanded = expandedPlan === plan.id;
            return (
              <div
                key={plan.id}
                style={{
                  ...s.planCard,
                  ...(isExpanded ? s.planCardActive : {}),
                }}
              >
                <div
                  style={s.planRow}
                  onClick={() => setExpandedPlan(isExpanded ? null : plan.id)}
                >
                  <div
                    style={{
                      ...s.iconBox,
                      backgroundColor: color + "22",
                      border: `1px solid ${color}55`,
                    }}
                  >
                    <PlanIcon iconKey={plan.icon} color={color} />
                  </div>
                  <span style={s.planName}>{plan.name}</span>
                  <div style={s.actions}>
                    <button
                      style={s.iconBtn}
                      title="Edit"
                      onClick={(e) => openEditModal(e, plan)}
                    >
                      <EditIcon style={{ fontSize: 18, color: "#888" }} />
                    </button>
                    <button
                      style={s.iconBtn}
                      title="Delete"
                      onClick={(e) => deletePlan(e, plan.id)}
                    >
                      <DeleteIcon style={{ fontSize: 18, color: "#888" }} />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div style={s.exTable}>
                    <div style={s.exTableHeader}>
                      <span style={{ flex: 3 }}>Exercise</span>
                      <span style={{ flex: 1, textAlign: "center" }}>Sets</span>
                      <span style={{ flex: 1, textAlign: "center" }}>Reps</span>
                    </div>
                    {plan.exercises.map((ex, i) => (
                      <div key={i} style={s.exRow}>
                        <span style={{ flex: 3 }}>{ex.name}</span>
                        <span style={{ flex: 1, textAlign: "center" }}>
                          {ex.sets}
                        </span>
                        <span style={{ flex: 1, textAlign: "center" }}>
                          {ex.reps}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div style={s.overlay} onClick={closeModal}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>
                {editingId !== null ? "Edit Workout Plan" : "New Workout Plan"}
              </h2>
              <button style={s.closeBtn} onClick={closeModal}>
                ✕
              </button>
            </div>

            {/* Plan name */}
            <label style={s.label}>Plan Name</label>
            <input
              style={s.input}
              placeholder="e.g. Push Day"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              autoFocus
            />

            {/* Icon + Color side by side */}
            <div style={{ display: "flex", gap: 24, marginBottom: 4 }}>
              <div style={{ flex: 1 }}>
                <label style={s.label}>Icon</label>
                <div style={s.iconGrid}>
                  {ICON_OPTIONS.map(({ key, Component }) => (
                    <button
                      key={key}
                      title={key}
                      style={{
                        ...s.iconOption,
                        backgroundColor:
                          selectedIcon === key
                            ? selectedColor + "33"
                            : "#1a1a1a",
                        border:
                          selectedIcon === key
                            ? `2px solid ${selectedColor}`
                            : "2px solid #2a2a2a",
                      }}
                      onClick={() => setSelectedIcon(key)}
                    >
                      <Component
                        style={{
                          fontSize: 22,
                          color: selectedIcon === key ? selectedColor : "#555",
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={s.label}>Color</label>
                <div style={s.colorGrid}>
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color}
                      style={{
                        ...s.colorSwatch,
                        backgroundColor: color,
                        outline:
                          selectedColor === color
                            ? "3px solid #fff"
                            : "3px solid transparent",
                        outlineOffset: 2,
                      }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Exercise table */}
            <div style={{ ...s.exTableHeader, marginTop: 20 }}>
              <span style={{ flex: 3 }}>Exercise</span>
              <span style={{ flex: 1, textAlign: "center" }}>Sets</span>
              <span style={{ flex: 1, textAlign: "center" }}>Reps</span>
              <span style={{ width: 32 }} />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginBottom: 4,
              }}
            >
              {exercises.map((ex, i) => (
                <div
                  key={i}
                  style={{ display: "flex", gap: 8, alignItems: "center" }}
                >
                  <input
                    style={{ ...s.input, flex: 3, marginBottom: 0 }}
                    placeholder="Exercise name"
                    value={ex.name}
                    onChange={(e) => updateExercise(i, "name", e.target.value)}
                  />
                  <input
                    style={{
                      ...s.input,
                      flex: 1,
                      textAlign: "center",
                      marginBottom: 0,
                    }}
                    placeholder="3"
                    type="number"
                    min="1"
                    value={ex.sets}
                    onChange={(e) => updateExercise(i, "sets", e.target.value)}
                  />
                  <input
                    style={{
                      ...s.input,
                      flex: 1,
                      textAlign: "center",
                      marginBottom: 0,
                    }}
                    placeholder="10"
                    type="number"
                    min="1"
                    value={ex.reps}
                    onChange={(e) => updateExercise(i, "reps", e.target.value)}
                  />
                  <button
                    style={s.removeBtn}
                    onClick={() =>
                      setExercises((prev) => prev.filter((_, j) => j !== i))
                    }
                    disabled={exercises.length === 1}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {error && <p style={s.error}>{error}</p>}

            <div style={s.modalActions}>
              <button
                style={s.secondaryBtn}
                onClick={() =>
                  setExercises((prev) => [...prev, emptyExercise()])
                }
              >
                + Add Exercise
              </button>
              <div style={{ display: "flex", gap: 10 }}>
                <button style={s.cancelBtn} onClick={closeModal}>
                  Cancel
                </button>
                <button style={s.saveBtn} onClick={handleSave}>
                  Save Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  page: {
    paddingLeft: 290,
    paddingRight: 40,
    paddingTop: 40,
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
    fontSize: 48,
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
  addBtn: {
    background: "linear-gradient(95deg, #F6FFC0, #DFFF00, #DAF900)",
    color: "#000",
    border: "none",
    borderRadius: 5,
    padding: "12px 22px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    letterSpacing: 0.5,
    flexShrink: 0,
    marginTop: 6,
    fontFamily: "'lexend', sans-serif",
  },
  empty: { marginTop: 100, textAlign: "center" },
  emptyText: { fontSize: 18, color: "#444", marginBottom: 8 },
  emptyHint: { fontSize: 14, color: "#333" },
  planList: { display: "flex", flexDirection: "column", gap: 12 },
  planCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    border: "1px solid #2a2a2a",
    overflow: "hidden",
    cursor: "pointer",
    transition: "border-color 0.15s",
  },
  planCardActive: { border: "1.5px solid #2563eb" },
  planRow: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "24px 24px",
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  planName: { flex: 1, fontSize: 17, fontWeight: 600, color: "#fff" },
  actions: { display: "flex", gap: 4 },
  iconBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 6,
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
  },
  exTable: { borderTop: "1px solid #222", padding: "12px 20px 16px" },
  exTableHeader: {
    display: "flex",
    gap: 8,
    fontSize: 11,
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
    paddingLeft: 2,
    marginTop: 4,
  },
  exRow: {
    display: "flex",
    gap: 8,
    padding: "7px 2px",
    borderBottom: "1px solid #222",
    fontSize: 14,
    color: "#ccc",
  },
  // Modal
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#111",
    border: "1px solid #2a2a2a",
    borderRadius: 14,
    padding: "28px 28px 24px",
    width: "100%",
    maxWidth: 580,
    maxHeight: "90vh",
    overflowY: "auto",
    boxSizing: "border-box",
    fontFamily: "'lexend', sans-serif",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: 700, margin: 0, color: "#fff" },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#555",
    fontSize: 16,
    cursor: "pointer",
  },
  label: {
    display: "block",
    fontSize: 11,
    color: "#666",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: 8,
    color: "#fff",
    fontSize: 14,
    padding: "9px 12px",
    marginBottom: 12,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "'lexend', sans-serif",
  },
  iconGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 8,
  },
  iconOption: {
    borderRadius: 8,
    padding: 10,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  colorGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 8,
  },
  colorSwatch: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
  },
  removeBtn: {
    background: "none",
    border: "1px solid #2a2a2a",
    color: "#555",
    borderRadius: 6,
    width: 32,
    height: 36,
    cursor: "pointer",
    fontSize: 12,
    flexShrink: 0,
  },
  error: { color: "#ef4444", fontSize: 13, margin: "8px 0 0" },
  modalActions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    gap: 10,
    flexWrap: "wrap",
  },
  saveBtn: {
    backgroundColor: "#DFFF00",
    color: "#000",
    border: "none",
    borderRadius: 8,
    padding: "10px 24px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'lexend', sans-serif",
  },
  cancelBtn: {
    backgroundColor: "transparent",
    color: "#888",
    border: "1px solid #2a2a2a",
    borderRadius: 8,
    padding: "10px 18px",
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "'lexend', sans-serif",
  },
  secondaryBtn: {
    backgroundColor: "transparent",
    color: "#ADAAAA",
    border: "1px solid #2a2a2a",
    borderRadius: 8,
    padding: "10px 18px",
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "'lexend', sans-serif",
  },
};

export default LogWorkoutPlan;
