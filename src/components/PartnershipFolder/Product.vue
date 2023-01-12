<template>
  <b-container fluid>
    <!-- @todo -->
    <b-row>
      <b-col>
        <b-col class="mb-4">
          <!-- if its not localShop -->
          <span v-if="!status.isLocalShop">{{ excelProductList.title }}</span>
          <!-- if its localShop -->
          <span v-if="status.isLocalShop">{{
            excelProductList.titleLocalShop
          }}</span>
        </b-col>
        <ul>
          <!-- if its not localShop -->
          <template v-if="!status.isLocalShop">
            <li
              v-for="(column, index) in excelProductList.columns"
              v-bind:key="index"
            >
              {{ column }}
            </li>
          </template>

          <!-- if its localShop -->
          <template v-if="status.isLocalShop">
            <li
              v-for="(column, index) in excelProductList.columnsLocalShop"
              v-bind:key="index"
            >
              {{ column }}
            </li>
          </template>
        </ul>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="text-right">
        <!-- @todo we need to have the file somewhere to be able to download it  -->
        <b-button @click="productList">Télécharger le fichier excel</b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";

import { excelProductList } from "@/Interface/partnershipFolderDatas";
import axios from "axios";

const store = useStore();

const status = computed(() => store.state.globalStore.status);

const offer = ref(null);

const productList = () => {
  axios({
    url: "",
    method: "GET",
    responseType: "blob",
  }).then((response) => {
    const fileURL = window.URL.createObjectURL(new Blob([response.data]));
    const fileLink = document.createElement("a");

    // need to do this with the store
    // this is just an example to do not waste time to search after
    const offersfile = offer.value
      ? excelProductList.file
      : excelProductList.fileLocalShop;

    fileLink.href = fileURL;
    fileLink.setAttribute("Télécharger le fichier excel", offersfile);
    document.body.appendChild(fileLink);

    fileLink.click();
  });
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/Pfolder/partnership-folder.scss";
</style>
