<template>
	<div class="site" @click="change_to_original_info">
		<header-buttons></header-buttons>
		<notifications
			group="mail-sent"
			position="bottom right"
			class="notification-container"
		/>
		<b-container fluid class="bc-example-row">

			<b-modal v-model="openModal" name="more-infos" :adaptive="true" :width="700" :height="670">
				<div class="ask-demo">
					<h3>
						Demander une démo
						<span
						><img
							class="button-close"
							@click="close_modal"
							src="@/assets/close.png"
						 alt=""/></span>
					</h3>
					<hr/>
					<b-form-group label="Sélectionnez le type de démo souhaité :">
						<b-form-radio-group
							id="radios1"
							v-model="demoType"
							name="radioSubComponent"
						>
							<b-form-radio value="Visibilité" selected
							>Visibilité
							</b-form-radio>
							<b-form-radio value="Garantie de visite"
							>Garantie de visite
							</b-form-radio>
							<b-form-radio value="Agenda en ligne"
							>Agenda en ligne
							</b-form-radio
							>
							<b-form-radio value="CRM">CRM</b-form-radio>
							<b-form-radio value="E-commerce">E-commerce</b-form-radio>
						</b-form-radio-group>
						<hr/>
						<p>
							Choisissez deux dates de rendez-vous :<span
							v-if="error"
							class="error-demo"
						>Veuillez saisir deux dates différentes</span
						>
						</p>
						<b-row>
							<b-col class="center">
								1er choix de date
								<v-date-picker
									mode="single"
									:disabled-dates="{ weekdays: [1, 7] }"
									:min-date="new Date()"
									v-model="firstDate"
								>
								</v-date-picker
								>
								<br/>
								<b-form-radio-group
									id="radios1"
									v-model="time1"
									name="radioSubComponent2"
								>
									<b-form-radio value="Matin">Matin</b-form-radio>
									<b-form-radio value="Après-midi">Après-midi</b-form-radio>
								</b-form-radio-group>
							</b-col>
							<b-col class="center">
								2e choix de date
								<v-date-picker
									mode="single"
									:disabled-dates="{ weekdays: [1, 7] }"
									:min-date="new Date()"
									v-model="secondDate"
								>
								</v-date-picker
								>
								<br/>
								<b-form-radio-group
									id="radios3"
									v-model="time2"
									name="radioSubComponent3"
								>
									<b-form-radio value="Matin">Matin</b-form-radio>
									<b-form-radio value="Après-midi">Après-midi</b-form-radio>
								</b-form-radio-group>
							</b-col>
						</b-row>
					</b-form-group>
					<button @click="send_demo" class="demo-button" type="submit">
						Demander une démo
					</button>
				</div>
			</b-modal>

			<b-row>
				<menu-formation class="hidden-for-mobile margin"></menu-formation>
				<menu-mobile class="menu-mobile"></menu-mobile>
				<fade-loader
					v-if="status.isPageLoading"
					class="loader-site hidden-for-mobile"
					:color="color"
				>
				</fade-loader>
				<b-col lg="9" class="mon-offre" v-if="!status.isPageLoading">
					<hr/>
					<b-row>
						<b-col lg="8" md="8" sm="6" xs="6" cols="12">
							<b-row>
								<b-col
									v-if="offers.length > 1"
									v-for="(value, key) in offers"
									:key="key"
									@click="
                    print_my_offer_services(offers[key]);
                    currentTab = offers[key].productCode;
                  "
									v-bind:class="{
                    'current-tab': offers[key].productCode == currentTab,
                  }"
									v-on:click="actualTabOffer(offers[key].name)"
									class="product-code-tab"
								>
									{{ offers[key].name }}
								</b-col>
								<b-col v-if="offers.length === 0">
									<h3>{{ messageOffer }}</h3>
								</b-col>
								<b-col
									v-if="offers.length === 1"
									v-for="(value, key) in offers"
									:key="key"
								>
									<h3>
										Mon offre :<strong> {{ offers[key].name }}</strong>
									</h3>
								</b-col>
							</b-row>
						</b-col>
						<b-col lg="4" md="4" sm="6" xs="6" cols="12" class="infos-customer">
							<app-customerRef></app-customerRef>
						</b-col>
					</b-row>
					<p>
						Signature partenariat : <b>{{ signatureDate }}</b>
					</p>
					<b-row class="content-padding">
						<b-col v-if="isBoost" lg="8" md="12" sm="12" cols="3">
							<b-col lg="12">
								<div class="timeline boost-size"></div>
								<b-row>
									<b-col lg="10">
										<b-row>
											<b-col
												@click.stop="change_to_boost_call_info"
												offset="0"
												lg="4"
												md="4"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_1 }"
													class="circle-contract"
												>
													<div class="info-circle">Appel<br/>Brief</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_create_campaign_info"
												lg="4"
												md="4"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_2 }"
													class="circle-upcoming"
												>
													<div class="info-circle">
														Création de la<br/>campagne
													</div>
												</div>
											</b-col>
											<b-col
												v-if="!isCampaign"
												@click.stop="change_to_following_info"
												lg="4"
												md="4"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_3 }"
													class="circle-red"
												>
													<div class="info-circle">
														Suivi et<br/>
														optimisation
													</div>
												</div>
											</b-col>
											<b-col
												v-if="isCampaign"
												@click.stop="change_to_following_mailing_info"
												lg="4"
												md="4"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_3 }"
													class="circle-red"
												>
													<div class="info-circle">
														Suivi et<br/>
														optimisation
													</div>
												</div>
											</b-col>
										</b-row>
									</b-col>
								</b-row>
							</b-col>
						</b-col>
						<b-col
							v-if="isEcommercePlatinum || isEcommercePremium"
							lg="8"
							md="12"
							sm="12"
							cols="3"
						>
							<b-col lg="12">
								<div class="timeline"></div>
								<b-row>
									<b-col lg="6">
										<b-row>
											<b-col
												@click.stop="change_to_appel_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_1 }"
													class="circle-contract"
												>
													<div class="info-circle">Appel<br/>Brief</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_conception_store_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_2 }"
													class="circle-upcoming"
												>
													<div class="info-circle">Conception<br/>site</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_bat_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_3 }"
													class="circle-red"
												>
													<div class="info-circle">Envoi<br/>CREA</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_webinar_1_bat_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_4 }"
													class="circle-contract"
												>
													<div class="info-circle">
														Formation<br/>Webinar 1
													</div>
												</div>
											</b-col>
										</b-row>
									</b-col>
									<b-col lg="6">
										<b-row>
											<b-col
												@click.stop="change_to_online_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_5 }"
													class="circle-upcoming"
												>
													<div class="info-circle">Appel de<br/>suivi</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_webinar_2_bat_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_6 }"
													class="circle-red"
												>
													<div class="info-circle">
														Formation<br/>Webinar 2
													</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_creation_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_6 }"
													class="circle-contract"
												>
													<div class="info-circle">
														Création<br/>profil visibilité
													</div>
												</div>
											</b-col>
										</b-row>
									</b-col>
								</b-row>
							</b-col>
						</b-col>
						<b-col v-if="status.isLocalResto" lg="8" md="12" sm="12" cols="3">
							<b-col lg="12">
								<div class="timeline boost-size"></div>
								<b-row>
									<b-col lg="6">
										<b-row>
											<b-col
												@click.stop="change_to_appel_info_toolbox"
												offset="0"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_1 }"
													class="circle-contract"
												>
													<div class="info-circle">Appel<br/>Brief</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_photo_report"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_2 }"
													class="circle-upcoming"
												>
													<div class="info-circle">Reportage<br/>photo</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_conception_info_toolbox"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_3 }"
													class="circle-red"
												>
													<div class="info-circle">Conception<br/>site</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_bat3_info_toolbox"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_4 }"
													class="circle-contract"
												>
													<div class="info-circle">Envoi<br/>CREA</div>
												</div>
											</b-col>
										</b-row>
									</b-col>
									<b-col lg="6">
										<div class="timeline boost-size-plus"></div>
										<b-row>
											<b-col
												@click.stop="change_to_livraison_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_5 }"
													class="circle-upcoming"
												>
													<div class="info-circle-resto">
														Appel<br/>livraison du site
													</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_online2_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_6 }"
													class="circle-red"
												>
													<div class="info-circle">
														Mise en<br/>ligne du site
													</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_formation_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_7 }"
													class="circle-contract"
												>
													<div class="info-circle">
														Formation<br/>à distance
													</div>
												</div>
											</b-col>
											<b-col
												@click.stop="
                          change_to_visibility_creation_and_reputation
                        "
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_8 }"
													class="circle-upcoming"
												>
													<div class="info-circle-resto-reputation">
														Création profil visibilité et<br/>e-reputation
													</div>
												</div>
											</b-col>
										</b-row>
									</b-col>
								</b-row>
							</b-col>
						</b-col>
						<b-col v-if="status.isLocalHotel" lg="8" md="12" sm="12" cols="3">
							<b-col lg="12">
								<div class="timeline boost-size-plus"></div>
								<b-row>
									<b-col lg="6">
										<b-row>
											<b-col
												@click.stop="change_to_appel_info_toolbox"
												offset="0"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_1 }"
													class="circle-contract"
												>
													<div class="info-circle">Appel<br/>Brief</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_photo_report_hotel"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_2 }"
													class="circle-upcoming"
												>
													<div class="info-circle">Reportage<br/>photo</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_conception_info_toolbox"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_3 }"
													class="circle-red"
												>
													<div class="info-circle">Conception<br/>site</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_bat3_info_toolbox"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_4 }"
													class="circle-contract"
												>
													<div class="info-circle">Envoi<br/>CREA</div>
												</div>
											</b-col>
										</b-row>
									</b-col>
									<b-col lg="6">
										<b-row>
											<b-col
												@click.stop="change_to_livraison_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_5 }"
													class="circle-upcoming"
												>
													<div class="info-circle-resto">
														Appel<br/>livraison du site
													</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_online2_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_6 }"
													class="circle-red"
												>
													<div class="info-circle">
														Mise en<br/>ligne du site
													</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_formation_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_7 }"
													class="circle-contract"
												>
													<div class="info-circle">
														Formation<br/>à distance
													</div>
												</div>
											</b-col>
											<b-col
												@click.stop="
                          change_to_visibility_creation_and_reputation
                        "
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_8 }"
													class="circle-upcoming"
												>
													<div class="info-circle-resto-reputation">
														Création profil visibilité et<br/>e-reputation
													</div>
												</div>
											</b-col>
										</b-row>
									</b-col>
								</b-row>
							</b-col>
						</b-col>
						<b-col v-if="status.isLocalAuto" lg="8" md="12" sm="12" cols="3">
							<b-col lg="12">
								<div class="timeline boost-size-plus"></div>
								<b-row>
									<b-col lg="6">
										<b-row>
											<b-col
												@click.stop="change_to_appel_info_toolbox_auto"
												offset="0"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_1 }"
													class="circle-contract"
												>
													<div class="info-circle">Appel<br/>Brief</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_conception_info_toolbox"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_2 }"
													class="circle-upcoming"
												>
													<div class="info-circle">Conception<br/>site</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_connexion_to_ubiflow_auto"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_3 }"
													class="circle-red"
												>
													<div class="info-circle-toolbox">Annonces</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_bat_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_4 }"
													class="circle-contract"
												>
													<div class="info-circle">Envoi<br/>CREA</div>
												</div>
											</b-col>
										</b-row>
									</b-col>
									<b-col lg="6">
										<b-row>
											<b-col
												@click.stop="change_to_livraison_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_5 }"
													class="circle-upcoming"
												>
													<div class="info-circle-resto">
														Appel<br/>livraison du site
													</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_online2_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_6 }"
													class="circle-red"
												>
													<div class="info-circle">
														Mise en<br/>ligne du site
													</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_formation_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_7 }"
													class="circle-contract"
												>
													<div class="info-circle">
														Formation<br/>à distance
													</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_creation_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_8 }"
													class="circle-upcoming"
												>
													<div class="info-circle-toolbox-profil">
														Création profil visibilité
													</div>
												</div>
											</b-col>
										</b-row>
									</b-col>
								</b-row>
							</b-col>
						</b-col>
						<b-col v-if="isLocalAutoPlus" lg="8" md="12" sm="12" cols="3">
							<b-col lg="12">
								<div class="timeline boost-size-plus"></div>
								<b-row>
									<b-col lg="6">
										<b-row>
											<b-col
												@click.stop="change_to_appel_info_toolbox"
												offset="0"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_1 }"
													class="circle-contract"
												>
													<div class="info-circle">Appel<br/>Brief</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_conception_info_toolbox"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_2 }"
													class="circle-upcoming"
												>
													<div class="info-circle">Conception<br/>site</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_connexion_to_ubiflow_auto_plus"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_3 }"
													class="circle-red"
												>
													<div class="info-circle-toolbox-plus">
														Annonces<br/>
														et<br/>Multi-diffusion
													</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_bat_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_4 }"
													class="circle-contract"
												>
													<div class="info-circle">Envoi<br/>CREA</div>
												</div>
											</b-col>
										</b-row>
									</b-col>
									<b-col lg="6">
										<b-row>
											<b-col
												@click.stop="change_to_livraison_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_5 }"
													class="circle-upcoming"
												>
													<div class="info-circle-resto">
														Appel<br/>livraison du site
													</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_online2_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_6 }"
													class="circle-red"
												>
													<div class="info-circle">
														Mise en<br/>ligne du site
													</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_formation_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_7 }"
													class="circle-contract"
												>
													<div class="info-circle">
														Formation<br/>à distance
													</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_creation_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_8 }"
													class="circle-upcoming"
												>
													<div class="info-circle-toolbox-profil">
														Création profil visibilité
													</div>
												</div>
											</b-col>
										</b-row>
									</b-col>
								</b-row>
							</b-col>
						</b-col>
						<b-col v-if="isLocalImmo" lg="8" md="12" sm="12" cols="3">
							<b-col lg="12">
								<div class="timeline boost-size-plus"></div>
								<b-row>
									<b-col lg="6">
										<b-row>
											<b-col
												@click.stop="change_to_appel_info_toolbox"
												offset="0"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_1 }"
													class="circle-contract"
												>
													<div class="info-circle">Appel<br/>Brief</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_conception_info_toolbox"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_2 }"
													class="circle-upcoming"
												>
													<div class="info-circle">Conception<br/>site</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_connexion_to_ubiflow_immo"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_3 }"
													class="circle-red"
												>
													<div class="info-circle-toolbox">Annonces</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_bat_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_4 }"
													class="circle-contract"
												>
													<div class="info-circle">Envoi<br/>CREA</div>
												</div>
											</b-col>
										</b-row>
									</b-col>
									<b-col lg="6">
										<b-row>
											<b-col
												@click.stop="change_to_livraison_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_5 }"
													class="circle-upcoming"
												>
													<div class="info-circle-resto">
														Appel<br/>livraison du site
													</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_online2_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_6 }"
													class="circle-red"
												>
													<div class="info-circle">
														Mise en<br/>ligne du site
													</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_formation_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_7 }"
													class="circle-contract"
												>
													<div class="info-circle">
														Formation<br/>à distance
													</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_creation_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_8 }"
													class="circle-upcoming"
												>
													<div class="info-circle-toolbox-profil">
														Création profil visibilité
													</div>
												</div>
											</b-col>
										</b-row>
									</b-col>
								</b-row>
							</b-col>
						</b-col>
						<b-col v-if="isLocalImmoPlus" lg="8" md="12" sm="12" cols="3">
							<b-col lg="12">
								<div class="timeline boost-size-plus"></div>
								<b-row>
									<b-col lg="6">
										<b-row>
											<b-col
												@click.stop="change_to_appel_info_toolbox"
												offset="0"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_1 }"
													class="circle-contract"
												>
													<div class="info-circle">Appel<br/>Brief</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_conception_info_toolbox"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_2 }"
													class="circle-upcoming"
												>
													<div class="info-circle">Conception<br/>site</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_connexion_to_ubiflow_immo_plus"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_3 }"
													class="circle-red"
												>
													<div class="info-circle-toolbox-plus">
														Annonces<br/>
														et<br/>Multi-diffusion
													</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_bat_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_4 }"
													class="circle-contract"
												>
													<div class="info-circle">Envoi<br/>CREA</div>
												</div>
											</b-col>
										</b-row>
									</b-col>
									<b-col lg="6">
										<b-row>
											<b-col
												@click.stop="change_to_livraison_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_5 }"
													class="circle-upcoming"
												>
													<div class="info-circle-resto">
														Appel<br/>livraison du site
													</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_online2_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_6 }"
													class="circle-red"
												>
													<div class="info-circle">
														Mise en<br/>ligne du site
													</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_formation_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_7 }"
													class="circle-contract"
												>
													<div class="info-circle">
														Formation<br/>à distance
													</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_creation_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_8 }"
													class="circle-upcoming"
												>
													<div class="info-circle-toolbox-profil">
														Création profil visibilité
													</div>
												</div>
											</b-col>
										</b-row>
									</b-col>
								</b-row>
							</b-col>
						</b-col>
						<b-col v-if="status.isLocalShop" lg="8" md="12" sm="12" cols="3">
							<b-col lg="12">
								<div class="timeline"></div>
								<b-row>
									<b-col lg="6">
										<b-row>
											<b-col
												@click.stop="change_to_appel_localShop"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_1 }"
													class="circle-contract"
												>
													<div class="info-circle">Appel<br/>Brief</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_conception_localShop_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_2 }"
													class="circle-upcoming"
												>
													<div class="info-circle">Conception<br/>site</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_bat_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_3 }"
													class="circle-red"
												>
													<div class="info-circle">Envoi<br/>CREA</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_webinar_1_localShop_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_4 }"
													class="circle-contract"
												>
													<div class="info-circle">
														Formation<br/>Webinar 1
													</div>
												</div>
											</b-col>
										</b-row>
									</b-col>
									<b-col lg="6">
										<b-row>
											<b-col
												@click.stop="change_to_online_localShop_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_5 }"
													class="circle-upcoming"
												>
													<div class="info-circle">Appel de<br/>suivi</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_webinar_2_bat_localShop_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_6 }"
													class="circle-red"
												>
													<div class="info-circle">
														Formation<br/>Webinar 2
													</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_creation_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_6 }"
													class="circle-contract"
												>
													<div class="info-circle">
														Création<br/>profil visibilité
													</div>
												</div>
											</b-col>
										</b-row>
									</b-col>
								</b-row>
							</b-col>
						</b-col>
						<b-col
							v-if="isLocalShopWithMigration"
							lg="8"
							md="12"
							sm="12"
							cols="3"
						>
							<b-col lg="12">
								<div class="timeline"></div>
								<b-row>
									<b-col lg="6">
										<b-row>
											<b-col
												@click.stop="change_to_appel_localShop"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_1 }"
													class="circle-contract"
												>
													<div class="info-circle">Appel<br/>Brief</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_conception_localShop_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_2 }"
													class="circle-upcoming"
												>
													<div class="info-circle">Conception<br/>site</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_bat_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_3 }"
													class="circle-red"
												>
													<div class="info-circle">Envoi<br/>CREA</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_webinar_1_localShop_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_4 }"
													class="circle-contract"
												>
													<div class="info-circle">
														Formation<br/>Webinar 1
													</div>
												</div>
											</b-col>
										</b-row>
									</b-col>
									<b-col lg="6">
										<b-row>
											<b-col
												@click.stop="change_to_online_localShop_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_5 }"
													class="circle-upcoming"
												>
													<div class="info-circle">Appel de<br/>suivi</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_webinar_2_bat_localShop_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_6 }"
													class="circle-red"
												>
													<div class="info-circle">
														Formation<br/>Webinar 2
													</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_creation_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_6 }"
													class="circle-contract"
												>
													<div class="info-circle">
														Création<br/>profil visibilité
													</div>
												</div>
											</b-col>
										</b-row>
									</b-col>
								</b-row>
							</b-col>
						</b-col>
						<b-col
							v-if="
                !isBoost &&
                !isEcommercePlatinum &&
                !isEcommercePremium &&
                !isLocalPresence &&
                !status.isToolbox &&
                !status.isLocalShop &&
                !isLocalShopWithMigration
              "
							lg="8"
							md="12"
							sm="12"
							cols="3"
						>
							<b-col lg="12">
								<div
									class="timeline"
									v-bind:class="{
                    'not-webtool-size': isLocalStart || isLocalWeb,
                  }"
								></div>
								<b-row>
									<b-col lg="6">
										<b-row>
											<b-col
												@click.stop="change_to_appel_info"
												offset="0"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_1 }"
													class="circle-contract"
												>
													<div class="info-circle">Appel<br/>Brief</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_conception_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_2 }"
													class="circle-upcoming"
												>
													<div class="info-circle">Conception<br/>site</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_bat2_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_3 }"
													class="circle-red"
												>
													<div class="info-circle">Envoi<br/>CREA</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_livraison_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_4 }"
													class="circle-contract"
												>
													<div class="info-circle">
														Appel<br/>livraison du site
													</div>
												</div>
											</b-col>
										</b-row>
									</b-col>
									<b-col lg="6">
										<b-row>
											<b-col
												@click.stop="change_to_online2_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_5 }"
													class="circle-upcoming"
												>
													<div class="info-circle">
														Mise en<br/>ligne du site
													</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_formation_info"
												lg="3"
												md="2"
												sm="2"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_6 }"
													class="circle-red"
												>
													<div class="info-circle">
														Formation<br/>à distance
													</div>
												</div>
											</b-col>
											<b-col
												@click.stop="change_to_creation_info"
												lg="3"
												md="2"
												sm="2"
												v-if="!isLocalStart && !isLocalWeb"
											>
												<div
													v-bind:class="{ 'circle-active': isCurrentStage_6 }"
													class="circle-contract"
												>
													<div class="info-circle">
														Création<br/>profil visibilité
													</div>
												</div>
											</b-col>
										</b-row>
									</b-col>
								</b-row>
							</b-col>
						</b-col>
						<b-col
							lg="4"
							md="12"
							sm="12"
							offset-lg="0"
							offset-md="0"
							offset-sm="0"
							offset="2"
							cols="7"
							class="box-down"
						>
							<b-col lg="11" md="11" sm="11" class="details-offer">
								{{ description }}
							</b-col>
						</b-col>
						<b-col lg="8" md="12" sm="12" class="rdv-site">
							<p>Les caractéristiques de votre offre :</p>
							<b-row class="logo-list">
								<b-col
									v-if="
                    !isBoost &&
                    !isEcommercePlatinum &&
                    !isEcommercePremium &&
                    !status.isLocalShop &&
                    !isLocalShopWithMigration &&
                    !isLocalPresence
                  "
									lg="1"
									md="2"
									sm="2"
									cols="3"
									class="logo-site-bottom"
									v-b-tooltip.hover
									v-bind:title="services[0]"
								>
									<img
										class="services-img"
										v-bind:class="{ 'logo-unavailable': responsiveDesign }"
										src="@/assets/responsive-design.png"
									/>
									<p class="description">{{ services[0] }}</p>
								</b-col>
								<b-col
									v-if="isEcommercePlatinum || isEcommercePremium"
									lg="1"
									md="2"
									sm="2"
									cols="3"
									class="logo-site-bottom"
									v-b-tooltip.hover
									v-bind:title="services[14]"
								>
									<img
										class="services-img"
										v-bind:class="{ 'logo-unavailable': responsiveDesign }"
										src="@/assets/responsive-design.png"
									/>
									<p class="description">{{ services[14] }}</p>
								</b-col>
								<b-col
									v-if="status.isLocalShop || isLocalShopWithMigration"
									lg="1"
									md="2"
									sm="2"
									cols="3"
									class="logo-site-bottom"
									v-b-tooltip.hover
									v-bind:title="services[21]"
								>
									<img
										class="services-img"
										v-bind:class="{ 'logo-unavailable': responsiveDesign }"
										src="@/assets/responsive-design.png"
									/>
									<p class="description">{{ services[21] }}</p>
								</b-col>
								<b-col
									v-if="
                    !isBoost &&
                    !isEcommercePlatinum &&
                    !isEcommercePremium &&
                    !isLocalPresence &&
                    !status.isToolbox &&
                    !status.isLocalShop &&
                    !isLocalShopWithMigration &&
                    !isLocalBoutique
                  "
									lg="1"
									md="2"
									sm="2"
									cols="3"
									class="logo-site-bottom"
									v-b-tooltip.hover
									v-bind:title="services[1]"
								>
									<img
										class="services-img"
										v-bind:class="{ 'logo-unavailable': securedNavigation }"
										src="@/assets/connexion-securisee.png"
									/>
									<p class="description">{{ services[1] }}</p>
								</b-col>
								<b-col
									lg="1"
									md="2"
									sm="2"
									cols="3"
									class="logo-site-bottom"
									v-b-tooltip.hover
									v-bind:title="services[2]"
								>
									<img
										class="services-img"
										v-bind:class="{ 'logo-unavailable': expertFollowing }"
										src="@/assets/accompagnement.png"
									/>
									<p class="description">{{ services[2] }}</p>
								</b-col>
								<b-col
									v-if="!isLocalPresence"
									lg="1"
									md="2"
									sm="2"
									cols="3"
									offset-md="0"
									offset-sm="0"
									class="logo-site-bottom"
									v-b-tooltip.hover
									v-bind:title="services[3]"
								>
									<img
										class="services-img"
										v-bind:class="{ 'logo-unavailable': statReport }"
										src="@/assets/statistiques.png"
									/>
									<p class="description">{{ services[3] }}</p>
								</b-col>
								<b-col
									v-if="
                    !isBoost &&
                    !isEcommercePremium &&
                    !isEcommercePlatinum &&
                    !isLocalPresence &&
                    !status.isLocalShop &&
                    !isLocalShopWithMigration &&
                    !isLocalBoutique
                  "
									lg="1"
									md="2"
									sm="2"
									cols="3"
									class="logo-site-bottom"
									v-b-tooltip.hover
									v-bind:title="services[4]"
								>
									<img
										class="services-img"
										v-bind:class="{ 'logo-unavailable': updates }"
										src="@/assets/webtool.png"
									/>
									<p class="description">{{ services[4] }}</p>
								</b-col>
								<b-col
									v-if="
                    isEcommercePremium ||
                    isEcommercePlatinum ||
                    status.isLocalShop ||
                    (isLocalShopWithMigration && !isLocalBoutique)
                  "
									lg="1"
									md="2"
									sm="2"
									cols="3"
									class="logo-site-bottom"
									v-b-tooltip.hover
									v-bind:title="services[4]"
								>
									<img
										class="services-img"
										v-bind:class="{ 'logo-unavailable': updates }"
										src="@/assets/webtool.png"
									/>
									<p class="description">Accès à la plateforme Oxatis</p>
								</b-col>
								<b-col
									v-if="!isBoost && !isLocalPresence && !isLocalStart"
									lg="1"
									md="2"
									sm="2"
									cols="3"
									v-b-tooltip.hover
									v-bind:title="services[5]"
									class="logo-site-bottom"
								>
									<img
										class="services-img"
										v-bind:class="{ 'logo-unavailable': remoteFormation }"
										src="@/assets/formation-a-distance.png"
									/>
									<p class="description">{{ services[5] }}</p>
								</b-col>
								<b-col
									v-if="
                    !isBoost &&
                    !isLocalStart &&
                    !isEcommercePlatinum &&
                    !isEcommercePremium
                  "
									offset-sm="0"
									offset-md="0"
									offset-lg="0"
									lg="1"
									md="2"
									sm="2"
									cols="3"
									v-b-tooltip.hover
									v-bind:title="services[6]"
									class="logo-site-bottom"
								>
									<a
										href="https://www.etre-visible.local.fr/diffusion-locale"
										target="_blank"
									>
										<img
											class="services-img"
											v-bind:class="{ 'logo-unavailable': visibilityOn }"
											src="@/assets/diffusion-locale.png"
										/>
										<p class="description">Visibilité</p>
									</a>
								</b-col>
								<b-col
									v-if="
                    !isEcommercePlatinum &&
                    !isEcommercePremium &&
                    !isBoost &&
                    !isLocalStart &&
                    !isLocalPresence &&
                    !status.isToolbox &&
                    !status.isLocalShop &&
                    !isLocalShopWithMigration &&
                    !isLocalBoutique
                  "
									lg="1"
									md="2"
									sm="2"
									cols="3"
									v-b-tooltip.hover
									v-bind:title="services[7]"
									class="logo-site-bottom"
								>
									<a
										href="https://www.etre-visible.local.fr/referencement"
										target="_blank"
									>
										<img
											class="services-img"
											v-bind:class="{ 'logo-unavailable': visitGuarantee }"
											src="@/assets/referencement-payant.png"
										/>
										<p class="description">Garantie de visite</p>
									</a>
								</b-col>
								<b-col
									v-if="isBoost"
									lg="1"
									md="2"
									sm="2"
									cols="3"
									v-b-tooltip.hover
									v-bind:title="services[15]"
									class="logo-site-bottom"
								>
									<img
										class="services-img"
										v-bind:class="{ 'logo-unavailable': visitGuarantee }"
										src="@/assets/referencement-payant.png"
									/>
									<p class="description">Référencement sur mesure</p>
								</b-col>
								<b-col
									v-if="
                    !isBoost &&
                    !isEcommercePlatinum &&
                    !isEcommercePremium &&
                    !isLocalStart &&
                    !isLocalPresence &&
                    status.isLocalResto &&
                    status.isLocalHotel &&
                    !status.isLocalShop &&
                    !isLocalShopWithMigration &&
                    !isLocalBoutique
                  "
									lg="1"
									md="2"
									sm="2"
									cols="3"
									v-b-tooltip.hover
									v-bind:title="services[8]"
									class="logo-site-bottom"
								>
									<a
										href="https://www.etre-visible.local.fr/agenda-en-ligne"
										target="_blank"
									>
										<img
											class="services-img"
											v-bind:class="{ 'logo-unavailable': onlineSchedule }"
											src="@/assets/agenda-en-ligne.png"
										/>
										<p class="description">
											Formulaire de réservation en ligne
										</p>
									</a>
								</b-col>
								<b-col
									v-if="
                    !isBoost &&
                    !isEcommercePlatinum &&
                    !isEcommercePremium &&
                    !isLocalStart &&
                    !isLocalPresence &&
                    !status.isToolbox &&
                    !status.isLocalShop &&
                    !isLocalShopWithMigration &&
                    !isLocalBoutique
                  "
									lg="1"
									md="2"
									sm="2"
									cols="3"
									v-b-tooltip.hover
									v-bind:title="services[8]"
									class="logo-site-bottom"
								>
									<a
										href="https://www.etre-visible.local.fr/agenda-en-ligne"
										target="_blank"
									>
										<img
											class="services-img"
											v-bind:class="{ 'logo-unavailable': onlineScheduleMain }"
											src="@/assets/agenda-en-ligne.png"
										/>
										<p class="description">Agenda en ligne</p>
									</a>
								</b-col>
								<b-col
									v-if="
                    !isBoost &&
                    !isEcommercePlatinum &&
                    !isEcommercePremium &&
                    !isLocalStart &&
                    !isLocalPresence &&
                    !status.isToolbox &&
                    !status.isLocalShop &&
                    !isLocalShopWithMigration &&
                    !isLocalBoutique
                  "
									lg="1"
									md="2"
									sm="2"
									cols="3"
									v-b-tooltip.hover
									v-bind:title="services[9]"
									class="logo-site-bottom"
								>
									<img
										class="services-img"
										v-bind:class="{ 'logo-unavailable': CrmOn }"
										src="@/assets/crm.png"
									/>
									<p class="description">CRM</p>
								</b-col>
								<b-col
									v-if="
                    isEcommercePlatinum ||
                    isEcommercePremium ||
                    status.isLocalShop ||
                    isLocalShopWithMigration
                  "
									offset-sm="0"
									offset-md="0"
									offset-lg="0"
									lg="1"
									md="2"
									sm="2"
									cols="3"
									v-b-tooltip.hover
									v-bind:title="services[10]"
									class="logo-site-bottom"
								>
									<img
										class="services-img"
										v-bind:class="{ 'logo-unavailable': onlineSupport }"
										src="@/assets/sept-sur-sept.png"
									/>
									<p class="description">Support en ligne 7j/7</p>
								</b-col>
								<b-col
									v-if="
                    isEcommercePremium ||
                    status.isLocalShop ||
                    isLocalShopWithMigration
                  "
									offset-sm="0"
									offset-md="0"
									offset-lg="0"
									lg="1"
									md="2"
									sm="2"
									cols="3"
									v-b-tooltip.hover
									v-bind:title="services[11]"
									class="logo-site-bottom"
								>
									<img
										class="services-img"
										v-bind:class="{ 'logo-unavailable': phoneSupport }"
										src="@/assets/assist.png"
									/>
									<p class="description">
										Support téléphonique du lundi au vendredi
									</p>
								</b-col>
								<b-col
									v-if="status.isLocalShop || isLocalShopWithMigration"
									lg="1"
									md="2"
									sm="2"
									cols="3"
									class="logo-site-bottom"
									v-b-tooltip.hover
									v-bind:title="services[22]"
								>
									<img
										class="services-img"
										v-bind:class="{ 'logo-unavailable': migration }"
										src="@/assets/migration-localshop-blanc.png"
									/>
									<p class="description">{{ services[22] }}</p>
								</b-col>
								<b-col
									v-if="isEcommercePlatinum || isEcommercePremium"
									offset-sm="0"
									offset-md="0"
									offset-lg="0"
									lg="1"
									md="2"
									sm="2"
									cols="3"
									v-b-tooltip.hover
									v-bind:title="services[12]"
									class="logo-site-bottom"
								>
									<img
										class="services-img"
										v-bind:class="{ 'logo-unavailable': capacity5000 }"
										src="@/assets/cart-simple.png"
									/>
									<p class="description">Capacité de 5 000 produits</p>
								</b-col>
								<b-col
									v-if="isEcommercePlatinum || isEcommercePremium"
									offset-sm="0"
									offset-md="0"
									offset-lg="0"
									lg="1"
									md="2"
									sm="2"
									cols="3"
									v-b-tooltip.hover
									v-bind:title="services[13]"
									class="logo-site-bottom"
								>
									<img
										class="services-img"
										v-bind:class="{ 'logo-unavailable': capacity10000 }"
										src="@/assets/cart-plus.png"
									/>
									<p class="description">Capacité de 10 000 produits</p>
								</b-col>
								<b-col
									v-if="status.isLocalResto || status.isLocalHotel"
									offset-sm="0"
									offset-md="0"
									offset-lg="0"
									lg="1"
									md="2"
									sm="2"
									cols="3"
									v-b-tooltip.hover
									v-bind:title="services[16]"
									class="logo-site-bottom"
								>
									<img
										class="services-img"
										v-bind:class="{ 'logo-unavailable': photo_report }"
										src="@/assets/photo-report.png"
									/>
									<p class="description">Reportage photos</p>
								</b-col>
								<b-col
									v-if="status.isLocalResto || status.isLocalHotel"
									offset-sm="0"
									offset-md="0"
									offset-lg="0"
									lg="1"
									md="2"
									sm="2"
									cols="3"
									v-b-tooltip.hover
									v-bind:title="services[17]"
									class="logo-site-bottom"
								>
									<img
										class="services-img"
										v-bind:class="{ 'logo-unavailable': gift_card }"
										src="@/assets/gift-card.png"
									/>
									<p class="description">
										Solution de vente en ligne produits et (bons cadeaux)
									</p>
								</b-col>
								<b-col
									v-if="status.isLocalResto || status.isLocalHotel"
									offset-sm="0"
									offset-md="0"
									offset-lg="0"
									lg="1"
									md="2"
									sm="2"
									cols="3"
									v-b-tooltip.hover
									v-bind:title="services[18]"
									class="logo-site-bottom"
								>
									<img
										class="services-img"
										v-bind:class="{ 'logo-unavailable': e_reputation }"
										src="@/assets/e-reputation.png"
									/>
									<p class="description">E-reputation</p>
								</b-col>
								<b-col
									v-if="isLocalAuto || isLocalAutoPlus"
									offset-sm="0"
									offset-md="0"
									offset-lg="0"
									lg="1"
									md="2"
									sm="2"
									cols="3"
									v-b-tooltip.hover
									v-bind:title="services[19]"
									class="logo-site-bottom"
								>
									<img
										class="services-img"
										v-bind:class="{ 'logo-unavailable': adAuto }"
										src="@/assets/annonces-auto.png"
									/>
									<p class="description">Annonces</p>
								</b-col>
								<b-col
									v-if="isLocalImmo || isLocalImmoPlus"
									offset-sm="0"
									offset-md="0"
									offset-lg="0"
									lg="1"
									md="2"
									sm="2"
									cols="3"
									v-b-tooltip.hover
									v-bind:title="services[19]"
									class="logo-site-bottom"
								>
									<img
										class="services-img"
										v-bind:class="{ 'logo-unavailable': adImmo }"
										src="@/assets/annonces-immo.png"
									/>
									<p class="description">Annonces</p>
								</b-col>
								<b-col
									v-if="isLocalAutoPlus || isLocalImmoPlus"
									offset-sm="0"
									offset-md="0"
									offset-lg="0"
									lg="1"
									md="2"
									sm="2"
									cols="3"
									v-b-tooltip.hover
									v-bind:title="services[20]"
									class="logo-site-bottom"
								>
									<img
										class="services-img"
										v-bind:class="{ 'logo-unavailable': multiDiffusion }"
										src="@/assets/multidiffusion.png"
									/>
									<p class="description">Multi-diffusion</p>
								</b-col>
								<b-col
									v-if="isLocalBoutique"
									offset-sm="0"
									offset-md="0"
									offset-lg="0"
									lg="1"
									md="2"
									sm="2"
									cols="3"
									v-b-tooltip.hover
									v-bind:title="services[23]"
									class="logo-site-bottom"
								>
									<img
										class="services-img"
										v-bind:class="{ 'logo-unavailable': integratedProducts }"
										src="@/assets/logo-panier.png"
									/>
									<p class="description">15 produits intégrés</p>
								</b-col>
								<b-col
									v-if="isLocalBoutique"
									offset-sm="0"
									offset-md="0"
									offset-lg="0"
									lg="1"
									md="2"
									sm="2"
									cols="3"
									v-b-tooltip.hover
									v-bind:title="services[24]"
									class="logo-site-bottom"
								>
									<img
										class="services-img"
										v-bind:class="{ 'logo-unavailable': clickAndCollect }"
										src="@/assets/logo-click-and-collect.png"
									/>
									<p class="description">Click&Collect</p>
								</b-col>
								<b-col
									v-if="isLocalBoutique"
									offset-sm="0"
									offset-md="0"
									offset-lg="0"
									lg="1"
									md="2"
									sm="2"
									cols="3"
									v-b-tooltip.hover
									v-bind:title="services[25]"
									class="logo-site-bottom"
								>
									<img
										class="services-img"
										v-bind:class="{ 'logo-unavailable': securedPayment }"
										src="@/assets/logo-cb.png"
									/>
									<p class="description">Moyens de paiement sécurisés</p>
								</b-col>
							</b-row>
							<div
								v-if="!isEcommercePlatinum && !isEcommercePremium && !isBoost"
							>
								<div class="more-infos-text">
									Vous souhaitez bénéficier d'une fonctionnalité supplémentaire
									?
								</div>
								<a @click="open_modal">
									<div class="more-infos-button">Demander une démo</div>
								</a>
							</div>
						</b-col>
					</b-row>
				</b-col>
			</b-row>
		</b-container>
		<footer class="footer-auth"/>
	</div>
</template>

<script lang="ts" setup>
import {useStore} from "vuex";
import axios from "axios";
import MenuMobile from "@/components/MenuMobile.vue";
import FadeLoader from "vue-spinner/src/FadeLoader.vue";
import {dateHelpers, getLocalStorageItem} from "../helpers";
import {computed, onMounted, ref, watch, type ComputedRef} from "vue";
import type {Salesforce, Status} from "@/store/typings/globalStore";
import {notify} from "@kyvg/vue3-notification";
import {BRow, BCol, BContainer, BFormGroup, BFormRadio, BModal} from "bootstrap-vue-3";
import MenuFormation from "@/components/MenuFormation.vue";
import HeaderButtons from "@/components/HeaderButtons.vue";
import Footer from "@/components/Footer.vue";

let store = useStore();

let offers = computed(() => store.state.globalStore.offers) as ComputedRef<any[]>;
let salesforce = computed(() => store.state.globalStore.salesforce) as ComputedRef<Salesforce>;
let status = computed(() => store.state.globalStore.status) as ComputedRef<Status>;

let description = ref("");
let signatureDate = ref("");
let responsiveDesign = ref(false);
let securedNavigation = ref(false);
let expertFollowing = ref(false);
let statReport = ref(false);
let updates = ref(false);
let remoteFormation = ref(false);
let visibilityOn = ref(false);
let visitGuarantee = ref(false);
let onlineSchedule = ref(false);
let onlineScheduleMain = ref(false);
let CrmOn = ref(false);
let onlineSupport = ref(false);
let phoneSupport = ref(false);
let capacity5000 = ref(false);
let capacity10000 = ref(false);
let e_reputation = ref(false);
let adAuto = ref(false);
let adImmo = ref(false);
let multiDiffusion = ref(false);
let integratedProducts = ref(false);
let clickAndCollect = ref(false);
let securedPayment = ref(false);
let gift_card = ref(false);
let photo_report = ref(false);
let migration = ref(false);
let isBoost = ref(false);
let isCampaign = ref(false);
let isEcommercePlatinum = ref(false);
let isEcommercePremium = ref(false);
let isLocalStart = ref(false);
let isLocalWeb = ref(false);
let isLocalPresence = ref(false);
let isLocalResto = ref(false);
let isLocalHotel = ref(false);
let isLocalAuto = ref(false);
let isLocalImmo = ref(false);
let isLocalAutoPlus = ref(false);
let isLocalImmoPlus = ref(false);
let isLocalShop = ref(false);
let isLocalShopWithMigration = ref(false);
let isLocalBoutique = ref(false);
let isCurrentStage_1 = ref(false);
let isCurrentStage_2 = ref(false);
let isCurrentStage_3 = ref(false);
let isCurrentStage_4 = ref(false);
let isCurrentStage_5 = ref(false);
let isCurrentStage_6 = ref(false);
let isCurrentStage_7 = ref(false);
let isCurrentStage_8 = ref(false);
let services = ref([
	"Responsive Design",
	"Navigation sécurisée",
	"Accompagnement par un expert",
	"Statistiques de performance",
	"Outil de mise à jour",
	"Formation à distance",
	"Visibilité",
	"Garantie de visite",
	"Agenda en ligne - Disponible uniquement avec LocalAgenda",
	"CRM - Disponible uniquement avec LocalAgenda",
	"Support en ligne 7j/7",
	"Support téléphonique du lundi au vendredi",
	"Capacité de 5 000 produits",
	"Capacité de 10 000 produits",
	"Création site (adapté en version mobile)",
	"Référencement sur mesure",
	"Reportage photos",
	"Solution de vente en ligne (produits et bons cadeaux)",
	"E-reputation",
	"Annonces",
	"Multi-diffusion",
	"Création boutique en ligne version mobile",
	"Migration",
	"15 produits intégrés",
	"Click&Collect",
	"Moyens de paiement sécurisés",
]);
let firstDate = ref(new Date());
let secondDate = ref(new Date());
let demoType = ref("Visibilité");
let time1 = ref("Matin");
let time2 = ref("Matin");
let error = ref(false);
let color = ref("#ec008c");
let currentTab = ref(null);
let messageOffer = ref("Recherche de votre offre...");
let actualOffer = ref("");
let defaultOffer = ref(null);
let openModal = ref(false);
watch(offers, () => {
	setDefaultOffer();
	printDefaultOffer();
});

onMounted(() => {
	setDefaultOffer();
	printDefaultOffer();
});

let setDefaultOffer = () => {
	if (offers.value.length) {
		defaultOffer.value = offers.value[0];
	}
};
let printDefaultOffer = () => {
	if (null === currentTab.value && defaultOffer.value) {
		print_my_offer_services(defaultOffer.value);
		currentTab.value = defaultOffer.value.productCode;
	}
};
let actualTabOffer = (currentTab: any) => {
	if ("" === currentTab) {
		throw new TypeError("Aucun onglet défini.");
	}
	let currentOffer = offers;
	for (let iterate of currentOffer.value) {
		if (iterate.name === currentTab) {
			actualOffer.value = currentTab;
			return actualOffer;
		}
	}

	return actualOffer;
};
let make_agency_email = (agency: any) => {
	if (agency === "Agence Aix-en-Provence") {
		agency = "agence-aix@local.fr";
	} else if (agency) {
		agency = agency.toLowerCase().replace(" ", "-") + "@local.fr";
	} else {
		agency = null;
	}
	return agency;
};

let send_demo = () => {
	let firstDate =
		firstDate.getMonth() +
		1 +
		"/" +
		firstDate.getDate() +
		"/" +
		firstDate.getFullYear() +
		" " +
		time1.value;
	let secondDate =
		secondDate.getMonth() +
		1 +
		"/" +
		secondDate.getDate() +
		"/" +
		secondDate.getFullYear() +
		" " +
		time2.value;
	if (firstDate === secondDate) {
		error = true;
	} else {
		error.value = false;
		axios
			.post(
				import.meta.env.VUE_LOCALETMOI_BASE_URL + "/api/mandrill/demo",
				{
					agency: salesforce.value.account.Agence__c || "",
					sageCode: getLocal.valueStorageItem("sageCode"),
					fromEmail: getLocalStorageItem("login"),
					firstDate: firstDate,
					secondDate: secondDate,
					demoType: demoType,
				},
				{
					headers: {
						"Content-type": "application/json",
					},
				}
			)
			.then((response) => {
				close_modal();
				notify({
					group: "mail-sent",
					title: "Merci !",
					type: "success",
					duration: 10000,
					text: "Votre demande de démo a bien été envoyée !",
				});
			})
			.catch((error) => {
				console.warn("error " + error);
			});
	}
};

let open_modal = () => {
	openModal.value = true;
};
let close_modal = () => {
	openModal.value = false;
};
let change_to_original_info = () => {
	if (document.getElementById("mySidenav")) {
		document.getElementById("mySidenav").style.width = "0";
	}
	if (isBoost.value) {
		change_to_boost_call_info();
	}
	if (isLocalShop.value || isLocalShopWithMigration) {
		change_to_localShop();
	} else {
		change_to_appel_info();
	}
};

// TODO : to clean..
let change_to_localShop = () => {
	description.value =
		"Retrouvez ici toutes les étapes de conception de votre boutique en ligne depuis la signature de notre partenariat, jusqu'à la mise en ligne de votre site.";
};
let change_to_appel_info = () => {
	description.value =
		"Votre chargé de projet web vous appelle, afin d'apporter des précisions sur votre entreprise, votre métier et sur l'apparence graphique de votre site.";
};
let change_to_appel_info_toolbox = () => {
	description.value =
		"Votre chargé de projet web vous appelle, afin d'apporter des précisions sur votre entreprise, votre métier, sur l'apparence graphique de votre site.";
};
let change_to_appel_info_toolbox_auto = () => {
	description.value =
		"Votre chargé de projet web vous appelle, afin d'apporter des précisions sur votre entreprise, votre métier, sur l'apparence graphique de votre site.";
};
let change_to_appel_localShop = () => {
	description.value =
		"Votre chargé de site e-commerce vous appelle, afin de bien comprendre l'activité de votre entreprise, votre métier, vos produits et définir ensemble l'apparence graphique de votre site.";
};
let change_to_conception_info = () => {
	description.value =
		"Grâce aux éléments récoltés pendant l'appel de brief, nos équipes réalisent votre site (graphisme, rédaction des contenus, intégration dans notre outil webtool, optimisation et référencement)";
};
let change_to_conception_info_toolbox = () => {
	description.value =
		"Grâce aux éléments récoltés pendant l'appel de brief, nos équipes réalisent votre site (graphisme, rédaction des contenus, intégration dans notre outil, optimisation et référencement)";
};
let change_to_conception_store_info = () => {
	description.value =
		"Grâce aux éléments récoltés pendant l'appel de brief, nos équipes réalisent votre boutique en ligne (graphisme, rédaction des contenus, intégration dans notre outil webtool, optimisation et référencement)";
};
let change_to_conception_localShop_info = () => {
	description.value =
		"Grâce aux éléments récoltés pendant l'appel de brief, nos équipes réalisent votre boutique en ligne (graphisme, rédaction des contenus, intégration et optimisations).";
};
let change_to_bat_info = () => {
	description.value =
		"Nous vous envoyons par e-mail un lien pour accéder à la CREA de votre site. Il s'agit d'une version finalisée, en fonction des éléments que nous avons vus ensemble lors de l'appel de brief.";
};
let change_to_bat2_info = () => {
	description.value =
		"14 jours après la signature de notre partenariat, nous vous envoyons par mail un lien pour accéder à la CREA de votre site. Il s'agit d'une version finalisée de votre site, en fonction des éléments que nous avons vus ensemble lors de l'appel de prise de brief.";
};
let change_to_bat3_info_toolbox = () => {
	description.value =
		"Environ un mois après la signature de notre partenariat, nous vous envoyons par mail un lien pour accéder à la CREA de votre site. Il s'agit d'une version finalisée de votre site, en fonction des éléments que nous avons vus ensemble lors de l'appel de prise de brief";
};
let change_to_livraison_info = () => {
	description.value =
		"Votre chargé de projet web vous appelle afin de faire les derniers ajustements avant la mise en ligne.";
};
let change_to_online_info = () => {
	description.value =
		"Votre chargé de site e-commerce vous appelle afin de finaliser les derniers éléments techniques de votre boutique en ligne (spécificités liées à votre activité, paramétrage de paiement et de livraison, ...).";
};
let change_to_online_localShop_info = () => {
	description.value =
		"Votre chargé de site e-commerce vous appelle afin de finaliser les derniers éléments techniques de votre boutique en ligne (spécificités liées à votre activité, transfert du nom de domaine, paramétrage Paypal, paramétrage des frais de port et transporteur, mise en ligne du site).";
};
let change_to_online2_info = () => {
	description.value =
		"Vous avez validé la CREA de votre site. Votre site peut être mis en ligne.";
};
let change_to_creation_info = () => {
	description.value =
		"Nous créons et gérons pour vous un profil visibilité, vous permettant de diffuser les coordonnées de votre entreprise sur différentes plateformes (adresse, numéro de téléphone, horaires, lien du site internet)";
};
let change_to_formation_info = () => {
	description.value =
		"Vous bénéficiez d'une formation à distance, avec un formateur agréé. 1h pour vous permettre de prendre en main l'outil de mise à jour, et découvrir les principales fonctionnalités.";
};
let change_to_boost_call_info = () => {
	description.value =
		"Votre trafic manager vous appelle afin de bien comprendre vos besoins. Il effectue un ciblage géographique et sélectionne des mots-clés par rapport à votre activité, votre métier ainsi que vos produits. Ces éléments permettront d'optimiser votre campagne.";
};
let change_to_create_campaign_info = () => {
	description.value =
		"Grâce à tous les éléments récoltés, il crée votre compte, rédige, réalise et planifie votre campagne Google Ads.";
};
let change_to_following_info = () => {
	description.value =
		"Votre trafic manager effectue un suivi des résultats. Vous recevez chaque mois un rapport de performance par e-mail.";
};
let change_to_following_mailing_info = () => {
	description.value = "Votre trafic manager effectue un suivi des résultats.";
};
let change_to_online_store_bat_info = () => {
	description.value =
		"Nous vous envoyons par e-mail un lien pour accéder à la CREA de votre boutique en ligne. Il s'agit d'une version finalisée, en fonction des éléments que nous avons vus ensemble lors de l'appel de brief.";
};
let change_to_webinar_1_bat_info = () => {
	description.value =
		"Nous vous invitons à vous inscrire à un webinar pour la première partie de la formation consacrée à la présentation de la plateforme Oxatis.";
};
let change_to_webinar_1_localShop_info = () => {
	description.value =
		"Nous vous invitons à vous inscrire à la première partie de formation en participant à un webinar. Votre formation s'effectue donc à distance sur les sujets suivants : se connecter sur votre back office, comprendre votre tableau de bord, création d'un produit standard, etc.";
};
let change_to_webinar_2_bat_info = () => {
	description.value =
		"Nous vous invitons à vous inscrire à un webinar pour la deuxième partie de la formation sur la prise en main de la plateforme, le suivi des commandes…";
};
let change_to_webinar_2_bat_localShop_info = () => {
	description.value =
		"Nous vous invitons à vous inscrire à la deuxième partie de formation en participant à un webinar. Les sujets suivants sont abordés : prise en main de vos pages sur-mesure, suivi des commandes. Si vous n'êtes pas disponible, vous aurez accès à la formation en replay.";
};
let change_to_visibility_creation = () => {
	description.value =
		"Nous créons et gérons pour vous un profil visibilité, vous permettant de diffuser les coordonnées de votre entreprise sur différentes plateformes (adresse, numéro de téléphone, horaires, lien du site internet, etc.)";
};
let change_to_social_creation = () => {
	description.value =
		"Vos pages Facebook entreprise et Google My Business sont créées depuis votre compte visibilité.";
};
let change_to_pages_connexion = () => {
	description.value =
		"Vos pages Facebook entreprise et Google My Business sont connectées à votre compte visibilité. La diffusion de vos coordonnées de communication en temps réel et sur les plateformes en ligne est prête !";
};
let change_to_photo_report = () => {
	description.value =
		"Nous effectuons un reportage de 10 photos professionnelles de votre établissement ainsi que 10 photos de plats. Elles seront par la suite intégrées sur votre site et sur votre compte visibilité.";
};
let change_to_photo_report_hotel = () => {
	description.value =
		"Nous effectuons un reportage de 10 photos professionnelles de votre établissement ainsi qu'une visite virtuelle certifiée par Google. Elles seront par la suite intégrées sur votre site et sur votre compte visibilité.";
};
let change_to_visibility_creation_and_reputation = () => {
	description.value =
		"Nous créons et gérons pour vous un profil visibilité, vous permettant de diffuser les coordonnées de votre entreprise sur différentes plateformes (adresse, numéro de téléphone, horaires, lien du site internet, etc.) et répondre aux avis de vos clients.";
};
let change_to_connexion_to_ubiflow_auto = () => {
	description.value =
		"Connexion au logiciel métier ou à un outil de saisie des annonces automobiles via l'espace Ubiflow.";
};
let change_to_connexion_to_ubiflow_immo = () => {
	description.value =
		"Connexion au logiciel métier ou à un outil de saisie des annonces immobilières via l'espace Ubiflow.";
};
let change_to_connexion_to_ubiflow_auto_plus = () => {
	description.value =
		"Connexion au logiciel métier ou à un outil de saisie des annonces automobiles via l'espace Ubiflow. Multi-diffusion vers plusieurs portails auto gratuits.";
};
let change_to_connexion_to_ubiflow_immo_plus = () => {
	description.value =
		"Connexion au logiciel métier ou à un outil de saisie des annonces immobilières via l'espace Ubiflow. Multi-diffusion vers plusieurs portails immo gratuits.";
};

let set_visible = (offers: string[]) => {
	for (let key in offers) {
		this[offers[key]] = true;
	}
};
let set_hidden = (offers: string[]) => {
	for (let key in offers) {
		this[offers[key]] = false;
	}
};
let print_my_offer_services = (offer: {
	name: string;
	signatureDate: Date;
}) => {

	if(offer.signatureDate){
		signatureDate.value = dateHelpers.usToFrDate(offer.signatureDate);
	}
	responsiveDesign.value = false;
	securedNavigation.value = false;
	expertFollowing.value = false;
	expertFollowing.value = false;
	statReport.value = false;
	updates.value = false;
	remoteFormation.value = false;
	visibilityOn.value = false;
	visitGuarantee.value = false;
	CrmOn.value = false;
	onlineSchedule.value = false;
	onlineScheduleMain.value = false;
	onlineSupport.value = false;
	phoneSupport.value = false;
	capacity5000.value = false;
	capacity10000.value = false;
	e_reputation.value = false;
	gift_card.value = false;
	photo_report.value = false;
	integratedProducts.value = false;
	clickAndCollect.value = false;
	securedPayment.value = false;
	isBoost.value = false;
	isCampaign.value = false;
	isEcommercePlatinum.value = false;
	isEcommercePremium.value = false;
	isLocalStart.value = false;
	isLocalPresence.value = false;
	isLocalResto.value = false;
	isLocalHotel.value = false;
	isLocalAuto.value = false;
	isLocalImmo.value = false;
	isLocalAutoPlus.value = false;
	isLocalImmoPlus.value = false;
	isLocalShop.value = false;
	isLocalShopWithMigration.value = false;
	isLocalBoutique.value = false;
	if (
		-1 !==
		[
			"LocalStart",
			"LocalWeb",
			"LocalVisibilité",
			"LocalAudience",
			"E-commerce Platinum",
			"E-commerce Premium",
		].indexOf(offer.name)
	) {
		if ("LocalStart" === offer.name) {
			isLocalStart.value = true;
		}
		if ("LocalWeb" === offer.name) {
			isLocalWeb.value = true;
		}
		responsiveDesign.value = true;
		securedNavigation.value = true;
		expertFollowing.value = true;
		statReport.value = true;
		updates.value = true;
		remoteFormation.value = true;
	}
	if ("LocalAgenda" === offer.name) {
		responsiveDesign.value = true;
		securedNavigation.value = true;
		expertFollowing.value = true;
		statReport.value = true;
		updates.value = true;
		remoteFormation.value = true;
		visibilityOn.value = true;
		onlineScheduleMain.value = true;
		CrmOn.value = true;
	}
	if ("LocalVisibilité" === offer.name) {
		visibilityOn.value = true;
	}
	if ("LocalAudience" === offer.name) {
		visibilityOn.value = true;
		visitGuarantee.value = true;
	}
	if (
		-1 !==
		["LocalBoost", "LocalBoost+", "Campagne sur mesure"].indexOf(offer.name)
	) {
		if ("LocalBoostMesure" === offer.name) {
			isCampaign.value = true;
		}
		isBoost.value = true;
		expertFollowing.value = true;
		statReport.value = true;
		visitGuarantee.value = true;
	}
	if ("E-commerce Platinum" === offer.name) {
		onlineSupport.value = true;
		capacity5000.value = true;
		isEcommercePlatinum.value = true;
	}
	if ("E-commerce Premium" === offer.name) {
		onlineSupport.value = true;
		capacity5000.value = true;
		phoneSupport.value = true;
		isEcommercePremium.value = true;

	}
	if ("LocalPrésence" === offer.name) {
		expertFollowing.value = true;
		visibilityOn.value = true;
		visitGuarantee.value = true;
		isLocalPresence.value = true;
	}
	if ("LocalResto" === offer.name) {
		isLocalResto.value = true;
		responsiveDesign.value = true;
		photo_report.value = true;
		gift_card.value = true;
		onlineSchedule.value = true;
		expertFollowing.value = true;
		statReport.value = true;
		updates.value = true;
		visibilityOn.value = true;
		remoteFormation.value = true;
		e_reputation.value = true;
	}
	if ("LocalHôtel" === offer.name) {
		isLocalHotel.value = true;
		responsiveDesign.value = true;
		photo_report.value = true;
		gift_card.value = true;
		onlineSchedule.value = true;
		expertFollowing.value = true;
		statReport.value = true;
		updates.value = true;
		visibilityOn.value = true;
		remoteFormation.value = true;
		e_reputation.value = true;

	}
	if ("LocalAuto" === offer.name) {
		isLocalAuto.value = true;
		responsiveDesign.value = true;
		expertFollowing.value = true;
		updates.value = true;
		statReport.value = true;

		remoteFormation.value = true;
		visibilityOn.value = true;

		adAuto.value = true;
	}
	if ("LocalImmo" === offer.name) {

		isLocalImmo.value = true;
		responsiveDesign.value = true;
		expertFollowing.value = true;
		updates.value = true;
		statReport.value = true;
		remoteFormation.value = true;
		visibilityOn.value = true;
		adImmo.value = true;
	}
	if ("LocalAutoPlus" === offer.name) {

		isLocalAutoPlus.value = true;
		responsiveDesign.value = true;
		expertFollowing.value = true;
		updates.value = true;
		statReport.value = true;
		remoteFormation.value = true;
		visibilityOn.value = true;
		adAuto.value = true;
		multiDiffusion.value = true;

	}
	if ("LocalImmoPlus" === offer.name) {

		isLocalImmoPlus.value = true;
		responsiveDesign.value = true;
		expertFollowing.value = true;
		updates.value = true;
		statReport.value = true;
		remoteFormation.value = true;
		visibilityOn.value = true;
		adImmo.value = true;
		multiDiffusion.value = true;
	}
	if ("LocalShop" === offer.name) {

		isLocalShop.value = true;
		responsiveDesign.value = true;
		expertFollowing.value = true;
		updates.value = true;
		statReport.value = true;
		remoteFormation.value = true;
		visibilityOn.value = true;
		onlineSupport.value = true;
		phoneSupport.value = true;
	}
	if ("LocalShop avec migration" === offer.name) {

		isLocalShopWithMigration.value = true;
		responsiveDesign.value = true;
		expertFollowing.value = true;
		updates.value = true;
		statReport.value = true;
		remoteFormation.value = true;
		visibilityOn.value = true;
		onlineSupport.value = true;
		phoneSupport.value = true;
		migration.value = true;

	}
	if ("LocalBoutique" === offer.name) {
		isLocalBoutique.value = true;
		responsiveDesign.value = true;
		expertFollowing.value = true;
		statReport.value = true;
		remoteFormation.value = true;
		visibilityOn.value = true;
		integratedProducts.value = true;
		clickAndCollect.value = true;
		securedPayment.value = true;
	}
	change_to_original_info();
};
</script>

<style lang="scss" >
@import "@/assets/style/accueil.scss";
@import "@/assets/style/site.scss";

.update-button {
	min-width: 17em;
	background-color: #ec008c;
}
.button-profile {
	width: 100%;
	min-width: 7em;
	padding: 1em;
	font-size: 12px;
	border-radius: 5px;
	text-transform: uppercase;
	border: 1px solid;
	white-space: nowrap;
	color: #fff;
	text-decoration: none;
}

</style>
