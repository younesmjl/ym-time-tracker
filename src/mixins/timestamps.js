export default {
  data() {
    return {
      formatter: Intl.DateTimeFormat("fr", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      fullDateFormatter: Intl.DateTimeFormat("fr", { dateStyle: "full" }),
    };
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
  },
};
