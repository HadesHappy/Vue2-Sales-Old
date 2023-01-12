<template>
  <b-container fluid>
    <b-row v-if="status.isLocalRestoBoutique" class="mb-3">
      <b-col sm="6">
        <label class="label"
          >Proposez-vous de la vente de plats à emporter ?</label
        >
        <ValidationProvider
          name="Delivery option"
          rules=""
          ref="salesforce.opportunity.Click_Collect__c"
          v-slot="{ classes, errors }"
        >
          <b-form-select
            @change="
              onBlur($event, {
                opportunity: salesforce.opportunity,
                type: 'bool',
              })
            "
            @focus="onFocus"
            :class="classes"
            name="salesforce.opportunity.Click_Collect__c"
            v-model="isClickAndCollectActive"
            :options="yesNoOptions"
            :disabled="!identity.allowedToEdit"
            :readonly="!identity.allowedToEdit"
          ></b-form-select>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row
      v-if="
        !status.isLocalRestoBoutique ||
        (status.isLocalRestoBoutique && clickAndCollectActive)
      "
    >
      <b-col sm="12">
        <span class="form-description">
          Moyens de paiement
          <i
            v-if="isClickAndCollectOffer"
            class="far fa-question-circle custom-tooltip"
            v-b-tooltip.hover
            title="Les 2 options peuvent être sélectionnées."
          ></i>
        </span>
      </b-col>
    </b-row>
    <b-row>
      <b-col
        v-for="(paymentMethod, index) in boutiquePaymentMeth"
        :key="paymentMethod.value"
        lg="3"
        md="5"
        sm="6"
      >
        <ValidationProvider
          name="Moyens de paiement"
          :rules="{ required: !checkedPaymentMethods.length }"
          :ref="`currentPartnerFolder.paymentModes.${index}.name`"
          v-slot="{ classes, errors }"
        >
          <b-form-checkbox-group
            @change="
              onPaymentMethodChange($event, {
                partnerFolder: currentPartnerFolder,
              })
            "
            :name="`currentPartnerFolder.paymentModes.${index}.name`"
            :options="[paymentMethod]"
            v-model="checkedPaymentMethods"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
            type="checkbox"
          ></b-form-checkbox-group>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row class="mt-3 mb-2" v-if="isClickAndCollectOffer">
      <b-col>
        <span>Avez-vous un moyen de paiement en ligne ?</span>
      </b-col>
    </b-row>
    <b-row v-if="isClickAndCollectOffer">
      <b-col>
        <ValidationProvider
          name="Avez-vous un compte Stripe ?"
          :rules="{
            required:
              undefined === currentPartnerFolder.partnerBoutique.paymentType,
          }"
          ref="currentPartnerFolder.partnerBoutique.paymentType"
          v-slot="{ classes, errors }"
        >
          <b-form-radio-group
            @change="
              onBlur($event, {
                partnerBoutique: currentPartnerFolder.partnerBoutique,
              })
            "
            v-model="paymentType"
            :options="tedsPaymentTypes"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
            name="currentPartnerFolder.partnerBoutique.paymentType"
            type="radio"
          ></b-form-radio-group>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row class="mb-4 extra-informations" v-if="isClickAndCollectOffer">
      <b-col>
        <small v-if="'Stripe' === paymentType || 'Viva Wallet' === paymentType">
          <span
            >Vous n'avez pas de compte
            {{ "Stripe" === paymentType ? "Stripe" : "Viva Wallet" }} ? Suivez
            notre guide complet</span
          >
          <a
            :href="'Stripe' === paymentType ? stripeURL : vivaWalletURL"
            target="_blank"
          >
            <span class="external-link"> (ici) </span>
          </a>
          pour vous aider à le créer.
        </small>
        <small v-if="'Aucun' === paymentType">
          <span class="warning-text">Attention : </span>
          Si vous souhaitez activer le paiement en ligne, un compte Stripe ou
          Vivawallet est nécessaire pour activer le paiement en ligne.
        </small>
      </b-col>
    </b-row>
    <b-row class="mb-4" v-if="isClickAndCollectOffer && !isClient">
      <b-col>
        Note pour le CPW :
        <br />
        Si le partenaire n'a pas de compte, lui envoyer la procédure par mail,
        s'il en a un lui envoyer un mail pour lui demander de nous les
        transmettre (il nous faudra la clé privée et la clé publique)
      </b-col>
    </b-row>
    <b-row class="mb-3" v-if="isClickAndCollectOffer">
      <b-col>
        <span class="form-description"> Horaires de retrait </span>
      </b-col>
    </b-row>
    <b-row class="mb-4" v-if="isClickAndCollectOffer">
      <b-col lg="2" md="12"> Plages d'ouverture : </b-col>
      <b-col lg="10" md="12">
        <TimeRanges
          parentEntityName="partnerBoutique"
          v-bind:parentEntity="currentPartnerFolder.partnerBoutique"
          v-bind:timeRanges="currentPartnerFolder.partnerBoutique.openingRanges"
          v-bind:allowedToEdit="allowedToEdit"
          v-bind:useCheckBox="false"
          v-bind:openCloseEnabled="true"
          v-bind:verifyFields="verifyFields"
          v-bind:updateTimeRanges="updateTimeRanges"
        />
      </b-col>
    </b-row>
    <b-row class="mb-4" v-if="isClickAndCollectOffer">
      <b-col lg="2" md="6">
        Durée du créneau de retrait
        <i
          class="far fa-question-circle custom-tooltip"
          v-b-tooltip.hover
          title="Comment s'organisent les créneaux de retrait (exemples: toutes les 30 minutes, toutes les heures...)."
        ></i>
      </b-col>
      <b-col lg="2" md="6">
        <ValidationProvider
          mode="passive"
          name="Durée du créneau"
          :rules="{ required: true, regex: /^\d{2}:\d{2}$/ }"
          ref="currentPartnerFolder.partnerBoutique.pickUpTime"
          v-slot="{ classes, errors }"
        >
          <b-form-input
            @focus="onFocus($event)"
            @blur="
              onBlur($event, {
                partnerBoutique: currentPartnerFolder.partnerBoutique,
                format: 'time2sec',
              })
            "
            type="time"
            :class="classes"
            name="currentPartnerFolder.partnerBoutique.pickUpTime"
            v-model="pickUpTime"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
          ></b-form-input>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row v-if="isOldLocalBoutique">
      <b-col class="mb-3">
        <span class="form-description">Livraison</span>
      </b-col>
    </b-row>
    <b-row class="mb-4" v-if="isOldLocalBoutique">
      <b-col
        v-for="(item, index) in boutiqueDeliveryMeth"
        :key="item.value"
        lg="3"
        md="5"
        sm="6"
      >
        <b-form-checkbox-group
          @change="
            onDeliveryMethodChange($event, {
              partnerFolder: currentPartnerFolder,
            })
          "
          v-model="checkedDeliveryMethods"
          :name="`currentPartnerFolder.deliveryModes[${index}].name`"
          :options="[item]"
          :disabled="!allowedToEdit"
          :readonly="!allowedToEdit"
          type="checkbox"
        ></b-form-checkbox-group>
      </b-col>
    </b-row>
    <div
      class="d-flex flex-row flex-wrap mb-4"
      v-if="isOldLocalBoutique && atHomeDeliveryMode"
    >
      <div class="pr-3">
        <span>Pour la livraison à domicile, veuillez préciser :</span>
      </div>
      <div class="px-3">
        <b-row md="12" v-for="(item, index) in homeDelivery" :key="item.value">
          <ValidationProvider
            name="méthode livraison"
            :ref="`atHomeDeliveryMode[${index}].shippingMethods`"
            v-slot="{ classes, errors }"
          >
            <b-form-checkbox-group
              @change="
                onShippingMethodChange($event, {
                  deliveryMode: atHomeDeliveryMode,
                })
              "
              v-model="checkedShippingMethods"
              :name="`atHomeDeliveryMode[${index}].shippingMethods`"
              :options="[item]"
              :disabled="!allowedToEdit"
              :readonly="!allowedToEdit"
              type="checkbox"
            >
            </b-form-checkbox-group>
            <small :class="classes">{{ errors[0] }}</small>
          </ValidationProvider>
        </b-row>
      </div>
      <div class="pl-3 flex-fill">
        <ValidationProvider
          name="zone de livraison"
          ref="atHomeDeliveryMode.deliveryArea"
          v-slot="{ classes, errors }"
        >
          <label class="label"
            >Zone de livraison (en km, toute la France, étranger)</label
          >
          <b-form-input
            @focus="onFocus"
            @blur="
              onBlur($event, { deliveryMode: atHomeDeliveryMode, type: 'int' })
            "
            v-model="atHomeDeliveryMode.deliveryArea"
            name="atHomeDeliveryMode.deliveryArea"
            :class="classes"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
            type="number"
          ></b-form-input>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
        <ValidationProvider
          name="frais de livraison"
          rules="oneOf:Au poids,Au panier"
          ref="atHomeDeliveryMode.deliveryType"
          v-slot="{ classes, errors }"
        >
          <label class="label">Frais de livraison définis</label>
          <b-form-select
            @change="onBlur($event, { deliveryMode: atHomeDeliveryMode })"
            :class="classes"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
            type="select"
            v-model="atHomeDeliveryMode.deliveryType"
            name="atHomeDeliveryMode.deliveryType"
            :options="transporterOptions"
          ></b-form-select>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </div>
    </div>
    <div class="d-flex flex-row flex-wrap mb-4" v-if="isOldLocalBoutique">
      <div class="pr-4">
        <span>La zone de livraison :</span>
      </div>
      <div class="flex-fill pl-4">
        <b-row>
          <ValidationProvider
            name="livraison en France"
            ref="currentPartnerFolder.franceDelivery"
            v-slot="{ classes, errors }"
          >
            <b-form-checkbox
              @change="
                onBlur($event, {
                  partnerFolder: currentPartnerFolder,
                  type: 'bool',
                })
              "
              v-model="currentPartnerFolder.franceDelivery"
              name="currentPartnerFolder.franceDelivery"
              :disabled="!allowedToEdit"
              :readonly="!allowedToEdit"
              type="checkbox"
            >
              Livraison en France
            </b-form-checkbox>
            <small :class="classes">{{ errors[0] }}</small>
          </ValidationProvider>
        </b-row>
        <b-row>
          <ValidationProvider
            name="livraison à l'étranger"
            ref="currentPartnerFolder.abroadDelivery"
            v-slot="{ classes, errors }"
          >
            <b-form-checkbox
              @change="
                onBlur($event, {
                  partnerFolder: currentPartnerFolder,
                  type: 'bool',
                })
              "
              v-model="currentPartnerFolder.abroadDelivery"
              name="currentPartnerFolder.abroadDelivery"
              :disabled="!allowedToEdit"
              :readonly="!allowedToEdit"
              type="checkbox"
            >
              Livraison à l'étranger
            </b-form-checkbox>
            <small :class="classes">{{ errors[0] }}</small>
          </ValidationProvider>
        </b-row>
      </div>
    </div>
    <b-row class="mt-3 mb-2" v-if="isClickAndCollectOffer">
      <b-col>
        <span class="form-description">Livraison</span>
      </b-col>
    </b-row>
    <div v-if="isClickAndCollectOffer" class="mb-4">
      <b-row class="mb-2 mt-1">
        <b-col md="3" sm="3">
          <span>Proposez-vous la livraison à domicile ?</span>
        </b-col>
        <b-col md="3" sm="3">
          <b-row>
            <b-col md="6" sm="12">
              <ValidationProvider
                ref="currentPartnerFolder.partnerBoutique.hasHomeDeliveryOption"
                v-slot="{ classes, errors }"
                :rules="{
                  required:
                    undefined ===
                    currentPartnerFolder.partnerBoutique.hasHomeDeliveryOption,
                }"
                name="Proposez-vous la livraison à domicile"
              >
                <b-form-radio
                  v-model="
                    currentPartnerFolder.partnerBoutique.hasHomeDeliveryOption
                  "
                  :disabled="!allowedToEdit"
                  :readonly="!allowedToEdit"
                  :value="true"
                  name="currentPartnerFolder.partnerBoutique.hasHomeDeliveryOption"
                  type="radio"
                  @change="
                    onBlur($event, {
                      partnerBoutique: currentPartnerFolder.partnerBoutique,
                      type: 'bool',
                    })
                  "
                >
                  Oui
                </b-form-radio>
                <small :class="classes">{{ errors[0] }}</small>
              </ValidationProvider>
            </b-col>
            <b-col md="6" sm="12">
              <ValidationProvider
                ref="currentPartnerFolder.partnerBoutique.hasHomeDeliveryOption"
                v-slot="{ classes, errors }"
                :rules="{
                  required:
                    undefined ===
                    currentPartnerFolder.partnerBoutique.hasHomeDeliveryOption,
                }"
                name="Proposez-vous la livraison à domicile"
              >
                <b-form-radio
                  v-model="
                    currentPartnerFolder.partnerBoutique.hasHomeDeliveryOption
                  "
                  :disabled="!allowedToEdit"
                  :readonly="!allowedToEdit"
                  :value="false"
                  name="currentPartnerFolder.partnerBoutique.hasHomeDeliveryOption"
                  type="radio"
                  @change="
                    onBlur($event, {
                      partnerBoutique: currentPartnerFolder.partnerBoutique,
                      type: 'bool',
                    })
                  "
                >
                  Non
                </b-form-radio>
                <small :class="classes">{{ errors[0] }}</small>
              </ValidationProvider>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row>
        <b-col
          class="mb-2 mt-3"
          v-if="currentPartnerFolder.partnerBoutique.hasHomeDeliveryOption"
        >
          <ValidationProvider
            ref="currentPartnerFolder.deliveryMode.name"
            v-slot="{ classes, errors }"
            name="Mode de livraison souhaité"
          >
            <label class="label">Mode de livraison souhaité :</label>
            <b-form-radio-group
              @change="onBlur($event, { deliveryMode: selectedDeliveryMode })"
              v-model="selectedDeliveryMode.name"
              :options="tedsDeliveryModes"
              :disabled="!allowedToEdit"
              :readonly="!allowedToEdit"
              name="currentPartnerFolder.deliveryMode.name"
              type="radio"
              md="2"
            >
            </b-form-radio-group>
            <small :class="classes">{{ errors[0] }}</small>
          </ValidationProvider>
        </b-col>
      </b-row>
      <b-row
        v-if="
          currentPartnerFolder.partnerBoutique.hasHomeDeliveryOption &&
          selectedDeliveryMode.name
        "
      >
        <b-col class="mb-2 mt-3">
          <ValidationProvider
            name="Informations complémentaires de livraison"
            ref="currentPartnerFolder.deliveryMode.deliveryComment"
            rules="max:1000"
            v-slot="{ classes, errors }"
          >
            <label class="label"
              >Informations complémentaires de livraison (facultatif)</label
            >
            <div class="input-text">
              <b-form-textarea
                @focus="onFocus"
                @blur="onBlur($event, { deliveryMode: selectedDeliveryMode })"
                v-model="selectedDeliveryMode.deliveryComment"
                name="currentPartnerFolder.deliveryMode.deliveryComment"
                :class="classes"
                :disabled="!allowedToEdit"
                :readonly="!allowedToEdit"
                rows="4"
              ></b-form-textarea>
              <TextLengthMessage
                :value="
                  !selectedDeliveryMode || selectedDeliveryMode.deliveryComment
                "
                maxlength="1000"
              />
            </div>
            <small :class="classes">{{ errors[0] }}</small>
          </ValidationProvider>
        </b-col>
      </b-row>
      <b-row
        v-if="
          currentPartnerFolder.partnerBoutique.hasHomeDeliveryOption &&
          selectedDeliveryMode.name &&
          'Tarif unique' !== selectedDeliveryMode.name
        "
      >
        <b-col class="mb-2 mt-3"> Détail des tarifs : </b-col>
      </b-row>
      <b-row
        v-if="
          currentPartnerFolder.partnerBoutique.hasHomeDeliveryOption &&
          selectedDeliveryMode.name
        "
      >
        <b-col
          class="mb-2 mt-3"
          v-if="'Tarif unique' === selectedDeliveryMode.name"
        >
          <ValidationProvider
            name="Montant de vos frais de port unique"
            ref="currentPartnerFolder.partnerBoutique.uniqueShippingFees"
            v-slot="{ classes, errors }"
          >
            <label class="label">Montant de vos frais de port unique</label>
            <b-form-input
              @focus="onFocus"
              @blur="
                onBlur($event, {
                  partnerBoutique: currentPartnerFolder.partnerBoutique,
                  type: 'float',
                })
              "
              v-model="currentPartnerFolder.partnerBoutique.uniqueShippingFees"
              name="currentPartnerFolder.partnerBoutique.uniqueShippingFees"
              :class="classes"
              :disabled="!allowedToEdit"
              :readonly="!allowedToEdit"
            ></b-form-input>
            <small :class="classes">{{ errors[0] }}</small>
          </ValidationProvider>
        </b-col>
        <b-col
          class="mb-2 mt-3 ml-3 fee-details-container"
          v-if="'Tarif unique' !== selectedDeliveryMode.name"
        >
          <b-row
            v-for="(feeDetail, index) in selectedDeliveryMode.feeDetails"
            :key="`feeDetail-${index}`"
            class="fee-details-row"
          >
            <b-col md="12">
              <div class="float-left pt-2">De</div>
              <div class="float-left col-xl-1 col-md-2 col-sm-3 col-4">
                <ValidationProvider
                  name="Valeur min de frais de livraison"
                  :ref="`feeDetail.${index}.minValue`"
                  v-slot="{ classes, errors }"
                >
                  <b-form-input
                    @focus="onFocus"
                    @blur="
                      onBlur(
                        $event,
                        { feeDetail: feeDetail, type: 'float' },
                        'minValue'
                      )
                    "
                    v-model="feeDetail.minValue"
                    :name="`feeDetail.${index}.minValue`"
                    :class="classes"
                    :disabled="!allowedToEdit"
                    :readonly="!allowedToEdit || isFeeDetailUpdating"
                    type="number"
                    md="1"
                  ></b-form-input>
                  <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
              </div>
              <div class="float-left pt-2">{{ feeDetailUnit }} à</div>
              <div class="float-left col-xl-1 col-md-2 col-sm-3 col-4">
                <ValidationProvider
                  name="Valeur max de frais de livraison"
                  :ref="`feeDetail.${index}.maxValue`"
                  v-slot="{ classes, errors }"
                >
                  <b-form-input
                    @focus="onFocus"
                    @blur="
                      onBlur(
                        $event,
                        { feeDetail: feeDetail, type: 'float' },
                        'maxValue'
                      )
                    "
                    v-model="feeDetail.maxValue"
                    :name="`feeDetail.${index}.maxValue`"
                    :class="classes"
                    :disabled="!allowedToEdit"
                    :readonly="!allowedToEdit || isFeeDetailUpdating"
                    type="number"
                    md="1"
                  ></b-form-input>
                </ValidationProvider>
              </div>
              <div class="float-left pt-2">
                {{ feeDetailUnit }}, frais de livraison à :
              </div>
              <div class="float-left col-xl-1 col-md-2 col-sm-3 col-4">
                <ValidationProvider
                  name="Montant de frais de livraison"
                  :ref="`feeDetail.${index}.deliveryFees`"
                  v-slot="{ classes, errors }"
                >
                  <b-form-input
                    @focus="onFocus"
                    @blur="
                      onBlur(
                        $event,
                        { feeDetail: feeDetail, type: 'float' },
                        'deliveryFees'
                      )
                    "
                    v-model="feeDetail.deliveryFees"
                    :name="`feeDetail.${index}.deliveryFees`"
                    :class="classes"
                    :disabled="!allowedToEdit || isFeeDetailUpdating"
                    :readonly="!allowedToEdit"
                    type="number"
                    md="1"
                  ></b-form-input>
                  <small :class="classes">{{ errors[0] }}</small>
                </ValidationProvider>
              </div>
              <div class="float-left pt-2">€</div>
              <div
                class="float-left col-1"
                v-if="
                  selectedDeliveryMode.feeDetails.length > 1 ||
                  !hasEmptyFeeDetail()
                "
              >
                <i
                  class="fas remove-item-action"
                  :class="{
                    'fa-fan': isFeeDetailUpdating,
                    'fa-trash': !isFeeDetailUpdating,
                  }"
                  @click="onFeeDetailRemove(feeDetail, index)"
                  title="Supprimer cette tranche"
                ></i>
              </div>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row
        v-if="
          currentPartnerFolder.partnerBoutique.hasHomeDeliveryOption &&
          selectedDeliveryMode.name
        "
      >
        <b-col
          class="mb-2 mt-3"
          v-if="'Tarif unique' !== selectedDeliveryMode.name && maxRange"
        >
          La livraison ne sera pas disponible pour les colis au-delà de
          <strong> {{ maxRange }} {{ feeDetailUnit }}</strong>
          <span v-if="'Tarif au km' === selectedDeliveryMode.name">
            par rapport à la boutique</span
          >.
        </b-col>
      </b-row>
      <b-row
        v-if="
          currentPartnerFolder.partnerBoutique.hasHomeDeliveryOption &&
          selectedDeliveryMode.name &&
          'Tarif unique' !== selectedDeliveryMode.name
        "
      >
        <b-col class="mb-2 mt-3" v-if="!hasEmptyFeeDetail()">
          <span
            class="float-left add-item-action ml-3"
            @click="onDeliveryModeRangeAdd"
          >
            <i class="fas fa-plus"></i> Ajouter une tranche
          </span>
        </b-col>
      </b-row>
    </div>
    <b-row v-if="currentPartnerFolder.partnerBoutique">
      <b-col class="mb-3">
        <span class="form-description">Commande</span>
      </b-col>
    </b-row>
    <b-row
      class="mb-4"
      v-if="isOldLocalBoutique && currentPartnerFolder.partnerBoutique"
    >
      <b-col md="6">
        <ValidationProvider
          name="temps de préparation"
          rules="integer"
          ref="currentPartnerFolder.partnerBoutique.preparationDelay"
          v-slot="{ classes, errors }"
        >
          <label class="label"
            >Temps de préparation entre chaque commande (en minutes)</label
          >
          <b-form-textarea
            @focus="onFocus"
            @blur="
              onBlur($event, {
                partnerBoutique: currentPartnerFolder.partnerBoutique,
                type: 'int',
              })
            "
            v-model="currentPartnerFolder.partnerBoutique.preparationDelay"
            name="currentPartnerFolder.partnerBoutique.preparationDelay"
            :class="classes"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
            type="number"
          ></b-form-textarea>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
      <b-col md="6">
        <ValidationProvider
          name="Délai avant commande"
          rules="integer"
          ref="currentPartnerFolder.partnerBoutique.beforeOrderDelay"
          v-slot="{ classes, errors }"
        >
          <label class="label">Délai avant commande (en minutes)</label>
          <b-form-textarea
            @focus="onFocus"
            @blur="
              onBlur($event, {
                partnerBoutique: currentPartnerFolder.partnerBoutique,
                type: 'int',
              })
            "
            v-model="currentPartnerFolder.partnerBoutique.beforeOrderDelay"
            name="currentPartnerFolder.partnerBoutique.beforeOrderDelay"
            :class="classes"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
            type="number"
          ></b-form-textarea>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row
      class="mb-4"
      v-if="isOldLocalBoutique && currentPartnerFolder.partnerBoutique"
    >
      <b-col md="6" v-if="currentPartnerFolder.partnerBoutique">
        <ValidationProvider
          name="maximum de commandes"
          rules="integer"
          ref="currentPartnerFolder.partnerBoutique.simultaneousOrders"
          v-slot="{ classes, errors }"
        >
          <label class="label"
            >Maximum de commandes honorées en même temps</label
          >
          <b-form-textarea
            @focus="onFocus"
            @blur="
              onBlur($event, {
                partnerBoutique: currentPartnerFolder.partnerBoutique,
                type: 'int',
              })
            "
            v-model="currentPartnerFolder.partnerBoutique.simultaneousOrders"
            name="currentPartnerFolder.partnerBoutique.simultaneousOrders"
            :class="classes"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
            type="number"
          ></b-form-textarea>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
      <b-col>
        <ValidationProvider
          name="précisions de livraison"
          rules="min:3"
          ref="currentPartnerFolder.partnerBoutique.deliveryDetails"
          v-slot="{ classes, errors }"
        >
          <label class="label"
            >Précisions sur votre offre de livraison et les tarifs
            associés</label
          >
          <b-form-textarea
            @focus="onFocus"
            @blur="
              onBlur($event, {
                partnerBoutique: currentPartnerFolder.partnerBoutique,
              })
            "
            v-model="currentPartnerFolder.partnerBoutique.deliveryDetails"
            name="currentPartnerFolder.partnerBoutique.deliveryDetails"
            :class="classes"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
            type="textarea"
          ></b-form-textarea>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row
      class="mb-4"
      v-if="isOldLocalBoutique && currentPartnerFolder.partnerBoutique"
    >
      <b-col>
        <small
          >Si les informations de paiement et de livraison ne sont pas
          précisées, l'option Click&Collect sera ajoutée par défaut.</small
        >
      </b-col>
    </b-row>
    <b-row class="mb-4" v-if="isClickAndCollectOffer">
      <b-col md="6" sm="12">
        <b-row>
          <b-col md="12" class="my-0">
            <label class="label"
              >Proposez-vous une option cadeau gratuite ?</label
            >
          </b-col>
          <b-col md="2" class="mt-0">
            <ValidationProvider
              name="Option cadeau"
              :rules="{
                required:
                  undefined === currentPartnerFolder.partnerBoutique.freeGift,
              }"
              ref="currentPartnerFolder.partnerBoutique.freeGift"
              v-slot="{ classes, errors }"
            >
              <b-form-radio
                @change="
                  onBlur($event, {
                    partnerBoutique: currentPartnerFolder.partnerBoutique,
                    type: 'bool',
                  })
                "
                type="radio"
                name="currentPartnerFolder.partnerBoutique.freeGift"
                v-model="currentPartnerFolder.partnerBoutique.freeGift"
                :value="true"
                :disabled="!allowedToEdit"
                :readonly="!allowedToEdit"
              >
                Oui
              </b-form-radio>
              <small :class="classes">{{ errors[0] }}</small>
            </ValidationProvider>
          </b-col>
          <b-col md="2">
            <ValidationProvider
              name="Option cadeau"
              :rules="{
                required:
                  undefined === currentPartnerFolder.partnerBoutique.freeGift,
              }"
              ref="currentPartnerFolder.partnerBoutique.freeGift"
              v-slot="{ classes, errors }"
            >
              <b-form-radio
                @change="
                  onBlur($event, {
                    partnerBoutique: currentPartnerFolder.partnerBoutique,
                    type: 'bool',
                  })
                "
                type="radio"
                name="currentPartnerFolder.partnerBoutique.freeGift"
                v-model="currentPartnerFolder.partnerBoutique.freeGift"
                :value="false"
                :disabled="!allowedToEdit"
                :readonly="!allowedToEdit"
              >
                Non
              </b-form-radio>
              <small :class="classes">{{ errors[0] }}</small>
            </ValidationProvider>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row class="mb-4">
      <b-col md="6" sm="12">
        <ValidationProvider
          name="Temps de préparation"
          rules="integer"
          ref="currentPartnerFolder.partnerBoutique.preparationDelay"
          v-slot="{ classes, errors }"
        >
          <label class="label"
            >Temps de préparation entre chaque commande (en minutes)</label
          >
          <b-form-input
            @focus="onFocus"
            @blur="
              onBlur($event, {
                partnerBoutique: currentPartnerFolder.partnerBoutique,
                type: 'int',
              })
            "
            v-model="currentPartnerFolder.partnerBoutique.preparationDelay"
            name="currentPartnerFolder.partnerBoutique.preparationDelay"
            :class="classes"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
            type="number"
          ></b-form-input>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
      <b-col md="6" sm="12">
        <ValidationProvider
          name="Nombre maximum de personnes par créneau de retrait"
          rules="expected"
          ref="currentPartnerFolder.partnerBoutique.maximumAllowedPersons"
          v-slot="{ classes, errors }"
        >
          <label class="label"
            >Nombre maximum de personnes par créneau de retrait</label
          >
          <b-input
            @focus="onFocus"
            @blur="
              onBlur($event, {
                partnerBoutique: currentPartnerFolder.partnerBoutique,
                type: 'int',
              })
            "
            type="number"
            :class="classes"
            name="currentPartnerFolder.partnerBoutique.maximumAllowedPersons"
            v-model="currentPartnerFolder.partnerBoutique.maximumAllowedPersons"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
          >
          </b-input>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row class="mb-4" v-if="isClickAndCollectOffer">
      <b-col md="6" sm="12">
        <b-row>
          <b-col md="5" class="pr-0">
            <label class="label"
              >Sélectionnez le / les taux de TVA applicables sur vos
              articles</label
            >
          </b-col>
          <b-col md="7" class="pl-0">
            <a
              class="redirect-link"
              href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F23567"
              target="_blank"
            >
              <img alt="" src="@/assets/link-button.svg" />
              <span class="text">INFOS TVA</span>
            </a>
          </b-col>
        </b-row>
        <b-form-group>
          <b-form-tags
            v-model="selectedVats"
            size="md"
            add-on-change
            no-outer-focus
            class="mb-2 selected__tags"
          >
            <template
              v-slot="{ tags, inputAttrs, inputHandlers, disabled, removeTag }"
            >
              <ul
                v-if="tags.length > 0"
                class="list-inline d-inline selected__tags"
              >
                <li v-for="tag in tags" :key="tag" class="d-inline">
                  <b-form-tag
                    @remove="
                      removeTag(tag);
                      onRemoveVat(
                        tag,
                        {
                          partnerBoutique: currentPartnerFolder.partnerBoutique,
                        },
                        'vat'
                      );
                    "
                    :title="tag"
                    :disabled="!allowedToEdit"
                    >{{ tag }}</b-form-tag
                  >
                </li>
              </ul>
              <b-form-select
                class="selected__vats--options"
                v-bind="inputAttrs"
                v-on="inputHandlers"
                :disabled="!allowedToEdit"
                :readonly="!allowedToEdit"
                :options="vatOptionsList"
                @change="
                  onVatListChange(
                    $event,
                    { partnerBoutique: currentPartnerFolder.partnerBoutique },
                    'vat'
                  )
                "
              >
                <template #first>
                  <option disabled value="">Sélectionner des TVA</option>
                </template>
              </b-form-select>
            </template>
          </b-form-tags>
        </b-form-group>
      </b-col>
      <b-col md="6" sm="12">
        <ValidationProvider
          name="Adresse différente"
          ref="currentPartnerFolder.partnerBoutique.differentPickUpAddress"
          v-slot="{ classes, errors }"
        >
          <label class="label"
            >Adresse de retrait différente de celle de votre entreprise</label
          >
          <b-form-input
            @focus="onFocus"
            @blur="
              onBlur($event, {
                partnerBoutique: currentPartnerFolder.partnerBoutique,
              })
            "
            v-model="
              currentPartnerFolder.partnerBoutique.differentPickUpAddress
            "
            name="currentPartnerFolder.partnerBoutique.differentPickUpAddress"
            :class="classes"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
            type="text"
          ></b-form-input>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row class="mb-4" v-if="isClickAndCollectOffer">
      <b-col md="6" sm="12">
        <ValidationProvider
          name="Date de transmission des éléments"
          ref="currentPartnerFolder.partnerBoutique.fileTransferDate"
          v-slot="{ classes, errors }"
        >
          <label class="label"
            >À quelle date allez-vous nous transmettre vos produits (Photos +
            fichier Excel)</label
          >
          <b-form-input
            @focus="onFocus"
            @blur="
              onBlur($event, {
                partnerBoutique: currentPartnerFolder.partnerBoutique,
              })
            "
            v-model="transferDate"
            name="currentPartnerFolder.partnerBoutique.fileTransferDate"
            :class="classes"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
            type="date"
          ></b-form-input>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
      <b-col md="6" sm="12">
        <ValidationProvider
          name="Quantité de produit"
          rules="expected"
          ref="currentPartnerFolder.partnerBoutique.inStoreProductQuantity"
          v-slot="{ classes, errors }"
        >
          <label class="label"
            >Combien de produits pensez-vous à terme ajouter sur votre boutique
            ?</label
          >
          <b-form-input
            @focus="onFocus"
            @blur="
              onBlur($event, {
                partnerBoutique: currentPartnerFolder.partnerBoutique,
                type: 'int',
              })
            "
            v-model="
              currentPartnerFolder.partnerBoutique.inStoreProductQuantity
            "
            name="currentPartnerFolder.partnerBoutique.inStoreProductQuantity"
            :class="classes"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
            type="number"
          ></b-form-input>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row v-if="isClickAndCollectOffer">
      <b-col class="mb-3">
        <span class="form-description">Couleurs</span>
      </b-col>
    </b-row>
    <b-row class="mb-3" v-if="isClickAndCollectOffer">
      <b-col>
        <span>
          La boutique ne peut comporter qu’une couleur principale
          <i
            class="far fa-question-circle custom-tooltip"
            v-b-tooltip.hover
            title="Décochez la checkbox pour choisir une autre couleur dans le sélecteur ci-dessous"
          ></i>
        </span>
      </b-col>
    </b-row>
    <b-row class="mb-3" v-if="isClickAndCollectOffer">
      <b-col>
        <ValidationProvider
          name="Garder la couleur initiale"
          ref="currentPartnerFolder.partnerBoutique.keepMainColor"
          v-slot="{ classes, errors }"
        >
          <b-form-checkbox
            @change="
              onBlur($event, {
                partnerBoutique: currentPartnerFolder.partnerBoutique,
                type: 'bool',
              })
            "
            v-model="currentPartnerFolder.partnerBoutique.keepMainColor"
            name="currentPartnerFolder.partnerBoutique.keepMainColor"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
            type="checkbox"
          >
            La couleur dominante sera celle du site vitrine ?
          </b-form-checkbox>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
    </b-row>
    <b-row align-v="end" class="mb-3" v-if="isClickAndCollectOffer">
      <b-col md="4">
        <ValidationProvider
          name="Couleur dominante"
          ref="currentPartnerFolder.partnerBoutique.newMainColor"
          v-slot="{ classes, errors }"
        >
          <label class="label">Couleur dominante</label>
          <b-form-input
            @focus="onFocus"
            @change="
              onBlur($event, {
                partnerBoutique: currentPartnerFolder.partnerBoutique,
              })
            "
            type="color"
            :disabled="!allowedToEdit"
            :readonly="!allowedToEdit"
            name="currentPartnerFolder.partnerBoutique.newMainColor"
            v-model="newMainColor"
          ></b-form-input>
          <small :class="classes">{{ errors[0] }}</small>
        </ValidationProvider>
      </b-col>
      <b-col md="4" class="mb-2">
        <span>{{
          currentPartnerFolder.partnerBoutique.newMainColor
            ? currentPartnerFolder.partnerBoutique.newMainColor
            : "Aucune couleur sélectionnée"
        }}</span>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, type Ref } from "vue";
import { useStore } from "vuex";
import {
  boutiqueDeliveryMeth,
  homeDelivery,
  transporterOptions,
  availableVats,
  weekDays,
  newBoutiquePaymentMeth,
  oldBoutiquePaymentMeth,
  tedsPaymentTypes,
  tedsDeliveryModes,
  yesNoOptions,
} from "@/Interface/partnershipFolderDatas";
import {
  readyState,
  dateHelpers,
  normalizer,
  validateSection,
} from "@/helpers";
import {useDP} from "@/mixins/useDP";
import TimeRanges from "@/components/PartnershipFolder/TimeRanges.vue";
import TextLengthMessage from "@/components/PartnershipFolder/TextLengthMessage.vue";

let {
  allowedToEdit,
  isClient,
  updatePartnerAndVerifyFields,
  currentPartner,
  verifyFields,
} = useDP();
let store = useStore();

let identity = computed(() => store.state.account.identity);
let opportunity = computed(() => store.state.account.opportunity);
let currentPartnerFolder = computed(
  () => store.state.account.currentPartnerFolder
);

let status = computed(() => store.state.globalStore.status);
let paymentModes = computed(() => store.state.globalStore.paymentModes);
let deliveryModes = computed(() => store.state.globalStore.deliveryModes);
let salesforce = computed(() => store.state.globalStore.salesforce);

let pickUpTime = computed({
  get() {
    return normalizer.secondsToStrTime(
      currentPartnerFolder.value.partnerBoutique.pickUpTime
    );
  },
  set(val) {
    currentPartnerFolder.value.partnerBoutique.pickUpTime =
      normalizer.strTimeToSeconds(val);
  },
});
let transferDate = computed({
  get() {
    return currentPartnerFolder.value.partnerBoutique.fileTransferDate
      ? dateHelpers.dateToStringForInput(
          currentPartnerFolder.value.partnerBoutique.fileTransferDate
        )
      : null;
  },
  set(value) {
    return (currentPartnerFolder.value.partnerBoutique.fileTransferDate =
      value);
  },
});
let isClickAndCollectOffer = computed(() => {
  return (
    (status.value.isNewLocalBoutique || status.value.isLocalRestoBoutique) &&
    currentPartnerFolder.value.partnerBoutique
  );
});
let isOldLocalBoutique = computed(() => {
  return status.value.isOldLocalBoutique;
});
let boutiquePaymentMeth = computed(() => {
  if (isOldLocalBoutique.value) {
    return oldBoutiquePaymentMeth;
  } else if (isClickAndCollectOffer.value) {
    return newBoutiquePaymentMeth;
  }

  return null;
});
let newMainColor = computed({
  get() {
    if (
      isClickAndCollectOffer.value &&
      currentPartner.value.partnerBoutique.keepMainColor
    ) {
      currentPartner.value.partnerBoutique.newMainColor =
        currentPartner.value.sites[0].mainColor;
      return currentPartner.value.partnerBoutique.newMainColor;
    } else {
      if (
        currentPartner.value.partnerBoutique.newMainColor &&
        currentPartner.value.sites[0].mainColor !==
          currentPartner.value.partnerBoutique.newMainColor
      ) {
        return currentPartner.value.partnerBoutique.newMainColor;
      }

      return (currentPartner.value.partnerBoutique.newMainColor = null);
    }
  },
  set(val) {
    if (!currentPartnerFolder.value.partnerBoutique.keepMainColor) {
      return (currentPartnerFolder.value.partnerBoutique.newMainColor = null);
    }
    currentPartnerFolder.value.partnerBoutique.newMainColor = val;

    return currentPartnerFolder.value.partnerBoutique.newMainColor;
  },
});
let feeDetailUnit = computed(() => {
  return selectedDeliveryMode.value &&
    "Tarif unique" !== selectedDeliveryMode.value.name
    ? unitsByDeliveryType[selectedDeliveryMode.value.name] || ""
    : "";
});
let maxRange = computed(() => {
  if (
    !selectedDeliveryMode.value ||
    !selectedDeliveryMode.value.feeDetails ||
    !selectedDeliveryMode.value.feeDetails.length
  ) {
    return null;
  }

  return selectedDeliveryMode.value.feeDetails
    .map((a: { maxValue: any }) => a.maxValue)
    .sort((a: number, b: number) => b - a)[0];
});
let paymentType = computed({
  get() {
    return currentPartnerFolder.value.partnerBoutique.paymentType;
  },
  set(value) {
    currentPartnerFolder.value.partnerBoutique.paymentType = value;
  },
});
let isClickAndCollectActive = computed({
  set(value) {
    clickAndCollectActive = value;
    salesforce.value.opportunity.Click_Collect__c = value;
  },
  get() {
    return clickAndCollectActive;
  },
});

let clickAndCollectActive = ref(null);
let isFeeDetailUpdating = ref(false);
let allowDeliveryAtHome = ref(false);
let checkedDeliveryMethods = ref([]);
let checkedTedsDeliveryMode = ref(null);
let selectedDeliveryMode = ref({});
let checkedPaymentMethods = ref([]);
let checkedShippingMethods = ref([]);
let atHomeDeliveryMode = ref(null);
let openingRanges = ref([]);
let morningOpeningRanges = ref([]);
let selectedDays = ref([]);
let boutiqueTimeRanges = ref(undefined);
let selectedVats = ref([]);
let unitsByDeliveryType = ref({
  "Tarif au km": "km",
  "Poids au colis": "kg",
  "Valeur du colis": "€",
});
let stripeURL = ref(import.meta.env.VUE_STRIPE_TUTORIAL_URL);
let vivaWalletURL = ref(import.meta.env.VUE_VIVA_WALLET_TUTORIAL_URL);
let previousEditedValue = ref(null);

let updatePartnerPropertyFromForm = (value: any) =>
  store.dispatch("account/updatePartnerPropertyFromForm", value);
let deletePartnerPropertyFromForm = (value: any) =>
  store.dispatch("account/deletePartnerPropertyFromForm", value);
let getPaymentModes = () => store.dispatch("globalStore/getPaymentModes");

let onFocus = (event: { target: { value: any } }) => {
  previousEditedValue.value = event.target.value;
};
let onBlur = (
  event: { target: { name: string | number; value: any } },
  data: {
    partnerBoutique: { id: any; partnerFolder: any };
    deliveryMode: { id: any; partners: any[] };
    feeDetail: { [x: string]: number; id: any; deliveryMode: any };
  },
  offset = null
) => {
  let provider = ref[event.target.name];
  if (data.partnerBoutique && !data.partnerBoutique.id) {
    data.partnerBoutique.partnerFolder = currentPartnerFolder.value["@id"];
  }
  if (data.deliveryMode && !data.deliveryMode.id) {
    data.deliveryMode.partners = [currentPartnerFolder.value["@id"]];
  }
  if (data.feeDetail) {
    if (
      offset &&
      ["minValue", "maxValue", "deliveryFees"].indexOf(offset) >= 0
    ) {
      data.feeDetail[offset] = normalizer.floatNormalizer(event.target.value);
    }
    if (!data.feeDetail.id) {
      isFeeDetailUpdating.value = true;
      data.feeDetail.deliveryMode = selectedDeliveryMode.value["@id"];
    }
  }

  updatePartnerPropertyFromForm({
    event: event,
    provider: provider[0] || provider,
    data: data
      ? Object.assign({ previousEditedValue: previousEditedValue }, data)
      : undefined,
  })
    .then((response) => {
      if (data.deliveryMode && !data.deliveryMode.id) {
        selectedDeliveryMode.value = response[0];
      }
      verifyFields();
    })
    .finally(() => (isFeeDetailUpdating.value = false));
};
let onVatListChange = (
  value: any,
  data: { partnerBoutique: { vat: never[] }; value: any; offset: any },
  offset: any
) => {
  let vatList = data.partnerBoutique.vat || [];
  if (value && !vatList.includes(value)) {
    vatList.push(value);
  }
  data.value = vatList;
  data.offset = offset;
  updatePartnerAndVerifyFields(data);
};
let onRemoveVat = (
  value: any,
  data: { partnerBoutique: { vat: never[] }; value: any; offset: any },
  offset: any
) => {
  let vatList = data.partnerBoutique.vat || [];
  let index = vatList.indexOf(value);
  if (!value || -1 === index) {
    return;
  }
  vatList.splice(index, 1);
  data.value = vatList;
  data.offset = offset;
  updatePartnerAndVerifyFields(data);
};
let onShippingMethodChange = (
  event: any,
  data: { offset: string; value: Ref<never[]> }
) => {
  data.offset = "shippingMethods";
  data.value = checkedShippingMethods;
  updatePartnerAndVerifyFields(data);
};
let onPaymentMethodChange = (
  event: any,
  data: { partnerFolder: any; offset: string; value: any[] }
) => {
  let newPaymentModes: (
    | { id: never; name?: undefined }
    | { name: never; id?: undefined }
  )[] = [];
  checkedPaymentMethods.value.forEach((checkedPaymentMethod) => {
    if (checkedPaymentMethod) {
      newPaymentModes.push(
        paymentModes[checkedPaymentMethod]
          ? { id: paymentModes[checkedPaymentMethod]["@id"] }
          : { name: checkedPaymentMethod }
      );
    }
  });
  if (data.partnerFolder) {
    data.offset = "paymentModes";
    data.value = newPaymentModes;
    updatePartnerAndVerifyFields(data);
  }
};
let onDeliveryMethodChange = (
  event: { target: { value: string; checked: any } },
  data: { partnerFolder: any; offset: string; value: any[] }
) => {
  if (event.target.value && "à domicile" === event.target.value.toLowerCase()) {
    allowDeliveryAtHome = event.target.checked;
    if (allowDeliveryAtHome.value) {
      let atHomeDeliveryMode = findAtHomeDeliveryMode();
      if (!atHomeDeliveryMode) {
        atHomeDeliveryMode = {
          name: "À domicile",
          partnerFolder: currentPartnerFolder.value["@id"],
        };
        currentPartnerFolder.value.deliveryModes.push(atHomeDeliveryMode);
        atHomeDeliveryMode = atHomeDeliveryMode;
      }
    } else {
      atHomeDeliveryMode = null;
    }
  }

  let newDeliveryMethods: { id?: any; name?: never }[] = [];
  checkedDeliveryMethods.value.forEach((checkedDeliveryMethod) => {
    if (!checkedDeliveryMethod) {
      return;
    }

    let deliveryModeFound = currentPartnerFolder.value.deliveryModes.find(
      (item: { name: string }) =>
        item.name &&
        item.name.toLowerCase() === checkedDeliveryMethod.toLowerCase()
    );

    if (deliveryModeFound) {
      if (deliveryModeFound["@id"]) {
        newDeliveryMethods.push({ id: deliveryModeFound["@id"] });
      } else {
        newDeliveryMethods.push(deliveryModeFound);
      }
    } else {
      newDeliveryMethods.push({ name: checkedDeliveryMethod });
    }
  });

  if (data.partnerFolder) {
    data.offset = "deliveryModes";
    data.value = newDeliveryMethods;
    updatePartnerAndVerifyFields(data);
  }
};
let onDeliveryModeRangeAdd = () => {
  if (!hasEmptyFeeDetail()) {
    selectedDeliveryMode.value.feeDetails.push({});
  }
};
let hasEmptyFeeDetail = () => {
  if (
    !selectedDeliveryMode.value.feeDetails ||
    !selectedDeliveryMode.value.feeDetails.length
  ) {
    return false;
  }

  let lastFeeDetail =
    selectedDeliveryMode.value.feeDetails[
      selectedDeliveryMode.value.feeDetails.length - 1
    ];

  return !lastFeeDetail || !lastFeeDetail.id;
};
let onFeeDetailRemove = (feeDetail: { id: any }, index: any) => {
  if (!feeDetail.id) {
    selectedDeliveryMode.value.feeDetails.splice(index, 1);
    return;
  }
  deletePartnerPropertyFromForm({ data: { feeDetail } });
};
let findAtHomeDeliveryMode = (offset: string | number | undefined) => {
  if (!currentPartnerFolder.value.deliveryModes.length) {
    return null;
  }

  let found = currentPartnerFolder.value.deliveryModes.find(
    (item: { name: string }) => "À domicile" === item.name
  );

  return found && offset && found[offset] ? found[offset] : found;
};
let validateFields = async (
  refs: any,
  entity: {
    currentPartnerFolder: {
      partnerBoutique: { openingRanges: string | any[] };
    };
  }
) => {
  if (!allowedToEdit) {
    validateDisplayColor("reset");
    return;
  }

  if (status.value.isLocalRestoBoutique && !clickAndCollectActive.value) {
    return validateDisplayColor("reset");
  }

  let isValid = await validateSection.validateRequiredFields(entity, refs);

  if (isValid && boutiqueTimeRanges) {
    if (Array.isArray(boutiqueTimeRanges)) {
      isValid = boutiqueTimeRanges.value.length > 0 ? true : null;
    }
  }

  if (isValid && !boutiqueTimeRanges.value) {
    isValid =
      entity.currentPartnerFolder &&
      entity.currentPartnerFolder.partnerBoutique &&
      entity.currentPartnerFolder.partnerBoutique.openingRanges &&
      entity.currentPartnerFolder.partnerBoutique.openingRanges.length > 0
        ? true
        : null;
  }

  if (
    (!entity.currentPartnerFolder ||
      !entity.currentPartnerFolder.partnerBoutique ||
      !entity.currentPartnerFolder.partnerBoutique.openingRanges ||
      !entity.currentPartnerFolder.partnerBoutique.openingRanges.length) &&
    !boutiqueTimeRanges.value
  ) {
    isValid = null;
  }

  validateDisplayColor(isValid);
};
let updateTimeRanges = (timeRanges: any) => {
  boutiqueTimeRanges = timeRanges;
};
let validateDisplayColor = (isValid: string | boolean | null) => {
  return validateSection.displayColorStateOnSection(
    "payment-method-and-delivery",
    isValid
  );
};

onMounted(async () => {
  if (!Object.keys(paymentModes).length) {
    getPaymentModes();
  }
  let currentPartnerFolder = await readyState.getCurrentPartnerState();

  checkedPaymentMethods.value = (currentPartnerFolder.paymentModes || [])
    .map((item: { name: any }) => item.name)
    .filter((item: any) => item);

  if (isOldLocalBoutique.value) {
    checkedDeliveryMethods.value = currentPartnerFolder.deliveryModes.map(
      (item: { name: any }) => item.name
    );
    atHomeDeliveryMode.value = findAtHomeDeliveryMode();
    if (atHomeDeliveryMode.value) {
      allowDeliveryAtHome = true;
      checkedShippingMethods = atHomeDeliveryMode.value.shippingMethods;
    }
  }

  if (isClickAndCollectOffer.value) {
    if (
      currentPartnerFolder.deliveryModes &&
      currentPartnerFolder.deliveryModes.length
    ) {
      selectedDeliveryMode = currentPartnerFolder.deliveryModes[0];
    } else {
      selectedDeliveryMode = {};
    }
  }

  if (
    currentPartnerFolder &&
    currentPartnerFolder.partnerBoutique &&
    !currentPartnerFolder.partnerBoutique.newMainColor &&
    !currentPartnerFolder.partnerBoutique.keepMainColor
  ) {
    currentPartnerFolder.partnerBoutique.newMainColor = null;
  }

  selectedVats =
    currentPartnerFolder.partnerBoutique &&
    currentPartnerFolder.partnerBoutique.vat
      ? currentPartnerFolder.partnerBoutique.vat
      : [];
  readyState.getSalesforceState().then((salesforceData) => {
    isClickAndCollectActive = salesforceData.opportunity.Click_Collect__c;
  });
});
</script>

<style lang="scss" scoped>
@import "@/assets/style/Pfolder/partnership-folder.scss";
</style>
