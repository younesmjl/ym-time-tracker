<template>
  <h2>Application</h2>
  <div style="max-width: 600px; margin: 0 auto; text-align: left">
    <p>Clé de votre API JSONbin.io :</p>
    <el-input
      @change="updateParameters($event, storageApiKey)"
      placeholder="Entrez votre clé API"
      v-model="apiKey"
    ></el-input>
    <p>ID de votre bin :</p>
    <el-input
      @change="updateParameters($event, storageBinID)"
      placeholder="Entrez quelque chose"
      v-model="binID"
    ></el-input>
  </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { updateAxiosInstance } from "../services/TaskService";
export default {
  setup() {
    const store = useStore();
    let storageApiKey = "apiKey";
    let storageBinID = "binID";
    let apiKey = ref(localStorage.getItem(storageApiKey) || "");
    let binID = ref(localStorage.getItem(storageBinID) || "");

    let updateParameters = async function (event, keyStorage) {
      //On ajoute
      if (apiKey.value.length > 0) {
        localStorage.setItem(keyStorage, event);
      } else {
        localStorage.removeItem(keyStorage);
      }
      //Tests de la connexion avec JSONBin.io
      updateAxiosInstance();
      try {
        await store.dispatch("tasks/getAllTasks");
        localStorage.setItem("successGetTasks", true);
        store.dispatch("notifications/sendSuccess", {
          title: "Succès",
          message: "Vos clés sont enregistrés dans ce navigateur",
        });
      } catch (error) {
        localStorage.removeItem("successGetTasks");
        store.dispatch("notifications/sendError", {
          title: "Erreur",
          message: "Votre clé API ou l'ID de votre BIN est faux ou manquant",
        });
      }
    };

    return {
      storageApiKey,
      storageBinID,
      apiKey,
      binID,
      updateParameters,
    };
  },
};
</script>
