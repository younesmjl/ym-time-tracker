<template>
  <el-select v-model="sortBy" placeholder="Select">
    <el-option label="La plus rescente d'abord" :value="defaultSortBy">
    </el-option>
    <el-option label="La plus ancienne d'abord" value="ascending"> </el-option>
  </el-select>
  <el-table
    v-loading="areTaskLoading"
    :data="tasks"
    :row-class-name="checkHighlight"
    row-key="id"
    @rowClick="setHighlightLine"
    empty-text="Aucune tâche"
    style="width: 100%"
    ref="table"
  >
    <el-table-column
      prop="name"
      sort-by="startTime"
      label="Tâche"
      width="300"
    />

    <el-table-column align="right" prop="dayDate" label="Durée" width="100">
      <template #header></template>
    </el-table-column>

    <el-table-column align="right" label="Début et fin" width="250">
      <template #default="scope">
        {{ formatTimestamp(scope.row.startTime) }}-
        {{ formatTimestamp(scope.row.endTime) }}
      </template>
    </el-table-column>

    <el-table-column align="right" prop="durations" label="Durée" width="100">
      <template #header></template>
    </el-table-column>

    <el-table-column align="right" label="Actions" width="250">
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
      defaultSortBy: "descending",
      sortBy:
        this.$route.query.sortBy === "ascending" ? "ascending" : "descending",
    };
  },
  watch: {
    sortBy(newValue) {
      this.$router.push({
        query: {
          sortBy: newValue === this.defaultSortBy ? undefined : newValue,
        },
      });
      this.sortByName();
    },
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
      this.$refs.table.sort("name", this.sortBy);
    },
    checkHighlight({ row }) {
      //On ajoute la classe highlight-line si on retrouve l'ID d'une tâche au seins d'une route dynamique / :row-class-name
      if (this.$route.params.taskID && row.id == this.$route.params.taskID) {
        return "highlight-line";
      } else {
        return "";
      }
    },
    setHighlightLine(row) {
      //On ajoute l'id de la tâche à l'url au moment du click sur celle-ci / @rowClick
      this.$router.push({ path: "/home/" + row.id });
    },
  },
  mounted() {
    this.sortByName();
  },
};
</script>
<style scoped>
.el-select {
  float: right;
}
</style>