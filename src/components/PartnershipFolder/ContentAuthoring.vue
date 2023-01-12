<template>
  <b-container fluid v-if="currentPartnerFolder.partnerShop">
    <!-- contentAuthoringForm -->
    <b-row>
      <b-col>
        <ValidationProvider
          name="Texte pour la page d'accueil"
          rules="min:10"
          ref="currentPartnerFolder.partnerShop.homepageContent"
          v-slot="{ validate, classes, errors }"
        >
          <label class="label">Texte pour la page d'accueil</label>
          <b-form-textarea
            @focus="onFocus"
            @blur="
              onBlur($event, { partnerShop: currentPartnerFolder.partnerShop })
            "
            :class="classes"
            type="textarea"
            v-model="currentPartnerFolder.partnerShop.homepageContent"
            name="currentPartnerFolder.partnerShop.homepageContent"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
          ></b-form-textarea>
          <small>{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row class="mt-3 mb-3">
      <b-col>
        <ValidationProvider
          name="Présentation de la boutique"
          rules="min:10"
          ref="currentPartnerFolder.partnerShop.shopDescription"
          v-slot="{ validate, classes, errors }"
        >
          <label class="label">Présentation de la boutique</label>
          <b-form-textarea
            @focus="onFocus"
            @blur="
              onBlur($event, { partnerShop: currentPartnerFolder.partnerShop })
            "
            :class="classes"
            type="textarea"
            v-model="currentPartnerFolder.partnerShop.shopDescription"
            name="currentPartnerFolder.partnerShop.shopDescription"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
          ></b-form-textarea>
          <small>{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts" setup>
import { useStore } from "vuex";
import {useDP} from "@/mixins/useDP";
import { computed, ref } from "vue";

const store = useStore();
const { accountStatus } = useDP();

const identity = computed(() => store.state.account.identity);
const currentPartnerFolder = computed(
  () => store.state.account.currentPartnerFolder
);
const previousEditedValue = ref(null);

const updatePartnerPropertyFromForm = (value: any) =>
  store.dispatch("account/updatePartnerPropertyFromForm", value);

const onFocus = (event: { target: { value: any } }) => {
  previousEditedValue.value = event.target.value;
};
const onBlur = (
  event: { target: { name: string | number } },
  data: { partnerShop: { id: any; partnerFolder: any } }
) => {
  const provider = ref[event.target.name];
  if (data.partnerShop && !data.partnerShop.id) {
    data.partnerShop.partnerFolder = currentPartnerFolder.value["@id"];
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
