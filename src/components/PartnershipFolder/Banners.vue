<template>
  <b-row class="mt-3">
    <b-col class="page-item mb-3" md="4">
      <label class="label">À gauche</label>

        <div class="input-text" v-if="allowedToEdit">
          <b-form-textarea
            @focus="onFocus"
            @blur="
              onBlur($event, {
                banner: currentPartnerFolder.sites[0].banners[0],
              })
            "
            type="textarea"
            name="currentPartnerFolder.sites[0].banners[0].leftContent"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
            v-model="leftContent"
          ></b-form-textarea>
          <TextLengthMessage
            v-if="currentBanner"
            :value="leftContent"
            maxlength="1024"
          />
        </div>

        <div
          class="mx-2 pre-line-text"
          v-else-if="!allowedToEdit && leftContent && leftContent.length"
        >
          {{ leftContent }}
        </div>

    </b-col>
    <b-col class="page-item mb-3" md="4">
      <label class="label">Au centre</label>

        <div class="input-text" v-if="allowedToEdit">
          <b-form-textarea
            @focus="onFocus"
            @blur="
              onBlur($event, {
                banner: currentPartnerFolder.sites[0].banners[0],
              })
            "
            type="textarea"
            :class="classes"
            :disabled="!props.allowedToEdit"
            :readonly="!props.allowedToEdit"
            name="currentPartnerFolder.sites[0].banners[0].centerContent"
            v-model="centerContent"
          ></b-form-textarea>
          <TextLengthMessage
            v-if="currentBanner"
            :value="centerContent"
            maxlength="1024"
          />
        </div>
        <div
          class="mx-2 pre-line-text"
          v-else-if="
            !props.allowedToEdit && centerContent && centerContent.length
          "
        >
          {{ centerContent }}
        </div>
    </b-col>
    <b-col class="page-item mb-3" md="4">
      <label class="label">À droite</label>
        <div class="input-text" v-if="props.allowedToEdit">
          <b-form-textarea
            @focus="onFocus"
            @blur="
              onBlur($event, {
                banner: currentPartnerFolder.sites[0].banners[0],
              })
            "
            type="textarea"
            :class="classes"
            :disabled="!props.allowedToEdit"
            :readonly="!props.allowedToEdit"
            name="currentPartnerFolder.sites[0].banners[0].rightContent"
            v-model="rightContent"
          ></b-form-textarea>
          <TextLengthMessage
            v-if="currentBanner"
            :value="rightContent"
            maxlength="1024"
          />
        </div>
        <div
          class="mx-2 pre-line-text"
          v-else-if="
            !props.allowedToEdit && rightContent && rightContent.length
          "
        >
          {{ rightContent }}
        </div>
    </b-col>
  </b-row>
</template>

<script lang="ts" setup>
import TextLengthMessage from "@/components/PartnershipFolder/TextLengthMessage.vue";
import {computed, ref} from "vue";
import {useStore} from "vuex";
import {BCol, BFormTextarea, BRow} from "bootstrap-vue-3";

const store = useStore();

const props = defineProps(["verifyFields", "allowedToEdit"]);
const previousEditedValue = ref(null);

const identity = computed(() => store.state.account.identity);
const currentPartnerFolder = computed(() => store.state.account.currentPartnerFolder);

const currentSite = computed(() => {
  return currentPartnerFolder.value && currentPartnerFolder.value.sites
    ? currentPartnerFolder.value.sites[0]
    : null;
});
const currentBanner = computed(() => {
	return currentSite.value && currentSite.value.banners
			? currentSite.value.banners[0]
			: null;
});
const leftContent = computed({
  get() {
    return getBannerOffset("leftContent");
  },
  set(val) {
    setBannerOffset("leftContent", val);
  },
});
const centerContent = computed({
  get() {
    return getBannerOffset("centerContent");
  },
  set(val) {
    setBannerOffset("centerContent", val);
  },
});
const rightContent = computed(() => getBannerOffset("rightContent"));

const updatePartnerPropertyFromForm = (value: any) =>
  store.dispatch("account/updatePartnerPropertyFromForm", value);

const onFocus = (event: { target: { value: null } }) => {
  previousEditedValue.value = event.target.value;
};
const onBlur = (
  event: { target: { name: string | number } },
  data: { banner: { id: any; site: any } }
) => {
  const provider = ref[event.target.name];
  if (data.banner && !data.banner.id) {
    data.banner.site = currentPartnerFolder.value.sites[0]["@id"];
  }
  updatePartnerPropertyFromForm({
    event: event,
    provider: provider[0] || provider,
    data: data
      ? Object.assign({ previousEditedValue: previousEditedValue }, data)
      : undefined,
  });
  props.verifyFields();
};
const getBannerOffset = (offset: string) => {
  return currentBanner.value ? currentBanner.value[offset] : null;
};
const setBannerOffset = (offset: string, value: any) => {
  if (!currentSite.value) {
    currentPartnerFolder.value.sites = [{}];
  }
  if (!currentBanner.value) {
    currentPartnerFolder.value.sites[0].banners = [{}];
  }

  currentPartnerFolder.value.sites[0].banners[0][offset] = value;
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/Pfolder/partnership-folder.scss";
</style>
