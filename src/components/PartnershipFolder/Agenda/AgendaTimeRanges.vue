<template>
  <b-container fluid>
    <b-row class="mt-3">
      <b-col sm="12" md="2" class="p-0">
        <label class="label row-display-times"
          >Horaires de prise de RDV :</label
        >
      </b-col>
    </b-row>
    <TimeRanges
      parentEntityName="agenda"
      :parentEntity="currentPartnerFolder.agenda"
      :timeRanges="currentPartnerFolder.agenda.appointmentTimeRanges"
      :allowedToEdit="allowedToEdit"
      customClassName="justify-content-center"
    />
  </b-container>
</template>

<script lang="ts" setup>
import { useStore } from "vuex";
import TimeRanges from "@/components/PartnershipFolder/TimeRanges.vue";
import {useDP} from "@/mixins/useDP";
import { computed } from "vue";

const store = useStore();
const { allowedToEdit } = useDP();

const identity = computed(() => store.state.account.identity);
const currentPartnerFolder = computed(
  () => store.state.account.currentPartnerFolder
);
</script>
