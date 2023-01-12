<template>
  <b-container fluid v-if="currentPartnerFolder.partnerAutoImmo">
    <!-- businessSoftwareForm -->
    <b-row>
      <b-col>
        <ValidationProvider
          name="logiciel métier"
          rules="required"
          ref="currentPartnerFolder.partnerAutoImmo.hasBusinessSoftware"
          v-slot="{ classes, errors }"
        >
          <label class="label">Utilisez-vous un logiciel métier ?</label>
          <b-form-select
            @change="
              onBlur($event, {
                partnerAutoImmo: currentPartnerFolder.partnerAutoImmo,
                type: 'bool',
              })
            "
            v-model="currentPartnerFolder.partnerAutoImmo.hasBusinessSoftware"
            name="currentPartnerFolder.partnerAutoImmo.hasBusinessSoftware"
            :class="classes"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
            :options="yesNoOptions"
            value-field="value"
            text-field="text"
            type="select"
          ></b-form-select>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row
      class="mt-3 mb-3"
      v-if="currentPartnerFolder.partnerAutoImmo.hasBusinessSoftware"
    >
      <b-col>
        <ValidationProvider
          name="nom du logiciel"
          rules="required_if:currentPartnerFolder.partnerAutoImmo.hasBusinessSoftware,Oui"
          ref="currentPartnerFolder.partnerAutoImmo.businessSoftwareName"
          v-slot="{ classes, errors }"
        >
          <label class="label">Si oui, nom du logiciel</label>
          <b-form-input
            @focus="onFocus"
            @blur="
              onBlur($event, {
                partnerAutoImmo: currentPartnerFolder.partnerAutoImmo,
              })
            "
            v-model="currentPartnerFolder.partnerAutoImmo.businessSoftwareName"
            name="currentPartnerFolder.partnerAutoImmo.businessSoftwareName"
            type="text"
            :class="classes"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
          ></b-form-input>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row class="mt-3 mb-3">
      <b-col>
        <ValidationProvider
          name="volume d'annonces"
          rules="integer"
          ref="currentPartnerFolder.partnerAutoImmo.adQuantity"
          v-slot="{ classes, errors }"
        >
          <label class="label">Volume d'annonces</label>
          <b-form-input
            @focus="onFocus"
            @change="
              onBlur($event, {
                partnerAutoImmo: currentPartnerFolder.partnerAutoImmo,
              })
            "
            v-model="currentPartnerFolder.partnerAutoImmo.adQuantity"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
            :class="classes"
            name="currentPartnerFolder.partnerAutoImmo.adQuantity"
            type="number"
          ></b-form-input>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row class="mt-3 mb-3 extra-informations">
      <b-col md="4">
        <a
          href="https://local-fr.lightning.force.com/lightning/r/Knowledge__kav/ka069000000oMbeAAE/view"
          target="_blank"
          class="external-link"
          >Liste des logiciels métiers compatibles</a
        >
      </b-col>
      <b-col>
        <small
          >S'il ne dispose pas d'un logiciel métier compatible, le professionnel
          pourra saisir ses annonces directement sur la plateforme
          Ubiflow.</small
        >
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts" setup>
import { useStore } from "vuex";
import { yesNoOptions as yesNoOptionsData } from "@/Interface/partnershipFolderDatas";
import {useDP} from "@/mixins/useDP";
import { computed, ref } from "vue";

const { allowedToEdit } = useDP();
const store = useStore();

const identity = computed(() => store.state.account.identity);
const currentPartnerFolder = computed(
  () => store.state.account.currentPartnerFolder
);

const yesNoOptions = ref(yesNoOptionsData);
const previousEditedValue = ref(null);

const updatePartnerPropertyFromForm = (value: any) =>
  store.dispatch("account/updatePartnerPropertyFromForm", value);

const onFocus = (event: { target: { value: null } }) => {
  previousEditedValue.value = event.target.value;
};
const onBlur = (
  event: { target: { name: string | number } },
  data: { partnerAutoImmo: { id: any; partnerFolder: any } }
) => {
  const provider = ref[event.target.name];
  if (data.partnerAutoImmo && !data.partnerAutoImmo.id) {
    data.partnerAutoImmo.partnerFolder = currentPartnerFolder.value["@id"];
  }
  updatePartnerPropertyFromForm({
    event: event,
    provider: provider[0] || provider,
    data: data
      ? Object.assign({ previousEditedValue: previousEditedValue }, data)
      : undefined,
  });
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/Pfolder/partnership-folder.scss";
</style>
