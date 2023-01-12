<template>
  <b-col class="hidden-for-mobile" lg="3" md="12" sm="12">
    <notifications
      group="connexion-failed"
      position="bottom right"
      class="notification-container"
    />
    <div role="tablist">
      <b-card no-body class="mb-1">
        <b-button
          block
          href="#"
          v-b-toggle.accordion1
          variant="info"
          class="menu-left-title"
          v-bind:class="{ 'current-section': current_section_1 }"
		>Présence</b-button>
        <b-collapse
          v-model="firstMenushowCollapse"
          id="accordion1"
          accordion="my-accordion"
          role="tabpanel"
        >
          <b-card-body>
            <router-link to="/presence/site" class="card-text">
              Site
            </router-link>
            <hr v-if="status.isQrcodeEnabled" />
            <router-link
              to="/presence/qrcode"
              class="card-text"
              v-if="status.isQrcodeEnabled"
            >
              QR Code
            </router-link>
            <hr />
            <div>
              <a
                @click="getUberallAutologin({ page: 'profile' })"
                class="uberall-link"
                v-bind:class="{
                  'uberall-link-available':
                    partner.hasVisibility &&
                    !status.isVisibilityOfferBeforeUberall,
                }"
              >
                Coordonnées de communication
              </a>
            </div>
            <hr v-if="status.isLocalResto || status.isLocalHotel" />
            <div v-if="status.isLocalResto || status.isLocalHotel">
              <a
                @click="getUberallAutologin({ page: 'inbox' })"
                class="uberall-link"
                v-bind:class="{
                  'uberall-link-available':
                    partner.hasVisibility &&
                    !status.isVisibilityOfferBeforeUberall,
                }"
              >
                Avis clients
              </a>
            </div>
            <hr v-if="status.isLocalResto || status.isLocalHotel" />
            <div v-if="status.isLocalResto || status.isLocalHotel">
              <a
                @click="getUberallAutologin({ page: 'posting' })"
                class="uberall-link"
                v-bind:class="{
                  'uberall-link-available':
                    partner.hasVisibility &&
                    !status.isVisibilityOfferBeforeUberall,
                }"
              >
                Publications
              </a>
            </div>
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card
        no-body
        class="mb-1"
        v-if="
          !store.state.globalStore.status.isEcommerce &&
          !store.state.globalStore.status.isLocalShop
        "
      >
        <b-button
          block
          v-b-toggle.accordion2
          variant="info"
          class="menu-left-title"
          v-bind:class="{ 'current-section': current_section_2 }"
          >Performance
		</b-button
        >
        <b-collapse
          v-model="secondMenushowCollapse"
          id="accordion2"
          accordion="my-accordion"
          role="tabpanel"
        >
          <b-card-body>
            <router-link to="/performance/audience" class="card-text">
              Statistiques de mon site web
            </router-link>
            <hr />
            <router-link
              to="/performance/localBroadcast"
              class="card-text"
              v-if="uberall.listingsLength"
            >
              Diffusion locale
            </router-link>
            <div v-if="status.isWebtool">
              <hr v-if="uberall.listingsLength" />
              <router-link to="/performance/messages" class="card-text">
                Messages
              </router-link>
              <hr />
              <router-link to="/performance/newsletter" class="card-text">
                Newsletter
              </router-link>
            </div>
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card no-body class="mb-1" v-if="status.isLocalShop">
        <b-btn
          block
          v-b-toggle.accordion2
          variant="info"
          class="menu-left-title"
          v-bind:class="{ 'current-section': current_section_2 }"
          >Performance</b-btn
        >
        <b-collapse
          v-model="secondMenushowCollapse"
          id="accordion2"
          accordion="my-accordion"
          role="tabpanel"
        >
          <b-card-body>
            <router-link to="/performance/audience" class="card-text">
              Statistiques de mon site web
            </router-link>
            <hr v-if="uberall.listingsLength" />
            <router-link
              to="/performance/localBroadcast"
              class="card-text"
              v-if="uberall.listingsLength"
            >
              Diffusion locale
            </router-link>
            <div v-if="status.isWebtool">
              <hr v-if="uberall.listingsLength" />
              <router-link to="/performance/messages" class="card-text">
                Messages
              </router-link>
              <hr />
              <router-link to="/performance/newsletter" class="card-text">
                Newsletter
              </router-link>
            </div>
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>
  </b-col>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import {BButton, BCard} from "bootstrap-vue-3";

const store = useStore();
const route = useRoute();

const firstMenushowCollapse = ref(false);
const current_section_1 = ref(false);
const secondMenushowCollapse = ref(false);
const current_section_2 = ref(false);

const readCurrentMenu = () => {
  if (route.path.includes("presence")) {
    firstMenushowCollapse.value = true;
    current_section_1.value = true;
  }
  if (route.path.includes("performance")) {
    secondMenushowCollapse.value = true;
    current_section_2.value = true;
  }
};

onMounted(() => {
  readCurrentMenu();
});

const partner = computed(() => store.state.globalStore.partner);
const status = computed(() => store.state.globalStore.status);
const uberall = computed(() => store.state.globalStore.uberall);

const getUberallAutologin = (profile: any) =>
  store.dispatch("getUberallAutologin", profile);
</script>

<style lang="scss">

//  move too general menu
.current-section {
	background-color: #ec008c!important;
	border-color: #ec008c!important;
	color: #fff!important;
}

.btn-info {
	color: #000;
	background-color: #c2c2c2;
	border-color: #c2c2c2;
	padding: 1em!important;
	text-align: left!important;
}
</style>
