<template>
  <b-container fluid v-if="currentPartnerFolder.partnerShop">
    <b-row>
      <b-col>
        <ValidationProvider
          name="informations utiles"
          rules="required:true"
          ref="currentPartnerFolder.partnerShop.siteDescription"
          v-slot="{ classes, errors }"
        >
          <label class="label"
            >Informations utiles pour la réalisation du site</label
          >
          <b-form-textarea
            @focus="onFocus"
            @blur="
              onBlur($event, { partnerShop: currentPartnerFolder.partnerShop })
            "
            :class="classes"
            name="currentPartnerFolder.partnerShop.siteDescription"
            v-model="currentPartnerFolder.partnerShop.siteDescription"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
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
import {useDP} from "@/mixins/useDP";
import { useStore } from "vuex";

const { allowedToEdit } = useDP();
const store = useStore();

const identity = computed(() => store.state.account.identity);
const opportunity = computed(() => store.state.account.opportunity);
const currentPartnerFolder = computed(
  () => store.state.account.currentPartnerFolder
);

const updatePartnerPropertyFromForm = (value: any) =>
  store.dispatch("account/updatePartnerPropertyFromForm", value);

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
  });
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/Pfolder/partnership-folder.scss";
</style>
