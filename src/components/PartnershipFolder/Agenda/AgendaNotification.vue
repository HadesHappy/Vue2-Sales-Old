<template>
  <b-container fluid id="notification-agenda">
    <b-row class="mt-3 my-3">
      <b-col lg="6" md="8" sm="4">
        <span class="mr-3"
          >Par défaut, votre client recevra un rappel du RDV par SMS la veille
          du RDV. Est-ce que cela vous convient ?</span
        >
      </b-col>
      <b-col lg="1" md="2" sm="3">
        <ValidationProvider
          name="Appel veille rdv"
          :rules="{ required: false }"
          ref="currentPartnerFolder.agenda.notifyBySms"
          v-slot="{ classes, errors }"
        >
          <b-form-radio
            @change="
              onBlur($event, {
                agenda: currentPartnerFolder.agenda,
                type: 'bool',
              })
            "
            type="radio"
            name="currentPartnerFolder.agenda.notifyBySms"
            v-model="currentPartnerFolder.agenda.notifyBySms"
            :value="true"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
          >
            Oui
          </b-form-radio>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
      <b-col lg="1" md="2" sm="3">
        <ValidationProvider
          name="Appel veille rdv"
          :rules="{ required: false }"
          ref="currentPartnerFolder.agenda.notifyBySms"
          v-slot="{ classes, errors }"
        >
          <b-form-radio
            @change="
              onBlur($event, {
                agenda: currentPartnerFolder.agenda,
                type: 'bool',
              })
            "
            type="radio"
            name="currentPartnerFolder.agenda.notifyBySms"
            v-model="currentPartnerFolder.agenda.notifyBySms"
            :value="false"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
          >
            Non
          </b-form-radio>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col>
        <p class="__important__informations">
          A titre d’information, toutes les notifications suivantes seront par
          défaut envoyées par SMS :
        </p>
        <p class="__informations">
          Notifications reçues par défaut par le manager et l’équipier concerné
          : prise d’un nouveau RDV, annulation de RDV par le client, le client a
          demandé à changer son RDV. <br />
          Notifications reçues par défaut par le client : confirmation de rdv,
          rappel de RDV, modification ou annulation de son RDV, rendez-vous non
          honoré
        </p>
      </b-col>
    </b-row>
    <b-row class="mt-3 my-3">
      <b-col lg="4" md="8" sm="4">
        <span class="mr-3"
          >Souhaitez-vous demander par mail au client son avis après le RDV
          ?</span
        >
      </b-col>
      <b-col lg="1" md="2" sm="3">
        <ValidationProvider
          name="Appel veille rdv"
          :rules="{ required: false }"
          ref="currentPartnerFolder.agenda.adviseConfirmation"
          v-slot="{ classes, errors }"
        >
          <b-form-radio
            @change="
              onBlur($event, {
                agenda: currentPartnerFolder.agenda,
                type: 'bool',
              })
            "
            type="radio"
            name="currentPartnerFolder.agenda.adviseConfirmation"
            v-model="currentPartnerFolder.agenda.adviseConfirmation"
            :value="true"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
          >
            Oui
          </b-form-radio>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
      <b-col lg="1" md="2" sm="3">
        <ValidationProvider
          name="Appel veille rdv"
          :rules="{ required: false }"
          ref="currentPartnerFolder.agenda.adviseConfirmation"
          v-slot="{ classes, errors }"
        >
          <b-form-radio
            @change="
              onBlur($event, {
                agenda: currentPartnerFolder.agenda,
                type: 'bool',
              })
            "
            type="radio"
            name="currentPartnerFolder.agenda.adviseConfirmation"
            v-model="currentPartnerFolder.agenda.adviseConfirmation"
            :value="false"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
          >
            Non
          </b-form-radio>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col>
        <p>
          Par défaut, chaque matin, le manager et l’équipier recevront par mail
          la liste des RDV de la journée.
        </p>
        <p>Renseignement sur le manager (s’il y en a un) :</p>
      </b-col>
    </b-row>
    <b-row class="team__input-separator __description__services">
      <b-col sm="12" md="1" class="mt-3">
        <label class="__important__label">Mail :</label>
      </b-col>
      <b-col sm="12" md="3" class="__description__services-input">
        <ValidationProvider
          name="Email manager"
          rules="min:3"
          ref="currentPartnerFolder.agenda.email"
          v-slot="{ classes, errors }"
        >
          <b-form-input
            type="text"
            @focus="onFocus"
            @blur="onBlur($event, { agenda: currentPartnerFolder.agenda })"
            :class="classes"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
            name="currentPartnerFolder.agenda.email"
            v-model="currentPartnerFolder.agenda.email"
            placeholder="Privilégier mail perso"
          ></b-form-input>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row class="team__input-separator __description__services">
      <b-col sm="12" md="1" class="mt-3">
        <label class="__important__label">Tél :</label>
      </b-col>
      <b-col sm="12" md="3" class="__description__services-input">
        <ValidationProvider
          name="Tél manager"
          rules="integer"
          ref="currentPartnerFolder.agenda.phone"
          v-slot="{ classes, errors }"
        >
          <b-form-input
            type="text"
            @focus="onFocus"
            @blur="onBlur($event, { agenda: currentPartnerFolder.agenda })"
            :class="classes"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
            name="currentPartnerFolder.agenda.phone"
            v-model="currentPartnerFolder.agenda.phone"
            placeholder="Veuillez saisir 10 chiffres"
          ></b-form-input>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col sm="12" md="4" class="p-0">
        <label class="form-description">Calendriers Sync - Facebook</label>
      </b-col>
    </b-row>
    <b-row class="mt-3 my-3">
      <b-col lg="6" md="8" sm="4">
        <span class="mr-3"
          >Avez-vous un agenda que vous souhaitez synchroniser avec cet outil ?
          (Outlook, Google Calendar, Windows Live ) :</span
        >
      </b-col>
      <b-col lg="1" md="2" sm="3">
        <ValidationProvider
          name="Agenda que vous souhaitez synchroniser"
          :rules="{ required: false }"
          ref="currentPartnerFolder.agenda.hasAgendaToSynchronize"
          v-slot="{ classes, errors }"
        >
          <b-form-radio
            @change="
              onBlur($event, {
                agenda: currentPartnerFolder.agenda,
                type: 'bool',
              })
            "
            type="radio"
            name="currentPartnerFolder.agenda.hasAgendaToSynchronize"
            v-model="currentPartnerFolder.agenda.hasAgendaToSynchronize"
            :value="true"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
          >
            Oui
          </b-form-radio>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
      <b-col lg="1" md="2" sm="3">
        <ValidationProvider
          name="Agenda que vous souhaitez synchroniser"
          :rules="{ required: false }"
          ref="currentPartnerFolder.agenda.hasAgendaToSynchronize"
          v-slot="{ classes, errors }"
        >
          <b-form-radio
            @change="
              onBlur($event, {
                agenda: currentPartnerFolder.agenda,
                type: 'bool',
              })
            "
            type="radio"
            name="currentPartnerFolder.agenda.hasAgendaToSynchronize"
            v-model="currentPartnerFolder.agenda.hasAgendaToSynchronize"
            :value="false"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
          >
            Non
          </b-form-radio>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row class="mt-3 team__input-separator __description__services">
      <b-col sm="12" md="2" class="p-0">
        <label>Quel calendrier synchroniser :</label>
      </b-col>
      <b-col lg="1" md="2" class="__description__services-input">
        <ValidationProvider
          name="Calendrier à synchroniser"
          :rules="{ required: false }"
          ref="currentPartnerFolder.agenda.calendarToSynchronize"
          v-slot="{ classes, errors }"
        >
          <b-form-group>
            <b-form-radio-group
              @change="onBlur($event, { agenda: currentPartnerFolder.agenda })"
              v-model="checkedCalendar"
              :options="agendaSyncCalendarList"
              name="currentPartnerFolder.agenda.calendarToSynchronize"
              :disabled="!allowedToEdit"
              :readonly="!allowedToEdit"
              stacked
            ></b-form-radio-group>
          </b-form-group>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
      <b-col
        v-if="isOtherCalendarTypeChecked()"
        sm="12"
        md="12"
        lg="4"
        class="input-element"
      >
        <ValidationProvider
          name="Autre calendrier"
          rules="min:3"
          v-slot="{ classes, errors }"
        >
          <b-form-input
            @focus="onFocus"
            placeholder="Saisissez un autre calendrier"
            @blur="onBlur($event, { agenda: currentPartnerFolder.agenda })"
            name="currentPartnerFolder.agenda.calendarToSynchronize"
            type="text"
            :class="classes"
            v-model="otherCalendarToSynchronize"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
          ></b-form-input>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts" setup>
import { useStore } from "vuex";
import { agendaSyncCalendarList as agendaSyncCalendarListData } from "@/Interface/partnershipFolderDatas";
import {useDP} from "@/mixins/useDP";
import { computed, onMounted, ref, type ComputedRef } from "vue";

const store = useStore();
const { allowedToEdit } = useDP();

const identity = computed(() => store.state.account.identity);
const currentPartnerFolder = computed(
  () => store.state.account.currentPartnerFolder
);
const calendarToSync = computed(() => {
  return currentPartnerFolder.value.agenda.calendarToSynchronize;
});

const agendaSyncCalendarList = ref(agendaSyncCalendarListData);
const checkedCalendar = ref(null);
const otherCalendarToSynchronize = ref(null);
const previousEditedValue = ref(null);

const updatePartnerPropertyFromForm = (value: any) =>
  store.dispatch("account/updatePartnerPropertyFromForm", value);

const onFocus = (event: { target: { value: any } }) => {
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
const isOtherCalendarTypeChecked = () => {
  return "Autre" === checkedCalendar.value;
};
const isCalendarToSynchronizeExists = (
  calendarName: string | ComputedRef<any>
) => {
  return agendaSyncCalendarList.value.some(
    (agendaToSync) => agendaToSync.text === calendarName
  );
};

onMounted(() => {
  if (isCalendarToSynchronizeExists(calendarToSync)) {
    checkedCalendar.value = calendarToSync;
  } else if (calendarToSync.value) {
    checkedCalendar.value = "Autre";
    otherCalendarToSynchronize.value = calendarToSync;
  }
});
</script>
