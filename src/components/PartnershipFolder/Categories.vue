<template>
  <b-container fluid v-if="currentPartnerFolder.partnerShop">
    <b-row>
      <b-col class="mb-2">
        <span
          >Listez les catégories et sous-catégories qui composent les pages
          définies dans l'arborescence.
        </span>
      </b-col>
    </b-row>
    <b-row>
      <!-- categoriesForm -->
      <b-col sm="12" md="10">
        <ValidationProvider
          name="catégories"
          rules="expected"
          ref="currentPartnerFolder.partnerShop.categories"
          v-slot="{ classes, errors }"
        >
          <b-form-textarea
            @focus="onFocus"
            @blur="
              onBlur($event, { partnerShop: currentPartnerFolder.partnerShop })
            "
            v-model="currentPartnerFolder.partnerShop.categories"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
            name="currentPartnerFolder.partnerShop.categories"
            type="textarea"
            :class="classes"
            rows="15"
            placeholder="Ex :
            Catégorie 1 : Vetements
                Sous-catégories :
                  - Vêtements femme
                  - vêtements homme
            Catégorie 2 : Chaussures
                Sous-catégories :
                  - Chaussures à talon
                  - Chaussures plates
            Catégorie 3 : Accessoires
                Sous-catégories :
                  - Chapeaux
                  - Ceintures
                  - Foulards"
          ></b-form-textarea>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts" setup>
import { useStore } from "vuex";
import { validateSection } from "@/helpers";
import {useDP} from "@/mixins/useDP";
import { computed } from "vue";

const store = useStore();
const { allowedToEdit, verifyFields } = useDP();

const identity = computed(() => store.state.account.identity);
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
  verifyFields();
};
const validateFields = async (
  refs: any,
  entity: { currentPartnerFolder: { partnerShop: { categories: any } } }
) => {
  if (!allowedToEdit) {
    return;
  }

  let isValid = await validateSection.validateRequiredFields(entity, refs);
  if (isValid) {
    const categories = entity.currentPartnerFolder.partnerShop.categories;
    isValid = categories && categories.length >= 150 ? true : null;
  }

  validateSection.displayColorStateOnSection("categories", isValid);
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/Pfolder/partnership-folder.scss";
</style>
