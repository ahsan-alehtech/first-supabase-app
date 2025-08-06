import { type ChangeEvent, useEffect, useState } from "react";
import { supabase } from "lib/supabaseClient";

interface Task {
  id: number;
  title: string;
  description: string;
  created_at: string;
  image_url: string;
}

function TaskManager() {
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newDescription, setNewDescription] = useState("");

  const [taskImage, setTaskImage] = useState<File | null>(null);

  const fetchTasks = async () => {
    const { error, data } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: true });
    console.log("data", data);
    if (error) {
      console.error("Error reading task: ", error.message);
      return;
    }

    setTasks(data);
  };

  const deleteTask = async (id: number) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      console.error("Error deleting task: ", error.message);
      return;
    }
  };

  const updateTask = async (id: number) => {
    const { error } = await supabase
      .from("tasks")
      .update({ description: newDescription })
      .eq("id", id);

    if (error) {
      console.error("Error updating task: ", error.message);
      return;
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // console.log("Submitting new task: ", newTask);
    // return;
    const response = await supabase.from("tasks").insert(newTask);
    console.log({ response });
    if (response.status !== 201) {
      console.error("Error adding task: ", response.error?.message);
      return;
    }
    setNewTask({ title: "", description: "" });

    // if (error) {
    //   console.error("Error adding task: ", error.message);
    //   return;
    // }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // useEffect(() => {
  //   const channel = supabase.channel("tasks-channel");
  //   channel
  //     .on("postgres_changes", { event: "INSERT", schema: "public", table: "tasks" }, (payload) => {
  //       const newTask = payload.new as Task;
  //       setTasks((prev) => [...prev, newTask]);
  //     })
  //     .subscribe((status) => {
  //       console.log("Subscription: ", status);
  //     });
  // }, []);

  console.log({ tasks });

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Task Manager CRUD</h2>

      {/* Form to add a new task */}
      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
          className="w-full mb-2 p-2 border border-gray-300 rounded"
        />
        <textarea
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) => setNewTask((prev) => ({ ...prev, description: e.target.value }))}
          className="w-full mb-2 p-2 border border-gray-300 rounded"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Add Task
        </button>
      </form>

      {/* List of Tasks */}
      <ul className="list-none p-0">
        {tasks.map((task, key) => (
          <li key={key} className="border border-gray-300 rounded p-4 mb-2">
            <div>
              <h3 className="text-lg font-semibold">{task.title}</h3>
              <p className="mb-2">{task.description}</p>
              {task.image_url && (
                <img src={task.image_url} className="h-20 mb-2 object-cover rounded" />
              )}
              <div>
                <textarea
                  placeholder="Updated description..."
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full mb-2 p-2 border border-gray-300 rounded"
                />
                <button
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2"
                  onClick={() => updateTask(task.id)}>
                  Edit
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={() => deleteTask(task.id)}>
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskManager;
