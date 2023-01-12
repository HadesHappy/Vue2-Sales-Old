<template>
  <b-container fluid>
    <!-- bookEngineForm -->
    <b-row>
      <ValidationProvider
        name="liste moteur de réservation"
        rules="expected"
        ref="currentPartnerFolder.bookEngines.0.engine"
        v-slot="{ classes, errors }"
      >
        <b-col>
          <label
            >Vous disposez déjà d'un moteur de réservation parmi la liste
            suivante</label
          >
          <b-form-select
            @change="
              onSelectBookEngine($event, {
                bookEngine: currentPartnerFolder.bookEngines[0],
              })
            "
            v-model="currentPartnerFolder.bookEngines[0].engine"
            :options="availableOptions"
            name="currentPartnerFolder.bookEngines.0.engine"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
            type="select"
          ></b-form-select>
          <small :class="classes">{{ errors[0] }}</small>
        </b-col>
      </ValidationProvider>
    </b-row>
    <b-row class="mt-3 mb-3">
      <b-col>
        <ValidationProvider
          name="nom du moteur de réservation"
          :rules="{ required: false, min: 3 }"
          ref="currentPartnerFolder.bookEngines.0.name"
          v-slot="{ classes, errors }"
        >
          <label
            >Vous avez un autre moteur de réservation, indiquez son nom</label
          >
          <b-form-input
            @focus="onFocus"
            @change="
              onBlur($event, {
                bookEngine: currentPartnerFolder.bookEngines[0],
              })
            "
            v-model="currentPartnerFolder.bookEngines[0].name"
            name="currentPartnerFolder.bookEngines.0.name"
            :class="classes"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
            type="text"
          ></b-form-input>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row class="mt-3 mb-3">
      <b-col>
        <ValidationProvider
          name="autre moteur de réservation"
          rules="min:3"
          ref="currentPartnerFolder.bookEngines.0.url"
          v-slot="{ classes, errors }"
        >
          <label
            >Vous avez un autre moteur de réservation, indiquez le lien vers
            celui-ci :</label
          >
          <b-form-input
            @focus="onFocus"
            @blur="
              onBlur($event, {
                bookEngine: currentPartnerFolder.bookEngines[0],
              })
            "
            :class="classes"
            type="text"
            name="currentPartnerFolder.bookEngines.0.url"
            v-model="currentPartnerFolder.bookEngines[0].url"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
          ></b-form-input>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row class="mt-3 mb-3">
      <b-col>
        <span>
          Indiquez toutes les informations utiles liées au compte client du
          moteur de réservation :
        </span>
      </b-col>
    </b-row>
    <b-row>
      <b-col lg="3" md="4" sm="6">
        <ValidationProvider
          name="Identifiant"
          rules="min:3"
          ref="currentPartnerFolder.bookEngines.0.username"
          v-slot="{ classes, errors }"
        >
          <label class="label">Identifiant</label>
          <b-form-input
            @focus="onFocus"
            @blur="
              onBlur($event, {
                bookEngine: currentPartnerFolder.bookEngines[0],
              })
            "
            :class="classes"
            type="text"
            name="currentPartnerFolder.bookEngines.0.username"
            v-model="currentPartnerFolder.bookEngines[0].username"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
          ></b-form-input>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
      <b-col lg="3" md="4" sm="6">
        <ValidationProvider
          name="Numéro client"
          rules="min:3"
          ref="currentPartnerFolder.bookEngines.0.customerCode"
          v-slot="{ classes, errors }"
        >
          <label class="label">Numéro client</label>
          <b-form-input
            @focus="onFocus"
            @blur="
              onBlur($event, {
                bookEngine: currentPartnerFolder.bookEngines[0],
              })
            "
            :class="classes"
            type="text"
            name="currentPartnerFolder.bookEngines.0.customerCode"
            v-model="currentPartnerFolder.bookEngines[0].customerCode"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
          ></b-form-input>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
      <b-col lg="3" md="4" sm="6">
        <ValidationProvider
          name="Hôtel ID"
          rules="min:3"
          ref="currentPartnerFolder.bookEngines.0.hotelId"
          v-slot="{ classes, errors }"
        >
          <label class="label">Hôtel ID</label>
          <b-form-input
            @focus="onFocus"
            @blur="
              onBlur($event, {
                bookEngine: currentPartnerFolder.bookEngines[0],
              })
            "
            :class="classes"
            type="text"
            name="currentPartnerFolder.bookEngines.0.hotelId"
            v-model="currentPartnerFolder.bookEngines[0].hotelId"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
          ></b-form-input>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
      <b-col lg="3" md="4" sm="6">
        <ValidationProvider
          name="Channel Code"
          rules="min:3"
          ref="currentPartnerFolder.bookEngines.0.channelCode"
          v-slot="{ classes, errors }"
        >
          <label class="label">Channel Code</label>
          <b-form-input
            @focus="onFocus"
            @blur="
              onBlur($event, {
                bookEngine: currentPartnerFolder.bookEngines[0],
              })
            "
            :class="classes"
            type="text"
            name="currentPartnerFolder.bookEngines.0.channelCode"
            v-model="currentPartnerFolder.bookEngines[0].channelCode"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
          ></b-form-input>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <ValidationProvider
          name="Autre"
          rules="min:3"
          ref="currentPartnerFolder.bookEngines.0.comment"
          v-slot="{ classes, errors }"
        >
          <label class="label">Autre</label>
          <b-form-input
            @focus="onFocus"
            @blur="
              onBlur($event, {
                bookEngine: currentPartnerFolder.bookEngines[0],
              })
            "
            :class="classes"
            type="text"
            name="currentPartnerFolder.bookEngines.0.comment"
            v-model="currentPartnerFolder.bookEngines[0].comment"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
          ></b-form-input>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row class="mt-3 mb-3" v-if="currentPartnerFolder.partnerHotelResto">
      <b-col>
        <ValidationProvider
          name="vous n'avez pas de moteur de réservation"
          ref="currentPartnerFolder.partnerHotelResto.bookEngineAction"
          v-slot="{ classes, errors }"
        >
          <label
            >Vous n'avez pas de moteur de réservation, que souhaitez-vous faire
            ?</label
          >
          <b-form-select
            @change="
              onBlur($event, {
                partnerHotelResto: currentPartnerFolder.partnerHotelResto,
              })
            "
            :class="classes"
            type="select"
            name="currentPartnerFolder.partnerHotelResto.bookEngineAction"
            v-model="currentPartnerFolder.partnerHotelResto.bookEngineAction"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
            :options="noEngineOptions"
          ></b-form-select>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts" setup>
import {useDP} from "@/mixins/useDP";

import {
  hotelEngineOptions as hotelEngineOptionsData,
  restoEngineOptions as restoEngineOptionsData,
  noEngineOptions as noEngineOptionsData,
} from "@/Interface/partnershipFolderDatas";
import { readyState, validateSection } from "@/helpers";
import { useStore } from "vuex";
import { computed, onMounted, ref } from "vue";

const { allowedToEdit, verifyFields } = useDP();
const store = useStore();

const identity = computed(() => store.state.account.identity);
const status = computed(() => store.state.globalStore.status);
const currentPartnerFolder = computed(
  () => store.state.account.currentPartnerFolder
);

const hotelEngineOptions = ref(hotelEngineOptionsData);
const restoEngineOptions = ref(restoEngineOptionsData);
const noEngineOptions = ref(hotelEngineOptionsData);
const availableOptions = ref(null);
const previousEditedValue = ref(null);

onMounted(() => {
  if (status.value.isLocalHotel) {
    availableOptions.value = hotelEngineOptions;
  }

  if (status.value.isLocalResto) {
    availableOptions.value = restoEngineOptions;
  }
});

const updatePartnerPropertyFromForm = (value: any) =>
  store.dispatch("account/updatePartnerPropertyFromForm", value);

const onFocus = (event: { target: { value: null } }) => {
  previousEditedValue.value = event.target.value;
};
const onBlur = (
  event: { target: { name: string | number } },
  data: { partnerHotelResto: { id: any; partnerFolder: any } }
) => {
  const provider = ref[event.target.name];
  if (data.partnerHotelResto && !data.partnerHotelResto.id) {
    data.partnerHotelResto.partnerFolder = currentPartnerFolder.value["@id"];
  }
  updatePartnerPropertyFromForm({
    event: event,
    provider: provider[0] || provider,
    data: data
      ? Object.assign({ previousEditedValue: previousEditedValue }, data)
      : undefined,
  }).then(() => verifyFields());
};
const onSelectBookEngine = (event: any, data: any) => {
  updatePartnerPropertyFromForm({
    event: event,
    data: data
      ? Object.assign({ previousEditedValue: previousEditedValue }, data)
      : undefined,
  }).then(() => verifyFields());
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/Pfolder/partnership-folder.scss";
</style>
