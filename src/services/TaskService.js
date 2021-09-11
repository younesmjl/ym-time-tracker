import axios from "axios";

const JSON_BIN_SECRET = import.meta.env.VITE_JSON_BIN_SECRET;

const instance = axios.create({
  baseURL: "https://api.jsonbin.io/v3/b/613bec50aa02be1d44460382",
  headers: { "X-Master-Key": JSON_BIN_SECRET },
});

//Récupération de toutes les tâches
export async function readAllTasks() {
  const res = await instance.get("/latest");
  return res.data.record;
}

//Mise à jour des toutes les tâches
export async function updateAllTasks(newTask) {
  const res = await instance.put("/", newTask);
}
