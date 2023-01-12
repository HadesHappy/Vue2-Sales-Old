<template>
  <b-container fluid>
    <b-row class="mb-3" v-if="useCheckBox">
      <b-form-checkbox-group
        @change="onDayOfWeekChecked($event)"
        :disabled="!allowedToEdit || isTimeRangeUpdating"
        :readonly="!allowedToEdit"
        :options="weekDays"
        v-model="checkedDaysOfWeek"
        type="checkbox"
      ></b-form-checkbox-group>
    </b-row>

    <b-row
      class="my-3 mt-2 time-ranges-container"
      :class="customClassName"
      lg="12"
      v-for="(openingRangeDays, index) in selectedDaysOfWeek"
      :key="index"
    >
      <b-col
        v-if="!useCheckBox"
        sm="12"
        :md="breakpointLayout(parentEntityName, 12, 4)"
        class="time-ranges-decoration"
      >
        <b-form-group>
          <b-form-tags
            v-model="selectedDaysOfWeek[index]"
            size="md"
            add-on-change
            no-outer-focus
            class="mb-2 selected__tags"
          >
            <template
              v-slot="{ tags, inputAttrs, inputHandlers, disabled, removeTag }"
            >
              <ul
                v-if="tags.length > 0"
                class="list-inline d-inline selected__days"
              >
                <li v-for="tag in tags" :key="tag" class="d-inline">
                  <b-form-tag
                    @remove="
                      removeTag(tag);
                      onDayOfWeekRemove(tag, index);
                    "
                    :title="tag"
                    :disabled="
                      disabled || !allowedToEdit || isTimeRangeUpdating
                    "
                    >{{ tag }}</b-form-tag
                  >
                </li>
              </ul>
              <b-form-select
                class="selected__days--options"
                v-bind="inputAttrs"
                v-on="inputHandlers"
                :disabled="
                  disabled ||
                  !allowedToEdit ||
                  isTimeRangeUpdating ||
                  0 === getAvailableDaysOfWeek(index).length
                "
                :readonly="disabled || !allowedToEdit"
                :options="getAvailableDaysOfWeek(index)"
                @change="onOpeningRangeDayChange($event, index)"
              >
                <template #first>
                  <!-- This is required to prevent bugs with Safari -->
                  <option disabled value="">Sélectionner des jours</option>
                </template>
              </b-form-select>
            </template>
          </b-form-tags>
        </b-form-group>
      </b-col>
      <b-col
        sm="5"
        md="2"
        :class="
          !allowedToEdit || {
            'days-selected': !!selectedDaysOfWeek[index].length && !useCheckBox,
            'days-not-selected':
              !selectedDaysOfWeek[index].length && !useCheckBox,
          }
        "
      >
        <ValidationProvider
          mode="passive"
          name="Heure d'ouverture"
          :rules="{
            required: selectedDaysOfWeek[index].length > 0,
            regex: /^\d{2}:\d{2}$/,
          }"
          :ref="`timeRanges[${index}].startTime`"
          v-slot="{ classes, errors }"
        >
          <b-form-input
            @focus="
              onFocus($event, index);
              loadCurrentRange(index);
            "
            type="time"
            :class="classes"
            :name="`timeRanges[${index}].startTime`"
            @blur="onOpeningRangeTimeChange(startTimes[index], index)"
            v-model="startTimes[index]"
            :disabled="
              !allowedToEdit ||
              isTimeRangeUpdating ||
              !selectedDaysOfWeek[index].length ||
              (useCheckBox && !checkedDaysOfWeek.length)
            "
            :readonly="!allowedToEdit"
          ></b-form-input>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
      <b-col
        sm="5"
        md="2"
        :class="
          !allowedToEdit || {
            'days-selected': !!selectedDaysOfWeek[index].length && !useCheckBox,
            'days-not-selected':
              !selectedDaysOfWeek[index].length && !useCheckBox,
          }
        "
      >
        <ValidationProvider
          mode="passive"
          name="Heure de fermeture"
          :rules="{
            required: selectedDaysOfWeek[index].length > 0,
            regex: /^\d{2}:\d{2}$/,
          }"
          :ref="`timeRanges[${index}].endTime`"
          v-slot="{ classes, errors }"
        >
          <b-form-input
            @focus="
              onFocus($event, index);
              loadCurrentRange(index);
            "
            type="time"
            :class="classes"
            :name="`timeRanges[${index}].endTime`"
            v-model="endTimes[index]"
            @blur="onOpeningRangeTimeChange(endTimes[index], index)"
            :disabled="
              !allowedToEdit ||
              isTimeRangeUpdating ||
              !selectedDaysOfWeek[index].length ||
              (useCheckBox && !checkedDaysOfWeek.length)
            "
            :readonly="!allowedToEdit"
          ></b-form-input>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
      <b-col
        v-if="openCloseEnabled"
        sm="5"
        md="2"
        :class="
          !allowedToEdit || {
            'days-selected': !!selectedDaysOfWeek[index].length && !useCheckBox,
            'days-not-selected':
              !selectedDaysOfWeek[index].length && !useCheckBox,
          }
        "
      >
        <b-form-select
          @change="onOpenCloseChange(index)"
          :options="openCloseDate"
          :name="`timeRanges[${index}].isOpeningRange`"
          :disabled="
            !allowedToEdit ||
            isTimeRangeUpdating ||
            !selectedDaysOfWeek[index].length ||
            (useCheckBox && !checkedDaysOfWeek.length)
          "
          :readonly="!allowedToEdit"
          v-model="isOpeningRanges[index]"
        ></b-form-select>
      </b-col>
      <b-col
        sm="1"
        v-if="allowedToEdit && !isTimeRangeUpdating"
        class="remove-opening-range"
        :class="{
          'days-selected': !!selectedDaysOfWeek[index].length && !useCheckBox,
          'days-not-selected':
            !selectedDaysOfWeek[index].length && !useCheckBox,
        }"
      >
        <i
          class="fas fa-trash remove-item-action"
          @click="onOpeningRangeRemove(index)"
          title="Supprimer cette plage horaire"
        ></i>
      </b-col>
      <b-col
        sm="2"
        v-if="
          isTimeRangeUpdating && (index === currentIndex || -1 === currentIndex)
        "
        class="remove-opening-range"
        :class="{
          'days-selected': !!selectedDaysOfWeek[index].length && !useCheckBox,
          'days-not-selected':
            !selectedDaysOfWeek[index].length && !useCheckBox,
        }"
      >
        <i
          class="fas fa-fan remove-item-action"
          title="Traitement en cours ..."
        ></i>
      </b-col>
    </b-row>
    <b-row
      class="mb-3"
      v-if="
        allowedToEdit &&
        !isTimeRangeUpdating &&
        (undefined === maxAllowedRanges ||
          selectedDaysOfWeek.length < maxAllowedRanges) &&
        (!useCheckBox || (useCheckBox && checkedDaysOfWeek.length))
      "
    >
      <div
        class="float-left add-item-action ml-3"
        @click="onOpeningRangeAdd"
        id="add-time-range"
      >
        <i class="fas fa-plus"></i> Ajouter des horaires
      </div>
    </b-row>
  </b-container>
</template>

<script lang="ts" setup>
import {
  weekDays as weekDaysData,
  openCloseDate as openCloseDateData,
} from "@/Interface/partnershipFolderDatas";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import { normalizer } from "@/helpers";
import {useDP} from "@/mixins/useDP";

let store = useStore();
let { verifyFields } = useDP();

let props = defineProps([
  "parentEntityName",
  "parentEntity",
  "timeRanges",
  "allowedToEdit",
  "customClassName",
  "useCheckBox",
  "isOpeningRange",
  "maxAllowedRanges",
  "verifyFields",
  "updateTimeRanges",
  "openCloseEnabled",
  "isCampaign",
]);

let weekDays = ref(weekDaysData);
let openCloseDate = ref(openCloseDateData);
let startTimes = ref([]);
let endTimes = ref([]);
let dates = ref([]);
let openingRanges = ref([]);
let selectedDaysOfWeek = ref([]);
let checkedDaysOfWeek = ref([]);
let currentTimeRanges = ref([]);
let isTimeRangeUpdating = ref(false);
let isNewOpenRange = ref(null);
let _timeRanges = ref([]);
let currentIndex = ref(-1);
let isOpeningRanges = ref([]);
let _isCampaign = ref(false);
let previousEditedValue = ref(null);

onMounted(() => {
  _timeRanges = [];
  _isCampaign = isCampaign || false;

  let timeout = window.setInterval(() => {
    if (!timeRanges) {
      return;
    }
    window.clearInterval(timeout);
    _timeRanges = timeRanges
      ? Array.from(
          timeRanges.filter(
            (openingRange: { isCampaign: boolean }) =>
              _isCampaign.value === openingRange.isCampaign
          )
        )
      : [];
    initializeTimeRanges();
  }, 50);
});

let updatePartnerPropertyFromForm = (value: any) =>
  store.dispatch("account/updatePartnerPropertyFromForm", value);
let deletePartnerPropertyFromForm = (value: any) =>
  store.dispatch("account/deletePartnerPropertyFromForm", value);

let onFocus = (event: { target: { value: any } }, index: number) => {
  previousEditedValue.value = event.target.value;
  currentIndex.value = index;
};
let onOpeningRangeDayChange = (selectedDayOfWeek: any, index: number) => {
  loadCurrentRange(index);

  if (!startTimes.value[index] || !endTimes.value[index]) {
    return;
  }

  isTimeRangeUpdating.value = true;

  let newTimeRange = {
    dayOfWeek: getDayValue(selectedDayOfWeek),
    startTime: normalizer.strTimeToSeconds(startTimes.value[index]),
    endTime: normalizer.strTimeToSeconds(endTimes.value[index]),
    isOpeningRange: getIsOpeningRange(index),
    isCampaign: _isCampaign,
  };
  newTimeRange.value[parentEntityName] = parentEntity["@id"];

  let data = {
    openingRange: newTimeRange,
  };

  return updatePartnerPropertyFromForm({ data: data }).then((response) => {
    isTimeRangeUpdating.value = false;
    let timeRange = response && response[0] ? response[0] : data.openingRange;
    updateCurrentTimeRanges(timeRange);
    initializeTimeRanges();
    verifyFields && verifyFields();
  });
};
let onOpeningRangeTimeChange = (time: string, index: number) => {
  // Time format HH:MM
  if (
    !/^\d{1,2}:\d{2}$/.test(time) ||
    previousEditedValue.value === time ||
    !endTimes.value[index] ||
    !startTimes.value[index] ||
    !selectedDaysOfWeek.value[index].length
  ) {
    return;
  }

  isTimeRangeUpdating.value = true;
  Promise.all(
    selectedDaysOfWeek.value[index].map((selectedDayOfWeek: any) => {
      let currentOpeningRange = {
        dayOfWeek: getDayValue(selectedDayOfWeek),
        startTime: normalizer.strTimeToSeconds(startTimes.value[index]),
        endTime: normalizer.strTimeToSeconds(endTimes.value[index]),
      };
      let openingRangeFound = currentTimeRanges.value.find(
        (currentOpeningRange) =>
          currentOpeningRange.dayOfWeek === getDayValue(selectedDayOfWeek)
      );
      let data = {};

      if (openingRangeFound) {
        data = {
          openingRange: openingRangeFound,
          payload: currentOpeningRange,
        };
      } else {
        currentOpeningRange = {
          ...currentOpeningRange,
          isOpeningRange: getIsOpeningRange(index),
          isCampaign: _isCampaign,
        };
        currentOpeningRange[parentEntityName] = parentEntity["@id"];
        data.openingRange = currentOpeningRange;
      }

      return updatePartnerPropertyFromForm({
        data,
        showNotification: false,
      }).then((response) => {
        let timeRange =
          response && response[0] ? response[0] : data.openingRange;
        updateCurrentTimeRanges(timeRange);
      });
    })
  )
    .then(() => {
      _timeRanges.value = _timeRanges.value.filter((item) => item.id);
      afterUpdateTimeRangesSuccess();
    })
    .catch(() => afterUpdateTimeRangesFailed())
    .finally(() => afterUpdateTimeRangesFinally());
};
let onOpenCloseChange = (index: string | number) => {
  // Time format HH:MM
  if (
    !endTimes[index] ||
    !startTimes[index] ||
    !selectedDaysOfWeek[index].length
  ) {
    return;
  }

  let startTime = normalizer.strTimeToSeconds(startTimes[index]);
  let endTime = normalizer.strTimeToSeconds(endTimes[index]);
  let isOpeningRange = isOpeningRanges[index];
  isTimeRangeUpdating = true;
  Promise.all(
    selectedDaysOfWeek[index].map((selectedDayOfWeek: any) => {
      let currentOpeningRange = {
        dayOfWeek: getDayValue(selectedDayOfWeek),
        startTime,
        endTime,
      };
      let openingRangeFound = findPartnerOpeningRange(currentOpeningRange);
      let data = {};
      if (openingRangeFound) {
        data = {
          openingRange: openingRangeFound,
          payload: {
            isOpeningRange,
            isCampaign: _isCampaign,
          },
        };
      } else {
        currentOpeningRange[parentEntityName] = parentEntity["@id"];
        data.openingRange = {
          ...currentOpeningRange,
          isOpeningRange,
          isCampaign: _isCampaign,
        };
      }

      return updatePartnerPropertyFromForm({
        data,
        showNotification: false,
      }).then((response) => {
        let timeRange =
          response && response[0] ? response[0] : data.openingRange;
        updateCurrentTimeRanges(timeRange);
      });
    })
  )
    .then(() => {
      _timeRanges = _timeRanges.value.filter((item) => item.id);
      afterUpdateTimeRangesSuccess();
    })
    .catch(() => afterUpdateTimeRangesFailed())
    .finally(() => afterUpdateTimeRangesFinally());
};
let onDayOfWeekChecked = (checkedDaysOfWeek: any[]) => {
  currentIndex.value = -1;
  if (checkedDaysOfWeek.length && !selectedDaysOfWeek.value.length) {
    onOpeningRangeAdd(null, checkedDaysOfWeek);
  }

  selectedDaysOfWeek.value.map((item, index, array) => {
    array[index] = checkedDaysOfWeek.map((day: any) => {
      return getDayLabel(day);
    });
  });

  // Add new
  let newDays = checkedDaysOfWeek.filter(
    (dayOfWeek: any) => !checkedDaysOfWeek.includes(dayOfWeek)
  );
  let hasAdded = false;
  let finishToAdd = false;
  if (newDays.length) {
    isTimeRangeUpdating = true;
  }
  Promise.all(
    newDays.map((dayOfWeek: any) => {
      return Promise.all(
        selectedDaysOfWeek.value.map((item, index) => {
          let startTime = startTimes[index];
          let endTime = endTimes[index];
          if (
            undefined === startTime ||
            null === startTime ||
            undefined === endTime ||
            null === endTime
          ) {
            return;
          }

          let openingRange = {
            dayOfWeek: dayOfWeek,
            startTime: normalizer.strTimeToSeconds(startTime),
            endTime: normalizer.strTimeToSeconds(endTime),
            isOpeningRange: getIsOpeningRange(index),
            isCampaign: _isCampaign,
          };
          openingRange[parentEntityName] = parentEntity["@id"];

          return updatePartnerPropertyFromForm({
            data: { openingRange },
            showNotification: false,
          }).then((response) => {
            hasAdded = true;
            let timeRange =
              response && response[0] ? response[0] : openingRange;
            updateCurrentTimeRanges(timeRange);
          });
        })
      );
    })
  )
    .then(() => hasAdded && afterUpdateTimeRangesSuccess())
    .catch(() => afterUpdateTimeRangesFailed())
    .finally(() => (finishToAdd = true));

  // Delete old
  let oldDays = checkedDaysOfWeek.filter(
    (dayOfWeek: any) => !checkedDaysOfWeek.includes(dayOfWeek)
  );
  let hasDeleted = false;
  let finishToDelete = false;
  if (oldDays.length) {
    isTimeRangeUpdating = true;
  }
  Promise.all(
    oldDays.map((dayOfWeek: any) => {
      return Promise.all(
        selectedDaysOfWeek.value.map((item, index) => {
          let openingRange = findPartnerOpeningRange({
            dayOfWeek,
            startTime: normalizer.strTimeToSeconds(startTimes[index]),
            endTime: normalizer.strTimeToSeconds(endTimes[index]),
          });

          return deletePartnerPropertyFromForm({
            data: {
              openingRange: openingRange,
            },
            showNotification: false,
          }).then(() => {
            hasDeleted = true;
            let timeRangeIdx = _timeRanges.value.findIndex(
              (item) =>
                item.dayOfWeek === openingRange.dayOfWeek &&
                item.startTime === openingRange.startTime &&
                item.endTime === openingRange.endTime
            );
            _timeRanges.value.splice(timeRangeIdx, 1);
            initializeTimeRanges();
          });
        })
      );
    })
  )
    .then(() => hasDeleted && notifySuccess("Donnée supprimée !"))
    .catch(() => afterUpdateTimeRangesFailed())
    .finally(() => (finishToDelete = true));

  let interval = setInterval(() => {
    if (finishToAdd && finishToDelete) {
      clearInterval(interval);
      isTimeRangeUpdating = false;
      verifyFields && verifyFields();
    }
  }, 50);
};
let updateCurrentTimeRanges = (timeRange: any) => {
  let timeRangeFound = false;
  _timeRanges = _timeRanges.value.map((_timeRange) => {
    if (isSameTimeRange(_timeRange, timeRange)) {
      timeRangeFound = true;
      return timeRange;
    }
    return _timeRange;
  });

  if (!timeRangeFound) {
    _timeRanges.value.push(timeRange);
  }

  updateTimeRanges && updateTimeRanges(_timeRanges);
};
let onOpeningRangeAdd = (event: null, selectedDaysOfWeek: any[]) => {
  let newDaysOfWeek = [];
  if (props.useCheckBox) {
    newDaysOfWeek = (selectedDaysOfWeek || checkedDaysOfWeek).map((day: any) =>
      getDayLabel(day)
    );
  }
  selectedDaysOfWeek.push(newDaysOfWeek);
  isOpeningRanges.value.push(true);
};
let onDayOfWeekRemove = (
  day: any,
  index: string | number,
  dates = null,
  showNotification = false
) => {
  currentIndex = index;
  let startTime = null === dates ? startTimes[index] : dates.startTime;
  let endTime = null === dates ? endTimes[index] : dates.endTime;
  let timeRangeFound = findPartnerOpeningRange({
    dayOfWeek: getDayValue(day),
    startTime: startTime ? normalizer.strTimeToSeconds(startTime) : undefined,
    endTime: endTime ? normalizer.strTimeToSeconds(endTime) : undefined,
    isOpeningRange: getIsOpeningRange(index),
  });

  if (timeRangeFound) {
    isTimeRangeUpdating = true;
    return deletePartnerPropertyFromForm({
      data: {
        openingRange: timeRangeFound,
      },
      showNotification: showNotification,
    }).then(() => {
      let timeRangeIdx = _timeRanges.value.findIndex((item) =>
        isSameTimeRange(timeRangeFound, item)
      );
      _timeRanges.value.splice(timeRangeIdx, 1);
      initializeTimeRanges();
      isTimeRangeUpdating = false;
      verifyFields && verifyFields();
    });
  }

  return Promise.resolve();
};
let onOpeningRangeRemove = (index: string | number) => {
  currentIndex = index;
  isTimeRangeUpdating = true;
  Promise.all(
    selectedDaysOfWeek[index].map((selectedDayOfWeek: any) =>
      onDayOfWeekRemove(selectedDayOfWeek, index, null, false)
    )
  )
    .then(() => afterUpdateTimeRangesSuccess())
    .catch(() => afterUpdateTimeRangesFailed())
    .finally(() => afterUpdateTimeRangesFinally());
};
let getDayLabel = (dayValue: number) => {
  return dayValue
    ? weekDays.value.find((item) => item.value === dayValue).text
    : null;
};
let getDayValue = (dayText: string) => {
  return dayText
    ? weekDays.value.find((item) => item.text === dayText).value
    : null;
};
let getAvailableDaysOfWeek = (index: string | number) => {
  return weekDays.value
    .map((item) => item.text)
    .filter((day) => -1 === selectedDaysOfWeek[index].indexOf(day));
};
let findPartnerOpeningRange = (openingRange: {
  dayOfWeek: any;
  startTime: any;
  endTime: any;
  isOpeningRange?: any;
}) => {
  return _timeRanges.value.find(
    (item) =>
      item.dayOfWeek === openingRange.dayOfWeek &&
      item.startTime === openingRange.startTime &&
      item.endTime === openingRange.endTime &&
      (undefined === openingRange.isOpeningRange ||
        item.isOpeningRange === openingRange.isOpeningRange)
  );
};
let initializeTimeRanges = () => {
  let filteredTimeRanges = _timeRanges.value.filter((item) => item.id);
  if (!allowedToEdit) {
    _timeRanges = filteredTimeRanges;
  }

  let timeRanges: never[] = [];
  let selectedDaysOfWeek: any[] = [];
  let startTimes: any[] = [];
  let endTimes: any[] = [];
  let dates: any[] = [];
  let isOpeningRanges: any[] = [];

  _timeRanges.value.forEach((item) => {
    if (item.date) {
      dates[item.id] = new Date(item.date).toLocaleDateString();
    } else {
      timeRanges.push(item);
    }
  });

  let alreadyProcessedRanges: string[] = [];
  timeRanges
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
    .forEach((item) => {
      let currentRange = `${item.startTime}:${item.endTime}:${item.isOpeningRange}`;
      let indexOfRange = alreadyProcessedRanges.indexOf(currentRange);
      if (-1 !== indexOfRange) {
        selectedDaysOfWeek[indexOfRange].push(getDayLabel(item.dayOfWeek));
      } else {
        selectedDaysOfWeek.push([getDayLabel(item.dayOfWeek)]);
        alreadyProcessedRanges.push(currentRange);
        startTimes.push(
          undefined !== item.startTime && null !== item.startTime
            ? normalizer.secondsToStrTime(item.startTime)
            : null
        );
        endTimes.push(
          undefined !== item.endTime && null !== item.endTime
            ? normalizer.secondsToStrTime(item.endTime)
            : null
        );
        isOpeningRanges.push(item.isOpeningRange);
      }
    });

  selectedDaysOfWeek = selectedDaysOfWeek;
  startTimes = startTimes;
  endTimes = endTimes;
  dates = dates;
  isOpeningRanges = isOpeningRanges;

  checkedDaysOfWeek = [
    ...new Set(_timeRanges.value.map((openingRange) => openingRange.dayOfWeek)),
  ];

  updateTimeRanges && updateTimeRanges(_timeRanges);
};
let isSameTimeRange = (timeRange1: never, timeRange2: never) => {
  return (
    (undefined !== timeRange1.id && timeRange1.id === timeRange2.id) ||
    (timeRange2.dayOfWeek === timeRange1.dayOfWeek &&
      timeRange2.startTime === timeRange1.startTime &&
      timeRange2.endTime === timeRange1.endTime &&
      timeRange2.isOpeningRange === timeRange1.isOpeningRange)
  );
};
let loadCurrentRange = (index: string | number) => {
  currentTimeRanges = _timeRanges.value.filter(
    (item) =>
      item.startTime === normalizer.strTimeToSeconds(startTimes[index]) &&
      item.endTime === normalizer.strTimeToSeconds(endTimes[index])
  );
};
let getIsOpeningRange = (index: number) => {
  return openCloseEnabled
    ? isOpeningRanges[index]
    : undefined !== isOpeningRange
    ? isOpeningRange
    : true;
};
let breakpointLayout = (
  parentEntityName: string,
  breakpointTrue: any,
  breakpointFalse: any
) => {
  return "agendaMember" === parentEntityName ? breakpointTrue : breakpointFalse;
};
let afterUpdateTimeRangesSuccess = () => {
  notifySuccess("Donnée sauvegardée !");
  initializeTimeRanges();
};
let afterUpdateTimeRangesFailed = () => {
  notifyFailure("Impossible de mettre à jour les informations du partenaire.");
};
let afterUpdateTimeRangesFinally = () => {
  isTimeRangeUpdating = false;
  verifyFields && verifyFields();
};
let notifySuccess = (message: string) => {
  store.dispatch("alert/success", {
    group: "general-error",
    type: "success",
    message,
    show: true,
    title: "Envoyé !",
  });
};
let notifyFailure = (message: string) => {
  store.dispatch("alert/error", {
    group: "general-error",
    message,
    show: true,
    title: "Erreur",
    type: "error",
  });
};
</script>
