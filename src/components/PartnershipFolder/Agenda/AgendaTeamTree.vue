<template>
  <b-container fluid id="team-tree">
    <b-row class="my-3 team-tree-label">
      <b-col sm="12" md="3" lg="2" class="p-0">
        <label class="label row-display">Combien d’équipiers avez-vous ?</label>
      </b-col>
      <b-col sm="12" md="1" lg="1" class="p-0">
        <strong>{{ numberOfMembers }}</strong>
      </b-col>
    </b-row>
    <b-row class="pages-container" id="team-tree-page">
      <b-col
        lg="6"
        md="12"
        sm="12"
        class="page-item mb-3"
        v-for="(item, index) in agendaMembers"
        :key="index"
      >
        <b-col class="mb-2 __title p-0" id="team-tree-title">
          <span class="__title">{{
            item.memberType
              ? item.memberType
              : index !== 0
              ? `Équipier ${index}`
              : "Manager"
          }}</span>
        </b-col>
        <i
          v-if="allowedToEdit && index !== 0"
          class="fas"
          :class="{ 'fa-trash': !isMemberRemoving, 'fa-fan': isMemberRemoving }"
          :disabled="isMemberRemoving"
          @click="onPageRemove(item, index)"
        ></i>
        <b-col class="mb-2 __description">
          <b-row class="team__input-separator __description__firstname">
            <b-col sm="12" md="3">
              <label class="team__label">Prénom :</label>
            </b-col>
            <b-col sm="12" md="9" class="__description__firstname-input">
              <ValidationProvider
                name="Prénom"
                rules="min:3"
                :ref="`agendaMembers[${index}].firstname`"
                v-slot="{ validate, classes, errors }"
              >
                <b-form-input
                  type="text"
                  @focus="onFocus"
                  @blur="
                    onBlur(
                      $event,
                      { agendaMember: agendaMembers[index] },
                      index
                    )
                  "
                  :class="classes"
                  :disabled="!allowedToEdit"
                  :readonly="!allowedToEdit"
                  :name="`agendaMembers[${index}].firstname`"
                  v-model="item.firstname"
                ></b-form-input>
                <small :class="classes">{{ errors[0] }}</small>
              </ValidationProvider>
            </b-col>
          </b-row>
          <b-row class="team__input-separator __description__name">
            <b-col sm="12" md="3">
              <label class="team__label">Nom :</label>
            </b-col>
            <b-col sm="12" md="9" class="__description__name-input">
              <ValidationProvider
                name="Nom"
                rules="min:3"
                :ref="`agendaMembers[${index}].lastname`"
                v-slot="{ classes, errors }"
              >
                <b-form-input
                  type="text"
                  @focus="onFocus"
                  @blur="
                    onBlur(
                      $event,
                      { agendaMember: agendaMembers[index] },
                      index
                    )
                  "
                  :class="classes"
                  :disabled="!allowedToEdit"
                  :readonly="!allowedToEdit"
                  :name="`agendaMembers[${index}].lastname`"
                  v-model="item.lastname"
                ></b-form-input>
                <small :class="classes">{{ errors[0] }}</small>
              </ValidationProvider>
            </b-col>
          </b-row>
          <b-row class="team__input-separator __description__phone">
            <b-col sm="12" md="3">
              <label class="team__label">Téléphone :</label>
            </b-col>
            <b-col sm="12" md="9" class="__description__phone-input">
              <ValidationProvider
                name="Téléphone"
                rules="digits:10"
                :ref="`agendaMembers[${index}].phone`"
                v-slot="{ classes, errors }"
              >
                <b-form-input
                  type="tel"
                  @focus="onFocus"
                  @blur="
                    onBlur($event, {
                      agendaMember: agendaMembers[index],
                      index,
                    })
                  "
                  :class="classes"
                  :disabled="!allowedToEdit"
                  :readonly="!allowedToEdit"
                  :name="`agendaMembers[${index}].phone`"
                  v-model="item.phone"
                ></b-form-input>
                <small :class="classes">{{ errors[0] }}</small>
              </ValidationProvider>
            </b-col>
          </b-row>
          <b-row class="team__input-separator __description__mail">
            <b-col sm="12" md="3">
              <label class="team__label">Mail :</label>
            </b-col>
            <b-col sm="12" md="9" class="__description__mail-input">
              <ValidationProvider
                name="Email"
                rules="min:8|email"
                :ref="`agendaMembers[${index}].email`"
                v-slot="{ classes, errors }"
              >
                <b-form-input
                  type="email"
                  @focus="onFocus"
                  @blur="
                    onBlur(
                      $event,
                      { agendaMember: agendaMembers[index] },
                      index
                    )
                  "
                  :class="classes"
                  :disabled="!allowedToEdit"
                  :readonly="!allowedToEdit"
                  :name="`agendaMembers[${index}].email`"
                  v-model="item.email"
                ></b-form-input>
                <small :class="classes">{{ errors[0] }}</small>
              </ValidationProvider>
            </b-col>
          </b-row>
          <b-row class="team__input-separator __description__role">
            <b-col sm="12" md="3">
              <label class="team__label">Rôle :</label>
            </b-col>
            <b-col sm="12" md="9" class="__description__role-input">
              <ValidationProvider
                name="Rôle"
                rules="oneOf:Administration,Planifier,Visualiser"
                :ref="`agendaMembers[${index}].role`"
                v-slot="{ classes, errors }"
              >
                <b-form-select
                  type="select"
                  @change="
                    onBlur(
                      $event,
                      { agendaMember: agendaMembers[index] },
                      index
                    )
                  "
                  v-model="item.role"
                  :options="agendaRoleList"
                  :disabled="!allowedToEdit"
                  :readonly="!allowedToEdit"
                  :name="`agendaMembers[${index}].role`"
                >
                </b-form-select>
                <small :class="classes">{{ errors[0] }}</small>
              </ValidationProvider>
            </b-col>
          </b-row>
          <b-row class="team__input-separator __description__services">
            <b-col sm="12" md="3">
              <label class="team__label">Services réalisé :</label>
            </b-col>
            <b-col sm="12" md="9" class="__description__services-input">
              <ValidationProvider
                name="Services réalisé"
                rules="min:3"
                :ref="`agendaMembers[${index}].realizedService`"
                v-slot="{ classes, errors }"
              >
                <b-form-input
                  type="text"
                  @focus="onFocus"
                  @blur="
                    onBlur(
                      $event,
                      { agendaMember: agendaMembers[index] },
                      index
                    )
                  "
                  :class="classes"
                  :disabled="!allowedToEdit"
                  :readonly="!allowedToEdit"
                  :name="`agendaMembers[${index}].realizedService`"
                  v-model="item.realizedService"
                ></b-form-input>
                <small :class="classes">{{ errors[0] }}</small>
              </ValidationProvider>
            </b-col>
          </b-row>
          <b-row class="team__input-separator __description__hours">
            <b-col sm="12" md="4">
              <label class="team__label">Horaires :</label>
            </b-col>
          </b-row>
          <b-row class="team__input-separator __description__hours">
            <b-col cols="12" class="__description__hours-input">
              <TimeRanges
                parentEntityName="agendaMember"
                v-bind:parentEntity="item"
                v-bind:timeRanges="item.appointmentTimeRanges"
                v-bind:allowedToEdit="allowedToEdit && item.id"
                customClassName="justify-content-center"
              />
            </b-col>
          </b-row>
        </b-col>
      </b-col>
      <b-col
        lg="6"
        md="12"
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
        <p class="agenda__informations">
          Par défaut sur le module affiché sur le site, nous allons afficher le
          prénom, le service et le prix
        </p>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts" setup>
import { useStore } from "vuex";
import {
  agendaRoleList as agendaRoleListData,
  memberType as memberTypeData,
} from "@/Interface/partnershipFolderDatas";
import TimeRanges from "@/components/PartnershipFolder/TimeRanges.vue";
import {useDP} from "@/mixins/useDP";
import { computed, onMounted, ref } from "vue";

const store = useStore();
const { allowedToEdit } = useDP();

const memberType = ref(memberTypeData);
const agendaRoleList = ref(agendaRoleListData);
const previousEditedValue = ref(null);
const agendaMembers = ref([]);
const initialMemberCount = ref(0);
const isMemberRemoving = ref(false);

const identity = computed(() => store.state.account.identity);
const currentPartnerFolder = computed(
  () => store.state.account.currentPartnerFolder
);
const warn = computed(() => store.state.alertStore.warn);
const numberOfMembers = computed(() => {
  currentPartnerFolder.value.agenda.membersLength =
    currentPartnerFolder.value.agenda.agendaMembers.length;
  return currentPartnerFolder.value.agenda.membersLength;
});

onMounted(() => {
  initialMemberCount.value =
    currentPartnerFolder.value.agenda.agendaMembers.length;
  let index = 0;
  if (!initialMemberCount.value) {
    while (currentPartnerFolder.value.agenda.agendaMembers.length < 2) {
      currentPartnerFolder.value.agenda.agendaMembers.push({
        agenda: currentPartnerFolder.value.agenda["@id"],
        role: index ? "Planifier" : "Administration",
      });
      index++;
    }
  }

  reloadAgendaMembers();
});

const updatePartnerPropertyFromForm = (value: any) =>
  store.dispatch("account/updatePartnerPropertyFromForm", value);
const deletePartnerPropertyFromForm = (value: any) =>
  store.dispatch("account/deletePartnerPropertyFromForm", value);

const onFocus = (event: { target: { value: null } }) => {
  previousEditedValue.value = event.target.value;
};

const onBlur = (
  event: { target: { name: string | number } },
  data: { agendaMember: { id: any; agenda: any; memberType: string } },
  index = 0
) => {
  const provider = ref[event.target.name];
  if (data.agendaMember && !data.agendaMember.id) {
    data.agendaMember.agenda = currentPartnerFolder.value.agenda["@id"];
  }

  data.agendaMember.memberType = 0 === index ? "Manager" : `Équipier ${index}`;

  updatePartnerPropertyFromForm({
    event: event,
    provider: provider[0] || provider,
    data: data
      ? Object.assign({ previousEditedValue: previousEditedValue }, data)
      : undefined,
  }).then(() => {
    if (initialMemberCount.value) {
      currentPartnerFolder.value.agenda.agendaMembers =
        currentPartnerFolder.value.agenda.agendaMembers.filter(
          (item: { id: any }) => item.id
        );
    }
    reloadAgendaMembers();
  });
};

const checkIfAnyAgendaMemberIdIsNotDefined = () => {
  return currentPartnerFolder.value.agenda.agendaMembers.find(
    (agendaMember: { id: any }) => !agendaMember.id
  );
};

const onPageAdd = () => {
  const members = currentPartnerFolder.value.agenda.agendaMembers;
  if (members.length && checkIfAnyAgendaMemberIdIsNotDefined()) {
    store.dispatch(
      "alert/warn",
      {
        group: "auth-error",
        message:
          "Veuillez remplir le dernier équipier avant d'en ajouter un autre.",
        show: true,
        title: "Vous ne pouvez pas ajouter un équipier",
        type: "error",
        duration: 3000,
      },
      { root: true }
    );
    return;
  }
  currentPartnerFolder.value.agenda.agendaMembers.push({
    agenda: currentPartnerFolder.value.agenda["@id"],
    appointmentTimeRanges: [],
  });
};

const onPageRemove = (agendaMember: { id: any }, index: any) => {
  if (isMemberRemoving.value) {
    return;
  }
  isMemberRemoving.value = true;
  if (agendaMember && agendaMember.id) {
    deletePartnerPropertyFromForm({
      data: { agendaMember: agendaMember },
    })
      .then(() => reloadAgendaMembers())
      .finally(() => (isMemberRemoving.value = false));
  } else {
    currentPartnerFolder.value.agenda.agendaMembers.splice(index, 1);
    reloadAgendaMembers();
    isMemberRemoving.value = false;
  }
};

const reloadAgendaMembers = () => {
  if (
    !currentPartnerFolder.value.agenda ||
    !currentPartnerFolder.value.agenda.agendaMembers
  ) {
    agendaMembers.value = [];
    return;
  }

  const index = currentPartnerFolder.value.agenda.agendaMembers.findIndex(
    (item: { memberType: string }) => "Manager" === item.memberType
  );
  if (0 < index) {
    currentPartnerFolder.value.agenda.agendaMembers = [
      ...currentPartnerFolder.value.agenda.agendaMembers.splice(index, 1),
      ...currentPartnerFolder.value.agenda.agendaMembers,
    ];
  }

  agendaMembers.value = currentPartnerFolder.value.agenda.agendaMembers;
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/Pfolder/partnership-folder.scss";
@import "@/assets/style/Pfolder/page-details.scss";
</style>
