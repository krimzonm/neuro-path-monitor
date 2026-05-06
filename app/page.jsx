'use client';
import React, { useState } from "react";

function calculateMRIDates(startDate) {
  const base = new Date(startDate);
  const addDays = (d) => {
    const newDate = new Date(base);
    newDate.setDate(newDate.getDate() + d);
    return newDate.toISOString().split("T")[0];
  };

  return {
    "Baseline MRI": startDate,
    "Pre-Infusion 5": addDays(28),
    "Pre-Infusion 7": addDays(42),
    "Pre-Infusion 14": addDays(98),
  };
}

export default function Home() {
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "Demo Patient A",
      startDate: "2026-04-01",
      stage: "Infusion Ongoing",
      risk: "High",
      mriSchedule: calculateMRIDates("2026-04-01"),
      completed: {}
    }
  ]);

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");

  const addPatient = () => {
    if (!name || !startDate) return;

    const newPatient = {
      id: Date.now(),
      name,
      startDate,
      stage: "Infusion Ongoing",
      risk: Math.random() > 0.5 ? "High" : "Low",
      mriSchedule: calculateMRIDates(startDate),
      completed: {}
    };

    setPatients([newPatient, ...patients]);
    setName("");
    setStartDate("");
  };

  const markComplete = (id, key) => {
    setPatients(patients.map(p => p.id === id ? {
      ...p,
      completed: { ...p.completed, [key]: true }
    } : p));
  };

  const isOverdue = (date) => new Date(date) < new Date();

  const overdueCount = patients.reduce((acc, p) => {
    return acc + Object.entries(p.mriSchedule).filter(([k, d]) => isOverdue(d) && !p.completed[k]).length;
  }, 0);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", fontFamily: "Arial" }}>
      <h1>NeuroPath Monitor</h1>
      <p>Leqembi Patient MRI & Journey Tracker</p>

      <div style={{ border: "1px solid #ddd", padding: 10, marginBottom: 20 }}>
        <strong>{overdueCount} MRI Tasks Overdue</strong>
      </div>

      <div style={{ border: "1px solid #ddd", padding: 10, marginBottom: 20 }}>
        <input placeholder="Patient Name" value={name} onChange={e => setName(e.target.value)} />
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <button onClick={addPatient}>Add Patient</button>
      </div>

      {patients.map(p => (
        <div key={p.id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
          <h3>{p.name}</h3>
          <p>Start: {p.startDate}</p>
          <p>Risk: {p.risk}</p>

          {Object.entries(p.mriSchedule).map(([k, d]) => {
            const overdue = isOverdue(d) && !p.completed[k];
            return (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span>{k} - {d} {overdue ? "(Overdue)" : ""}</span>
                <button onClick={() => markComplete(p.id, k)}>
                  {p.completed[k] ? "Done" : "Mark Done"}
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
