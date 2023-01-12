<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <ValidationProvider
          name="Commentaires pour la Production"
          rules="expected|max:1024"
          ref="currentPartnerFolder.notes.0.comment"
          v-slot="{ classes, errors }"
        >
          <label class="label">
            Commentaires pour la Production
            <span v-if="currentNote.updateDate" class="internal-note-date">
              (dernière mise à jour le {{ formatDate(currentNote.updateDate) }})
            </span>
          </label>
          <div class="input-text">
            <b-form-textarea
              @focus="onFocus"
              @blur="updateComment()"
              :class="classes"
              name="currentPartnerFolder.notes.0.comment"
              v-model="currentNote.comment"
              :disabled="!isAllowedToEdit || isLoading"
              :readonly="!isAllowedToEdit"
              type="textarea"
            ></b-form-textarea>
            <TextLengthMessage :value="currentNote.comment" maxlength="1024" />
          </div>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { authDpHelper, dateHelpers, validateSection } from "@/helpers";
import TextLengthMessage from "@/components/PartnershipFolder/TextLengthMessage.vue";
import {useDP} from "@/mixins/useDP";

let store = useStore();
let { verifyFields, allowedToEdit } = useDP();

let identity = computed(() => store.state.account.identity);
let opportunity = computed(() => store.state.account.opportunity);
let currentPartnerFolder = computed(
  () => store.state.account.currentPartnerFolder
);

let isLoading = ref(false);

let isProvider = computed(() => {
  return identity.value && authDpHelper.isProvider(identity);
});
let isAllowedToEdit = computed(() => {
  return allowedToEdit && !isProvider.value;
});
let currentNote = computed(() => {
  return currentPartnerFolder.value &&
    currentPartnerFolder.value.notes &&
    currentPartnerFolder.value.notes.length
    ? currentPartnerFolder.value.notes[0]
    : {};
});

onMounted(() => {
  verifyFields();
});

let updatePartnerPropertyFromForm = (value: any) =>
  store.dispatch("account/updatePartnerPropertyFromForm", value);

let onFocus = (event) => {
  previousEditedValue = event.target.value;
};
let updateComment = () => {
  if (previousEditedValue === currentNote.value.comment) {
    return;
  }
  isLoading = true;

  let data = {};
  let note = {
    comment: currentNote.value.comment,
    updateDate: new Date(),
    userId: identity.value.id,
  };
  if (currentNote.value.id) {
    data.note = currentNote;
    data.payload = note;
  } else {
    note.partnerFolder = currentPartnerFolder.value["@id"];
    note.createDate = new Date();
    data.note = note;
  }

  verifyFields();
  updatePartnerPropertyFromForm({ data }).then(() => {
    isLoading = false;
  });
};
let validateFields = async () => {
  if (!allowedToEdit) {
    return;
  }

  let isValid =
    currentNote.value.comment && currentNote.value.comment.length
      ? true
      : "reset";

  validateSection.displayColorStateOnSection("internal-notes", isValid);
};
let formatDate = () => dateHelpers.formatSFBriefDate;
</script>

<style lang="scss" scoped>
@import "@/assets/style/Pfolder/partnership-folder.scss";
</style>
