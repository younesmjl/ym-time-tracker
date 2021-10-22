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
import { mapActions } from "vuex";
import { updateAxiosInstance } from "../services/TaskService";
export default {
  data() {
    return {
      storageApiKey: "apiKey",
      storageBinID: "binID",
      apiKey: null,
      binID: null,
    };
  },
  methods: {
    //spread operator for mapActions
    ...mapActions({
      getAllTasks: "tasks/getAllTasks",
    }),
    async updateParameters(event, keyStorage) {
      //On ajoute
      if (this.apiKey.length > 0) {
        localStorage.setItem(keyStorage, event);
      } else {
        localStorage.removeItem(keyStorage);
      }
      //Tests de la connexion avec JSONBin.io
      updateAxiosInstance();
      try {
        await this.getAllTasks();
        localStorage.setItem("successGetTaks", true);
        this.$notify({
          title: "Succès",
          message: "Vos clés sont enregistrés dans ce navigateur",
          type: "success",
          offset: 60,
        });
      } catch (error) {
        localStorage.removeItem("successGetTaks");
        this.$notify.error({
          title: "Erreur",
          message: "Votre clé API ou l'ID de votre BIN est faux ou manquant",
          type: "danger",
          offset: 60,
        });
      }
    },
  },
  mounted() {
    this.apiKey = localStorage.getItem(this.storageApiKey);
    this.binID = localStorage.getItem(this.storageBinID);
  },
};
</script>

<style lang="stylus" scoped></style>