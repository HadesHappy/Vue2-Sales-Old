<template>
  <b-container fluid id="visio-tree">
    <b-row class="my-3">
      <b-col class="p-0">
        <label class="label row-display"
          >Pour quels services déjà listés ci-dessus souhaitez vous proposer la
          visio :</label
        >
      </b-col>
    </b-row>
    <b-row class="pages-container" id="visio-tree-page">
      <b-col
        lg="4"
        md="6"
        sm="12"
        class="page-item mb-3"
        v-for="(agendaVisio, index) in currentPartnerFolder.agenda.agendaVisios"
        :key="index"
      >
        <b-col class="mb-2 __title p-0">
          <span class="__title">{{
            index !== 0 ? `Service ${index}` : `Service`
          }}</span>
        </b-col>
        <i
          class="fas fa-trash"
          v-if="
            allowedToEdit &&
            currentPartnerFolder.agenda.agendaVisios &&
            currentPartnerFolder.agenda.agendaVisios.length > 1
          "
          @click="onPageRemove(agendaVisio, index)"
        ></i>
        <b-col class="mb-2 __description">
          <b-row class="team__input-separator __description__visio_name">
            <b-col>
              <label class="team__label">Nom du service :</label>
            </b-col>
          </b-row>
          <b-row class="justify-content-left">
            <b-col cols="12" class="ml-1 pr-4 __description__visio_name-input">
              <ValidationProvider
                name="Nom du service"
                rules="min:3"
                :ref="`currentPartnerFolder.agenda.agendaVisios.${index}.name`"
                v-slot="{ validate, classes, errors }"
              >
                <b-form-input
                  type="text"
                  @focus="onFocus"
                  @blur="
                    onBlur($event, {
                      agendaVisio:
                        currentPartnerFolder.agenda.agendaVisios[index],
                    })
                  "
                  :class="classes"
                  :disabled="!allowedToEdit || isUpdating"
                  :readonly="!allowedToEdit"
                  :name="`currentPartnerFolder.agenda.agendaVisios.${index}.name`"
                  v-model="agendaVisio.name"
                ></b-form-input>
                <small :class="classes">{{ errors[0] }}</small>
              </ValidationProvider>
            </b-col>
          </b-row>
          <b-row class="mt-3 team__input-separator __description__name">
            <b-col>
              <label class="team__label">Ce service doit-il exister :</label>
            </b-col>
          </b-row>
          <b-row class="justify-content-left ml-1">
            <b-col md="3" lg="3" sm="12">
              <ValidationProvider
                name="Service existant sur place"
                :rules="{ required: false }"
                :ref="`currentPartnerFolder.agenda.agendaVisios.${index}.isOnSpot`"
                v-slot="{ classes, errors }"
              >
                <label>
                  <b-form-checkbox
                    type="checkbox"
                    @change="
                      onBlur($event, {
                        agendaVisio:
                          currentPartnerFolder.agenda.agendaVisios[index],
                        type: 'bool',
                      })
                    "
                    :name="`currentPartnerFolder.agenda.agendaVisios.${index}.isOnSpot`"
                    v-model="agendaVisio.isOnSpot"
                    :disabled="!allowedToEdit || isUpdating"
                    :readonly="!allowedToEdit"
                  >
                    Sur place
                  </b-form-checkbox>
                </label>
                <small :class="classes">{{ errors[0] }}</small>
              </ValidationProvider>
            </b-col>
            <b-col md="3" lg="3" sm="12">
              <ValidationProvider
                name="Service existant en visio"
                :rules="{ required: false }"
                :ref="`currentPartnerFolder.agenda.agendaVisios.${index}.isRemote`"
                v-slot="{ classes, errors }"
              >
                <label>
                  <b-form-checkbox
                    type="checkbox"
                    @change="
                      onBlur($event, {
                        agendaVisio:
                          currentPartnerFolder.agenda.agendaVisios[index],
                        type: 'bool',
                      })
                    "
                    :name="`currentPartnerFolder.agenda.agendaVisios.${index}.isRemote`"
                    v-model="agendaVisio.isRemote"
                    :disabled="!allowedToEdit || isUpdating"
                    :readonly="!allowedToEdit"
                  >
                    En visio
                  </b-form-checkbox>
                </label>
                <small :class="classes">{{ errors[0] }}</small>
              </ValidationProvider>
            </b-col>
          </b-row>
          <b-row class="mt-3 team__input-separator __description__services">
            <b-col>
              <label class="team__label"
                >Souhaitez vous que nous utilisions notre solution ? :</label
              >
            </b-col>
          </b-row>
          <b-row class="justify-content-left ml-1">
            <b-col md="3" lg="3" sm="12">
              <ValidationProvider
                name="Utilisation de notre solution"
                :rules="{ required: false }"
                :ref="`currentPartnerFolder.agenda.agendaVisios.${index}.useOurSolution`"
                v-slot="{ classes, errors }"
              >
                <label>
                  <b-form-radio
                    type="radio"
                    @change="
                      onBlur($event, {
                        agendaVisio:
                          currentPartnerFolder.agenda.agendaVisios[index],
                        type: 'bool',
                      })
                    "
                    :name="`currentPartnerFolder.agenda.agendaVisios.${index}.useOurSolution`"
                    v-model="agendaVisio.useOurSolution"
                    :value="true"
                    :disabled="!allowedToEdit || isUpdating"
                    :readonly="!allowedToEdit"
                  >
                    Oui
                  </b-form-radio>
                </label>
                <small :class="classes">{{ errors[0] }}</small>
              </ValidationProvider>
            </b-col>
            <b-col md="3" lg="3" sm="12">
              <ValidationProvider
                name="Utilisation de notre solution"
                :rules="{ required: false }"
                :ref="`currentPartnerFolder.agenda.agendaVisios.${index}.useOurSolution`"
                v-slot="{ classes, errors }"
              >
                <label>
                  <b-form-radio
                    type="radio"
                    @change="
                      onBlur($event, {
                        agendaVisio:
                          currentPartnerFolder.agenda.agendaVisios[index],
                        type: 'bool',
                      })
                    "
                    :name="`currentPartnerFolder.agenda.agendaVisios.${index}.useOurSolution`"
                    v-model="agendaVisio.useOurSolution"
                    :value="false"
                    :disabled="!allowedToEdit || isUpdating"
                    :readonly="!allowedToEdit"
                  >
                    Non
                  </b-form-radio>
                </label>
                <small :class="classes">{{ errors[0] }}</small>
              </ValidationProvider>
            </b-col>
          </b-row>
          <b-row class="mt-3 team__input-separator __description__visio">
            <b-col>
              <label class="team__label"
                >Transmettez nous le lien vers votre outil de visio jitsi
                :</label
              >
            </b-col>
          </b-row>
          <b-row class="justify-content-left">
            <b-col cols="12" class="mb-1 ml-1 pr-4 __description__visio-input">
              <ValidationProvider
                name="Outil de visio"
                rules="min:3"
                :ref="`currentPartnerFolder.agenda.agendaVisios.${index}.toolUrl`"
                v-slot="{ classes, errors }"
              >
                <b-form-input
                  type="text"
                  @focus="onFocus"
                  @blur="
                    onBlur($event, {
                      agendaVisio:
                        currentPartnerFolder.agenda.agendaVisios[index],
                    })
                  "
                  :class="classes"
                  :disabled="!allowedToEdit || isUpdating"
                  :readonly="!allowedToEdit"
                  :name="`currentPartnerFolder.agenda.agendaVisios.${index}.toolUrl`"
                  v-model="agendaVisio.toolUrl"
                ></b-form-input>
                <small :class="classes">{{ errors[0] }}</small>
              </ValidationProvider>
            </b-col>
          </b-row>
        </b-col>
      </b-col>
      <b-col
        lg="4"
        md="6"
        sm="12"
        class="page-item sample-page mb-3"
        v-if="allowedToEdit"
      >
        <b-col class="mb-2 __title px-0 py-2" @click="onPageAdd">&nbsp;</b-col>
        <b-col class="mb-2 __description p-0" @click="onPageAdd">
          <i class="fas fa-plus"></i>
        </b-col>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <p class="visio__informations">
          Un service peut-être réalisé sur place ou en visio (exemple : une
          séance de Yoga). Les 2 peuvent donc être cochées.
        </p>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts" setup>
import { useStore } from "vuex";
import { yesNoOptions as yesNoOptionsData } from "@/Interface/partnershipFolderDatas";
import {useDP} from "@/mixins/useDP";
import { computed, ref } from "vue";

const store = useStore();
const { allowedToEdit } = useDP();

const identity = computed(() => store.state.account.identity);
const currentPartnerFolder = computed(
  () => store.state.account.currentPartnerFolder
);
const warn = computed(() => store.state.alertStore.warn);

const yesNoOptions = ref(yesNoOptionsData);
const previousEditedValue = ref(null);
const isUpdating = ref(false);

const updatePartnerPropertyFromForm = (value: any) =>
  store.dispatch("account/updatePartnerPropertyFromForm", value);
const deletePartnerPropertyFromForm = (value: any) =>
  store.dispatch("account/deletePartnerPropertyFromForm", value);

const onFocus = (event: { target: { value: null } }) => {
  previousEditedValue.value = event.target.value;
};
const onBlur = (
  event: { target: { name: string | number } },
  data: { agendaVisio: { id: any; agenda: any } }
) => {
  isUpdating.value = true;
  const provider = ref[event.target.name];
  if (data.agendaVisio && !data.agendaVisio.id) {
    data.agendaVisio.agenda = currentPartnerFolder.value.agenda["@id"];
  }

  updatePartnerPropertyFromForm({
    event: event,
    provider: provider[0] || provider,
    data: data
      ? Object.assign({ previousEditedValue: previousEditedValue }, data)
      : undefined,
  })
    .then(() => (isUpdating.value = false))
    .catch(() => (isUpdating.value = false));
};
const onPageAdd = () => {
  const visios = currentPartnerFolder.value.agenda.agendaVisios;
  if (visios.length && !visios[visios.length - 1].id) {
    store.dispatch(
      "alert/warn",
      {
        group: "auth-error",
        message:
          "Veuillez remplir le dernier service avant d'en ajouter un autre.",
        show: true,
        title: "Vous ne pouvez pas ajouter un service",
        type: "error",
        duration: 3000,
      },
      { root: true }
    );
    return;
  }
  currentPartnerFolder.value.agenda.agendaVisios.push({
    name: null,
    isOnSpot: null,
    isRemote: null,
    useOurSolution: null,
    toolUrl: null,
  });
};
const onPageRemove = (visio: { id: any }, index: any) => {
  if (visio && visio.id) {
    deletePartnerPropertyFromForm({
      data: { agendaVisio: visio },
    });
  } else {
    if (
      !currentPartnerFolder.value.agenda.agendaVisios ||
      currentPartnerFolder.value.agenda.agendaVisios.length <= 1
    ) {
      store.dispatch("alert/warn", {
        group: "general-error",
        type: "warn",
        message: "Veuillez saisir une description pour cet équipier.",
        show: true,
        title: "Vous ne pouvez pas supprimer un équipier vide",
      });
    } else {
      currentPartnerFolder.value.agenda.agendaVisios.splice(index, 1);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/Pfolder/partnership-folder.scss";
@import "@/assets/style/Pfolder/page-details.scss";
</style>
