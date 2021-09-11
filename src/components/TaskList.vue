<template>
  <el-table
    v-loading="areTaskLoading"
    :data="tasks"
    row-key="id"
    empty-text="Aucune tâche"
    stripe
    style="width: 100%"
    ref="table"
  >
    <el-table-column
      prop="name"
      sort-by="startTime"
      label="Tâche"
      width="250"
    />

    <el-table-column align="right" prop="dayDate" label="Durée" width="100">
      <template #header></template>
    </el-table-column>

    <el-table-column align="right" label="Début et fin" width="150">
      <template #default="scope">
        {{ formatTimestamp(scope.row.startTime) }}-
        {{ formatTimestamp(scope.row.endTime) }}
      </template>
    </el-table-column>

    <el-table-column align="right" prop="durations" label="Durée" width="100">
      <template #header></template>
    </el-table-column>

    <el-table-column align="right" label="Actions" width="200">
      <template #header></template>
      <template #default="scope">
        <TaskListAction
          :taskID="scope.row.id"
          :taskName="scope.row.name"
          v-on="{
            delete: handleDelete,
            restart: handleRestart,
          }"
        ></TaskListAction>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import TaskListAction from "./TaskListAction.vue";
export default {
  emits: ["restartTask", "removeTask"],
  components: {
    TaskListAction,
  },
  props: {
    tasks: {
      type: Array,
      default: [],
    },
    areTaskLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formatter: Intl.DateTimeFormat("fr", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };
  },
  watch: {
    tasks: {
      /*
      Pour la modif d'un array ou d'un objet, on a besoin l'option : "deep:true".
      L'objet watch regarde, si la propriété est réinitialiser.
      Dans notre cas, tasks n'est pas réinitialiser mais juste mis à jour via this.tasks.unshift() 
      */
      deep: true,
      handler() {
        this.sortByName();
      },
    },
  },
  methods: {
    handleRestart(event) {
      this.$emit("restartTask", event);
    },
    handleDelete(event) {
      this.$emit("removeTask", event);
    },
    formatTimestamp(ts) {
      return this.formatter.format(ts);
    },
    sortByName() {
      //gestion des paramètres dans les urls - Vue Router
      const sortBy =
        this.$route.query.sortBy === "ascending" ? "ascending" : "descending";
      this.$refs.table.sort("name", sortBy);
    },
  },
  mounted() {
    this.sortByName();
  },
};
</script>