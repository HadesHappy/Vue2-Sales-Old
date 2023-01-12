<template>
  <b-container fluid class="keyword-group">
    <b-row>
      <b-col class="mb-2">
        <span
          >La prise de brief complète sera faite à la mise en place de la
          campagne lors d'un rendez-vous téléphonique avec le traffic manager.
        </span>
      </b-col>
    </b-row>
    <b-row class="my-3">
      <b-col
        :cols="
          currentPartnerFolder.campaignKeywords &&
          currentPartnerFolder.campaignKeywords.length >= 1
            ? 11
            : 12
        "
      >
        <ValidationProvider
          name="Mots-clés prédéfinis"
          rules="expected"
          ref="currentPartnerFolder.campaignKeywords"
          v-slot="{}"
        >
          <label class="label">Mots-clés prédéfinis</label>
          <b-form-tags
            id="campaign-keywords"
            @input="
              onTagsChange(
                $event,
                { partnerFolder: currentPartnerFolder },
                'campaignKeywords'
              )
            "
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
            tag-variant="local-orange"
            size="md"
            remove-on-delete
            name="currentPartnerFolder.campaignKeywords"
            v-model="currentPartnerFolder.campaignKeywords"
          ></b-form-tags>
        </ValidationProvider>
      </b-col>
      <b-col cols="1" align-self="center" class="text-center">
        <b-button
          @click="
            uiActions.copy2clipboard(currentPartnerFolder.campaignKeywords)
          "
          size="md"
          class="button-copy"
          v-if="
            currentPartnerFolder.campaignKeywords &&
            currentPartnerFolder.campaignKeywords.length >= 1
          "
          v-b-tooltip.hover
          title="Copier dans le presse-papier"
        >
          <i class="fas fa-copy"></i>
        </b-button>
      </b-col>
    </b-row>
    <b-row class="my-3">
      <b-col
        :cols="
          currentPartnerFolder.campaignLocalities &&
          currentPartnerFolder.campaignLocalities.length >= 1
            ? 11
            : 12
        "
      >
        <ValidationProvider
          name="Localités"
          rules="expected"
          ref="currentPartnerFolder.campaignLocalities"
          v-slot="{ classes, errors }"
        >
          <b-form-group label-for="campaign-localities">
            <label class="label">Localités</label>
            <b-form-tags
              input-id="campaign-localities"
              @input="
                onCampaignLocalitiesChange(
                  $event,
                  { partnerFolder: currentPartnerFolder },
                  'campaignLocalities'
                )
              "
              :disabled="!allowedToEdit"
              :readonly="!allowedToEdit"
              tag-variant="local-orange"
              size="md"
              remove-on-delete
              name="currentPartnerFolder.campaignLocalities"
              v-model="campaignLocalities"
              :state="campaignLocalitiesState"
              :input-attrs="{ 'aria-describedby': 'tags-validation-help' }"
            ></b-form-tags>
            <small :class="classes">{{ errors[0] }}</small>
            <template #description v-if="campaignLocalitiesState">
              <div
                id="tags-validation-help"
                v-if="
                  !campaignLocalities ||
                  !campaignLocalities.length ||
                  campaignLocalities.length <= 20
                "
              >
                Saisissez jusqu'à 20 localités au maximum.
              </div>
              <div id="tags-validation-help" v-else>
                Vous avez saisi {{ campaignLocalities.length }}/20 localités.
              </div>
            </template>
            <template #invalid-feedback v-else>
              Vous ne pouvez pas enregister plus de 20 localités.
            </template>
          </b-form-group>
        </ValidationProvider>
      </b-col>
      <b-col cols="1" align-self="center" class="text-center">
        <b-button
          @click="
            uiActions.copy2clipboard(currentPartnerFolder.campaignLocalities)
          "
          size="md"
          class="button-copy"
          v-if="
            currentPartnerFolder.campaignLocalities &&
            currentPartnerFolder.campaignLocalities.length >= 1
          "
          v-b-tooltip.hover
          title="Copier dans le presse-papier"
        >
          <i class="fas fa-copy"></i>
        </b-button>
      </b-col>
    </b-row>
    <b-row class="my-3">
      <b-col md="6">
        <label class="label">Horaires de diffusion</label>
        <b-row class="my-3">
          <TimeRanges
            parentEntityName="partnerFolder"
            :parentEntity="currentPartnerFolder"
            :isCampaign="true"
            :timeRanges="currentPartnerFolder.openingRanges"
            :allowedToEdit="allowedToEdit"
          />
        </b-row>
      </b-col>
      <b-col md="6">
        <ValidationProvider
          name="Commentaires"
          ref="currentPartnerFolder.campaignComment"
          v-slot="{ classes, errors }"
        >
          <label class="label">Commentaires</label>
          <b-form-textarea
            @focus="onFocus"
            @blur="onBlur($event, { partnerFolder: currentPartnerFolder })"
            :class="classes"
            name="currentPartnerFolder.campaignComment"
            v-model="currentPartnerFolder.campaignComment"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
            type="textarea"
          ></b-form-textarea>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row class="mt-4 mb-3">
      <b-col sm="6">
        <span
          >Pour une campagne local sur-mesure, choisir le mois et le thème de la
          campagne :</span
        >
      </b-col>
      <b-col sm="6" v-if="adplorerLink">
        <a class="redirect-link" :href="adplorerLink" target="_blank">
          <img alt="" src="@/assets/link-button.svg" />
          <span class="text">Résultat estimation Adplorer</span>
        </a>
      </b-col>
    </b-row>
    <b-row
      v-for="(item, index) in campaignOptions"
      :key="item.value"
      class="mb-3"
    >
      <b-col sm="12" md="2" class="local-campaign__months">
        <ValidationProvider
          name="Mois selectionné"
          :ref="`currentPartnerFolder.campaignOptions.${index}.month`"
          v-slot="{ classes, errors }"
        >
          <b-form-checkbox
            @change="
              onCheckboxChange($event, { campaignOption: item, type: 'bool' })
            "
            :name="`currentPartnerFolder.campaignOptions.${index}.month`"
            v-model="checkedCampaigns[index]"
            :label="item.label"
            type="checkbox"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
          >
            {{ localCampaignControls[item.month].label }}
          </b-form-checkbox>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
      <b-col sm="12" md="10">
        <ValidationProvider
          name="sujet"
          :rules="{
            required: checkedCampaigns[index],
            requiredCheckedField: checkedCampaigns[index],
          }"
          :ref="`currentPartnerFolder.campaignOptions.${index}.subject`"
          v-slot="{ classes, errors }"
        >
          <b-form-textarea
            @focus="onFocus"
            @blur="onCampaignChange($event, { campaignOption: item })"
            v-model="item.subject"
            :class="classes"
            :name="`currentPartnerFolder.campaignOptions.${index}.subject`"
            type="textarea"
            :disabled="!allowedToEdit || !checkedCampaigns[index]"
            :readonly="!allowedToEdit"
          ></b-form-textarea>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts" setup>
import { localCampaignControls } from "@/Interface/partnershipFolderDatas";
import { uiActions, validateSection } from "@/helpers";
import { useStore } from "vuex";
//import { extend } from "vee-validate";
import TimeRanges from "@/components/PartnershipFolder/TimeRanges.vue";
import {useDP} from "@/mixins/useDP";
import { computed, onBeforeMount, ref, toRef } from "vue";

const store = useStore();
const { allowedToEdit, verifyFields } = useDP();

const localCampaignControlsInterface = ref(localCampaignControls);
const uiActionsHelper = ref(uiActions);
const previousEditedValue = ref(null);
const campaignOptions = ref(Object.assign([], localCampaignControls));
const checkedCampaigns = ref([]);
const maxCampaignLocalities = ref(20);

//extend("requiredCheckedField", validateSection.expectedCheckedField);

const identity = computed(() => store.state.account.identity);
const currentPartnerFolder = computed(
  () => store.state.account.currentPartnerFolder
);
const adplorer = computed(() => store.state.globalStore.adplorer);

const campaignLocalities = computed({
  get() {
    return currentPartnerFolder.value.campaignLocalities;
  },
  set(val) {
    currentPartnerFolder.value.campaignLocalities = val;
  },
});
const campaignLocalitiesState = computed(() => {
  return (
    campaignLocalities.value &&
    campaignLocalities.value.length <= maxCampaignLocalities.value
  );
});
const adplorerLink = computed(() => {
  if (Object.keys(adplorer).every((key) => !adplorer.value[key])) {
    return null;
  }

  return `${import.meta.env.ADPLORER_NEW_CAMPAIGN_URL}/${
    adplorer.value.companyId
  }/Order/${adplorer.value.orderId}/Step/6`;
});

const updatePartnerPropertyFromForm = (value: any) =>
  store.dispatch("account/updatePartnerPropertyFromForm", value);
const deletePartnerPropertyFromForm = (value: any) =>
  store.dispatch("account/deletePartnerPropertyFromForm", value);

const onFocus = (event: { target: { value: null } }) => {
  previousEditedValue.value = event.target.value;
};
const onBlur = (event: { target: { name: string | number } }, data: any) => {
  const provider = event.target ? ref[event.target.name] : null;
  updatePartnerPropertyFromForm({
    event: event,
    provider: provider ? provider[0] || provider : undefined,
    data: data
      ? Object.assign({ previousEditedValue: previousEditedValue }, data)
      : undefined,
  });
};
const onTagsChange = (
  value: any,
  data: { value: any; offset: any },
  offset: any
) => {
  data.value = value;
  data.offset = offset;
  updatePartnerPropertyFromForm({
    data: data,
  });
};
const onCampaignLocalitiesChange = (
  value: string | any[],
  data: any,
  offset: any
) => {
  if (value && value.length > maxCampaignLocalities.value) {
    return;
  }
  onTagsChange(value, data, offset);
};
const onCampaignChange = (
  event: any,
  data: {
    campaignOption: {
      [x: string]: any;
      month: any;
      partnerFolder: any;
      id: any;
      subject: any;
    };
  }
) => {
  if (!data.campaignOption) {
    return;
  }
  const campaignFound = findCampaignForMonth(data.campaignOption.month);

  if (!campaignFound) {
    delete data.campaignOption["id"];
    data.campaignOption.partnerFolder = currentPartnerFolder.value["@id"];
  } else if (!data.campaignOption.id) {
    campaignFound.subject = data.campaignOption.subject;
    data.campaignOption = campaignFound;
  }
  onBlur(event, data);
};
const onCheckboxChange = (
  event: { target: { checked: any } },
  data: { campaignOption: { month: any } }
) => {
  const campaignFound = data.campaignOption
    ? findCampaignForMonth(data.campaignOption.month)
    : null;
  if (!event.target.checked && campaignFound) {
    deletePartnerPropertyFromForm({ data: data }).then(loadCampaigns);
  }
};
const loadCampaigns = () => {
  localCampaignControlsInterface.value.forEach(
    (localCampaignControl, index) => {
      const campaignFound = findCampaignForMonth(localCampaignControl.month);
      campaignOptions[index] = campaignFound
        ? campaignFound
        : localCampaignControl;
      checkedCampaigns[index] = !!campaignFound;
    }
  );
};
const findCampaignForMonth = (month: string | number) => {
  return currentPartnerFolder.value.campaignOptions.find(
    (campaign: { month: string }) =>
      campaign && parseInt(month) === parseInt(campaign.month)
  );
};

onBeforeMount(() => {
  loadCampaigns();
});
</script>

<style lang="scss" scoped>
@import "@/assets/style/Pfolder/partnership-folder.scss";
</style>
