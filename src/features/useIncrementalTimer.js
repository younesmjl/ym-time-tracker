import { reactive, toRefs } from "vue";

export const useIncrementalTimer = () => {
  const state = reactive({
    nowTime: null,
    intervalEverySecond: null,
  });

  const startTimer = () => {
    /*
      Lorsque l'on utilise une arrow function le this n'est pas rédéfinie pour la fonction 
      De ce fait on peut directiment utilisé this
      */
    state.nowTime = Date.now();
    state.intervalEverySecond = setInterval(() => {
      state.nowTime = Date.now();
    }, 1000);
  };

  const stopTimer = () => {
    state.nowTime = null;
    clearInterval(state.intervalEverySecond);
  };

  return {
    ...toRefs(state),
    startTimer,
    stopTimer,
  };
};
