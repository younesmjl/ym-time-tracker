<template>
  <div class="flex-form-container">
    <div class="container-form w-full lg:w-2/3">
      <form action="/" method="get" @submit.prevent="sendForm">
        <h1>Inscription</h1>
        <fieldset>
          <legend>Informations de connexion</legend>

          <BaseInput
            label="Adresse email"
            v-model="email"
            id="email"
            placeholder="test@email.fr"
            type="email"
            aria-describedby="emailError"
            :aria-invalid="v$.email.$invalid"
          ></BaseInput>
          <el-alert
            id="emailError"
            v-if="v$.email.$error"
            :title="v$.email.$error ? v$.email.$errors[0].$message : ''"
            type="error"
            :closable="false"
          ></el-alert>

          <BaseInput
            label="Mot de passe"
            v-model="password"
            id="password"
            type="password"
            aria-describedby="passwordError"
            :aria-invalid="v$.password.$invalid"
          ></BaseInput>
          <el-alert
            id="passwordError"
            v-if="v$.password.$error"
            :title="v$.password.$error ? v$.password.$errors[0].$message : ''"
            type="error"
            :closable="false"
          ></el-alert>

          <BaseInput
            label="Confirmation du mot de passe"
            v-model="passwordConfirm"
            id="passwordConfirm"
            type="password"
            aria-describedby="passwordConfirmError"
            :aria-invalid="v$.passwordConfirm.$invalid"
          ></BaseInput>
          <el-alert
            id="passwordConfirmError"
            v-if="v$.passwordConfirm.$error"
            :title="
              v$.passwordConfirm.$error
                ? v$.passwordConfirm.$errors[0].$message
                : ''
            "
            type="error"
            :closable="false"
          ></el-alert>
        </fieldset>

        <fieldset>
          <legend>Finalisation de l'inscription</legend>
          <BaseCheckbox
            v-model="termsOfUse"
            aria-describedby="checkBoxError"
            :aria-invalid="v$.termsOfUse.$invalid"
          >
            Conditions d'utilisation
          </BaseCheckbox>
          <el-alert
            id="checkBoxError"
            v-if="v$.termsOfUse.$error"
            :title="
              v$.termsOfUse.$error ? v$.termsOfUse.$errors[0].$message : ''
            "
            type="error"
            :closable="false"
          ></el-alert>
        </fieldset>

        <div>
          <el-button
            :loading="loading"
            type="primary"
            native-type="submit"
            aria-describedby="submitError"
            >Confirmer</el-button
          >
          <el-alert
            id="submitError"
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
import { reactive, toRef, toRefs } from "vue";
import { useVuelidate } from "@vuelidate/core";
import BaseInput from "../components/BaseInput.vue";
import BaseCheckbox from "../components/BaseCheckbox.vue";
import {
  required,
  email,
  minLength,
  sameAsPassword,
  sameAsTrue,
} from "../utils/validators.js";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  components: { BaseInput, BaseCheckbox },
  setup() {
    const router = useRouter();
    const store = useStore();

    const state = reactive({
      email: "",
      password: "",
      passwordConfirm: "",
      termsOfUse: false,
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
        minLength: minLength(8),
      },
      passwordConfirm: {
        required,
        sameAsPassword: sameAsPassword(toRef(state, "password")),
      },
      termsOfUse: { required, sameAsTrue },
    };

    const v$ = useVuelidate(rules, state, { $autoDirty: true });

    const sendForm = async () => {
      v$.value.$touch();
      if (!v$.value.$error) {
        state.loading = true;
        //On met simplement un virgule au niveau de l'array pour ne pas définir de variable non utilisé et  consommer de la mémoire inutilement
        const res = await store.dispatch("users/register", {
          email: state.email,
          password: state.password,
        });
        if (res === true) {
          router.push("/settings/app");
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
form {
  padding: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  border-radius: 4px;
  text-align: left;
}
fieldset {
  border: none;
}
legend {
  display: none;
}
.BaseInput,
.el-alert {
  display: block;
  max-width: 75%;
  margin: 10px 0;
}
.el-checkbox {
  margin: 20px 0 0;
}
.el-button {
  margin-top: 25px;
}
</style>
