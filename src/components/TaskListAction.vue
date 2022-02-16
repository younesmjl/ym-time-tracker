<template>
  <TaskListActionButton @click="copyToClipboard(taskName)">
    <template v-slot:icon>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 mr-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    </template>
    <template v-slot:text>Copier</template>
  </TaskListActionButton>
  <TaskListActionButton @click="restartTask(taskID)" type="primary">
    <template v-slot:icon>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 mr-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </template>
    <template #text>Relancer</template>
  </TaskListActionButton>
  <TaskListActionButton @click="deleteTask(taskID)" type="danger">
    <template v-slot:icon>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 mr-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    </template>
    <template #text>Supprimer</template>
  </TaskListActionButton>
</template>

<script>
import TaskListActionButton from "./TaskListActionButton.vue";
import { mapActions } from "vuex";
export default {
  components: {
    TaskListActionButton,
  },
  props: {
    taskID: {
      type: String,
      required: true,
    },
    taskName: {
      type: String,
      required: true,
    },
  },
  methods: {
    ...mapActions({
      deleteTask: "tasks/deleteTask",
      restartTask: "tasks/restartTask",
      sendSuccess: "notifications/sendSuccess",
    }),
    copyToClipboard(name) {
      navigator.clipboard.writeText(name);
      this.sendSuccess({
        title: "Succés",
        message: "Le nom de la tâche a été copiée",
        type: "success",
      });
    },
  },
};
</script>

<style></style>
