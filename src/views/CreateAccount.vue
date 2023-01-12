<template>
  <div id="authentification">
    <b-row class="title-bar">
      <b-col lg="6" md="6" sm="6">
        <img class="image-log" src="@/assets/logo-local-et-moi.jpg" />
      </b-col>
      <b-col class="title-right title-bar-words" lg="6" md="6" sm="6">
        Mon espace Partenaire
      </b-col>
    </b-row>
    <b-container fluid class="bv-example-row">
      <b-row>
        <notifications
          group="connexion-failed"
          position="bottom right"
          class="notification-container"
        />
        <notifications
          group="mail-sent"
          position="bottom right"
          class="notification-container"
        />
        <b-col offset="2" lg="8" md="12" sm="12" @keyup.enter="checkPassword()">
          <div v-if="timestampOver" class="ticket-form">
            Votre lien de réinitialisation de mot de passe a expiré.
          </div>
          <div v-if="!timestampOver" class="ticket-form">
            <h2 class="center">Définir un mot de passe</h2>
            <br />
            <p :class="`info-pwd ${pwdErrorClass}`">
              Votre mot de passe doit contenir au moins
              <span :class="validPwdLengthClass">8 caractères</span> dont
              <span :class="validPwdMinClass">1 minuscule</span>,
              <span :class="validPwdMajClass">1 majuscule</span>,
              <span :class="validPwdNumericClass">des chiffres</span>,
              <span :class="validPwdAlphaClass">des lettres</span> et
              <span :class="validPwdSpecialClass"
                >1 caractère spécial de cette liste %, #, :, $, *</span
              >
            </p>
            <p>Saisissez votre mot de passe :</p>
            <div class="pwd-input">
              <b-form-input
                v-model="password"
                type="password"
                @keyup="onPasswordChange"
              ></b-form-input>
              <i :class="`fas fa-check ${validPwdCompleteClass}`"></i>
            </div>
            <p>Ressaisissez votre mot de passe :</p>
            <div class="pwd-input">
              <b-form-input
                v-model="passwordBis"
                type="password"
                @keyup="onPasswordBisChange"
              ></b-form-input
              ><br />
              <i :class="`fas fa-check ${validPwdBisClass}`"></i>
            </div>
            <b-col class="center">
              <button
                @click="checkPassword()"
                variant="success"
                class="submit-button"
              >
                Valider
              </button>
            </b-col>
            <b-col lg="12" md="12" sm="12" hidden>
              <label>
                <input
                  type="file"
                  id="files"
                  ref="files"
                  multiple
                  @change="handle_files_upload()"
                />
              </label>
            </b-col>
          </div>
        </b-col>
      </b-row>
    </b-container>
    <app-footer class="footer-auth"></app-footer>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from "vuex";
import { encryptorHelpers } from "@/helpers";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const store = useStore();
const route = useRoute();

const passwordBis = ref("");
const password = ref("");
const pwdErrorClass = ref("");
const token = ref(null);
const userId = ref(null);
const timestampOver = ref(false);
const validPwdLengthClass = ref("");
const validPwdMinClass = ref("");
const validPwdMajClass = ref("");
const validPwdNumericClass = ref("");
const validPwdAlphaClass = ref("");
const validPwdSpecialClass = ref("");
const validPwdCompleteClass = ref("");
const validPwdBisClass = ref("");

onMounted(() => {
  checkToken();
});

const changePassword = (value: any) =>
  store.dispatch("account/changePassword", value);
const checkToken = () => {
  if (!route.query.token) {
    window.location.href = "/#/authentification";
  } else {
    try {
      let token = encryptorHelpers.verifyToken(route.query.token);
      token = route.query.token;
      userId.value = token.sub;
    } catch (e) {
      console.error(e);
      if (e instanceof TokenExpiredException) {
        timestampOver.value = true;
      }
    }
  }
};
const checkPassword = () => {
  if (
    /[A-Z]/.test(password.value) &&
    /[a-z]/.test(password.value) &&
    /[0-9]/.test(password.value) &&
    password.value.length >= 8 &&
    /[%#:$*]/.test(password.value) &&
    password.value === passwordBis.value
  ) {
    pwdErrorClass.value = "";
    const data = {
      password: password.value.trim(),
    };

    changePassword({ userId: userId, data, token: token });
  } else {
    pwdErrorClass.value = "error-message";
  }
};
const onPasswordChange = () => {
  validPwdMinClass.value = /[a-z]/.test(password.value) ? "subpwd-valid" : "";
  validPwdMajClass.value = /[A-Z]/.test(password.value) ? "subpwd-valid" : "";
  validPwdAlphaClass.value = /[a-zA-Z]/.test(password.value)
    ? "subpwd-valid"
    : "";
  validPwdNumericClass.value = /[0-9]/.test(password.value)
    ? "subpwd-valid"
    : "";
  validPwdLengthClass.value = password.value.length >= 8 ? "subpwd-valid" : "";
  validPwdSpecialClass.value = /[%#:$*]/.test(password.value)
    ? "subpwd-valid"
    : "";
  validPwdCompleteClass.value =
    validPwdAlphaClass.value &&
    validPwdNumericClass &&
    validPwdLengthClass &&
    validPwdSpecialClass
      ? "pwd-valid"
      : "";
};
const onPasswordBisChange = () => {
  validPwdBisClass.value =
    password.value.length >= 8 &&
    password &&
    passwordBis &&
    password.value === passwordBis.value
      ? "pwd-valid"
      : "";
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/authentification.scss";
</style>
