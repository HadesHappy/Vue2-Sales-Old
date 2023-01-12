<template>
  <b-container fluid>
    <!-- reportForm -->
    <b-row class="mb-3">
      <!-- @todo fake value now -->
      <b-col lg="3" md="4" class="text-left">
        <b-form-checkbox
          :disabled="true"
          :readonly="true"
          :checked="status.hasPhotosReport10"
          type="checkbox"
        >
          Reportage 10 photos
        </b-form-checkbox>
      </b-col>
      <b-col lg="3" md="4" class="text-left">
        <b-form-checkbox
          :disabled="true"
          :readonly="true"
          :checked="status.hasPhotosVideoReport10"
          type="checkbox"
        >
          Reportage 10 photos + vidéos 60s
        </b-form-checkbox>
      </b-col>
      <b-col lg="3" md="4" class="text-left">
        <b-form-checkbox
          :disabled="true"
          :readonly="true"
          :checked="status.hasVirtualVisit"
          type="checkbox"
        >
          Reportage 10 photos + visite virtuelle
        </b-form-checkbox>
      </b-col>
      <b-col lg="3" md="4" class="text-left">
        <b-form-checkbox
          :disabled="true"
          :readonly="true"
          :checked="status.hasPhotosReport20"
          type="checkbox"
        >
          Reportage 20 photos
        </b-form-checkbox>
      </b-col>
    </b-row>
    <b-row
      v-for="(item, index) in currentPartnerFolder.footages"
      :key="item.id"
      class="footage-period-container mb-2"
    >
      <i
        class="fas fa-trash d-block d-md-none remove-item-action"
        @click="onFootageRemove(item, index)"
        title="Supprimer cette disponibilité"
      ></i>
      <b-col lg="4" md="6">
        <ValidationProvider
          name="date de rendez-vous"
          rules="required"
          :ref="`currentPartnerFolder.footages[${index}].date`"
          v-slot="{ classes, errors }"
        >
          <b-form-datepicker
            @input="
              onDateChange(
                $event,
                { footage: currentPartnerFolder.footages[index] },
                selectedFootagePeriods[index]
              )
            "
            type="date"
            :class="classes"
            v-model="item.date"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
            :name="`currentPartnerFolder.footages[${index}].date`"
            :min="minDate"
            :max="maxDate"
          ></b-form-datepicker>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
      <b-col lg="5" md="5">
        <b-row>
          <b-col
            v-for="dayPeriod in dayPeriods"
            :key="`${index}-${dayPeriod.value}`"
          >
            <ValidationProvider
              name="Période de disponible"
              :rules="{ required: { allow: false } }"
              :ref="`footages[${index}][${dayPeriod.value}].period`"
              v-slot="{ classes, errors }"
            >
              <b-form-checkbox-group
                @change="
                  onFootagePeriodChange(
                    $event,
                    currentPartnerFolder.footages[index],
                    selectedFootagePeriods[index]
                  )
                "
                :options="[dayPeriod]"
                v-model="selectedFootagePeriods[index]"
                :disabled="
                  !allowedToEdit || !currentPartnerFolder.footages[index].date
                "
                :readonly="!allowedToEdit"
                :name="`footages[${index}][${dayPeriod.value}].period`"
                type="checkbox"
              >
              </b-form-checkbox-group>
              <small :class="classes">{{ errors[0] }}</small>
            </ValidationProvider>
          </b-col>
          <b-col cols="1" v-if="allowedToEdit" class="d-none d-md-block">
            <i
              class="fas fa-trash remove-item-action"
              @click="onFootageRemove(item, index)"
              title="Supprimer cette disponibilité"
            ></i>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row class="my-3" v-if="allowedToEdit">
      <div class="float-left add-item-action ml-3" @click="onFootageAdd">
        <i class="fas fa-plus"></i> Ajouter une disponibilité
      </div>
    </b-row>
  </b-container>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { footages, dayPeriods } from "@/Interface/partnershipFolderDatas";
import {useDP} from "@/mixins/useDP";

const store = useStore();
const { allowedToEdit } = useDP();

const identity = computed(() => store.state.account.identity);
const opportunity = computed(() => store.state.account.opportunity);
const currentPartnerFolder = computed(
  () => store.state.account.currentPartnerFolder
);
const status = computed(() => store.state.globalStore.status);

const selectedFootagePeriods = ref([]);
const maxDays = ref(15);
const today = computed(
  () =>
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    )
);
const previousEditedValue = ref(null);
const minDate = computed(() => new Date(today.value));
const maxDate = computed(() =>
  new Date(today.value).setDate(minDate.value.getDate() + maxDays.value)
);

const updatePartnerPropertyFromForm = (value: any) =>
  store.dispatch("account/updatePartnerPropertyFromForm", value);
const deletePartnerPropertyFromForm = (value: any) =>
  store.dispatch("account/deletePartnerPropertyFromForm", value);

const onFocus = (event: { target: { value: null } }) => {
  previousEditedValue.value = event.target.value;
};
const onBlur = (event: { target: { name: string | number } }, data: any) => {
  const provider = ref[event.target.name];
  updatePartnerPropertyFromForm({
    event: event,
    provider: provider[0] || provider,
    data: data
      ? Object.assign({ previousEditedValue: previousEditedValue }, data)
      : undefined,
  });
};
const onDateChange = (
  value: any,
  data: {
    footage: { id?: any; date?: any; partnerFolder?: any };
    offset: string;
    value: any;
  },
  selectedPeriods: string | any[]
) => {
  if (!selectedPeriods || !selectedPeriods.length) {
    return;
  }

  if (!data.footage || !data.footage.id) {
    data.footage = {
      date: value,
      partnerFolder: currentPartnerFolder.value["@id"],
    };
  } else {
    data.offset = "date";
    data.value = value;
  }
  updatePartnerPropertyFromForm({
    data: data
      ? Object.assign({ previousEditedValue: previousEditedValue }, data)
      : undefined,
  });
};
const onFootagePeriodChange = (
  event: any,
  footage: { id: any; period: any },
  selectedPeriods: string | any[]
) => {
  const data = {
    footage: footage || {},
  };

  switch (selectedPeriods.length) {
    case 2:
      data.footage.period = "All";
      break;
    case 1:
      data.footage.period = selectedPeriods[0];
      break;
  }

  if (!footage || !footage.id) {
    data.footage.partnerFolder = currentPartnerFolder.value["@id"];
  } else {
    data.offset = "period";
    data.value = footage.period;
  }

  updatePartnerPropertyFromForm({ data: data });
};
const onFootageAdd = () => {
  currentPartnerFolder.value.footages.push({
    date: null,
    period: null,
    partnerFolder: currentPartnerFolder.value["@id"],
  });
};
const onFootageRemove = (footage: { id: any }, index: any) => {
  if (footage && footage.id) {
    deletePartnerPropertyFromForm({
      data: { footage: footage },
    });
  } else {
    currentPartnerFolder.value.footages.splice(index, 1);
  }
};

onMounted(() => {
  currentPartnerFolder.value.footages.forEach((item: { period: any }) => {
    let periods: any[] = [];
    switch (item.period) {
      case "AM":
      case "PM":
        periods = [item.period];
        break;
      case "All":
        periods = ["AM", "PM"];
        break;
    }
    selectedFootagePeriods.value.push(periods);
  });
});
</script>

<style lang="scss" scoped>
@import "@/assets/style/Pfolder/partnership-folder.scss";
</style>
