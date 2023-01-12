<template>
  <fade-loader
    v-if="pageLoading"
    class="loader-demandes hidden-for-mobile"
    :color="color"
  ></fade-loader>
</template>

<script lang="ts" setup>
import FadeLoader from "vue-spinner/src/FadeLoader.vue";
import { dropboxService } from "@/services";
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

const store = useStore();
const route = useRoute();

const pageLoading = ref(true);
const color = ref("#ec008c");

onMounted(() => {
  get_attachment();
});

const currentPartner = computed(() => store.state.account.currentPartner);

const getSalesforceAccount = (profile: any) =>
  store.dispatch("globalStore/getSalesforceAccount", profile);

const get_attachment = () => {
  return getSalesforceAccount({
    accountId: currentPartner.value.company,
  }).then((result) => {
    const folder = route.params.folder;
    const subfolder = route.params.subfolder;
    const filename = route.params.filename;
    const matches = folder.match(/^(\d+)[\s-._]?(.*)$/);
    dropboxService
      .downloadFile(matches[1], matches[2], subfolder, filename)
      .then((data) => {
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename as string);
        document.body.appendChild(link);
        link.click();
        pageLoading.value = false;
        window.close();
      });
  });
};
</script>
