<template>
  <div class="audiencevisibilite">
    <app-headerbuttons></app-headerbuttons>
    <b-container fluid class="bv-example-row">
      <b-row>
        <notifications
          group="no-ticket"
          position="bottom right"
          class="notification-container"
        />
        <app-menuformation
          class="hidden-for-mobile margin-menu"
        ></app-menuformation>
        <app-menumobile class="menu-mobile"></app-menumobile>
        <fade-loader
          v-if="status.isPageLoading"
          color="#ec008c"
          class="loader-accueil"
        ></fade-loader>
        <b-col v-else lg="9" md="12" sm="12" class="visibilty-container">
          <hr />
          <b-row>
            <b-col lg="6" sm="6" cols="12">
              <h4>Bilan de ma diffusion sur les annuaires et GPS majeurs</h4>
            </b-col>
            <b-col lg="6" md="6" sm="6">
              <app-customerRef></app-customerRef>
            </b-col>
          </b-row>
          <b-row>
            <b-col
              offset="1"
              lg="7"
              v-if="
                status.isToolbox &&
                !status.isWebtool &&
                !status.isVisibilityOfferBeforeUberall
              "
            >
              <i v-if="uberall.listingsTab && 0 === uberall.listingsLength"
                >Aucune donnée disponible.</i
              >
              <i
                v-else-if="
                  status.isRetrieveListingsFailure || !uberall.listingsTab
                "
                >Offre non souscrite</i
              >
              <b-row class="listing-zone">
                <fade-loader
                  v-if="status.isRetrieveListingsLoading"
                  class="loaderToolbox"
                  :color="color"
                ></fade-loader>
                <b-col
                  lg="4"
                  md="4"
                  sm="6"
                  v-for="list in uberall.listingsTab"
                  :key="list.id"
                  v-if="!status.isRetrieveListingsLoading"
                  class="listings"
                >
                  <a :href="list.listingUrl" target="_blank">
                    <div
                      class="list-widget"
                      :class="{ 'list-effect': list.listingUrl }"
                    >
                      <img class="img-logo" :src="list.urlImage" width="20" />
                      <p class="text-list">{{ list.typeName }}</p>
                      <img
                        v-if="'NO_ONLINE_LISTING' == list.syncStatus"
                        src="@/assets/empty-shield.png"
                        class="img-status"
                        v-b-tooltip.hover
                        :title="infos[0]"
                        width="20"
                      />
                      <img
                        v-if="'IN_SYNC' == list.syncStatus"
                        src="@/assets/shield.png"
                        class="img-status"
                        v-b-tooltip.hover
                        :title="infos[1]"
                        width="20"
                      />
                      <img
                        v-if="
                          'NOT_FOUND' == list.syncStatus ||
                          'NOT_IN_SYNC' == list.syncStatus
                        "
                        src="@/assets/sync.png"
                        class="img-status"
                        v-b-tooltip.hover
                        :title="infos[2]"
                        width="20"
                      />
                    </div>
                  </a>
                </b-col>
              </b-row>
              <b-row class="justify-center">
                <a
                  @click="getUberallAutologin({ page: 'profile' })"
                  class="uberall-autologin-link"
                >
                  <img alt="" src="@/assets/link-button.svg" />
                  Tableau de bord diffusion locale
                </a>
              </b-row>
            </b-col>
            <b-col
              offset="1"
              lg="7"
              v-if="
                !status.isToolbox &&
                !status.isWebtool &&
                partner.hasVisibility &&
                !status.isVisibilityOfferBeforeUberall
              "
            >
              <i v-if="uberall.listingsTab && 0 === uberall.listingsLength"
                >Aucune donnée disponible.</i
              >
              <i
                v-else-if="
                  status.isRetrieveListingsFailure || !uberall.listingsTab
                "
                >Offre non souscrite</i
              >
              <b-row class="listing-zone">
                <fade-loader
                  v-if="status.isRetrieveListingsLoading"
                  class="loaderToolbox"
                  :color="color"
                ></fade-loader>
                <b-col
                  lg="4"
                  md="4"
                  sm="6"
                  v-for="list in uberall.listingsTab"
                  :key="list.id"
                  v-if="!status.isRetrieveListingsLoading"
                  class="listings"
                >
                  <a :href="list.listingUrl" target="_blank">
                    <div
                      class="list-widget"
                      :class="{ 'list-effect': list.listingUrl }"
                    >
                      <img class="img-logo" :src="list.urlImage" width="20" />
                      <p class="text-list">{{ list.typeName }}</p>
                      <img
                        v-if="'NO_ONLINE_LISTING' == list.syncStatus"
                        src="@/assets/empty-shield.png"
                        class="img-status"
                        v-b-tooltip.hover
                        :title="infos[0]"
                        width="20"
                      />
                      <img
                        v-if="'IN_SYNC' == list.syncStatus"
                        src="@/assets/shield.png"
                        class="img-status"
                        v-b-tooltip.hover
                        :title="infos[1]"
                        width="20"
                      />
                      <img
                        v-if="
                          'NOT_FOUND' == list.syncStatus ||
                          'NOT_IN_SYNC' == list.syncStatus
                        "
                        src="@/assets/sync.png"
                        class="img-status"
                        v-b-tooltip.hover
                        :title="infos[2]"
                        width="20"
                      />
                    </div>
                  </a>
                </b-col>
              </b-row>
              <b-row class="justify-center">
                <a
                  @click="getUberallAutologin({ page: 'profile' })"
                  class="uberall-autologin-link"
                >
                  <img alt="" src="@/assets/link-button.svg" />
                  Tableau de bord diffusion locale
                </a>
              </b-row>
            </b-col>
            <b-col
              offset="1"
              lg="7"
              v-if="
                !status.isToolbox &&
                status.isWebtool &&
                partner.hasVisibility &&
                !status.isVisibilityOfferBeforeUberall
              "
            >
              <i v-if="uberall.listingsTab && 0 === uberall.listingsLength"
                >Aucune donnée disponible.</i
              >
              <i
                v-else-if="
                  status.isRetrieveListingsFailure || !uberall.listingsTab
                "
                >Offre non souscrite</i
              >
              <b-row class="listing-zone">
                <fade-loader
                  v-if="status.isRetrieveListingsLoading"
                  class="loaderToolbox"
                  :color="color"
                ></fade-loader>
                <b-col
                  lg="4"
                  md="4"
                  sm="6"
                  v-for="list in uberall.listingsTab"
                  :key="list.id"
                  v-if="!status.isRetrieveListingsLoading"
                  class="listings"
                >
                  <a :href="list.listingUrl" target="_blank">
                    <div
                      class="list-widget"
                      :class="{ 'list-effect': list.listingUrl }"
                    >
                      <img class="img-logo" :src="list.urlImage" width="20" />
                      <p class="text-list">{{ list.typeName }}</p>
                      <img
                        v-if="'NO_ONLINE_LISTING' == list.syncStatus"
                        src="@/assets/empty-shield.png"
                        class="img-status"
                        v-b-tooltip.hover
                        :title="infos[0]"
                        width="20"
                      />
                      <img
                        v-if="'IN_SYNC' == list.syncStatus"
                        src="@/assets/shield.png"
                        class="img-status"
                        v-b-tooltip.hover
                        :title="infos[1]"
                        width="20"
                      />
                      <img
                        v-if="
                          'NOT_FOUND' == list.syncStatus ||
                          'NOT_IN_SYNC' == list.syncStatus
                        "
                        src="@/assets/sync.png"
                        class="img-status"
                        v-b-tooltip.hover
                        :title="infos[2]"
                        width="20"
                      />
                    </div>
                  </a>
                </b-col>
              </b-row>
              <b-row class="justify-center">
                <a
                  @click="getUberallAutologin({ page: 'profile' })"
                  class="uberall-autologin-link"
                >
                  <img alt="" src="@/assets/link-button.svg" />
                  Tableau de bord diffusion locale
                </a>
              </b-row>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
    <app-footer :class="{ 'footer-auth': !partner.hasVisibility }" />
  </div>
</template>

<script lang="ts" setup>
import { useStore } from "vuex";
import FadeLoader from "vue-spinner/src/FadeLoader.vue";
import LineChart from "@/components/Charts/LinearChart.vue";
import DoughnutChart from "@/components/Charts/DoughnutChart.vue";
import { computed, onMounted, ref } from "vue";
import type { Status } from "@/store/typings/globalStore";

const store = useStore();

const partner = computed(() => store.state.globalStore.partner);
const status = computed((): Status => store.state.globalStore.status);
const uberall = computed(() => store.state.globalStore.uberall);

const infos = ref([
  "Safeguard actif: les données ont été transmises à l'annuaire en ligne.",
  "Safeguard activé: les informations de l'établissement sont publiées sur les annuaires en ligne, régulièrement vérifiées et actualisées si necessaire.",
  "Safeguard activé: la synchronisation des données est en cours.",
]);
const color = ref("#ec008c");

onMounted(() => {
  const timeout = setInterval(() => {
    if (status.value.isPageLoading) {
      return;
    }
    clearInterval(timeout);

    getUberallListings();
  }, 100);
});

const getUberallListings = () =>
  store.dispatch("globalStore/getUberallListings");
const getUberallAutologin = (value: any) =>
  store.dispatch("globalStore/getUberallAutologin", value);
</script>

<style lang="scss" scoped>
@import "@/assets/style/visibilite.scss";
</style>
