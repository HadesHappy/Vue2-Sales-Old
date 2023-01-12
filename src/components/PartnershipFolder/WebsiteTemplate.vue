<template>
  <b-container fluid>
    <b-row>
      <b-col
        sm="12"
        md="4"
        class="website-template"
        v-for="template in availableSiteModels"
        :key="template.name"
      >
        <ValidationProvider
          name="modèle de site"
          rules="required"
          ref="currentPartnerFolder.sites.0.siteModel"
          v-slot="{ validate, classes, errors }"
        >
          <b-form-radio
            @change="onBlur($event, { site: currentPartnerFolder.sites[0] })"
            v-model="currentPartnerFolder.sites[0].siteModel"
            :value="template.name"
            name="currentPartnerFolder.sites.0.siteModel"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
            type="radio"
            class="website-template __item"
          ></b-form-radio>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
        <b-col md="5">
          <a :href="template.url" target="_blank">
            <img
              :src="require(`@/assets/partnership-file/${template.visual}`)"
              :alt="template.name"
            />
          </a>
          <h1 class="text-center website-template __title">
            {{ template.name }}
          </h1>
        </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import {useDP} from "@/mixins/useDP";
import { useStore } from "vuex";
import {
  templatesBoutique,
  templatesImmo,
  templatesAuto,
  templatesHotel,
  templatesResto,
} from "@/Interface/websiteTemplates";

const { verifyFields, allowedToEdit } = useDP();
const store = useStore();

const identity = computed(() => store.state.account.identity);
const opportunity = computed(() => store.state.account.opportunity);
const currentPartnerFolder = computed(
  () => store.state.account.currentPartnerFolder
);

const globalStoreStatus = computed(() => store.state.globalStore.status);

const updatePartnerPropertyFromForm = (value: any) =>
  store.dispatch("account/updatePartnerPropertyFromForm", value);

const onBlur = (event, data) => {
  const provider = ref[event.target.name];
  updatePartnerPropertyFromForm({
    event: event,
    provider: provider[0] || provider,
    data: data
      ? Object.assign({ previousEditedValue: previousEditedValue }, data)
      : undefined,
  });
  verifyFields();
};
const getSiteModels = () => {
  switch (true) {
    case status["isLocalResto"]:
      return templatesResto;
    case status["isLocalHotel"]:
      return templatesHotel;
    case status["isLocalAuto"] || status["isLocalAutoPlus"]:
      return templatesAuto;
    case status["isLocalImmo"] || status["isLocalImmoPlus"]:
      return templatesImmo;
    default:
      return [];
  }
};

onMounted(() => {
  availableSiteModels = getSiteModels();
});
</script>

<style lang="scss" scoped>
@import "@/assets/style/Pfolder/partnership-folder.scss";
</style>
