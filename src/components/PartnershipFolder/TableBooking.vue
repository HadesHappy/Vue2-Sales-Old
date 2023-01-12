<template>
	<b-container fluid>
		<b-row>
			<b-col>
				<b-row class="my-3">
					<b-col>
						<span class="form-description">Services</span>
						<span class="text-italic text-gray">
              (créer autant de services que le partenaire en propose. Ex :
              Brunch ; Midi 1 ; Midi 2 ; Soir)
            </span>
					</b-col>
				</b-row>
				<b-row class="pages-container" id="booking-service-tree">
					<template v-if="bookingServices && bookingServices.length">
						<b-col
							v-for="(bookingService, serviceIndex) in bookingServices"
							:key="`service-${serviceTimestamp}-${serviceIndex}`"
							lg="6"
							md="12"
							sm="12"
							class="page-item mb-3"
						>
							<b-col class="mb-2 __description p-0">
								<span class="text-bold">Service {{ bookingService.name }}</span>
							</b-col>
							<i class="fas fa-fan" v-if="isServiceLoading[serviceIndex]"></i>
							<i
								class="fas fa-trash"
								v-else-if="allowedToEdit"
								@click="onServiceRemove(bookingService, serviceIndex)"
							></i>
							<b-col class="mb-2 __description">
								<b-row>
									<b-col sm="12" md="3">
										<label class="service__label">*Nom du service :</label>
									</b-col>
									<b-col sm="12" md="9">
										<ValidationProvider
											name="Nom du service"
											:rules="{
                        min: 3,
                        required: true,
                        expectedUniqueValues: { values: serviceNames },
                      }"
											:ref="`currentPartnerFolder.partnerHotelResto.bookingServices.${serviceIndex}.name`"
											v-slot="{ classes, errors }"
										>
											<b-form-input
												type="text"
												@focus="onFocus"
												@blur="
                          onBookingServiceChange(
                            $event,
                            { bookingService: bookingService },
                            serviceIndex
                          )
                        "
												:class="classes"
												:disabled="
                          !allowedToEdit || isServiceLoading[serviceIndex]
                        "
												:readonly="!allowedToEdit"
												:name="`currentPartnerFolder.partnerHotelResto.bookingServices.${serviceIndex}.name`"
												v-model="bookingService.name"
											></b-form-input>
											<small :class="classes">{{ errors[0] }}</small>
										</ValidationProvider>
									</b-col>
								</b-row>
								<b-row>
									<b-col sm="12" md="3">
										<label class="service__label">Description :</label>
									</b-col>
									<b-col sm="12" md="9" class="__description">
										<ValidationProvider
											name="Description"
											rules="min:3"
											:ref="`currentPartnerFolder.partnerHotelResto.bookingServices.${serviceIndex}.description`"
											v-slot="{ classes, errors }"
										>
											<b-form-textarea
												type="textarea"
												@focus="onFocus"
												@blur="
                          onBookingServiceChange(
                            $event,
                            { bookingService: bookingService },
                            serviceIndex
                          )
                        "
												:class="classes"
												:disabled="
                          !allowedToEdit || isServiceLoading[serviceIndex]
                        "
												:readonly="!allowedToEdit"
												:name="`currentPartnerFolder.partnerHotelResto.bookingServices.${serviceIndex}.description`"
												v-model="bookingService.description"
											></b-form-textarea>
											<small :class="classes">{{ errors[0] }}</small>
										</ValidationProvider>
									</b-col>
								</b-row>
								<b-row>
									<b-col sm="12" md="3">
										<label class="service__label"
										>*Durée moyenne d’occupation d’une table :</label
										>
									</b-col>
									<b-col sm="12" md="3" class="__description">
										<ValidationProvider
											name="Durée moyenne d’occupation d'une table"
											rules="required"
											:ref="`currentPartnerFolder.partnerHotelResto.bookingServices.${serviceIndex}.occupancyDelay`"
											v-slot="{ classes, errors }"
										>
											<b-form-input
												type="time"
												@focus="onFocus"
												@blur="
                          onBookingServiceChange(
                            $event,
                            {
                              bookingService: bookingService,
                              format: 'time2sec',
                            },
                            serviceIndex
                          )
                        "
												:class="classes"
												:disabled="
                          !allowedToEdit || isServiceLoading[serviceIndex]
                        "
												:readonly="!allowedToEdit"
												:name="`currentPartnerFolder.partnerHotelResto.bookingServices.${serviceIndex}.occupancyDelay`"
												v-model="occupancyDelays[serviceIndex]"
											></b-form-input>
											<small :class="classes">{{ errors[0] }}</small>
										</ValidationProvider>
									</b-col>
								</b-row>
								<b-row>
									<b-col sm="4" md="3">
										<label class="service__label"
										>*Nb de couverts disponibles à la réservation en
											ligne</label
										>
									</b-col>
									<b-col sm="8" md="3" class="__description">
										<ValidationProvider
											name="Nb de couverts disponibles"
											rules="required|integer"
											:ref="`currentPartnerFolder.partnerHotelResto.bookingServices.${serviceIndex}.flatwareQuantity`"
											v-slot="{ classes, errors }"
										>
											<b-form-input
												type="number"
												@focus="onFocus"
												@blur="
                          onBookingServiceChange(
                            $event,
                            { bookingService: bookingService },
                            serviceIndex
                          )
                        "
												:class="classes"
												:disabled="
                          !allowedToEdit || isServiceLoading[serviceIndex]
                        "
												:readonly="!allowedToEdit"
												:name="`currentPartnerFolder.partnerHotelResto.bookingServices.${serviceIndex}.flatwareQuantity`"
												v-model="bookingService.flatwareQuantity"
											></b-form-input>
											<small :class="classes">{{ errors[0] }}</small>
										</ValidationProvider>
									</b-col>
									<b-col sm="4" md="3">
										<label class="service__label"
										>*Nb max. de couverts par réservation en ligne</label
										>
									</b-col>
									<b-col sm="8" md="3" class="__description">
										<ValidationProvider
											name="Nb max. de couverts"
											rules="required|integer"
											:ref="`currentPartnerFolder.partnerHotelResto.bookingServices.${serviceIndex}.flatwareMaxQuantity`"
											v-slot="{ classes, errors }"
										>
											<b-form-input
												type="number"
												@focus="onFocus"
												@blur="
                          onBookingServiceChange(
                            $event,
                            { bookingService: bookingService },
                            serviceIndex
                          )
                        "
												:class="classes"
												:disabled="
                          !allowedToEdit || isServiceLoading[serviceIndex]
                        "
												:readonly="!allowedToEdit"
												:name="`currentPartnerFolder.partnerHotelResto.bookingServices.${serviceIndex}.flatwareMaxQuantity`"
												v-model="bookingService.flatwareMaxQuantity"
											></b-form-input>
											<small :class="classes">{{ errors[0] }}</small>
										</ValidationProvider>
									</b-col>
								</b-row>
								<b-row class="service__entitle" v-if="bookingService.id">
									<b-col>
										<label>Plages horaires du service :</label>
									</b-col>
								</b-row>
								<b-row
									v-if="
                    bookingService.bookingTimeRanges &&
                    bookingService.bookingTimeRanges.length
                  "
									v-for="(bookingTimeRange, rangeIndex) in bookingServices[
                    serviceIndex
                  ].bookingTimeRanges"
									:key="`timerange-${serviceTimestamp}-${rangeIndex}`"
									class="service-time-range-container"
								>
									<b-col>
										<b-row>
											<b-col sm="12" md="4" class="__description">
												<label class="label">Service saisonnier ?</label>
												<ValidationProvider
													name="Service saisonnier ?"
													:ref="`bookingTimeRanges.${rangeIndex}.seasonal`"
													v-slot="{ classes, errors }"
												>
													<b-form-select
														@change="
                              onBookingTimeRangeChange(
                                $event,
                                serviceIndex,
                                rangeIndex,
                                {
                                  bookingTimeRange: bookingTimeRange,
                                  type: 'bool',
                                }
                              )
                            "
														v-model="bookingTimeRange.seasonal"
														:name="`bookingTimeRanges.${rangeIndex}.seasonal`"
														:class="classes"
														:disabled="
                              !allowedToEdit || isServiceLoading[serviceIndex]
                            "
														:readonly="!allowedToEdit"
														:options="yesNoOptions"
														value-field="value"
														text-field="text"
														type="select"
													></b-form-select>
													<small :class="classes">{{ errors[0] }}</small>
												</ValidationProvider>
											</b-col>
											<b-col
												sm="12"
												md="4"
												class="__description"
												v-if="bookingTimeRange.seasonal"
											>
												<label class="label">Date de début</label>
												<ValidationProvider
													name="Date de début"
													rules="min:3|checkPeriodDates:@startDate,@endDate"
													:ref="`currentPartnerFolder.partnerHotelResto.bookingServices.${serviceIndex}.bookingTimeRanges.${rangeIndex}.startDate`"
													v-slot="{ classes, errors }"
												>
													<b-form-datepicker
														type="date"
														@input="
                              onStartDateChange(
                                bookingTimeRange,
                                serviceIndex,
                                rangeIndex
                              )
                            "
														v-model="bookingTimeRange.startDate"
														:class="classes"
														:name="`currentPartnerFolder.partnerHotelResto.bookingServices.${serviceIndex}.bookingTimeRanges.${rangeIndex}.startDate`"
														:disabled="
                              !allowedToEdit || isServiceLoading[serviceIndex]
                            "
														:readonly="!allowedToEdit"
														size="sm"
													></b-form-datepicker>
													<small :class="classes">{{ errors[0] }}</small>
												</ValidationProvider>
											</b-col>
											<b-col
												sm="12"
												md="4"
												class="__description"
												v-if="bookingTimeRange.seasonal"
											>
												<label class="label">Date de fin</label>
												<ValidationProvider
													name="Date de fin"
													rules="min:3|checkPeriodDates:@startDate,@endDate"
													:ref="`currentPartnerFolder.partnerHotelResto.bookingServices.${serviceIndex}.bookingTimeRanges.${rangeIndex}.endDate`"
													v-slot="{ classes, errors }"
												>
													<b-form-datepicker
														type="date"
														@input="
                              onEndDateChange(
                                bookingTimeRange,
                                serviceIndex,
                                rangeIndex
                              )
                            "
														v-model="bookingTimeRange.endDate"
														:class="classes"
														:name="`currentPartnerFolder.partnerHotelResto.bookingServices.${serviceIndex}.bookingTimeRanges.${rangeIndex}.endDate`"
														:disabled="
                              !allowedToEdit || isServiceLoading[serviceIndex]
                            "
														:readonly="!allowedToEdit"
														size="sm"
													></b-form-datepicker>
													<small :class="classes">{{ errors[0] }}</small>
												</ValidationProvider>
											</b-col>
										</b-row>
										<b-row>
											<b-col md="4" class="mt-1">
												<label class="service__label"
												>Réservation après minuit ?</label
												>
											</b-col>
											<b-col md="3" class="__description">
												<ValidationProvider
													name="Réservation après minuit ?"
													:ref="`currentPartnerFolder.partnerHotelResto.bookingServices.${serviceIndex}.bookingTimeRanges.${rangeIndex}.allowAfterMidnight`"
													v-slot="{ classes, errors }"
												>
													<b-form-select
														@change="
                              onBookingTimeRangeChange(
                                $event,
                                serviceIndex,
                                rangeIndex,
                                {
                                  bookingTimeRange: bookingTimeRange,
                                  type: 'bool',
                                }
                              )
                            "
														:options="yesNoOptions"
														:class="classes"
														:name="`currentPartnerFolder.partnerHotelResto.bookingServices.${serviceIndex}.bookingTimeRanges.${rangeIndex}.allowAfterMidnight`"
														:disabled="
                              !allowedToEdit || isServiceLoading[serviceIndex]
                            "
														:readonly="!allowedToEdit"
														v-model="bookingTimeRange.allowAfterMidnight"
													></b-form-select>
													<small :class="classes">{{ errors[0] }}</small>
												</ValidationProvider>
											</b-col>
										</b-row>
										<b-row>
											<b-col
												class="days-of-week __description"
												v-if="undefined !== selectedDaysOfWeek[serviceIndex]"
											>
												<b-form-group>
													<b-form-tags
														size="md"
														v-model="
                              selectedDaysOfWeek[serviceIndex][rangeIndex]
                            "
														add-on-change
														no-outer-focus
														class="mb-2 selected__tags"
													>
														<template
															v-slot="{
                                tags,
                                inputAttrs,
                                inputHandlers,
                                disabled,
                                removeTag,
                              }"
														>
															<ul
																v-if="tags.length > 0"
																class="list-inline d-inline selected__days"
															>
																<li
																	v-for="tag in tags"
																	:key="tag"
																	class="d-inline"
																>
																	<b-form-tag
																		@remove="
                                      removeTag(tag);
                                      onDayOfWeekRemove(
                                        tag,
                                        serviceIndex,
                                        rangeIndex
                                      );
                                    "
																		:title="tag"
																		:disabled="
                                      disabled ||
                                      !allowedToEdit ||
                                      isServiceLoading[serviceIndex]
                                    "
																	>{{ tag }}
																	</b-form-tag
																	>
																</li>
															</ul>
															<b-form-select
																class="selected__days--options"
																v-bind="inputAttrs"
																v-on="inputHandlers"
																:disabled="
                                  disabled ||
                                  !allowedToEdit ||
                                  isServiceLoading[serviceIndex]
                                "
																:readonly="
                                  disabled ||
                                  !allowedToEdit ||
                                  isServiceLoading[serviceIndex]
                                "
																:options="
                                  getAvailableDaysOfWeek(
                                    serviceIndex,
                                    rangeIndex
                                  )
                                "
																@change="
                                  onDayOfWeekChange(
                                    $event,
                                    serviceIndex,
                                    rangeIndex
                                  )
                                "
															>
																<template #first>
																	<!-- This is required to prevent bugs with Safari -->
																	<option disabled value="">
																		Sélectionner des jours
																	</option>
																</template>
															</b-form-select>
														</template>
													</b-form-tags>
												</b-form-group>
											</b-col>
											<b-col
												sm="6"
												md="2"
												class="time-container __description"
												v-if="undefined !== startTimes[serviceIndex]"
											>
												<ValidationProvider
													mode="passive"
													name="Heure d'ouverture"
													:rules="{
                            required: hasSelectedDays(serviceIndex, rangeIndex),
                            regex: /^\d{2}:\d{2}$/,
                          }"
													:ref="`currentPartnerFolder.partnerHotelResto.bookingServices.${serviceIndex}.bookingTimeRanges.${rangeIndex}.startTime`"
													v-slot="{ classes, errors }"
												>
													<b-form-input
														@focus="onFocus($event)"
														type="time"
														:class="classes"
														:name="`currentPartnerFolder.partnerHotelResto.bookingServices.${serviceIndex}.bookingTimeRanges.${rangeIndex}.startTime`"
														@blur="
                              onBookingTimeRangeChange(
                                $event,
                                serviceIndex,
                                rangeIndex,
                                {
                                  bookingTimeRange: bookingTimeRange,
                                  format: 'time2sec',
                                }
                              )
                            "
														v-model="startTimes[serviceIndex][rangeIndex]"
														:disabled="
                              !allowedToEdit ||
                              isServiceLoading[serviceIndex] ||
                              !hasSelectedDays(serviceIndex, rangeIndex)
                            "
														:readonly="!allowedToEdit"
													></b-form-input>
													<small :class="classes">{{ errors[0] }}</small>
												</ValidationProvider>
											</b-col>
											<b-col
												sm="6"
												md="2"
												class="time-container __description"
												v-if="undefined !== endTimes[serviceIndex]"
											>
												<ValidationProvider
													mode="passive"
													name="Heure de fermeture"
													:rules="{
                            required: hasSelectedDays(serviceIndex, rangeIndex),
                            regex: /^\d{2}:\d{2}$/,
                          }"
													:ref="`currentPartnerFolder.partnerHotelResto.bookingServices.${serviceIndex}.bookingTimeRanges.${rangeIndex}.endTime`"
													v-slot="{ classes, errors }"
												>
													<b-form-input
														@focus="onFocus($event)"
														type="time"
														:class="classes"
														:name="`currentPartnerFolder.partnerHotelResto.bookingServices.${serviceIndex}.bookingTimeRanges.${rangeIndex}.endTime`"
														@blur="
                              onBookingTimeRangeChange(
                                $event,
                                serviceIndex,
                                rangeIndex,
                                {
                                  bookingTimeRange: bookingTimeRange,
                                  format: 'time2sec',
                                }
                              )
                            "
														v-model="endTimes[serviceIndex][rangeIndex]"
														:disabled="
                              !allowedToEdit ||
                              isServiceLoading[serviceIndex] ||
                              !hasSelectedDays(serviceIndex, rangeIndex)
                            "
														:readonly="!allowedToEdit"
													></b-form-input>
													<small :class="classes">{{ errors[0] }}</small>
												</ValidationProvider>
											</b-col>
										</b-row>
									</b-col>
									<i
										class="fas fa-trash"
										v-if="allowedToEdit"
										@click="
                      onServiceTimeRangeRemove(
                        bookingTimeRange,
                        serviceIndex,
                        rangeIndex
                      )
                    "
									></i>
								</b-row>
								<b-row class="mb-3">
									<div
										id="add-time-range"
										class="float-left add-item-action ml-3"
										:class="{
                      disabled:
                        !allowedToEdit ||
                        isServiceLoading[serviceIndex] ||
                        !bookingService ||
                        !bookingService.id,
                    }"
										@click="onServiceTimeRangeAdd(serviceIndex)"
									>
										<i class="fas fa-plus"></i> Ajouter des horaires
									</div>
								</b-row>
							</b-col>
						</b-col>
					</template>
					<b-col
						lg="6"
						md="12"
						sm="12"
						class="page-item sample-page mb-3"
						v-if="allowedToEdit"
					>
						<b-col class="mb-2 __title px-0 py-2" @click="onBookingServiceAdd()"
						>&nbsp;
						</b-col
						>
						<b-col
							class="mb-2 __description p-0"
							@click="onBookingServiceAdd()"
						>
							<i class="fas fa-plus"></i>
						</b-col>
					</b-col>
				</b-row>
				<b-row class="my-3">
					<b-col>
						<span class="form-description">Indisponibilités</span>
						<span class="text-italic text-gray">
              (les réservations de table ne seront plus possible sur cette
              période)
            </span>
					</b-col>
				</b-row>
				<b-row>
					<b-col v-if="serviceTimestamp">
						<ExceptionnalDates
							parentEntityName="partnerHotelResto"
							parentEntityPath="currentPartnerFolder.partnerHotelResto"
							:enableIsOpeningRange="false"
							:isOpeningRange="false"
							:enableReason="true"
							:allowedToEdit="allowedToEdit"
							size="sm"
							:displayEntitle="false"
						/>
					</b-col>
				</b-row>
				<b-row class="my-3">
					<b-col>
            <span class="form-description"
			>Liens vers des plateformes de livraison externe</span
			>
						<span class="text-italic text-gray">
              (cocher si vous souhaitez ajouter le lien vers ces différentes
              plateformes de livraison sur votre site)
            </span>
					</b-col>
				</b-row>
				<b-row
					class="mb-3"
					v-for="(deliveryMode, index) in currentDeliveryModes.value"
					:key="`booking-delivery-${deliveryTimestamp}-${index}`"
				>
					<b-col md="3" lg="3" class="display-context">
						<b-form-checkbox
							@change="onDeliveryModeCheck(index)"
							v-model="checkedDeliveryModes[index]"
							:name="`currentPartnerFolder.partnerHotelResto.deliveryModes.${index}.name`"
							:disabled="!allowedToEdit || isDeliveryModeLoading[index]"
							:readonly="!allowedToEdit"
							type="checkbox"
						>
							{{
								deliveryMode.name
									? deliveryMode.name
									: restoDeliveryMethods[index].value
							}}
						</b-form-checkbox>
					</b-col>
					<b-col
						md="9"
						lg="4"
						class="display-context__input"
						v-if="undefined !== deliveryMode"
					>
						<ValidationProvider
							name="URL"
							:rules="{
                required: !!deliveryMode.name,
                min: deliveryMode.name ? 3 : 0,
              }"
							:ref="`currentPartnerFolder.partnerHotelResto.deliveryModes.${index}.url`"
							v-slot="{ classes, errors }"
						>
							<b-form-input
								@focus="onFocus"
								@blur="
                  onDeliveryModeChange($event, index, {
                    deliveryMode: deliveryMode,
                  })
                "
								type="text"
								:class="classes"
								:name="`currentPartnerFolder.partnerHotelResto.deliveryModes.${index}.url`"
								v-model="deliveryMode.url"
								:placeholder="
                  restoDeliveryMethods[index]
                    ? restoDeliveryMethods[index].text
                    : `Lien vers votre profil ${deliveryMode.name}`
                "
								:disabled="
                  !allowedToEdit ||
                  !checkedDeliveryModes[index] ||
                  isDeliveryModeLoading[index]
                "
								:readonly="!allowedToEdit"
							></b-form-input>
							<small :class="classes">{{ errors[0] }}</small>
						</ValidationProvider>
					</b-col>
					<b-col>
						<i class="fas fa-fan" v-if="isDeliveryModeLoading[index]"></i>
					</b-col>
				</b-row>
				<b-row class="mb-3">
					<b-col md="3" lg="3" class="display-context">
						<b-form-checkbox
							v-model="checkedOtherDeliveryMode"
							:disabled="!allowedToEdit || isOtherDeliveryModeLoading"
							:readonly="!allowedToEdit"
							type="checkbox"
						>
							Ajouter une autre plateforme
						</b-form-checkbox>
					</b-col>
					<b-col md="9" lg="4" class="display-context__input">
						<ValidationProvider
							name="Nom plateforme de livraison externe"
							:rules="{
                required: !!checkedOtherDeliveryMode,
                min: checkedOtherDeliveryMode ? 3 : 0,
              }"
							ref="partnerHotelResto.otherDeliveryMode.name"
							v-slot="{ classes, errors }"
						>
							<b-form-input
								@focus="onFocus"
								@blur="onOtherDeliveryModeChange($event)"
								v-model="otherDeliveryModeName"
								type="text"
								:class="classes"
								name="partnerHotelResto.otherDeliveryMode.name"
								placeholder="Nom de la plateforme externe"
								:disabled="
                  !allowedToEdit ||
                  !checkedOtherDeliveryMode ||
                  isOtherDeliveryModeLoading
                "
								:readonly="!allowedToEdit"
							></b-form-input>
							<small :class="classes">{{ errors[0] }}</small>
						</ValidationProvider>
					</b-col>
					<b-col>
						<i class="fas fa-fan" v-if="isOtherDeliveryModeLoading"></i>
					</b-col>
				</b-row>
				<b-row class="my-3">
					<b-col>
						<span class="form-description">Couleurs</span>
						<span class="text-italic text-gray">
              (cocher si vous souhaitez ajouter le lien vers ces différentes
              plateformes de livraison sur votre site)
            </span>
					</b-col>
				</b-row>
				<b-row class="mb-3">
					<b-col class="display-context">
						<b-form-checkbox
							@change="
                onBlur($event, {
                  partnerHotelResto: currentPartnerFolder.partnerHotelResto,
                  type: 'bool',
                })
              "
							v-model="currentPartnerFolder.partnerHotelResto.useMainColor"
							name="currentPartnerFolder.partnerHotelResto.useMainColor"
							:disabled="!allowedToEdit"
							:readonly="!allowedToEdit"
							type="checkbox"
						>
							La couleur dominante du module de réservation sera celle du site
							vitrine ?
						</b-form-checkbox>
					</b-col>
				</b-row>
				<b-row align-v="end">
					<b-col md="6" class="display-context__input">
						<ValidationProvider
							name="Couleur dominante"
							rules="expected|max:255"
							ref="currentPartnerFolder.partnerHotelResto.mainColor"
							v-slot="{ classes, errors }"
						>
							<label class="label">Couleur dominante</label>
							<div class="input-text">
								<b-form-input
									@focus="onFocus"
									@change="
                    onBlur($event, {
                      partnerHotelResto: currentPartnerFolder.partnerHotelResto,
                    })
                  "
									type="color"
									:disabled="!allowedToEdit"
									:readonly="!allowedToEdit"
									name="currentPartnerFolder.partnerHotelResto.mainColor"
									v-model="mainColor"
								></b-form-input>
							</div>
							<small :class="classes">{{ errors[0] }}</small>
						</ValidationProvider>
					</b-col>
					<b-col md="4" class="mb-2">
            <span>{{
					mainColor ? mainColor : "Aucune couleur sélectionnée"
				}}</span>
					</b-col>
				</b-row>
			</b-col>
		</b-row>
	</b-container>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref, type ComputedRef} from "vue";
//import { extend } from "vee-validate";
import {useStore} from "vuex";
import {normalizer, readyState, validateSection} from "@/helpers";
import ExceptionnalDates from "@/components/PartnershipFolder/ExceptionnalDates.vue";
import {useDP} from "@/mixins/useDP";
import {
	yesNoOptions as yesNoOptionsData,
	weekDays as weekDaysData,
	restoDeliveryMethods as restoDeliveryMethodsdata,
} from "@/Interface/partnershipFolderDatas";
//extend("checkPeriodDates", validateSection.checkPeriodDates);

let yesNoOptions = ref(yesNoOptionsData);
let weekDays = ref(weekDaysData);
let restoDeliveryMethods = ref(restoDeliveryMethodsdata);
let isDeliveryModeLoading = ref([]);
let isOtherDeliveryModeLoading = ref(false);
let occupancyDelays = ref([]);
let selectedDaysOfWeek = ref([]);
let startTimes = ref([]);
let endTimes = ref([]);
let serviceTimestamp = ref(0);
let deliveryTimestamp = ref(0);
let isServiceLoading = ref([]);
let checkedDeliveryModes = ref([]);
let checkedOtherDeliveryMode = ref(false);
let otherDeliveryModeName = ref(null);
let currentDeliveryModes = ref([]);
let previousEditedValue = ref(null);

const store = useStore();
let {allowedToEdit, verifyFields} = useDP();

let currentPartnerFolder = computed(
	() => store.state.account.currentPartnerFolder
);

let bookingServices = computed(() => {
	if (
		!currentPartnerFolder.value.partnerHotelResto.bookingServices ||
		!currentPartnerFolder.value.partnerHotelResto.bookingServices.length
	) {
		currentPartnerFolder.value.partnerHotelResto.bookingServices = [
			{
				name: "Midi",
			},
			{
				name: "Soir",
			},
		];
	}

	return currentPartnerFolder.value.partnerHotelResto.bookingServices || [];
});
let serviceNames = computed(() => {
	return currentPartner.partnerHotelResto.bookingServices || [];
});
let mainColor = computed({
	get() {
		if (
			currentPartnerFolder.value &&
			currentPartnerFolder.value.partnerHotelResto &&
			currentPartnerFolder.value.partnerHotelResto.useMainColor
		) {
			return currentPartnerFolder.value.sites &&
			currentPartnerFolder.value.sites.length
				? currentPartnerFolder.value.sites[0].mainColor
				: null;
		}
		return null;
	},
	set(value) {
		currentPartnerFolder.value.partnerHotelResto.mainColor = value;
	},
});

onMounted(() => {
	refreshCurrentBookingServices();
	initializeDeliveryModes();
});

let updatePartnerPropertyFromForm = (value: any) =>
	store.dispatch("account/updatePartnerPropertyFromForm", value);
let deletePartnerPropertyFromForm = (value: any) =>
	store.dispatch("account/deletePartnerPropertyFromForm", value);

let onFocus = (event: { target: { value: any } }) => {
	previousEditedValue = event.target.value;
};
let onBlur = (event: { target: { name: string | number } }, data: any) => {
	let provider = $refs[event.target.name];
	updatePartnerPropertyFromForm({
		event: event,
		provider: provider ? provider[0] || provider : null,
		data: data
			? Object.assign({previousEditedValue: previousEditedValue}, data)
			: undefined,
	});
	verifyFields();
};
let onBookingServiceChange = (
	event: { target: { name: string | number; value: null } },
	data: { bookingService: { id: any; partnerHotelResto: any } },
	serviceIndex: string | number
) => {
	let provider = $refs[event.target.name];
	if (data.bookingService && !data.bookingService.id) {
		data.bookingService.partnerHotelResto =
			currentPartner.partnerHotelResto["@id"];
	}
	if (event) {
		if (event.target.value === previousEditedValue.value) {
			return;
		} else {
			isServiceLoading[serviceIndex] = true;
			refreshServiceTimestamp();
		}
	}

	let isNewBookingService = false;
	if (data.bookingService && !data.bookingService.id) {
		isNewBookingService = true;
	}
	updatePartnerPropertyFromForm({
		event: event,
		provider: (provider || [])[0] || provider,
		data: data
			? Object.assign({previousEditedValue: previousEditedValue}, data)
			: undefined,
	}).finally(() => {
		isServiceLoading[serviceIndex] = false;
		if (isNewBookingService) {
			refreshServiceTimestamp();
		}
		verifyFields();
	});
};
let onBookingTimeRangeChange = (
	event: { target: { name: string | number } } | null,
	serviceIndex: string | number,
	rangeIndex: any,
	data: {
		bookingTimeRange: any;
		payload?:
			| { weekDays: any }
			| { weekDays: any }
			| { startDate: string; endDate: string };
		serviceIndex?: any;
	}
) => {
	let provider = event ? $refs[event.target.name] : null;
	if (data.bookingTimeRange && !data.bookingTimeRange.id) {
		data.bookingTimeRange.bookingService = bookingServices[serviceIndex]["@id"];
	}
	data.serviceIndex = serviceIndex;
	updatePartnerPropertyFromForm({
		event: event,
		provider: (provider || [])[0] || provider,
		data: data,
	}).then(() => {
		refreshServiceTimestamp();
		verifyFields();
	});
};
let onBookingServiceAdd = () => {
	if (
		bookingServices.value.some(
			(bookingService: { id: any }) => !bookingService.id
		)
	) {
		store.dispatch(
			"alert/warn",
			{
				group: "general-error",
				message: "Vous devez remplir le service vide.",
				show: true,
				title: "Action invalide",
				type: "warn",
			},
			{root: true}
		);
		return;
	}

	bookingServices.value.push({});
	refreshServiceTimestamp();
	verifyFields();
};
let onServiceRemove = (bookingService: any, serviceIndex: number) => {
	if (
		bookingServices.value.some(
			(bookingService: { id: any }) => !bookingService.id
		)
	) {
		bookingServices.value.splice(serviceIndex, 1);
		selectedDaysOfWeek.value.splice(serviceIndex, 1);
		startTimes.value.splice(serviceIndex, 1);
		endTimes.value.splice(serviceIndex, 1);
		refreshServiceTimestamp();
	} else {
		Promise.all(
			bookingServices[serviceIndex].timeRanges.map((bookingTimeRange: any) =>
				deletePartnerPropertyFromForm({
					data: {bookingTimeRange, serviceIndex},
					showNotification: false,
				})
			)
		).then(() => {
			deletePartnerPropertyFromForm({
				data: {bookingService},
			}).then(() => {
				refreshCurrentBookingServices();
				verifyFields();
			});
		});
	}
};
let onServiceTimeRangeRemove = (
	bookingTimeRange: { id: any },
	serviceIndex: string | number,
	rangeIndex: any
) => {
	if (!bookingTimeRange.id) {
		bookingServices[serviceIndex].timeRanges.splice(rangeIndex, 1);
		selectedDaysOfWeek[serviceIndex].splice(rangeIndex, 1);
		startTimes[serviceIndex].splice(rangeIndex, 1);
		endTimes[serviceIndex].splice(rangeIndex, 1);
		refreshServiceTimestamp();
	} else {
		deletePartnerPropertyFromForm({
			data: {
				bookingTimeRange,
				serviceIndex,
			},
		}).then(() => {
			refreshCurrentBookingServices();
			verifyFields();
		});
	}
};
let onServiceTimeRangeAdd = (serviceIndex: string | number) => {
	if (
		!allowedToEdit ||
		isServiceLoading[serviceIndex] ||
		!bookingServices.value.length ||
		!bookingServices[serviceIndex] ||
		!bookingServices[serviceIndex].id
	) {
		return;
	}

	let timeRanges =
		((bookingServices.value || [])[serviceIndex] || {}).timeRanges || [];
	if (timeRanges.some((item: { id: any }) => !item.id)) {
		store.dispatch(
			"alert/warn",
			{
				group: "general-error",
				message: "Vous devez remplir la plage horaire vide.",
				show: true,
				title: "Action invalide",
				type: "warn",
			},
			{root: true}
		);
		return;
	}

	let rangeIndex = timeRanges.length;
	initializeTimeRange(serviceIndex, rangeIndex);

	if (!selectedDaysOfWeek[serviceIndex]) {
		selectedDaysOfWeek[serviceIndex] = [];
		startTimes[serviceIndex] = [];
		endTimes[serviceIndex] = [];
	}
	if (!selectedDaysOfWeek[serviceIndex][rangeIndex]) {
		selectedDaysOfWeek[serviceIndex][rangeIndex] = [];
	}

	refreshServiceTimestamp();
};
let onDayOfWeekChange = (
	day: string,
	serviceIndex: string | number,
	rangeIndex: string | number
) => {
	initializeTimeRange(serviceIndex, rangeIndex);
	let bookingTimeRange = bookingServices[serviceIndex].timeRanges[rangeIndex];
	if (!bookingTimeRange.weekDays) {
		bookingTimeRange.weekDays = [];
	}
	bookingTimeRange.weekDays.push(
		weekDays.value.find((item) => item.text === day).value
	);
	onBookingTimeRangeChange(null, serviceIndex, rangeIndex, {
		bookingTimeRange,
		payload: {
			weekDays: bookingTimeRange.weekDays,
		},
	});
};
let onDayOfWeekRemove = (
	day: any,
	serviceIndex: string | number,
	rangeIndex: string | number
) => {
	if (!hasSelectedDays(serviceIndex, rangeIndex)) {
		return;
	}
	let bookingTimeRange = bookingServices[serviceIndex].timeRanges[rangeIndex];
	let weekDays = bookingTimeRange.weekDays;
	weekDays.splice(
		weekDays.indexOf(
			weekDays.find((item: { text: any }) => item.text === day).value
		),
		1
	);
	bookingTimeRange.weekDays = weekDays;
	onBookingTimeRangeChange(null, serviceIndex, rangeIndex, {
		bookingTimeRange,
		payload: {
			weekDays: bookingTimeRange.weekDays,
		},
	});
};
let onStartDateChange = (
	bookingTimeRange: { endDate: any; startDate: any },
	serviceIndex: any,
	rangeIndex: any
) => {
	if (!bookingTimeRange.endDate) {
		bookingTimeRange.endDate = bookingTimeRange.startDate;
	}
	onDateChange(bookingTimeRange, serviceIndex, rangeIndex);
};
let onEndDateChange = (
	bookingTimeRange: { startDate: any; endDate: any },
	serviceIndex: any,
	rangeIndex: any
) => {
	if (!bookingTimeRange.startDate) {
		bookingTimeRange.startDate = bookingTimeRange.endDate;
	}
	onDateChange(bookingTimeRange, serviceIndex, rangeIndex);
};
let onDateChange = (
	bookingTimeRange: {
		startDate: string | number | Date;
		endDate: string | number | Date;
	},
	serviceIndex: any,
	rangeIndex: any
) => {
	if (!isDateRangeValid(bookingTimeRange)) {
		return;
	}
	onBookingTimeRangeChange(null, serviceIndex, rangeIndex, {
		bookingTimeRange,
		payload: {
			startDate: new Date(bookingTimeRange.startDate).toISOString(),
			endDate: new Date(bookingTimeRange.endDate).toISOString(),
		},
	});
};
let isDateRangeValid = (timeRange: {
	startDate: string | number | Date;
	endDate: string | number | Date;
}) => {
	if (!timeRange.startDate || !timeRange.endDate) {
		return false;
	}

	let startDate = new Date(timeRange.startDate).getTime();
	let endDate = new Date(timeRange.endDate).getTime();

	return startDate <= endDate;
};
let getAvailableDaysOfWeek = (
	serviceIndex: string | number,
	rangeIndex: string | number
) => {
	let weekDays = hasSelectedDays(serviceIndex, rangeIndex)
		? bookingServices[serviceIndex].timeRanges[rangeIndex].weekDays
		: [];

	return weekDays
		.filter((item: { value: any }) => -1 === weekDays.indexOf(item.value))
		.map((item: { text: any }) => item.text);
};
let refreshServiceTimestamp = () => {
	serviceTimestamp = new Date().getTime();
};
let refreshDeliveryTimestamp = () => {
	deliveryTimestamp = new Date().getTime();
};
let hasSelectedDays = (
	serviceIndex: string | number,
	rangeIndex: string | number
) => {
	return (
		selectedDaysOfWeek.value &&
		selectedDaysOfWeek[serviceIndex] &&
		selectedDaysOfWeek[serviceIndex][rangeIndex] &&
		selectedDaysOfWeek[serviceIndex][rangeIndex].length > 0
	);
};
let refreshCurrentBookingServices = () => {
	let occupancyDelays: any[] = [];
	let startTimes: any[] = [];
	let endTimes: any[] = [];
	let selectedDaysOfWeek: any[] = [];

	(bookingServices.value || []).forEach(
		(
			bookingService: { occupancyDelay: number | undefined; timeRanges: any },
			serviceIndex: string | number
		) => {
			if (undefined !== bookingService.occupancyDelay) {
				occupancyDelays[serviceIndex] = normalizer.secondsToStrTime(
					bookingService.occupancyDelay
				);
			}
			if (!startTimes[serviceIndex]) {
				startTimes[serviceIndex] = [];
			}
			if (!endTimes[serviceIndex]) {
				endTimes[serviceIndex] = [];
			}
			if (!selectedDaysOfWeek[serviceIndex]) {
				selectedDaysOfWeek[serviceIndex] = [];
			}
			(bookingService.timeRanges || []).forEach(
				(
					timeRange: {
						startTime: number | undefined;
						endTime: number | undefined;
						weekDays: number[] | undefined;
					},
					rangeIndex: string | number
				) => {
					if (undefined !== timeRange.startTime) {
						startTimes[serviceIndex][rangeIndex] = normalizer.secondsToStrTime(
							timeRange.startTime
						);
					}
					if (undefined !== timeRange.endTime) {
						endTimes[serviceIndex][rangeIndex] = normalizer.secondsToStrTime(
							timeRange.endTime
						);
					}
					if (undefined !== timeRange.weekDays) {
						selectedDaysOfWeek[serviceIndex][rangeIndex] = weekDays.value
							.filter((item) => -1 !== timeRange.weekDays.indexOf(item.value))
							.map((item) => item.text);
					}
				}
			);
		}
	);

	occupancyDelays = occupancyDelays;
	startTimes = startTimes;
	endTimes = endTimes;
	selectedDaysOfWeek = selectedDaysOfWeek;

	refreshServiceTimestamp();
};
let initializeBookingService = (serviceIndex: string | number) => {
	if (!bookingServices.value) {
		bookingServices = [];
	}
	if (!bookingServices[serviceIndex]) {
		bookingServices[serviceIndex] = {};
	}
};
let initializeTimeRange = (
	serviceIndex: string | number,
	rangeIndex: string | number
) => {
	initializeBookingService(serviceIndex);
	if (!bookingServices[serviceIndex].timeRanges) {
		bookingServices[serviceIndex].timeRanges = [];
	}
	if (!bookingServices[serviceIndex].timeRanges[rangeIndex]) {
		bookingServices[serviceIndex].timeRanges[rangeIndex] = {
			allowAfterMidnight: false,
		};
	}
};
let onDeliveryModeCheck = (index: string | number) => {
	let deliveryModeChecked = checkedDeliveryModes[index];
	let deliveryMode = currentDeliveryModes.value[index];
	let promise = Promise.resolve();

	isDeliveryModeLoading[index] = true;
	refreshDeliveryTimestamp();
	if (deliveryModeChecked && !deliveryMode.id) {
		deliveryMode = {
			partnerHotelResto: currentPartner.partnerHotelResto["@id"],
			name: restoDeliveryMethods[index].value,
		};
		promise = updatePartnerPropertyFromForm({
			data: {
				deliveryMode,
				parentEntityName: "partnerHotelResto",
			},
		});
	} else if (!deliveryModeChecked && deliveryMode.id) {
		promise = deletePartnerPropertyFromForm({
			data: {
				deliveryMode,
				parentEntityName: "partnerHotelResto",
			},
		});
	}

	promise.finally(() => {
		initializeDeliveryModes();
		verifyFields();
		isDeliveryModeLoading[index] = false;
		refreshDeliveryTimestamp();
	});
};
let onDeliveryModeChange = (
	event: { target: { name: string | number } },
	index: string | number,
	data: { parentEntityName: string }
) => {
	let deliveryModeChecked = checkedDeliveryModes[index];
	if (!deliveryModeChecked) {
		return;
	}
	if (data) {
		data.parentEntityName = "partnerHotelResto";
	}
	let provider = $refs[event.target.name];
	updatePartnerPropertyFromForm({
		event,
		provider: (provider || [])[0] || provider,
		data: data
			? Object.assign({previousEditedValue: previousEditedValue}, data)
			: undefined,
	}).then(() => verifyFields());
};
let onOtherDeliveryModeChange = (event: any) => {
	if (previousEditedValue.value === otherDeliveryModeName.value) {
		return;
	}

	isOtherDeliveryModeLoading = true;
	let deliveryMode = {
		partnerHotelResto: currentPartner.partnerHotelResto["@id"],
		name: otherDeliveryModeName,
	};
	updatePartnerPropertyFromForm({
		data: {
			deliveryMode,
			parentEntityName: "partnerHotelResto",
		},
	})
		.then(() => {
			checkedOtherDeliveryMode = false;
			otherDeliveryModeName = null;
		})
		.finally(() => {
			initializeDeliveryModes();
			verifyFields();
			isOtherDeliveryModeLoading = false;
			refreshDeliveryTimestamp();
		});
};
let initializeDeliveryModes = () => {
	let deliveryModes = currentPartner.partnerHotelResto.deliveryModes || [];
	let currentDeliveryModes: any[] = [];
	let checkedDeliveryModes: any[] = [];

	// check registered delivery modes from restoDeliveryMethods
	restoDeliveryMethods.value.forEach((item, index) => {
		let found = deliveryModes.find(
			(deliveryMode: { name: string }) => deliveryMode.name === item.value
		);
		currentDeliveryModes[index] = found || {};
		checkedDeliveryModes[index] = !!found;
	});

	// check other registered delivery modes
	deliveryModes.forEach((deliveryMode: { id: any }) => {
		let found = currentDeliveryModes.find(
			(item) => item.id === deliveryMode.id
		);
		if (!found) {
			currentDeliveryModes.push(deliveryMode);
			checkedDeliveryModes.push(true);
		}
	});

	//currentDeliveryModes = currentDeliveryModes.value;
	//checkedDeliveryModes = checkedDeliveryModes.value;
};
let validateFields = async (refs: any, entity: any) => {
	if (!readyState.allowedToEdit) {
		return;
	}

	let isValid = await validateSection.validateRequiredFields(entity, refs, [
		"deliveryModes",
		"timeRanges",
	]);
	if (isValid) {
		isValid = currentPartner.partnerHotelResto.deliveryModes.every(
			(deliveryMode: { url: any }) => !!deliveryMode.url
		);
	}

	validateSection.displayColorStateOnSection("table-booking", isValid);
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/Pfolder/partnership-folder.scss";
@import "@/assets/style/Pfolder/page-details.scss";
</style>
