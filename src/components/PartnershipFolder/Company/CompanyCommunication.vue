<template>
  <b-container fluid  v-if="currentPartnerFolder">
    <!-- your communication -->
    <b-row class="my-3">
      <b-col>
        <ValidationProvider
          name="Flyer"
          :rules="{ required: false }"
          ref="currentPartnerFolder.flyerUse"
        >
          <label>
            <b-form-checkbox
              type="checkbox"
              @change="
                onBlur($event, {
                  partnerFolder: currentPartnerFolder,
                  type: 'bool',
                })
              "
              name="currentPartnerFolder.flyerUse"
              v-model="currentPartnerFolder.flyerUse"
              :disabled="!allowedToEdit"
              :readonly="!allowedToEdit"
            >
              Flyer
            </b-form-checkbox>
          </label>
          <small :class="classes">}</small>
        </ValidationProvider>
      </b-col>
      <b-col>
        <ValidationProvider
          name="Réseaux sociaux"
          :rules="{ required: false }"
          ref="currentPartnerFolder.socialNetworkUse"
        >
          <label>
            <b-form-checkbox
              type="checkbox"
              @change="
                onBlur($event, {
                  partnerFolder: currentPartnerFolder,
                  type: 'bool',
                })
              "
              name="currentPartnerFolder.socialNetworkUse"
              v-model="currentPartnerFolder.socialNetworkUse"
              :disabled="!allowedToEdit"
              :readonly="!allowedToEdit"
            >
              Réseaux sociaux
            </b-form-checkbox>
          </label>
          <small :class="classes"></small>
        </ValidationProvider>
      </b-col>
      <b-col>
        <ValidationProvider
          name="Pages jaunes"
          :rules="{ required: false }"
          ref="currentPartnerFolder.yellowPageUse"
        >
          <label>
            <b-form-checkbox
              type="checkbox"
              @change="
                onBlur($event, {
                  partnerFolder: currentPartnerFolder,
                  type: 'bool',
                })
              "
              name="currentPartnerFolder.yellowPageUse"
              v-model="currentPartnerFolder.yellowPageUse"
              :disabled="!allowedToEdit"
              :readonly="!allowedToEdit"
            >
              Pages jaunes
            </b-form-checkbox>
          </label>
          <small :class="classes"></small>
        </ValidationProvider>
      </b-col>
      <b-col>
        <ValidationProvider
          name="Site internet"
          :rules="{ required: false }"
          ref="currentPartnerFolder.websiteUse"
        >
          <label>
            <b-form-checkbox
              type="checkbox"
              @change="
                onBlur($event, {
                  partnerFolder: currentPartnerFolder,
                  type: 'bool',
                })
              "
              name="currentPartnerFolder.websiteUse"
              v-model="currentPartnerFolder.websiteUse"
              :disabled="!allowedToEdit"
              :readonly="!allowedToEdit"
            >
              Site internet
            </b-form-checkbox>
          </label>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
      <b-col>
        <ValidationProvider
          name="Autres médias"
          :rules="{ required: false }"
          ref="currentPartnerFolder.otherMediaUse"
        >
          <label>
            <b-form-checkbox
              type="checkbox"
              @change="
                onBlur($event, {
                  partnerFolder: currentPartnerFolder,
                  type: 'bool',
                })
              "
              name="currentPartnerFolder.otherMediaUse"
              v-model="currentPartnerFolder.otherMediaUse"
              :disabled="!allowedToEdit"
              :readonly="!allowedToEdit"
            >
              Autres médias
            </b-form-checkbox>
          </label>
          <small :class="classes"></small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <div>
      <b-row class="my-3">
        <b-col md="6">
          <ValidationProvider
            name="Réseaux sociaux"
            rules="min:3"
            ref="currentPartnerFolder.socialNetworkShared"
          >
            <label class="label"
              >Réseaux sociaux sur lesquels vous communiquez</label
            >
            <b-form-textarea
              type="textarea"
              :class="classes"
              @focus="onFocus"
              @blur="onBlur($event, { partnerFolder: currentPartnerFolder })"
              rows="3"
              name="currentPartnerFolder.socialNetworkShared"
              v-model="currentPartnerFolder.socialNetworkShared"
              :disabled="!allowedToEdit"
              :readonly="!allowedToEdit"
            ></b-form-textarea>
            <small :class="classes"></small>
          </ValidationProvider>
        </b-col>
        <b-col md="6">
          <ValidationProvider
            name="Objectifs et retombées"
            rules="min:3"
            ref="currentPartnerFolder.objectivesAndImpacts"
          >
            <label class="label">Objectifs et retombées</label>
            <b-form-textarea
              type="textarea"
              :class="classes"
              @focus="onFocus"
              @blur="onBlur($event, { partnerFolder: currentPartnerFolder })"
              rows="3"
              name="currentPartnerFolder.objectivesAndImpacts"
              v-model="currentPartnerFolder.objectivesAndImpacts"
              :disabled="!allowedToEdit"
              :readonly="!allowedToEdit"
            ></b-form-textarea>
            <small :class="classes"></small>
          </ValidationProvider>
        </b-col>
      </b-row>
      <b-row class="my-3">
        <b-col class="website-context col-left px-0 mt-3 pb-3" md="6">
          <b-col class="text-center bg-pink">
            <h3>SITE EXISTANT</h3>
          </b-col>
          <b-col class="mt-3">
            <ValidationProvider
              name="Nom de domaine"
              rules="required|min:3|max:255"
              ref="currentPartnerFolder.sites[0].oldDomain"
            >
              <label class="label">Nom de domaine</label>
              <div class="input-text">
                <b-form-input
                  @change="
                    onBlur($event, { site: currentPartnerFolder.sites[0] })
                  "
                  type="text"
                  :class="classes"
                  name="currentPartnerFolder.sites[0].oldDomain"
                  v-model="currentPartnerFolder.sites[0].oldDomain"
                  :disabled="!allowedToEdit"
                  :readonly="!allowedToEdit"
                ></b-form-input>
                <TextLengthMessage
                  :value="!currentSite || currentSite.oldDomain"
                  maxlength="255"
                />
              </div>
              <small :class="classes"></small>
            </ValidationProvider>
          </b-col>
          <b-col class="mt-3">
            <!-- unknown field -->
            <ValidationProvider
              name="Mail associé"
              rules="email"
              ref="currentPartnerFolder.sites[0].domainEmail"
              v-slot="{ classes, errors }"
            >
              <label class="label">Mail associé</label>
              <b-form-input
                id="domainEmail"
                @change="
                  onBlur($event, { site: currentPartnerFolder.sites[0] })
                "
                type="email"
                :class="classes"
                name="currentPartnerFolder.sites[0].domainEmail"
                v-model="currentPartnerFolder.sites[0].domainEmail"
                :disabled="!allowedToEdit"
                :readonly="!allowedToEdit"
              ></b-form-input>
              <small :class="classes"></small>
            </ValidationProvider>
          </b-col>
          <b-col class="mt-3">
            <ValidationProvider
              name="Analyse des retours"
              rules="min:3"
              ref="currentPartnerFolder.feedbackReports"
            >
              <label class="label">Analyse des retours</label>
              <b-form-textarea
                type="textarea"
                :class="classes"
                @focus="onFocus"
                @blur="onBlur($event, { partnerFolder: currentPartnerFolder })"
                rows="3"
                name="currentPartnerFolder.feedbackReports"
                v-model="currentPartnerFolder.feedbackReports"
                :disabled="!allowedToEdit"
                :readonly="!allowedToEdit"
              ></b-form-textarea>
              <small :class="classes"></small>
            </ValidationProvider>
          </b-col>
          <b-col class="mt-3">
            <ValidationProvider
              name="Engagement"
              rules="min:3"
              ref="currentPartnerFolder.commitment"
            >
              <label class="label">Engagement</label>
              <b-form-textarea
                type="textarea"
                :class="classes"
                @focus="onFocus"
                @blur="onBlur($event, { partnerFolder: currentPartnerFolder })"
                rows="3"
                name="currentPartnerFolder.commitment"
                v-model="currentPartnerFolder.commitment"
                :disabled="!allowedToEdit"
                :readonly="!allowedToEdit"
              ></b-form-textarea>
              <small :class="classes"></small>
            </ValidationProvider>
          </b-col>
          <b-col class="mt-3">
            <ValidationProvider
              name="Prestataire"
              rules="min:3"
              ref="currentPartnerFolder.serviceProvider"
            >
              <label class="label">Prestataire</label>
              <b-form-textarea
                type="textarea"
                :class="classes"
                @focus="onFocus"
                @blur="onBlur($event, { partnerFolder: currentPartnerFolder })"
                rows="3"
                name="currentPartnerFolder.serviceProvider"
                v-model="currentPartnerFolder.serviceProvider"
                :disabled="!allowedToEdit"
                :readonly="!allowedToEdit"
              ></b-form-textarea>
              <small :class="classes"></small>
            </ValidationProvider>
          </b-col>
          <b-col class="mt-3">
            <ValidationProvider
              name="Axe d'amélioration"
              rules="min:3"
              ref="currentPartnerFolder.improvement"
            >
              <label class="label">Axe d'amélioration</label>
              <b-form-textarea
                type="textarea"
                :class="classes"
                @focus="onFocus"
                @blur="onBlur($event, { partnerFolder: currentPartnerFolder })"
                name="currentPartnerFolder.improvement"
                v-model="currentPartnerFolder.improvement"
                :disabled="!allowedToEdit"
                :readonly="!allowedToEdit"
              ></b-form-textarea>
              <small :class="classes"></small>
            </ValidationProvider>
          </b-col>
        </b-col>
        <b-col class="website-context col-right px-0 mt-3 pb-3" md="6">
          <b-col class="text-center bg-yellow">
            <h3>PAS DE SITE</h3>
          </b-col>
          <b-col class="mt-3">
            <label class="label">Raison</label>
            <ValidationProvider
              name="Raison"
              :rules="{ required: false }"
              ref="currentPartnerFolder.noSiteCause"
            >
              <b-form-radio-group
                type="radio"
                @change="
                  onBlur($event, { partnerFolder: currentPartnerFolder })
                "
                name="currentPartnerFolder.noSiteCause"
                v-model="currentPartnerFolder.noSiteCause"
                :options="noSiteCauseList"
                :disabled="!allowedToEdit"
                :readonly="!allowedToEdit"
              >
              </b-form-radio-group>
              <small :class="classes"></small>
            </ValidationProvider>
          </b-col>
          <b-col class="mt-3">
            <label class="label">Objectif</label>
            <ValidationProvider
              name="Objectif"
              :rules="{ required: false }"
              ref="currentPartnerFolder.noSiteObjective"
              v-slot="{ classes, errors }"
            >
              <b-form-radio-group
                type="radio"
                @change="
                  onBlur($event, { partnerFolder: currentPartnerFolder })
                "
                name="currentPartnerFolder.noSiteObjective"
                v-model="currentPartnerFolder.noSiteObjective"
                :options="noSiteObjectiveList"
                :disabled="!allowedToEdit"
                :readonly="!allowedToEdit"
              ></b-form-radio-group>
              <small :class="classes"></small>
            </ValidationProvider>
          </b-col>
          <b-col class="mt-3">
            <ValidationProvider
              name="Exemple de mots-clésame"
              rules="min:3"
              ref="currentPartnerFolder.noSiteKeywords"
            >
              <label class="label">Exemple de mots-clés</label>
              <b-form-textarea
                type="textarea"
                :class="classes"
                @focus="onFocus"
                @blur="onBlur($event, { partnerFolder: currentPartnerFolder })"
                rows="3"
                name="currentPartnerFolder.noSiteKeywords"
                v-model="currentPartnerFolder.noSiteKeywords"
                :disabled="!allowedToEdit"
                :readonly="!allowedToEdit"
              ></b-form-textarea>
              <small :class="classes"></small>
            </ValidationProvider>
          </b-col>
        </b-col>
      </b-row>
      <b-row class="my-3">
        <b-col>
          <ValidationProvider
            name="Objectifs d'un site"
            rules="min:3"
            ref="currentPartnerFolder.websiteObjective"
          >
            <label class="label">Objectifs d'un site professionnel</label>
            <b-form-textarea
              type="textarea"
              :class="classes"
              @focus="onFocus"
              @blur="onBlur($event, { partnerFolder: currentPartnerFolder })"
              rows="3"
              name="currentPartnerFolder.websiteObjective"
              v-model="currentPartnerFolder.websiteObjective"
              :disabled="!allowedToEdit"
              :readonly="!allowedToEdit"
            ></b-form-textarea>
            <small :class="classes">{{ errors[0] }}</small>
          </ValidationProvider>
        </b-col>
      </b-row>
      <b-row class="my-3">
        <b-col>
          <ValidationProvider
            name="Degré de motivation"
            rules="min:3"
            ref="currentPartnerFolder.websiteMotivation"
          >
            <label class="label"
              >Degré de motivation pour un site professionnel</label
            >
            <b-form-textarea
              type="textarea"
              :class="classes"
              @focus="onFocus"
              @blur="onBlur($event, { partnerFolder: currentPartnerFolder })"
              name="currentPartnerFolder.websiteMotivation"
              v-model="currentPartnerFolder.websiteMotivation"
              :disabled="!allowedToEdit"
              :readonly="!allowedToEdit"
            ></b-form-textarea>
            <small :class="classes"></small>
          </ValidationProvider>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script lang="ts" setup>
import {useDP} from "@/mixins/useDP";
import TextLengthMessage from "@/components/PartnershipFolder/TextLengthMessage.vue";
import { useStore } from "vuex";
import {
  noSiteCauseList as noSiteCauseListData,
  noSiteObjectiveList as noSiteObjectiveListData,
} from "@/Interface/partnershipFolderDatas";
import { computed, ref } from "vue";

const { allowedToEdit } = useDP();
const store = useStore();

const identity = computed(() => store.state.account.identity);
const currentPartnerFolder = computed(
  () => store.state.account.currentPartnerFolder
);

const noSiteCauseList = ref(noSiteCauseListData);
const noSiteObjectiveList = ref(noSiteObjectiveListData);
const previousEditedValue = ref(null);

const currentSite = computed(() => {
  return currentPartnerFolder.value && currentPartnerFolder.value.sites
    ? currentPartnerFolder.value.sites[0]
    : null;
});

const updatePartnerPropertyFromForm = (data: any) =>
  store.dispatch("account/updatePartnerPropertyFromForm", data);

const onFocus = (event: { target: { value: null } }) => {
  previousEditedValue.value = event.target.value;
};
const onBlur = (event: { target: { name: string | number } }, data: any) => {
  const provider = ref[event.target.name];
  updatePartnerPropertyFromForm({
    event: event,
    provider: provider[0] || provider,
    data: data
      ? Object.assign({ previousEditedValue: previousEditedValue }, data)
      : undefined,
  });
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/Pfolder/partnership-folder.scss";
</style>
