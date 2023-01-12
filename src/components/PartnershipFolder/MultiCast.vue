<template>
  <b-container fluid>
    <!-- multicastForm -->
    <b-row class="mb-3">
      <b-col>
        <span
          >Portails auprès desquels le professionnel a déjà souscrit un
          abonnement
        </span>
      </b-col>
    </b-row>
    <b-row class="mb-3">
      <b-col
        sm="12"
        md="2"
        v-for="(availablePortal, index) in availablePortals"
        :key="availablePortal.value"
      >
        <b-form-checkbox-group
          @change="
            onPortalChange($event, { partnerFolder: currentPartnerFolder })
          "
          v-model="checkedPortals"
          :options="[availablePortal]"
          :disabled="!identity.allowedToEdit"
          :readonly="!identity.allowedToEdit"
          :name="`currentPartnerFolder.portals[${index}].name`"
          type="checkbox"
        ></b-form-checkbox-group>
      </b-col>
    </b-row>
    <b-row class="mt-3 mb-3 extra-informations">
      <b-col md="4">
        <a
          href="https://www.ubiflow.net/partenaires-vo.php"
          target="_blank"
          class="external-link"
          >Liste des médias de diffusion compatibles</a
        >
      </b-col>
      <b-col>
        <small
          >Si aucun abonnement n'est souscrit par le professionnel, les annonces
          pourront être diffusées sur des supports gratuits uniquement.</small
        >
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";

import {
  commonPortals,
  autoPortals,
  immoPortals,
} from "@/Interface/partnershipFolderDatas";

const store = useStore();

const identity = computed(() => store.state.account.identity);
const opportunity = computed(() => store.state.account.opportunity);
const currentPartnerFolder = computed(
  () => store.state.account.currentPartnerFolder
);

const status = computed(() => store.state.globalStore.status);
const portals = computed(() => store.state.globalStore.portals);

const availablePortals = ref(commonPortals);
let checkedPortals = ref([]);

const updatePartnerPropertyFromForm = (value: any) =>
  store.dispatch("account/updatePartnerPropertyFromForm", value);
const getPortals = () => store.dispatch("globalStore/getPortals");

const onPortalChange = (
  event: any,
  data: { partnerFolder: any; offset: string; value: any[] }
) => {
  const newPortals: (
    | { id: any; name?: undefined }
    | { name: never; id?: undefined }
  )[] = [];
  checkedPortals.value.forEach((checkedPortal) => {
    if (checkedPortal) {
      newPortals.push(
        portals[checkedPortal.toLowerCase()]
          ? { id: portals[checkedPortal.toLowerCase()]["@id"] }
          : { name: checkedPortal }
      );
    }
  });
  if (data.partnerFolder) {
    data.offset = "portals";
    data.value = newPortals;
    updatePartnerPropertyFromForm({ data: data });
  }
};

onMounted(() => {
  {
    switch (true) {
      case status.value["isLocalAutoPlus"]:
        availablePortals.value = commonPortals.concat(autoPortals);
        break;
      case status.value["isLocalImmoPlus"]:
        availablePortals.value = commonPortals.concat(immoPortals);
        break;
    }

    if (!Object.keys(portals).length) {
      getPortals();
    }

    checkedPortals = currentPartnerFolder.value.portals.map(
      (item: { name: any }) => item.name
    );
  }
});
</script>

<style lang="scss" scoped>
@import "@/assets/style/Pfolder/partnership-folder.scss";
</style>
