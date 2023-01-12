<template>
  <b-col
    offset-lg="0"
    lg="4"
    offset-md="1"
    class="text-center margin-drop-button"
    id="drop-button-link"
  >
    <router-link :to="`/espace-partage/${customerCode || ''}`">
      <b-col class="button-drop-element">
        <span
          >Déposez dès maintenant <br />
          vos fichiers pour la création de votre site <br />
          <strong>CLIQUEZ ICI</strong>
        </span>
      </b-col>
    </router-link>
  </b-col>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { useStore } from "vuex";
const store = useStore();

const currentPartner = computed(() => store.state.account.currentPartner);
const customerCode = computed(() => {
  return currentPartner.value ? currentPartner.value.customerCode : null;
});
</script>
