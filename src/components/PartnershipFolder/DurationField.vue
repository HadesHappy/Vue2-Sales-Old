<template>
  <b-row class="team__input-separator __description__duration_field">
    <b-col sm="12" md="3">
      <label class="team__label"
        >{{ required ? "*" : "" }}{{ fieldLabel }} :</label
      >
    </b-col>
    <b-col sm="12" md="3" class="__description__duration_value-input">
      <ValidationProvider
        name="duration value"
        rules="integer"
        ref="entity.durationValue"
        v-slot="{ classes, errors }"
      >
        <b-form-input
          type="text"
          @focus="onFocus"
          @blur="onDurationValueChange"
          v-model="durationValue"
          :class="classes"
          :disabled="!allowedToEdit"
          :readonly="!allowedToEdit"
          name="entity.durationValue"
        ></b-form-input>
        <small :class="classes">{{ errors[0] }}</small>
      </ValidationProvider>
    </b-col>
    <b-col sm="12" md="6" class="__description__duration_unit-input">
      <ValidationProvider
        name="duration unit"
        ref="entity.durationUnit"
        v-slot="{ classes, errors }"
      >
        <b-form-select
          type="select"
          @change="onDurationUnitChange"
          v-model="durationUnit"
          :options="agendaTimeTypeList"
          :disabled="!allowedToEdit"
          :readonly="!allowedToEdit"
          name="entity.durationUnit"
        >
        </b-form-select>
        <small :class="classes">{{ errors[0] }}</small>
      </ValidationProvider>
    </b-col>
  </b-row>
</template>

<script lang="ts" setup>
import { useStore } from "vuex";
import { agendaTimeTypeList as agendaTimeTypeListData } from "@/Interface/partnershipFolderDatas";
import { computed, onMounted, ref, type Ref } from "vue";

const store = useStore();

const identity = computed(() => store.state.account.identity);
const currentPartnerFolder = computed(
  () => store.state.account.currentPartnerFolder
);

const props = defineProps([
  "fieldLabel",
  "entity",
  "entityName",
  "durationValueField",
  "durationUnitField",
  "required",
  "refreshDurationFieldComponent",
  "allowedToEdit",
]);

const previousEditedValue = ref("");
const agendaTimeTypeList = ref(agendaTimeTypeListData);
const durationValue = ref(null);
const durationUnit = ref("Minutes");

onMounted(() => {
  durationValue.value =
    props.entity && props.entity[props.durationValueField]
      ? props.entity[props.durationValueField]
      : null;
  durationUnit.value =
    props.entity && props.entity[props.durationUnitField]
      ? props.entity[props.durationUnitField]
      : "Minutes";
});

const updatePartnerPropertyFromForm = (value: any) =>
  store.dispatch("account/updatePartnerPropertyFromForm", value);

const onFocus = (event: { target: { value: any } }) => {
  previousEditedValue.value = event.target.value;
};
const onDurationValueChange = () => {
  if (previousEditedValue.value === durationValue.value) {
    return;
  }

  if (!durationUnit.value || "" === durationValue.value) {
    return;
  }

  entity = updateObject(entity);

  const data = {};
  if (entity["@id"]) {
    data.payload = updateObject({});
  }
  data[entityName] = entity;

  updatePartnerPropertyFromForm({ data }).then(() => {
    if (refreshDurationFieldComponent) {
      refreshDurationFieldComponent();
    }
  });
};
const onDurationUnitChange = () => {
  if (!durationValue.value) {
    return;
  }

  onDurationValueChange();
};
const updateObject = (entity: { [x: string]: Ref<string> }) => {
  entity[durationValueField] = parseInt(durationValue);
  entity[durationUnitField] = durationUnit;

  return entity;
};
</script>
