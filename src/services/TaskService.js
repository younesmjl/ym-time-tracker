import axios from "axios";

let instance = null;
updateAxiosInstance();

//Récupération de toutes les tâches
export async function readAllTasks() {
  const res = await instance.get("/latest");
  return res.data.record;
}

//Mise à jour des toutes les tâches
export async function updateAllTasks(newTask) {
  const res = await instance.put("/", newTask);
}

//Mise à jour de l'instance d'Axios
export async function updateAxiosInstance() {
  instance = axios.create({
    baseURL: "https://api.jsonbin.io/v3/b/" + localStorage.getItem("binID"),
    headers: { "X-Master-Key": localStorage.getItem("apiKey") },
  });
}
