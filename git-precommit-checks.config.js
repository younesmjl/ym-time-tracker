module.exports = {
  display: {
    // Utilise les notifs système pour nous signler qu’un
    // problème est détecté.
    notifications: true,
    // Affiche les chemins des fichiers et numéros de lignes
    // ainsi que les contenus défaillants. Pratique pour ouvrir
    // via un "Ctrl + clic" le fichier au bon emplacement
    // directement dans l'éditeur.
    offendingContent: true,
    // Si jamais on souhaite obtenir l’affiche dans le
    // terminal du détail des règles en place.
    rulesSummary: false,
    // Si on veut afficher des statistiques simplifiées
    // (exemple : "1 error, 1 warning").
    shortStats: true,
    // Pour afficher le détail de chaque action executée,
    // les fichiers analysés, le résumé des opérations.
    verbose: false,
  },
  rules: [
    // Règles globales, appliquées sur tous les contenus ajoutés
    {
      message: "Tu as des marqueurs de conflits qui traînent",
      regex: /^[<>|=]{4,}/m,
    },
    // Ensuite on peut spécifier des fichiers ou motifs particuliers
    // pour appliquer nos règles, ça se fait avec la propriété "filter".
    {
      // Là encore on peut utiliser une expression rationnelle
      filter: /\.vue$/,
      message: '🤔 Hum ! N’as-tu pas oublié de retirer du "console.log(…)" ?',
      regex: /^\s*console\.log/,
    },
  ],
};
