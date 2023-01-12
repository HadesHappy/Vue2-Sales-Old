<template>
  <b-col lg="4" offset-lg="0" offset-md="1">
    <b-row class="timeline-main-container">
      <TimelineButton
        v-if="!isLoading"
        :key="index"
        v-for="(timelineDisplayStep, index) in timelineDisplaySteps"
        :name="timelineDisplayStep"
        :step="index + 1"
        :isLast="index === timelineDisplaySteps.length - 1"
      />
    </b-row>
  </b-col>
</template>

<script lang="ts" setup>
import TimelineButton from "./TimelineButton.vue";
import { useStore } from "vuex";
import { onMounted, ref, computed } from "vue";

const store = useStore();

const timelineDisplaySteps = ref(["Commercial", "Assistante", "Planification"]);
const isLoading = ref(true);

const currentPartner = computed(() => store.state.account.currentPartner);
const salesforceUser = computed(() => store.state.account.salesforceUser);
const status = computed(() => store.state.globalStore.status);
const salesforce = computed(() => store.state.globalStore.salesforce);

onMounted(() => {
  if (4 > timelineDisplaySteps.value.length) {
    if (
      salesforceUser.value &&
      salesforceUser.value.Fonction_hi_rarchique__c &&
      ("Chargé E-commerce" === salesforceUser.value.Fonction_hi_rarchique__c ||
        "Coach E-commerce" === salesforceUser.value.Fonction_hi_rarchique__c)
    ) {
      timelineDisplaySteps.value.push("E-commerce");
    } else {
      timelineDisplaySteps.value.push("CPW");
    }
  }

  const timeout = setInterval(() => {
    if (
      !status.value.isPageLoading &&
      currentPartner &&
      undefined !== currentPartner.value?.hasPartnerFolder &&
      null !== currentPartner.value?.hasPartnerFolder &&
      salesforce &&
      salesforce.value.opportunity &&
      salesforce.value.opportunity.Id
    ) {
      clearInterval(timeout);
      isLoading.value = false;
    }
  }, 50);
});
</script>
