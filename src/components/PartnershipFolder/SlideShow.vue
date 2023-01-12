<template>
  <b-container fluid v-if="currentPartnerFolder.partnerShop">
    <b-row>
      <b-col class="mb-2">
        <span>
          Le diaporama est la vitrine de votre boutique. Nous mettrons en avant
          les 4 catégories principales, sauf mentions contraires de votre part.
          Cette partie sera vue directement avec le chargé de site e-commerce
          lors de l'appel de brief.
        </span>
      </b-col>
    </b-row>
    <!-- slideShowForm -->
    <b-row class="mb-3">
      <b-col>
        <ValidationProvider
          name="diaporama"
          rules="min:5|expected"
          ref="currentPartnerFolder.partnerShop.firstProductCategory"
          v-slot="{ classes, errors }"
        >
          <label class="label">Première slide</label>
          <b-form-textarea
            @focus="onFocus"
            @blur="
              onBlur($event, { partnerShop: currentPartnerFolder.partnerShop })
            "
            v-model="currentPartnerFolder.partnerShop.firstProductCategory"
            :class="classes"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
            name="currentPartnerFolder.partnerShop.firstProductCategory"
            placeholder="catégorie 1"
            type="textarea"
          ></b-form-textarea>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row class="mb-3">
      <b-col>
        <ValidationProvider
          name="diaporama"
          rules="min:5|expected"
          ref="currentPartnerFolder.partnerShop.secondProductCategory"
          v-slot="{ classes, errors }"
        >
          <label class="label">Deuxième slide</label>
          <b-form-textarea
            @focus="onFocus"
            @blur="
              onBlur($event, { partnerShop: currentPartnerFolder.partnerShop })
            "
            v-model="currentPartnerFolder.partnerShop.secondProductCategory"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
            :class="classes"
            name="currentPartnerFolder.partnerShop.secondProductCategory"
            placeholder="catégorie 2"
            type="textarea"
          ></b-form-textarea>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row class="mb-3">
      <b-col>
        <ValidationProvider
          name="diaporama"
          rules="min:5|expected"
          ref="currentPartnerFolder.partnerShop.thirdProductCategory"
          v-slot="{ classes, errors }"
        >
          <label class="label">Troisième slide</label>
          <b-form-textarea
            @focus="onFocus"
            @blur="
              onBlur($event, { partnerShop: currentPartnerFolder.partnerShop })
            "
            v-model="currentPartnerFolder.partnerShop.thirdProductCategory"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
            :class="classes"
            name="currentPartnerFolder.partnerShop.thirdProductCategory"
            placeholder="catégorie 3"
            type="textarea"
          ></b-form-textarea>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row class="mb-3">
      <b-col>
        <ValidationProvider
          name="diaporama"
          rules="min:5|expected"
          ref="currentPartnerFolder.partnerShop.fourthProductCategory"
          v-slot="{ classes, errors }"
        >
          <label class="label">Quatrième slide</label>
          <b-form-textarea
            @focus="onFocus"
            @blur="
              onBlur($event, { partnerShop: currentPartnerFolder.partnerShop })
            "
            v-model="currentPartnerFolder.partnerShop.fourthProductCategory"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
            :class="classes"
            name="currentPartnerFolder.partnerShop.fourthProductCategory"
            placeholder="catégorie 4"
            type="textarea"
          ></b-form-textarea>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import {useDP} from "@/mixins/useDP";

const store = useStore();
const { allowedToEdit, verifyFields } = useDP();

const identity = computed(() => store.state.account.identity);
const opportunity = computed(() => store.state.account.opportunity);
const currentPartnerFolder = computed(
  () => store.state.account.currentPartnerFolder
);

const updatePartnerPropertyFromForm = (value: any) =>
  store.dispatch("account/updatePartnerPropertyFromForm", value);

const editSlide = ref(null);

const onFocus = (event: { target: { value: any } }) => {
  previousEditedValue = event.target.value;
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
  }).then(() => verifyFields());
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/Pfolder/partnership-folder.scss";
</style>
