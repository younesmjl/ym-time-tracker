<template>
  <div class="flex-form-container">
    <div class="container-form">
      <img
        class="flex-1 w-full h-40 object-cover md:h-full md:max-h-96"
        src="../assets/images/background-login.jpg"
        alt=""
      />
      <form action="/" method="get" @submit.prevent="sendForm">
        <h1>
          <span class="text-1xl">Connexion</span>
        </h1>
        <BaseInput
          label="Adresse email"
          v-model="email"
          placeholder="hello@vuetracker.fr"
          type="email"
          id="email"
          aria-describedby="emailError"
          :aria-invalid="v$.email.$invalid"
        />
        <el-alert
          v-if="v$.email.$error"
          :title="v$.email.$error ? v$.email.$errors[0].$message : ''"
          type="error"
          :closable="false"
          id="emailError"
        ></el-alert>

        <BaseInput
          label="Mot de passe"
          v-model="password"
          type="password"
          id="password"
          aria-describedby="passwordError"
          :aria-invalid="v$.password.$invalid"
        />
        <el-alert
          v-if="v$.password.$error"
          :title="v$.password.$error ? v$.password.$errors[0].$message : ''"
          type="error"
          :closable="false"
          id="passwordError"
        ></el-alert>

        <div>
          <el-button
            class="mt-4"
            type="primary"
            native-type="submit"
            :loading="loading"
            @click.prevent="sendForm"
            >Confirmer</el-button
          >
          <el-alert
            v-if="apiError"
            :title="apiError"
            type="error"
            :closable="false"
          ></el-alert>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength } from "../utils/validators.js";
import BaseInput from "../components/BaseInput.vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
export default {
  components: {
    BaseInput,
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    const state = reactive({
      email: "",
      password: "",
      loading: false,
      apiError: null,
    });

    const rules = {
      email: {
        required,
        email,
      },
      password: {
        required,
        minLength: minLength(6),
      },
    };

    const v$ = useVuelidate(rules, state, { $autoDirty: true });
    const sendForm = async () => {
      v$.value.$touch();
      if (!v$.value.$error) {
        state.loading = true;
        const res = await store.dispatch("users/login", {
          email: state.email,
          password: state.password,
        });
        if (res === true) {
          router.push("/");
        } else {
          state.apiError = res;
        }
        state.loading = false;
      }
    };
    return {
      ...toRefs(state),
      v$,
      sendForm,
    };
  },
};
</script>

<style lang="scss" scoped>
fieldset {
  border: none;
}
legend {
  display: none;
}
.el-alert {
  display: block;
  @apply bg-white pl-0 pt-1;
}
</style>
