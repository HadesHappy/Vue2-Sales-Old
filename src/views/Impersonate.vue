<template>
  <b-container>
    <b-row>
      <b-col> Impersonating... </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

const store = useStore();
const route = useRoute();

const identity = computed(() => store.state.account.identity);
const impersonateLogin = (user: any) =>
  store.dispatch("account/impersonateLogin", user);

onMounted(() => {
  impersonateLogin({
    userId: identity.value.id,
    username: route.params.email,
  }).then(
    () => {
      window.location.replace("/#/accueil");
    },
    (error) => {
      console.log(error);
    }
  );
});
</script>
