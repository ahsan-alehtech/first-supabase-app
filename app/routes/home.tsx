import TaskManager from "components/TaskManager";
import { supabase } from "lib/supabaseClient";
import { useEffect, useState } from "react";

type Instrument = {
  id: string;
  name: string;
};

function Home() {
  const [instruments, setInstruments] = useState<Instrument[]>([]);

  useEffect(() => {
    getInstruments();
  }, []);

  async function getInstruments() {
    const response = await supabase.from<Instrument>("instruments").select();
    console.log("Fetching instruments...", response);
    // if (error) {
    //   console.error("Error fetching instruments:", error.message);
    // } else {
    //   setInstruments(data || []);
    // }
  }

  // ✅ Insert a new instrument
  async function handleInsert() {
    const { error } = await supabase.from("instruments").insert([{ name: "Guitar" }]);

    if (error) {
      console.error("Insert error:", error);
    } else {
      getInstruments(); // Refresh list
    }
  }

  // ✅ Update first instrument (example)
  async function handleUpdate() {
    if (instruments.length === 0) return;

    const firstInstrument = instruments[0];

    const { error } = await supabase
      .from("instruments")
      .update({ name: "Updated Name" })
      .eq("id", firstInstrument.id);

    if (error) {
      console.error("Update error:", error.message);
    } else {
      getInstruments(); // Refresh list
    }
  }

  // ✅ Delete last instrument (example)
  async function handleDelete() {
    if (instruments.length === 0) return;

    const lastInstrument = instruments[instruments.length - 1];

    const { error } = await supabase.from("instruments").delete().eq("id", lastInstrument.id);

    if (error) {
      console.error("Delete error:", error.message);
    } else {
      getInstruments(); // Refresh list
    }
  }

  return (
    <>
      {/* <div>
      <h2>Instruments List</h2>

      <ul>
        {instruments.map((instrument) => (
          <li key={instrument.id}>{instrument.name}</li>
        ))}
      </ul>

      <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
        <button
          onClick={handleInsert}
          style={{
            padding: "8px 16px",
            background: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}>
          Insert New
        </button>
        <button
          onClick={handleUpdate}
          style={{
            padding: "8px 16px",
            background: "#2196F3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}>
          Update First
        </button>
        <button
          onClick={handleDelete}
          style={{
            padding: "8px 16px",
            background: "#f44336",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}>
          Delete Last
        </button>
      </div>
    </div> */}
      <TaskManager />
    </>
  );
}

export default Home;
