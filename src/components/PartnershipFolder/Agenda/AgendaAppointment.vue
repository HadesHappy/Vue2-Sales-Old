<template>
  <b-container fluid>
    <b-row class="mt-3 my-3">
      <b-col lg="6" md="8" sm="4">
        <span class="mr-3"
          >Les RDV pris ont-ils besoin d’être validés pour être confirmés ? (par
          défaut ils sont validés par le manager)</span
        >
      </b-col>
      <b-col lg="1" md="2" sm="6">
        <ValidationProvider
          name="Validation rdv"
          :rules="{ required: false }"
          ref="currentPartnerFolder.agenda.shouldBeConfirmed"
          v-slot="{ classes, errors }"
        >
          <b-form-radio
            @change="
              onBlur($event, {
                agenda: currentPartnerFolder.agenda,
                type: 'bool',
              })
            "
            type="radio"
            name="currentPartnerFolder.agenda.shouldBeConfirmed"
            v-model="currentPartnerFolder.agenda.shouldBeConfirmed"
            :value="true"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
          >
            Oui
          </b-form-radio>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
      <b-col lg="1" md="2" sm="6">
        <ValidationProvider
          name="Validation rdv"
          :rules="{ required: false }"
          ref="currentPartnerFolder.agenda.shouldBeConfirmed"
          v-slot="{ classes, errors }"
        >
          <b-form-radio
            @change="
              onBlur($event, {
                agenda: currentPartnerFolder.agenda,
                type: 'bool',
              })
            "
            type="radio"
            name="currentPartnerFolder.agenda.shouldBeConfirmed"
            v-model="currentPartnerFolder.agenda.shouldBeConfirmed"
            :value="false"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
          >
            Non
          </b-form-radio>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col sm="12" md="4">
        <label>Combien de temps à l'avance le RDV peut-il être pris ? </label>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <DurationField
        field-label="Maximum"
        entity-name="agenda"
        duration-value-field="appointmentDelay"
        duration-unit-field="appointmentType"
        v-bind:entity="currentPartnerFolder.agenda"
        v-bind:required="false"
        :allowedToEdit="allowedToEdit"
      />
    </b-row>
  </b-container>
</template>

<script lang="ts" setup>
import {useDP} from "@/mixins/useDP";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import DurationField from "../DurationField.vue";

const store = useStore();
const { allowedToEdit } = useDP();

const identity = computed(() => store.state.account.identity);
const currentPartnerFolder = computed(
  () => store.state.account.currentPartnerFolder
);

const updatePartnerPropertyFromForm = (data: any) =>
  store.dispatch("account/updatePartnerPropertyFromForm", data);

const previousEditedValue = ref(null);

const onFocus = (event: { target: { value: null } }) => {
  previousEditedValue.value = event.target.value;
};
const onBlur = (event: { target: { name: string | number } }, data: null) => {
  const provider = event ? ref[event.target.name] : null;
  updatePartnerPropertyFromForm({
    event: event,
    provider: provider,
    data: data ? (previousEditedValue.value = data) : undefined,
  });
};
</script>
