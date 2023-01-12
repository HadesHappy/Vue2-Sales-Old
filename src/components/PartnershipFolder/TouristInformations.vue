<template>
  <b-container fluid>
    <!-- tourismInfoForm -->
    <b-row class="mb-3">
      <b-col>
        <span>Langues parlées</span>
      </b-col>
    </b-row>
    <b-row class="mb-3">
      <b-col
        v-for="(availableLanguage, index) in availableSpokenLanguages"
        :key="`availableLanguage-${index}`"
        class="languages-grid"
        lg="1"
        md="3"
        sm="4"
      >
        <ValidationProvider
          name="langages parlés"
          :rules="{ required: false }"
          :ref="`currentPartnerFolder.spokenLanguages[${index}]`"
          v-slot="{ classes, errors }"
        >
          <b-form-checkbox-group
            @change="
              onLanguageCheck($event, { partnerFolder: currentPartnerFolder })
            "
            :name="`currentPartnerFolder.spokenLanguages[${index}]`"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
            :options="[availableLanguage]"
            v-model="checkedSpokenLanguages"
            type="checkbox"
          ></b-form-checkbox-group>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
      <b-col v-if="otherSpokenLanguageChecked" sm="8" md="9" lg="4">
        <ValidationProvider
          name="Autre langage parlé"
          ref="currentPartnerFolder.spokenLanguages.other"
          v-slot="{ classes, errors }"
        >
          <b-form-input
            @focus="onFocus"
            type="text"
            @blur="
              onLanguageChange($event, { partnerFolder: currentPartnerFolder })
            "
            :class="classes"
            placeholder="Autre"
            name="currentPartnerFolder.spokenLanguages.other"
            v-model="otherSpokenLanguage"
            :disabled="!allowedToEdit || !otherSpokenLanguageChecked"
            :readonly="!allowedToEdit || !otherSpokenLanguageChecked"
          ></b-form-input>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row class="mb-3">
      <b-col>
        <span>Moyens de paiements acceptés</span>
      </b-col>
    </b-row>
    <b-row class="mb-3">
      <b-col
        v-for="(paymentMethod, index) in paymentMethods"
        :key="`paymentMethod-${index}`"
        lg="2"
        md="3"
        sm="4"
      >
        <b-form-checkbox-group
          @change="
            onPaymentMethodChange($event, {
              partnerFolder: currentPartnerFolder,
            })
          "
          :name="`currentPartnerFolder.paymentModes[${index}].name`"
          :options="[paymentMethod]"
          v-model="checkedPaymentMethods"
          :disabled="!allowedToEdit"
          :readonly="!allowedToEdit"
          type="checkbox"
        ></b-form-checkbox-group>
      </b-col>
    </b-row>
    <b-row class="mt-3 mb-3" v-if="currentPartnerFolder.partnerHotelResto">
      <b-col>
        <ValidationProvider
          name="activités proposées"
          rules="min:10"
          ref="currentPartnerFolder.partnerHotelResto.hobbies"
          v-slot="{ classes, errors }"
        >
          <label class="label"
            >Listez les activités proposées par votre établissement</label
          >
          <b-form-textarea
            @focus="onFocus"
            @blur="
              onBlur($event, {
                partnerHotelResto: currentPartnerFolder.partnerHotelResto,
              })
            "
            type="textarea"
            :class="classes"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
            name="currentPartnerFolder.partnerHotelResto.hobbies"
            v-model="currentPartnerFolder.partnerHotelResto.hobbies"
          ></b-form-textarea>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row class="mt-3 mb-3" v-if="currentPartnerFolder.partnerHotelResto">
      <b-col>
        <ValidationProvider
          name="services proposés"
          rules="min:10"
          ref="currentPartnerFolder.partnerHotelResto.services"
          v-slot="{ classes, errors }"
        >
          <label class="label"
            >Listez les services proposés par votre établissement</label
          >
          <b-form-textarea
            @focus="onFocus"
            @blur="
              onBlur($event, {
                partnerHotelResto: currentPartnerFolder.partnerHotelResto,
              })
            "
            type="textarea"
            :class="classes"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
            name="currentPartnerFolder.partnerHotelResto.services"
            v-model="currentPartnerFolder.partnerHotelResto.services"
          ></b-form-textarea>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, type Ref } from "vue";
import { useStore } from "vuex";
import {
  availableSpokenLanguages,
  paymentMethods,
} from "@/Interface/partnershipFolderDatas";
import {useDP} from "@/mixins/useDP";

const { allowedToEdit } = useDP();
const store = useStore();

const identity = computed(() => store.state.account.identity);
const opportunity = computed(() => store.state.account.opportunity);
const currentPartnerFolder = computed(
  () => store.state.account.currentPartnerFolder
);

const paymentModes = computed(() => store.state.globalStore.paymentModes);
const languages = computed(() => store.state.globalStore.languages);

const checkedLanguages = ref([]);
const otherSpokenLanguage = ref("");
const checkedPaymentMethods = ref([]);
const checkedSpokenLanguages = ref([]);
const otherSpokenLanguageChecked = ref(false);
const previousEditedValue = ref(null);

const updatePartnerPropertyFromForm = (value: any) =>
  store.dispatch("account/updatePartnerPropertyFromForm", value);

const getPaymentModes = () => store.dispatch("globalStore/getPaymentModes");
const getLanguages = () => store.dispatch("globalStore/getLanguages");

const onFocus = (event: { target: { value: any } }) => {
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
  });
};
const onLanguageCheck = (
  event: { target: { value: string; checked: any } },
  data: any
) => {
  if ("other" === event.target.value) {
    otherSpokenLanguageChecked.value = event.target.checked;
    if (!otherSpokenLanguage.value) {
      return;
    }
  }

  onLanguageChange(event, data);
};
const onLanguageChange = (
  event: any,
  data: { offset: string; value: any[] }
) => {
  const checkedSpokenTexts = checkedSpokenLanguages.value.map(
    (checkedLanguage) => {
      const find = availableSpokenLanguages.find(
        (availableLanguage) => availableLanguage.text === checkedLanguage
      );
      return find ? find.text : "";
    }
  );
  const newSpokenLanguages: Ref<string>[] = [];
  checkedSpokenLanguages.value.forEach((checkedSpokenLanguage) => {
    if (!checkedSpokenLanguage) {
      return;
    }

    if ("other" === checkedSpokenLanguage) {
      if (otherSpokenLanguage.value) {
        const spokenLanguageFound = checkedSpokenTexts.find(
          (item) => item === otherSpokenLanguage.value
        );
        if (!spokenLanguageFound) {
          newSpokenLanguages.push(otherSpokenLanguage);
        }
      }
    } else {
      newSpokenLanguages.push(checkedSpokenLanguage);
    }
  });
  data.offset = "spokenLanguages";
  data.value = newSpokenLanguages;
  updatePartnerPropertyFromForm({ data: data });
};
const onPaymentMethodChange = (
  event: any,
  data: { partnerFolder: any; offset: string; value: any[] }
) => {
  const newPaymentModes: (
    | { id: never; name?: undefined }
    | { name: never; id?: undefined }
  )[] = [];
  checkedPaymentMethods.value.forEach((checkedPaymentMethod) => {
    if (checkedPaymentMethod) {
      newPaymentModes.push(
        paymentModes[checkedPaymentMethod]
          ? { id: paymentModes[checkedPaymentMethod]["@id"] }
          : { name: checkedPaymentMethod }
      );
    }
  });
  if (data.partnerFolder) {
    data.offset = "paymentModes";
    data.value = newPaymentModes;
    updatePartnerPropertyFromForm({ data: data });
  }
};

onMounted(() => {
  // Payment modes
  if (!Object.keys(paymentModes).length) {
    getPaymentModes();
  }
  checkedPaymentMethods.value = currentPartnerFolder.value.paymentModes.map(
    (item: { name: any }) => item.name
  );

  // Spoken languages
  const availableSpokenLanguageValues = availableSpokenLanguages.map(
    (item) => item.value
  );

  otherSpokenLanguage.value = currentPartnerFolder.value.spokenLanguages.find(
    (item: string) => -1 === availableSpokenLanguageValues.indexOf(item)
  );
  otherSpokenLanguageChecked.value = !!otherSpokenLanguage.value;

  checkedSpokenLanguages.value =
    currentPartnerFolder.value.spokenLanguages.filter(
      (item: string) => -1 !== availableSpokenLanguageValues.indexOf(item)
    );

  if (otherSpokenLanguageChecked.value) {
    checkedSpokenLanguages.value.push("other");
  }
});
</script>

<style lang="scss" scoped>
@import "@/assets/style/Pfolder/partnership-folder.scss";
</style>
