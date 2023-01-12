<template>
  <div class="qrcode">
    <app-headerbuttons></app-headerbuttons>
    <notifications
      group="mail-sent"
      position="bottom right"
      class="notification-container"
    />
    <b-container fluid class="bc-example-row">
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
        <b-col
          v-else-if="status.isQrcodeEnabled"
          lg="9"
          md="12"
          sm="12"
          class="visibilty-container"
        >
          <hr />
          <b-row>
            <b-col lg="6" sm="6" cols="12">
              <h2>Gestion de mon QR Code</h2>
            </b-col>
            <b-col lg="6" md="6" sm="6">
              <app-customerRef></app-customerRef>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              Veuillez indiquer l’adresse url pour laquelle vous souhaitez créer
              votre QR Code (exemple : votre page menus)
              <i
                class="far fa-question-circle custom-tooltip ml-2 mt-1"
                v-b-tooltip.hover
                title="l'adresse URL se trouve dans votre barre de navigation en haut de votre écran"
              ></i>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="8" class="mt-2">
              <b-input-group>
                <b-input-group-append>
                  <b-input-group-text class="pr-1 domain-prefix">
                    https://www.{{ host }}/
                  </b-input-group-text>
                </b-input-group-append>
                <div class="input-text-field">
                  <b-form-input
                    @focus="onUrlFocus()"
                    v-model="qrcodeUrl"
                    class="pl-1"
                    type="text"
                  ></b-form-input>
                </div>
              </b-input-group>
            </b-col>
            <b-col md="4" class="mt-2">
              <b-button
                @click="createQrcode()"
                variant="outline-dark"
                size="sm"
                class="btn-generate-qrcode"
                :disabled="previousQrcodeUrl === qrcodeUrl"
              >
                <img src="@/assets/icon-qrcode.svg" alt="QR Code" />
                Création du QR Code
              </b-button>
            </b-col>
          </b-row>
          <b-row v-if="qrcodeGenerated" class="mt-3">
            <b-col
              offset-lg="4"
              lg="2"
              offset-md="3"
              md="4"
              v-html="qrcodeGenerated"
              class="qrcode-container"
            ></b-col>
          </b-row>
          <b-row v-if="qrcodeGenerated" class="mt-3">
            <b-col
              offset-lg="3"
              lg="4"
              offset-md="3"
              md="4"
              class="qrcode-container text-center"
            >
              <b-button
                @click="downloadQrcode()"
                variant="outline-dark"
                size="sm"
                class="btn-download-qrcode"
              >
                <img
                  src="@/assets/download-rose.svg"
                  alt="Télécharger le QR Code"
                />
                Télécharger en PNG
              </b-button>
              <a
                class="qrcode-download-link"
                download="qrcode.png"
                target="_blank"
              ></a>
            </b-col>
          </b-row>
        </b-col>
        <b-col v-else class="mt-5">Cette fonctionnalité n'est activée.</b-col>
      </b-row>
    </b-container>
    <app-footer class="footer-auth" />
  </div>
</template>

<script lang="ts" setup>
import { useStore } from "vuex";
import FadeLoader from "vue-spinner/src/FadeLoader.vue";
import { qrcodeService } from "@/services";
import { useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue";

const store = useStore();
const router = useRouter();

const previousQrcodeUrl = ref(null);
const qrcodeUrl = ref(null);
const qrcodeSize = ref({
  width: 314,
  height: 407,
});

const offers = computed(() => store.state.globalStore.offers);
const salesforce = computed(() => store.state.globalStore.salesforce);
const status = computed(() => store.state.globalStore.status);
const websiteLink = computed(() => store.state.globalStore.websiteLink);
const currentPartnerFolder = computed(
  () => store.state.account.currentPartnerFolder
);

const host = computed(() => {
  return (websiteLink.value || "").replace(/https?:\/\//, "").replace("/", "");
});

const qrcodeGenerated = computed({
  get() {
    return currentPartnerFolder.value.qrcodeValue || null;
  },
  set(val) {
    currentPartnerFolder.value.qrcodeValue = val;
  },
});

onMounted(() => {
  const timeout = setInterval(() => {
    if (!currentPartnerFolder.value.qrcodeUrl || !host.value) {
      return;
    }
    clearInterval(timeout);
    qrcodeUrl.value = (currentPartnerFolder.value.qrcodeUrl || "")
      .replace(host, "")
      .replace(/^https?:\/\/(www\.)?/, "")
      .replace(/^\//, "");
    previousQrcodeUrl.value = qrcodeUrl;
  }, 100);
});

const updatePartnerPropertyFromForm = store.dispatch(
  "account/updatePartnerPropertyFromForm"
);

const onUrlFocus = () => {
  previousQrcodeUrl.value = qrcodeUrl;
};

const createQrcode = () => {
  if (previousQrcodeUrl.value === qrcodeUrl.value) {
    return;
  }

  currentPartnerFolder.value.qrcodeUrl = `https://www.${host.value}/${qrcodeUrl.value}`;

  qrcodeService
    .createQrcode(currentPartnerFolder.value.qrcodeUrl, "svg")
    .then((blob) => blob.text())
    .then((content) => {
      updatePartnerPropertyFromForm({
        data: {
          partnerFolder: currentPartnerFolder,
          payload: {
            qrcodeUrl: currentPartnerFolder.value.qrcodeUrl,
            qrcodeValue: content,
          },
        },
        skipPartnerHistory: true,
      }).then(() => {
        qrcodeGenerated.value = content;
      });
    });
};

const downloadQrcode = () => {
  const svgString = new XMLSerializer().serializeToString(
    document.querySelector("svg")
  );
  const canvas = document.createElement("canvas");
  canvas.width = qrcodeSize.value.width;
  canvas.height = qrcodeSize.value.height;
  const canvasContext = canvas.getContext("2d");
  const DOMURL = window.URL || window.webkitURL || window;
  const img = new Image();
  const svg = new Blob([svgString], {
    type: "image/svg+xml;charset=utf-8",
  });
  const url = DOMURL.createObjectURL(svg);
  img.onload = function () {
    canvasContext.drawImage(
      img,
      0,
      0,
      qrcodeSize.value.width,
      qrcodeSize.value.height
    );
    makeTransparent(canvasContext);
    const element = document.querySelector("a.qrcode-download-link");
    element.href = canvas.toDataURL("image/png");
    element.click();
  };
  img.src = url;
};
const makeTransparent = (canvasContext: CanvasRenderingContext2D | null) => {
  const imageData = canvasContext.getImageData(
    0,
    0,
    qrcodeSize.value.width,
    qrcodeSize.value.height
  );
  for (let x = 0; x < imageData.width; x++) {
    for (let y = 0; y < imageData.height; y++) {
      const offset = (y * imageData.width + x) * 4;
      const r = imageData.data[offset];
      const g = imageData.data[offset + 1];
      const b = imageData.data[offset + 2];

      // if it is pure white, change its alpha to 0 <=> transparent
      if (255 === r && 255 === g && 255 === b) {
        imageData.data[offset + 3] = 0;
      }
    }
  }
  canvasContext.putImageData(imageData, 0, 0);
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/accueil.scss";
@import "@/assets/style/qrcode.scss";
</style>
