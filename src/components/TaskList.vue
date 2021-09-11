<template>
  <el-table
    v-loading="areTaskLoading"
    :data="tasks"
    row-key="id"
    empty-text="Aucune tâche"
    stripe
    style="width: 100%"
  >
    <el-table-column prop="name" label="Tâche" width="250"> </el-table-column>

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
  emits: ["removeTask", "restartTask"],
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
  },
};
</script>