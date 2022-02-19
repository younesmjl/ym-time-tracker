<template>
  <div class="flex-form-container flex-col">
    <div class="flex justify-content flex-col mt-6 mb-4">
      <h1 class="mb-2">Get started with YM Time Tracker</h1>
      <h4 class="mb-2">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit curabitur
        molestie.
      </h4>
      <span
        >Aliquet commodo nisi sagittis vel · Morbi congue sed magna varius
      </span>
    </div>
    <div class="container-form">
      <img
        class="flex-1 w-full h-40 object-cover md:h-full md:max-h-96 rounded-l-md"
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
    <span class="text-sm block mt-2 mb-6"
      >Pas de compte ?
      <a class="text-black hover:text-gray-400" href="/register">
        Créez un compte</a
      >
    </span>
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
