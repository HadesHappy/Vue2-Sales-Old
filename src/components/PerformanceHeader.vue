<template>
  <b-container fluid>
    <b-row class="audience-header">
      <b-col class="element" lg="4" sm="4" cols="12">
        <h2>{{ title }}</h2>
      </b-col>
      <b-col class="element" lg="4" sm="4" cols="12">
        <a v-if="websiteLink !== null" :href="websiteLink" target="_blank">
          www.{{ websiteLink.replace(/https?:\/\//, "").replace("/", "") }}
        </a>
        <a v-else-if="websiteLink === null"> <div>Aucun site</div> </a><br />
      </b-col>
      <b-col class="calendar-element" lg="4" md="4" sm="4">
        <b-row>
          <b-col sm="2">
            <img src="@/assets/calendar.svg" />
          </b-col>
          <b-col sm="10">
            <date-range-picker
              ref="picker"
              :locale-data="localeData"
              :ranges="ranges"
              v-model="currentDateRange"
              :minDate="null"
              :maxDate="maxDate"
              :opens="'left'"
              :timePicker="false"
              :closeOnEsc="true"
              @update="updateRange"
            >
              <template v-slot:input="picker" style="min-width: 350px">
                <b-row>
                  <b-col sm="10">
                    {{ getDate(picker.startDate) }} -
                    {{ getDate(picker.endDate) }}
                  </b-col>
                  <b-col sm="2">
                    <img src="@/assets/arrow-multi-choice.svg" />
                  </b-col>
                </b-row>
              </template>
            </date-range-picker>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts" setup>
import { useStore } from "vuex";
// import FadeLoader from "vue-spinner/src/FadeLoader.vue";
// import DateRangePicker from "vue2-daterange-picker";
import dayjs from "dayjs";
import { ref, computed, onMounted } from "vue";

const store = useStore();
// require("vue-tour/dist/vue-tour.css");
const emit = defineEmits(["change"]);

const ranges = ref({});
const range = ref({});
const maxDate = ref(new Date(new Date().setDate(new Date().getDate() - 1)));
const picker = ref(null);
const localeData = ref({
  firstDay: 0,
  format: "dd/mm/yyyy",
  separator: " - ",
  applyLabel: "Appliquer",
  cancelLabel: "Annuler",
  weekLabel: "S",
  daysOfWeek: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
  monthNames: [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Jui",
    "Jui",
    "Aoû",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
  ],
});
const currentDateRange = ref({});

const props = defineProps({
  title: String,
  dateRange: {
    default: {},
  },
});

const websiteLink = computed(() => store.state.globalStore.websiteLink);

const updateRange = (val: any) => {
  emit("change", val);
};
const getDate = (val: any) => {
  return val ? dayjs(val).format("DD/MM/YYYY") : "";
};

onMounted(() => {
  currentDateRange.value = props.dateRange;
  const today = new Date(),
    yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  ranges.value = {
    Hier: [yesterday, yesterday],
    "7 derniers jours": [
      new Date(
        yesterday.getFullYear(),
        yesterday.getMonth(),
        yesterday.getDate() - 7
      ),
      yesterday,
    ],
    "30 derniers jours": [
      new Date(
        yesterday.getFullYear(),
        yesterday.getMonth(),
        yesterday.getDate() - 30
      ),
      yesterday,
    ],
    "Mois en cours": [
      new Date(yesterday.getFullYear(), yesterday.getMonth(), 1),
      new Date(),
    ],
    "Mois dernier": [
      new Date(yesterday.getFullYear(), yesterday.getMonth() - 1, 1),
      new Date(yesterday.getFullYear(), yesterday.getMonth(), 0),
    ],
    "Année courante": [new Date(yesterday.getFullYear(), 0, 1), yesterday],
  };
});
</script>
