<template>
  <p>{{ errorMsg }}</p>
</template>

<script lang="ts" setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const errorMsg = ref("Redirection en cours ...");

onMounted(() => {
  token_check();
});

const token_check = () => {
  if (!route.query.token) {
    window.location.href = "/#/authentification";
  } else {
    const webtoolToken = decodeURIComponent(route.query.token);
    if (!webtoolToken) {
      window.location.href = "/#/authentification";
    } else {
      axios
        .get(
          import.meta.env.VUE_LOCALFR_API_BASE_URL +
            import.meta.env.LOCALFR_API_TOKEN_CHECK_AUTOLOGIN +
            "/" +
            webtoolToken,
          {
            headers: {
              "Content-type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then((response) => {
          const cookieKeys = $cookies.keys();
          for (const cookie in cookieKeys) {
            $cookies.remove(cookieKeys[cookie]);
          }
          sessionStorage.clear();
          localStorage.clear();
          localStorage.setItem("fromSF", "true");
          localStorage.setItem("source", response.data.source);
          sessionStorage.setItem("access_token", response.data.token);
          localStorage.setItem("sageCode", response.data.customer_codes[0]);
          localStorage.setItem("showTutorial", response.data.show_tutorial);
          localStorage.setItem("login", response.data.email);
          localStorage.setItem("customerEmail", response.data.customer_email);
          window.location.href = "/#/accueil";
        })
        .catch((error) => {
          errorMsg.value = "Le lien utilisé n'est pas valide";
          console.warn(error);
        });
    }
  }
};
</script>
