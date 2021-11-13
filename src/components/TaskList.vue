<template>
  <el-select v-model="sortBy" placeholder="Select">
    <el-option label="La plus rescente d'abord" :value="defaultSortBy">
    </el-option>
    <el-option label="La plus ancienne d'abord" value="ascending"> </el-option>
  </el-select>
  <div v-for="(dayTasks, dayTS) in tasksByDay" :key="dayTS">
    <h3>{{ fullDateFormatter.format(dayTS) }}</h3>
    <el-table
      v-loading="areTaskLoading"
      :data="dayTasks"
      :row-class-name="checkHighlight"
      row-key="id"
      @rowClick="setHighlightLine"
      empty-text="Aucune tâche"
      style="width: 100%"
      :ref="dayTS"
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
          {{ formatTimestamp(scope.row.startTime) }} -
          {{ formatTimestamp(scope.row.endTime) }}
        </template>
      </el-table-column>

      <el-table-column align="right" label="Durée" width="100">
        <template #default="scope">{{
          durationBetweenTimestamps(scope.row.startTime, scope.row.endTime)
        }}</template>
      </el-table-column>

      <el-table-column align="right" label="Actions" width="450">
        <template #header></template>
        <template #default="scope">
          <TaskListAction
            :taskID="scope.row.id"
            :taskName="scope.row.name"
          ></TaskListAction>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import TaskListAction from "./TaskListAction.vue";
export default {
  components: {
    TaskListAction,
  },
  computed: {
    ...mapState({
      areTaskLoading: (state) => state.tasks.areTaskLoading,
    }),
    ...mapGetters({ tasksByDay: "tasks/tasksByDay" }),
  },
  data() {
    return {
      formatter: Intl.DateTimeFormat("fr", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      fullDateFormatter: Intl.DateTimeFormat("fr", { dateStyle: "full" }),
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
    tasksByDay: {
      /*
      Pour la modif d'un array ou d'un objet, on a besoin l'option : "deep:true".
      L'objet watch regarde, si la propriété est réinitialiser.
      Dans notre cas, tasks n'est pas réinitialiser mais juste mis à jour via this.tasks.unshift() 
      */
      deep: true,
      handler() {
        this.$nextTick(() => {
          this.sortByName();
        });
      },
    },
  },
  methods: {
    formatTimestamp(ts) {
      return this.formatter.format(ts);
    },

    durationBetweenTimestamps(start, end) {
      //start et end sont au format timestamp, le formation timestamp est en milliseconds
      //Math.floor permet de convertir les variables en entier pour éviter d'avoir par exemple 5.6 secondes et plutôt avoir 6 secondes

      //on divise donc par 1000 end et start pour les convertir en seconds
      let seconds = Math.floor(end / 1000 - start / 1000);
      //on divise les secondes par 60 pour les convertir en minutes
      let minutes = Math.floor(seconds / 60);
      //on divise les minutes par 60 pour les convertir en heures
      const hours = Math.floor(minutes / 60);

      //On effectue un modulo de 60 sur les seconds pour améliorer l'affichage.
      /*Exemple: si la tâches à durée 144 secondes,on ne veut pas afficher 00:00:144, mais bien 00:02:24 */
      seconds = seconds % 60;
      //On effectue un modulo de 60 sur les minutes pour améliorer l'affichage.
      minutes = minutes % 60;

      //La fonction padStart ajoute un 0 sur la string est inférieur à 2 caractères
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`;
    },
    sortByName() {
      //gestion des paramètres dans les urls - Vue Router
      for (let dayTS in this.tasksByDay) {
        this.$refs[dayTS].sort("name", this.sortBy);
      }
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
h3 {
  text-align: left;
  text-transform: capitalize;
}
</style>