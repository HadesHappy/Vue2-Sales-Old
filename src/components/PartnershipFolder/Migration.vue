<template>
  <b-container fluid v-if="currentPartnerFolder.partnerShop">
    <!-- migrationForm -->
    <b-row class="mb-2">
      <b-col>
        <ValidationProvider
          name="migrations"
          rules=""
          ref="currentPartnerFolder.partnerShop.migrationChoice"
          v-slot="{ classes, errors }"
        >
          <b-form-radio-group
            @change="
              onBlur($event, { partnerShop: currentPartnerFolder.partnerShop })
            "
            type="radio"
            name="currentPartnerFolder.partnerShop.migrationChoice"
            v-model="currentPartnerFolder.partnerShop.migrationChoice"
            :options="hasPrestashopChoice"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
          >
          </b-form-radio-group>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { hasPrestashopChoice } from "@/Interface/partnershipFolderDatas";
import { useStore } from "vuex";
import {useDP} from "@/mixins/useDP";

const store = useStore();
const { allowedToEdit } = useDP();

const identity = computed(() => store.state.account.identity);
const opportunity = computed(() => store.state.account.opportunity);
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
    provider: provider,
    data: data
      ? Object.assign({ previousEditedValue: previousEditedValue }, data)
      : undefined,
  });
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/Pfolder/partnership-folder.scss";
</style>
