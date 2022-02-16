<template>
  <el-select v-model="sortBy" placeholder="Select">
    <el-option label="La plus rescente d'abord" :value="defaultSortBy">
    </el-option>
    <el-option label="La plus ancienne d'abord" value="ascending"> </el-option>
  </el-select>

  <div
    class="border border-gray-300 m-4 shadow"
    v-for="(dayTasks, dayTS) in tasksByDay"
    :key="dayTS"
  >
    <div
      class="bg-gray-200 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 bg-gray-200 items-center"
    >
      <h3
        class="capitalize text-center md:text-left lg:text-left font-bold text-lg"
      >
        {{ fullDateFormatter.format(dayTS) }}
      </h3>
      <div class="hidden md:block lg: block font-bold text-lg">
        Début et Fin
      </div>
      <div class="hidden md:block lg: block font-bold text-lg">Durée</div>
    </div>

    <div
      v-for="(dayTask, id) in dayTasks"
      :key="id"
      class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 bg-white items-center border-b border-gray-200"
    >
      <div class="text-center sm:text-xl lg:text-lg lg:text-left">
        <span class="font-bold md:hidden lg:hidden">Tâche: </span>

        {{ dayTask.name }}
      </div>
      <div>
        <span class="font-bold md:hidden lg:hidden">Début et Fin: </span>
        {{ formatTimestamp(dayTask.startTime) }} -
        {{ formatTimestamp(dayTask.endTime) }}
      </div>
      <div>
        <span class="font-bold md:hidden lg:hidden">Durée: </span>
        {{ durationBetweenTimestamps(dayTask.startTime, dayTask.endTime) }}
      </div>
      <div
        class="flex items-center justify-center flex-wrap md:col-span-3 lg:col-span-2 lg:justify-end lg:flex-nowrap sm:gap-2"
      >
        <TaskListAction
          :taskID="dayTask.id"
          :taskName="dayTask.name"
        ></TaskListAction>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import TaskListAction from "./TaskListAction.vue";
import { useTimestamps } from "../features/useTimestamps";

export default {
  components: {
    TaskListAction,
  },
  setup() {
    const { durationBetweenTimestamps, formatTimestamp, fullDateFormatter } =
      useTimestamps();
    return {
      durationBetweenTimestamps,
      formatTimestamp,
      fullDateFormatter,
    };
  },
  computed: {
    ...mapState({
      areTaskLoading: (state) => state.tasks.areTaskLoading,
    }),
    ...mapGetters({ tasksByDay: "tasks/tasksByDay" }),
  },
  data() {
    return {
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
      //this.sortByName();
    },
    tasksByDay: {
      /*
      Pour la modif d'un array ou d'un objet, on a besoin l'option : "deep:true".
      L'objet watch regarde, si la propriété est réinitialiser.
      Dans notre cas, tasks n'est pas réinitialiser mais juste mis à jour via this.tasks.unshift() 
      */
      deep: true,
      handler() {
        this.$nextTick(() => {
          //this.sortByName();
        });
      },
    },
  },
  methods: {
    /*sortByName() {
      //gestion des paramètres dans les urls - Vue Router
      for (let dayTS in this.tasksByDay) {
        this.$refs[dayTS].sort("name", this.sortBy);
      }
    },*/
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
    //this.sortByName();
  },
};
</script>
<style scoped></style>
