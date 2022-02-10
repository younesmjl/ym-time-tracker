<template>
  <div>
    <h1>Inscription</h1>
    <el-row>
      <el-col :span="12" :offset="6">
        <form action="/" method="get" @submit.prevent="sendForm">
          <fieldset>
            <legend>Informations de connexion</legend>

            <label for="email">Adresse email</label>
            <el-input
              v-model="email"
              id="email"
              placeholder="hello@vuetracker.fr"
              type="email"
              aria-describedby="emailError"
              :aria-invalid="v$.email.$invalid"
            ></el-input>
            <el-alert
              id="emailError"
              v-if="v$.email.$error"
              :title="v$.email.$error ? v$.email.$errors[0].$message : ''"
              type="error"
              :closable="false"
            ></el-alert>

            <label for="password">Mot de passe</label>
            <el-input
              v-model="password"
              id="password"
              type="password"
              aria-describedby="passwordError"
              :aria-invalid="v$.password.$invalid"
            ></el-input>
            <el-alert
              id="passwordError"
              v-if="v$.password.$error"
              :title="v$.password.$error ? v$.password.$errors[0].$message : ''"
              type="error"
              :closable="false"
            ></el-alert>

            <label for="passwordConfirm">Confirmation du mot de passe</label>
            <el-input
              v-model="passwordConfirm"
              id="passwordConfirm"
              type="password"
              aria-describedby="passwordConfirmError"
              :aria-invalid="v$.passwordConfirm.$invalid"
            ></el-input>
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

            <el-checkbox
              v-model="termsOfUse"
              aria-describedby="checkBoxError"
              :aria-invalid="v$.termsOfUse.$invalid"
            >
              Conditions d'utilisation
            </el-checkbox>
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
            <el-button :loading="loading" type="primary" native-type="submit"
              >Confirmer</el-button
            >
          </div>
        </form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { reactive, toRef, toRefs } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength, sameAs } from "@vuelidate/validators";

export default {
  setup() {
    const state = reactive({
      email: "",
      password: "",
      passwordConfirm: "",
      termsOfUse: false,
      loading: false,
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
        sameAsPassword: sameAs(toRef(state, "password")),
      },
      termsOfUse: { required, sameAsTrue: sameAs(true) },
    };

    const v$ = useVuelidate(rules, state, { $autoDirty: true });

    const sendForm = () => {
      v$.value.$touch();
      if (!v$.value.$error) {
        state.loading = true;
        setTimeout(() => {
          state.loading = false;
        }, 1000);
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
.el-input,
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
