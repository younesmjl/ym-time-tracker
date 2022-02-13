<template>
  <h2>Utilisateurs</h2>
  <div v-if="$store.state.users.currentUser">
    <strong>Connecté</strong>: {{ $store.state.users.currentUser.email }}
  </div>
  <el-button type="danger" round @click="dialogVisible = true"
    >Déconnexion</el-button
  >

  <el-dialog
    v-model="dialogVisible"
    title="Confirmation de déconnexion"
    width="30%"
  >
    <span>Êtes-vous sûr de vouloir vous déconnecter</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Annuler</el-button>
        <el-button type="primary" @click="confirmLogout" :loading="loading"
          >Confirmer</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const dialogVisible = ref(false);
const loading = ref(false);

const store = useStore();
const router = useRouter();

const confirmLogout = async () => {
  loading.value = true;
  const res = await store.dispatch("users/logout");
  loading.value = false;
  if (res == true) {
    router.push("/login");
  } else {
    console.log("SettingsUser || res ", res);
    dialogVisible.value = false;
  }
};
</script>

<style scoped>
button {
  margin-top: 10px;
}
</style>
