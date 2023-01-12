<template>
	<div :class="`list partner-folder-container ${deniedAccessClass}`">
		<notifications
				group="general-error"
				position="bottom right"
				class="notification-container"
		/>
		<b-row class="justify-content-space-between">
			<b-col
					v-if="!pfPreviewInformation.isPreview"
					:lg="!status.isGetRecentFolderLoading && canViewPartnerFolder() ? 6 : 9"
					md="6"
					sm="12"
			>
				<h3 class="partner-folder-title">
					Offre souscrite : <strong>{{ currentOffer?.name || "" }}</strong>
				</h3>
<!--				<div v-else-if="opportunityFoldersSet.length > 1">-->
<!--					<b-row>-->
<!--						<b-col sm="3">-->
<!--							<h3 class="partner-folder-title">Offre souscrite :</h3>-->
<!--						</b-col>-->
<!--						<b-col :class="showPfs ? 'no-bottom-radius' : ''" sm="9">-->
<!--							<b-row>-->
<!--								<b-col sm="12">-->
<!--									<b-row>-->
<!--										<b-col sm="3">-->
<!--											<b-row @click="showOrHidePfs()">-->
<!--												<b-col-->
<!--														class="partnership-folder-selector"-->
<!--														sm="9"-->
<!--														:class="showPfs ? 'last-custom' : ''"-->
<!--												>-->
<!--													<b-row class="offer-name">-->
<!--														{{ selectedOpportunityName || "" }}-->
<!--													</b-row>-->
<!--													<b-row>-->
<!--														{{ selectedOpportunitySignatureDate || "" }}-->
<!--													</b-row>-->
<!--												</b-col>-->
<!--												<b-col class="arrow-multiple-pf" sm="1">-->
<!--													&lt;!&ndash;													<img src="@/assets/arrow-multi-pf.svg"/>&ndash;&gt;-->
<!--												</b-col>-->
<!--											</b-row>-->
<!--											<b-row>-->
<!--												<b-col-->
<!--														v-for="(-->
<!--                            opportunityFolder, index-->
<!--                          ) in opportunityFoldersSet.filter(-->
<!--                            (opportunity) => opportunity !== selected-->
<!--                          )"-->
<!--														v-bind:key="index"-->
<!--														v-if="-->
<!--                            showPfs &&-->
<!--                            opportunityFolder &&-->
<!--                            opportunityFolder.opportunity &&-->
<!--                            opportunityFolder.partnerFolder &&-->
<!--                            index <= 2-->
<!--                          "-->
<!--														:class="-->
<!--                            opportunityFoldersSet.length - 2 === index ||-->
<!--                            (opportunityFoldersSet.length >= 3 && 1 === index)-->
<!--                              ? 'last'-->
<!--                              : ''-->
<!--                          "-->
<!--														class="partnership-folder-selection"-->
<!--														@click="-->
<!--                            handleSelectedPartnerFolder(opportunityFolder)-->
<!--                          "-->
<!--														sm="9"-->
<!--												>-->
<!--													<b-row class="offer-name">-->
<!--														{{ opportunityFolder.offerName }}-->
<!--													</b-row>-->
<!--													<b-row>-->
<!--														{{ opportunityFolder.signatureDate }}-->
<!--													</b-row>-->
<!--												</b-col>-->
<!--											</b-row>-->
<!--										</b-col>-->
<!--									</b-row>-->
<!--								</b-col>-->
<!--							</b-row>-->
<!--						</b-col>-->
<!--					</b-row>-->
<!--				</div>-->
			</b-col>
			<b-col
					class="text-right"
					sm="12"
					md="6"
					lg="6"
					v-if="
          !status.isGetRecentFolderLoading &&
          canViewPartnerFolder() &&
          !(pfPreviewInformation && pfPreviewInformation.isPreview)
        "
			>
				<router-link
						:to="`/espace-partage/${currentPartner.customerCode}`"
						class="upload-files"
				>
					<img src="@/assets/upload-cloud.svg"/>
					<span>Transmettre les documents du partenaire</span>
					<div
							v-if="!filesCount && filesCountLoading"
							class="files-counter custom-tooltip"
							v-b-tooltip.hover
							title="Nombre de documents transmis (calcul en cours...)"
					>
						<i class="fas fa-fan"></i>
					</div>
					<div
							v-else
							class="files-counter custom-tooltip"
							:class="{ 'valid-files-count': filesCount > 0 }"
							v-b-tooltip.hover
							title="Nombre de documents transmis"
					>
						{{ filesCount }}
					</div>
				</router-link>
			</b-col>
		</b-row>
		<b-row v-show="currentOffer && !status.isGetRecentFolderLoading">
			<b-col>
				<h6>
					RDV de brief souhaité par le partenaire :
					<span
							:class="{
              'empty-value': !allowBrief,
              filled: /oui/i.test(allowBrief),
              'no-brief': /non/i.test(allowBrief),
            }"
					>
						{{ allowBrief }}
            {{ allowBrief || "non renseigné" }}
          </span>
					<span v-if="briefDate" class="filled"> ({{ briefDate.value }}) </span>
				</h6>
				<h6>
					Statut du RDV :
					<span
							:class="{
              'empty-value': !brief.callResult,
              filled: brief.callResult,
            }"
					>
            {{ brief.callResult || "non renseigné" }}
          </span>
				</h6>
				<h6 v-if="!isUser">
					Attribué à :
					<span
							:class="{
              'empty-value': !brief.ownerName,
              filled: brief.ownerName,
            }"
					>
            {{ brief.ownerName || "non renseigné" }}
          </span>
				</h6>
				<h6>Secteur d'activité :
					<span class="filled">
                        {{ salesforce.account.Industry }}
                    </span>
				</h6>
			</b-col>
		</b-row>
		<b-row v-if="canSendReportAboutPartnerFolder()">
			<b-col class="report-modal-form">
				<button
						v-b-modal.modal-report
						v-if="status.reportHasBeenSent"
						class="btn-report-sended"
				>
					Signalement effectué <i class="fas fa-check"></i>
				</button>
				<button v-b-modal.modal-report v-else class="btn-report-sendable">
					<i class="fas fa-exclamation-triangle"></i>
					<br/>Signaler
				</button>
				<ReportModal v-if="salesforce.opportunity"/>
			</b-col>
		</b-row>

		<!-- DEFAULT -->
		<b-card no-body class="mb-2" id="company-form">
			<b-button block v-b-toggle.accordion-company-form variant="dp-section">
				<i class="fas fa-exclamation-triangle"></i>
				<span> INFORMATIONS SUR L'ENTREPRISE </span>
				<span class="pl-2 account-name" v-if="salesforce.account.Name">
          			{{ salesforce.account.Name }}
        		</span>
				<i
						class="fas fa-chevron-down"
						v-bind:class="{ custom: !identity.allowedToEdit }"
				></i>
			</b-button>
			<b-collapse
					id="accordion-company-form"
					accordion="my-accordion"
					role="tabpanel"
			>
				<b-card-body>
					<b-tabs id="company_nav" justified>
						<b-tab
								class="company-form-nav"
								no-body
								title="Votre entreprise"
								active
						>
							<CompanyForm/>
						</b-tab>
						<b-tab
								class="company-profile-nav"
								no-body
								title="Pour mieux vous connaître"
						>
							<CompanyProfile/>
						</b-tab>
						<b-tab class="company-objectives-nav" no-body title="Vos objectifs">
							<CompanyObjectives/>
						</b-tab>
						<b-tab
								class="company-communication-nav"
								no-body
								title="Votre communication"
						>
							<CompanyCommunication/>
						</b-tab>
					</b-tabs>
				</b-card-body>
			</b-collapse>
		</b-card>

		<b-card no-body class="mb-2" id="display-informations" v-if="!isSeoOffer">
			<b-button
					block
					v-b-toggle.accordion-display-information
					variant="dp-section"
			>
				<i class="fas fa-exclamation-triangle"></i>
				COORDONNÉES À AFFICHER / MASQUER SUR LE SITE
				<i
						class="fas fa-chevron-down"
						v-bind:class="{ custom: !identity.allowedToEdit }"
				></i>
			</b-button>
			<b-collapse
					id="accordion-display-information"
					accordion="my-accordion"
					role="tabpanel"
			>
				<b-card-body>
					<DisplayInformations/>
				</b-card-body>
			</b-collapse>
		</b-card>

		<b-card no-body class="mb-2" id="seo-informations" v-if="!isSeoOffer || status.hasAdwordsCampaign">
			<b-button block v-b-toggle.accordion-seo-information variant="dp-section">
				<i class="fas fa-exclamation-triangle"></i>
				RÉFÉRENCEMENT
				<i
						class="fas fa-chevron-down"
						v-bind:class="{ custom: !identity.allowedToEdit }"
				></i>
			</b-button>
			<b-collapse
					id="accordion-seo-information"
					accordion="my-accordion"
					role="tabpanel"
			>
				<b-card-body>
					<SeoInformations/>
				</b-card-body>
			</b-collapse>
		</b-card>

		<b-card no-body class="mb-2" id="wording" v-if="!isSeoOffer">
			<b-button
					block
					v-b-toggle.accordion-wording-information
					variant="dp-section"
			>
				<i class="fas fa-exclamation-triangle"></i>
				RÉDACTIONNEL
				<i
						class="fas fa-chevron-down"
						v-bind:class="{ custom: !identity.allowedToEdit }"
				></i>
			</b-button>
			<b-collapse
					id="accordion-wording-information"
					accordion="my-accordion"
					role="tabpanel"
			>
				<b-card-body>
					<Wording/>
				</b-card-body>
			</b-collapse>
		</b-card>

		<b-card no-body class="mb-2" id="url">
			<b-button block v-b-toggle.accordion-url variant="dp-section">
				<i class="fas fa-exclamation-triangle"></i>
				URL
				<i
						class="fas fa-chevron-down"
						v-bind:class="{ custom: !identity.allowedToEdit }"
				></i>
			</b-button>
			<b-collapse id="accordion-url" accordion="my-accordion" role="tabpanel">
				<b-card-body>
					<Url/>
				</b-card-body>
			</b-collapse>
		</b-card>

		<b-card no-body class="mb-2" id="site-tree" v-if="!isSeoOffer">
			<b-button block v-b-toggle.accordion-site-tree variant="dp-section">
				<i class="fas fa-exclamation-triangle"></i>
				ARBORESCENCE
				<i
						class="fas fa-chevron-down"
						v-bind:class="{ custom: !identity.allowedToEdit }"
				></i>
			</b-button>
			<b-collapse
					id="accordion-site-tree"
					accordion="my-accordion"
					role="tabpanel"
			>
				<b-card-body>
					<SiteTree/>
				</b-card-body>
			</b-collapse>
		</b-card>
		<!-- OPTIONS IF ALREADY HAVE LOGO -->
		<b-card
				no-body
				class="mb-2"
				id="existing-logo"
				v-if="!isSeoOffer && !status.hasLogoCreation"
		>
			<b-button block v-b-toggle.accordion-existing-logo variant="dp-section">
				<i class="fas fa-exclamation-triangle"></i>
				LOGO
				<i
						class="fas fa-chevron-down"
						v-bind:class="{ custom: !identity.allowedToEdit }"
				></i>
			</b-button>
			<b-collapse
					id="accordion-existing-logo"
					accordion="my-accordion"
					role="tabpanel"
			>
				<b-card-body>
					<ExistingLogo/>
				</b-card-body>
			</b-collapse>
		</b-card>
		<!-- OPTIONS IF WANT TO HAVE LOGO  -->
		<b-card
				no-body
				class="mb-2"
				id="logo"
				v-if="
        !isSeoOffer &&
        (status.hasLogoCreation ||
          (Cr_ation_logo__c && 'Non' === hasLogo && !isMiniOffer))
      "
		>
			<b-button block v-b-toggle.accordion-logo variant="dp-section">
				<i class="fas fa-exclamation-triangle"></i>
				BRIEF LOGO
				<i
						class="fas fa-chevron-down"
						v-bind:class="{ custom: !identity.allowedToEdit }"
				></i>
			</b-button>
			<b-collapse id="accordion-logo" accordion="my-accordion" role="tabpanel">
				<b-card-body>
					<Logo/>
				</b-card-body>
			</b-collapse>
		</b-card>

		<b-card no-body class="mb-2" id="website-conception" v-if="!isSeoOffer">
			<b-button
					block
					v-b-toggle.accordion-website-conception
					variant="dp-section"
			>
				<i class="fas fa-exclamation-triangle"></i>
				CONCEPTION DU SITE
				<i
						class="fas fa-chevron-down"
						v-bind:class="{ custom: !identity.allowedToEdit }"
				></i>
			</b-button>
			<b-collapse
					id="accordion-website-conception"
					accordion="my-accordion"
					role="tabpanel"
			>
				<b-card-body>
					<WebsiteConception/>
				</b-card-body>
			</b-collapse>
		</b-card>
		<!-- AUTO/IMMO | AUTO/IMMO + | BOUTIQUE | HOTEL/RESTO-->
		<b-card
				no-body
				class="mb-2"
				id="website-template"
				v-if="
        status.isLocalAuto ||
        status.isLocalImmo ||
        status.isLocalAutoPlus ||
        status.isLocalImmoPlus ||
        status.isLocalHotel ||
        (status.isLocalResto && !isNewLocalRestoOffer)
      "
		>
			<b-button
					block
					v-b-toggle.accordion-website-template
					variant="dp-section"
			>
				<i class="fas fa-exclamation-triangle"></i>
				MODÈLE DE SITE
				<i
						class="fas fa-chevron-down"
						v-bind:class="{ custom: !identity.allowedToEdit }"
				></i>
			</b-button>
			<b-collapse
					id="accordion-website-template"
					accordion="my-accordion"
					role="tabpanel"
			>
				<b-card-body>
					<WebsiteTemplate/>
				</b-card-body>
			</b-collapse>
		</b-card>
		<!-- OPTIONS -->

		<b-card
				no-body
				class="mb-2"
				id="adword-campaign-custom"
				v-if="status.isLocalBoost || status.hasAdwordsCampaign"
		>
			<b-button
					block
					v-b-toggle.accordion-adword-campain-custom
					variant="dp-section"
			>
				<i class="fas fa-exclamation-triangle"></i>
				CAMPAGNE GOOGLE ADS
				<i
						class="fas fa-chevron-down"
						v-bind:class="{ custom: !identity.allowedToEdit }"
				></i>
			</b-button>
			<b-collapse
					id="accordion-adword-campain-custom"
					accordion="my-accordion"
					role="tabpanel"
			>
				<b-card-body>
					<AdwordCampaignCustom/>
				</b-card-body>
			</b-collapse>
		</b-card>
		<!-- OPTIONS -->
		<b-card
				no-body
				class="mb-2"
				id="report"
				v-if="
        status.hasPhotosReport10 ||
        status.hasPhotosReport20 ||
        status.hasVirtualVisit ||
        status.hasPhotosVideoReport10
      "
		>
			<b-button block v-b-toggle.accordion-report variant="dp-section">
				<i class="fas fa-exclamation-triangle"></i>
				REPORTAGES
				<i
						class="fas fa-chevron-down"
						v-bind:class="{ custom: !identity.allowedToEdit }"
				></i>
			</b-button>
			<b-collapse
					id="accordion-report"
					accordion="my-accordion"
					role="tabpanel"
			>
				<b-card-body>
					<Report/>
				</b-card-body>
			</b-collapse>
		</b-card>
		<!-- HOTEL/RESTO -->
		<b-card
				no-body
				class="mb-2"
				id="book-engine"
				v-if="
        status.isLocalHotel || (status.isLocalResto && !isNewLocalRestoOffer)
      "
		>
			<b-button block v-b-toggle.accordion-book-engine variant="dp-section">
				<i class="fas fa-exclamation-triangle"></i>
				MOTEUR DE RÉSERVATION
				<i
						class="fas fa-chevron-down"
						v-bind:class="{ custom: !identity.allowedToEdit }"
				></i>
			</b-button>
			<b-collapse
					id="accordion-book-engine"
					accordion="my-accordion"
					role="tabpanel"
			>
				<b-card-body>
					<BookEngine/>
				</b-card-body>
			</b-collapse>
		</b-card>
		<!-- HOTEL/RESTO -->
		<b-card
				no-body
				class="mb-2"
				id="tourist-informations"
				v-if="
        status.isLocalHotel || (status.isLocalResto && !isNewLocalRestoOffer)
      "
		>
			<b-button
					block
					v-b-toggle.accordion-tourist-information
					variant="dp-section"
			>
				<i class="fas fa-exclamation-triangle"></i>
				INFORMATIONS TOURISTIQUES
				<i
						class="fas fa-chevron-down"
						v-bind:class="{ custom: !identity.allowedToEdit }"
				></i>
			</b-button>
			<b-collapse
					id="accordion-tourist-information"
					accordion="my-accordion"
					role="tabpanel"
			>
				<b-card-body>
					<TouristInformations/>
				</b-card-body>
			</b-collapse>
		</b-card>
		<!-- BOUTIQUE  -->
		<!-- Table booking -->
		<b-card
				no-body
				class="mb-2"
				id="table-booking"
				v-if="!isUser && isNewLocalRestoOffer"
		>
			<b-button block v-b-toggle.accordion-table-booking variant="dp-section">
				<i class="fas fa-exclamation-triangle"></i>
				MODULE DE R&Eacute;SERVATION DE TABLE
				<i
						class="fas fa-chevron-down"
						v-bind:class="{ custom: !identity.allowedToEdit }"
				></i>
			</b-button>
			<b-collapse
					id="accordion-table-booking"
					accordion="my-accordion"
					role="tabpanel"
			>
				<b-card-body>
					<TableBooking/>
				</b-card-body>
			</b-collapse>
		</b-card>
		<b-card
				no-body
				class="mb-2"
				id="payment-method-and-delivery"
				v-if="status.isLocalBoutique"
		>
			<b-button
					block
					v-b-toggle.accordion-payment-method-and-delivery
					variant="dp-section"
			>
				<i class="fas fa-exclamation-triangle"></i>
				<span
						v-html="
            isClickAndCollectOffer
              ? 'CLICK<strong>&</strong>COLLECT'
              : 'MOYENS DE PAIEMENT ET LIVRAISON'
          "
				></span>
				<i
						class="fas fa-chevron-down"
						v-bind:class="{ custom: !identity.allowedToEdit }"
				></i>
			</b-button>
			<b-collapse
					id="accordion-payment-method-and-delivery"
					accordion="my-accordion"
					role="tabpanel"
			>
				<b-card-body>
					<PaymentMethodAndDelivery/>
				</b-card-body>
			</b-collapse>
		</b-card>
		<b-card
				no-body
				class="mb-2"
				id="qr-code-section"
				v-if="isNewLocalRestoOffer"
		>
			<b-button block v-b-toggle.accordion-qr-code-section variant="dp-section">
				<i class="fas fa-exclamation-triangle"></i>
				<span v-html="'QR CODE'"></span>
				<i
						class="fas fa-chevron-down"
						v-bind:class="{ custom: !identity.allowedToEdit }"
				></i>
			</b-button>
			<b-collapse
					id="accordion-qr-code-section"
					accordion="my-accordion"
					role="tabpanel"
			>
				<b-card-body>
					<QrCodeSection/>
				</b-card-body>
			</b-collapse>
		</b-card>
		<!-- LOCALSHOP -->
		<b-card no-body class="mb-2" id="categories" v-if="status.isLocalShop">
			<b-button block v-b-toggle.accordion-categories variant="dp-section">
				<i class="fas fa-exclamation-triangle"></i>
				CATÉGORIES ET SOUS CATÉGORIES
				<i
						class="fas fa-chevron-down"
						v-bind:class="{ custom: !identity.allowedToEdit }"
				></i>
			</b-button>
			<b-collapse
					id="accordion-categories"
					accordion="my-accordion"
					role="tabpanel"
			>
				<b-card-body>
					<Categories/>
				</b-card-body>
			</b-collapse>
		</b-card>
		<!-- LOCALSHOP / BOUTIQUE  -->
		<b-card no-body class="mb-2" id="product" v-if="false">
			<b-button block v-b-toggle.accordion-product variant="dp-section">
				<i class="fas fa-exclamation-triangle"></i>
				PRODUITS
				<i
						class="fas fa-chevron-down"
						v-bind:class="{ custom: !identity.allowedToEdit }"
				></i>
			</b-button>
			<b-collapse
					id="accordion-product"
					accordion="my-accordion"
					role="tabpanel"
			>
				<b-card-body>
					<Product/>
				</b-card-body>
			</b-collapse>
		</b-card>
		<!-- AUTO/IMMO -->
		<b-card
				no-body
				class="mb-2"
				id="business-software"
				v-if="
        status.isLocalAuto ||
        status.isLocalImmo ||
        status.isLocalAutoPlus ||
        status.isLocalImmoPlus
      "
		>
			<b-button
					block
					v-b-toggle.accordion-business-software
					variant="dp-section"
			>
				<i class="fas fa-exclamation-triangle"></i>
				LOGICIEL MÉTIER
				<i
						class="fas fa-chevron-down"
						v-bind:class="{ custom: !identity.allowedToEdit }"
				></i>
			</b-button>
			<b-collapse
					id="accordion-business-software"
					accordion="my-accordion"
					role="tabpanel"
			>
				<b-card-body>
					<BusinessSoftware/>
				</b-card-body>
			</b-collapse>
		</b-card>
		<!-- AUTO/IMMO + -->
		<b-card
				no-body
				class="mb-2"
				id="multicast"
				v-if="status.isLocalAutoPlus || status.isLocalImmoPlus"
		>
			<b-button block v-b-toggle.accordion-multi-cast variant="dp-section">
				<i class="fas fa-exclamation-triangle"></i>
				MULTI-DIFFUSION
				<i
						class="fas fa-chevron-down"
						v-bind:class="{ custom: !identity.allowedToEdit }"
				></i>
			</b-button>
			<b-collapse
					id="accordion-multi-cast"
					accordion="my-accordion"
					role="tabpanel"
			>
				<b-card-body>
					<Multicast/>
				</b-card-body>
			</b-collapse>
		</b-card>
		<!-- LOCALSHOP -->
		<b-card no-body class="mb-2" id="slide-show" v-if="status.isLocalShop">
			<b-button block v-b-toggle.accordion-slide-show variant="dp-section">
				<i class="fas fa-exclamation-triangle"></i>
				DIAPORAMA
				<i
						class="fas fa-chevron-down"
						v-bind:class="{ custom: !identity.allowedToEdit }"
				></i>
			</b-button>
			<b-collapse
					id="accordion-slide-show"
					accordion="my-accordion"
					role="tabpanel"
			>
				<b-card-body>
					<SlideShow/>
				</b-card-body>
			</b-collapse>
		</b-card>
		<b-card
				no-body
				class="mb-2"
				id="content-authoring"
				v-if="status.isLocalShop"
		>
			<b-button
					block
					v-b-toggle.accordion-content-authoring
					variant="dp-section"
			>
				<i class="fas fa-exclamation-triangle"></i>
				RÉDACTION DES CONTENUS
				<i
						class="fas fa-chevron-down"
						v-bind:class="{ custom: !identity.allowedToEdit }"
				></i>
			</b-button>
			<b-collapse
					id="accordion-content-authoring"
					accordion="my-accordion"
					role="tabpanel"
			>
				<b-card-body>
					<ContentAuthoring/>
				</b-card-body>
			</b-collapse>
		</b-card>
		<b-card
				no-body
				class="mb-2"
				id="shop-payment-delivery"
				v-if="status.isLocalShop"
		>
			<b-button
					block
					v-b-toggle.accordion-shop-payment-delivery
					variant="dp-section"
			>
				<i class="fas fa-exclamation-triangle"></i>
				MOYENS DE PAIEMENTS ET DE LIVRAISON
				<i
						class="fas fa-chevron-down"
						v-bind:class="{ custom: !identity.allowedToEdit }"
				></i>
			</b-button>
			<b-collapse
					id="accordion-shop-payment-delivery"
					accordion="my-accordion"
					role="tabpanel"
			>
				<b-card-body>
					<ShopPaymentDelivery/>
				</b-card-body>
			</b-collapse>
		</b-card>
		<!-- LOCALSHOP + MIGRATION -->
		<b-card
				no-body
				class="mb-2"
				id="migration"
				v-if="status.isLocalShopWithMigration"
		>
			<b-button block v-b-toggle.accordion-migration variant="dp-section">
				<i class="fas fa-exclamation-triangle"></i>
				MIGRATION
				<i
						class="fas fa-chevron-down"
						v-bind:class="{ custom: !identity.allowedToEdit }"
				></i>
			</b-button>
			<b-collapse
					id="accordion-migration"
					accordion="my-accordion"
					role="tabpanel"
			>
				<b-card-body>
					<Migration/>
				</b-card-body>
			</b-collapse>
		</b-card>
		<!-- LOCALSHOP -->
		<b-card no-body class="mb-2" id="site-comments" v-if="status.isLocalShop">
			<b-button block v-b-toggle.accordion-site-comments variant="dp-section">
				<i class="fas fa-exclamation-triangle"></i>
				COMMENTAIRES SUR LE SITE
				<i
						class="fas fa-chevron-down"
						v-bind:class="{ custom: !identity.allowedToEdit }"
				></i>
			</b-button>
			<b-collapse
					id="accordion-site-comments"
					accordion="my-accordion"
					role="tabpanel"
			>
				<b-card-body>
					<SiteComments/>
				</b-card-body>
			</b-collapse>
		</b-card>
		<!-- LOCALAGENDA -->
		<b-card
				no-body
				class="mb-2"
				id="agenda-introduction"
				v-if="status.isLocalAgenda && salesforce.agenda.online"
		>
			<b-button block v-b-toggle.accordion-agenda variant="dp-section">
				<i class="fas fa-exclamation-triangle"></i>
				AGENDA EN LIGNE
				<i
						class="fas fa-chevron-down"
						v-bind:class="{ custom: !identity.allowedToEdit }"
				></i>
			</b-button>
			<b-collapse
					id="accordion-agenda"
					accordion="my-accordion"
					role="tabpanel"
			>
				<b-card-body>
					<AgendaIntroduction/>
					<b-tabs id="agenda_nav" justified>
						<b-tab class="time-ranges-nav" no-body title="Horaires" active>
							<AgendaTimeRanges/>
						</b-tab>
						<b-tab class="team-tree-nav" no-body title="Équipe">
							<AgendaTeamTree/>
						</b-tab>
						<b-tab
								class="service-tree-nav"
								no-body
								title="Services et ressources"
						>
							<AgendaServicesTree/>
						</b-tab>
						<b-tab class="appointment-nav" no-body title="RDV">
							<AgendaAppointment/>
						</b-tab>
						<b-tab class="notification-nav" no-body title="Notifications">
							<AgendaNotification/>
						</b-tab>
						<b-tab
								class="crm-nav"
								no-body
								title="CRM"
								v-if="salesforce.agenda.crm"
						>
							<AgendaCrm/>
						</b-tab>
						<b-tab
								class="visio-nav"
								no-body
								title="Visio"
								v-if="salesforce.agenda.visio"
						>
							<AgendaVisio/>
						</b-tab>
					</b-tabs>
				</b-card-body>
			</b-collapse>
		</b-card>
		<!-- Internal Notes -->
		<b-card-body no-body class="mb-2" id="internal-notes" v-if="!isUser">
			<b-button block v-b-toggle.accordion-internal-notes variant="dp-section">
				<i class="fas fa-exclamation-triangle"></i>
				NOTES POUR LA PRODUCTION
				<i
						class="fas fa-chevron-down"
						v-bind:class="{ custom: !identity.allowedToEdit }"
				></i>
			</b-button>
			<b-collapse
					id="accordion-internal-notes"
					accordion="my-accordion"
					role="tabpanel"
			>
				<b-card-body>
					<InternalNotes/>
				</b-card-body>
			</b-collapse>
		</b-card-body>
	</div>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import AgendaAppointment from "@/components/PartnershipFolder/Agenda/AgendaAppointment.vue";
import AgendaCrm from "@/components/PartnershipFolder/Agenda/AgendaCrm.vue";
import AgendaIntroduction from "@/components/PartnershipFolder/Agenda/AgendaIntroduction.vue";
import AgendaNotification from "@/components/PartnershipFolder/Agenda/AgendaNotification.vue";
import AgendaServicesTree from "@/components/PartnershipFolder/Agenda/AgendaServicesTree.vue";
import AgendaTeamTree from "@/components/PartnershipFolder/Agenda/AgendaTeamTree.vue";
import AgendaTimeRanges from "@/components/PartnershipFolder/Agenda/AgendaTimeRanges.vue";
import AgendaVisio from "@/components/PartnershipFolder/Agenda/AgendaVisio.vue";
import AdwordCampaignCustom from "@/components/PartnershipFolder/AdwordCampaignCustom.vue";
import BookEngine from "@/components/PartnershipFolder/BookEngine.vue";
import BusinessSoftware from "@/components/PartnershipFolder/BusinessSoftware.vue";
import Categories from "@/components/PartnershipFolder/Categories.vue";
import CompanyCommunication from "@/components/PartnershipFolder/Company/CompanyCommunication.vue";
import CompanyForm from "@/components/PartnershipFolder/Company/CompanyForm.vue";
import CompanyObjectives from "@/components/PartnershipFolder/Company/CompanyObjectives.vue";
import CompanyProfile from "@/components/PartnershipFolder/Company/CompanyProfile.vue";
import ContentAuthoring from "@/components/PartnershipFolder/ContentAuthoring.vue";
import DisplayInformations from "@/components/PartnershipFolder/DisplayInformations.vue";
import ExistingLogo from "@/components/PartnershipFolder/ExistingLogo.vue";
import FadeLoader from "vue-spinner/src/FadeLoader.vue";
import Logo from "@/components/PartnershipFolder/Logo.vue";
import Migration from "@/components/PartnershipFolder/Migration.vue";
import Multicast from "@/components/PartnershipFolder/MultiCast.vue";
import SiteComments from "@/components/PartnershipFolder/SiteComments.vue";
import InternalNotes from "@/components/PartnershipFolder/InternalNotes.vue";
import PaymentMethodAndDelivery from "@/components/PartnershipFolder/PaymentMethodAndDelivery.vue";
import Product from "@/components/PartnershipFolder/Product.vue";
import Report from "@/components/PartnershipFolder/Report.vue";
import SeoInformations from "@/components/PartnershipFolder/SeoInformations.vue";
import ShopPaymentDelivery from "@/components/PartnershipFolder/ShopPaymentDelivery.vue";
import SiteTree from "@/components/PartnershipFolder/SiteTree.vue";
import SlideShow from "@/components/PartnershipFolder/SlideShow.vue";
import TouristInformations from "@/components/PartnershipFolder/TouristInformations.vue";
import Url from "@/components/PartnershipFolder/Url.vue";
import WebsiteConception from "@/components/PartnershipFolder/WebsiteConception.vue";
import WebsiteTemplate from "@/components/PartnershipFolder/WebsiteTemplate.vue";
import Wording from "@/components/PartnershipFolder/Wording.vue";
import {useStore} from "vuex";
import {
	authDpHelper,
	readyState,
	dropboxHelper,
	dateHelpers,
} from "@/helpers";

import {salesforceService, dropboxService} from "@/services";
import ReportModal from "@/components/PartnershipFolder/ReportModal.vue";
import TableBooking from "@/components/PartnershipFolder/TableBooking.vue";
import QrCodeSection from "@/components/PartnershipFolder/QrCodeSection.vue";
import {BButton, BCard, BCardBody, BCol, BCollapse, BRow, BTab} from "bootstrap-vue-3";

let store = useStore();

let color = ref("#ffa300");
let filesCount = ref(0);
let filesCountLoading = ref(false);
let isAllowedToTransmitDp = ref(false);
let previousPartnerHistory = ref(null);
let previousPartnerHistoryStep = ref(null);
let currentPartnerHistory = ref(null);
let currentPartnerHistoryStep = ref(null);
let nextPartnerHistory = ref(null);
let nextPartnerHistoryStep = ref(null);
let currentUserStep = ref(null);
let showPfs = ref(false);
let selected = ref(null);
let opportunityFoldersSet = ref([]);

onMounted(async () => {
	filesCountLoading.value = true;
	let currentPartner = await readyState.getCurrentPartnerState();
	let salesforce = await readyState.getSalesforceState();
	await checkPartnerFolderAccess();
	let customerCode = currentPartner.customerCode;
	let companyName = salesforce.account.Name;
	if (false === status.value.hasMostRecentFolder) {
		await dropboxHelper.getMostRecentFolder(customerCode, companyName);
	}

	dropboxService
			.getFolder(customerCode, companyName) //TODO: check
			.then((folders) => {
					console.log('getting folder', folders);
						if (folders) {
							Promise.all(
									folders.map((folder: { name: string }) => {
										if (/(nouveaux\s)?[eé]l[eé]ments\s(du\s)?\d{2}/i.test(folder.name)) {
											return dropboxService
													.getFolder(customerCode, companyName, folder.name)
													.then((files) => (filesCount.value += files.length || 0));
										}
										return Promise.resolve(0);
									})
							)
						}
					}
			)
			.finally(() => (filesCountLoading.value = false));


	if (currentPartner.partnerFolders) {
		Promise.all(
				currentPartner.partnerFolders.map((partnerFolder: { opportunities: any }) =>
						getOpportunityByPartnerFolder(partnerFolder.opportunities).then(
								(opportunity) => {
									let offerName = getOfferNameByOpportunity(opportunity) || "";
									let signatureDate = opportunity.Date_signature2__c || "";
									opportunity &&
									opportunityFoldersSet.value.push({
										opportunity: JSON.stringify(opportunity),
										partnerFolder,
										offerName,
										signatureDate,
									});
								}
						)
				)
		).then(() => {
			if (opportunityFoldersSet.value.length) {
				updateOpportunityFolder(opportunityFoldersSet.value[0]);
			}
		});
	}
});

let identity = computed(() => store.state.account.identity);
let currentPartner = computed(() => store.state.account.currentPartner);
let currentPartnerFolder = computed(() => store.state.account.currentPartner);
let salesforceUser = computed(() => store.state.account.salesforceUser);
let partnerHistory = computed(() => store.state.account.partnerHistory);
let pfPreviewInformation = computed(() => store.state.account.pfPreviewInformation);
let accountStatus = computed(() => store.state.account.accountStatus);
let salesforce = computed(() => store.state.globalStore.salesforce);
let offers = computed(() => store.state.globalStore.offers);
let status = computed(() => store.state.globalStore.status);
let partner = computed(() => store.state.globalStore.partner);

console.log('PARTNERSHIP FORM  Salesforce store', salesforce.value.opportunity)
let allowBrief = computed(() => {salesforce.value.opportunity && salesforce.value.opportunity.Deviseur_Souhaite_un_RDV_Brief__c ? salesforce.value.opportunity.Deviseur_Souhaite_un_RDV_Brief__c : null;});
console.log('PARTNERSHIP FORM  allowBrief', allowBrief.value)

let currentOffer = computed(() => {return salesforceService.findCurrentOffer()});
console.log('PARTNERSHIP FORM  Current offer', currentOffer.value)
let briefDate = () => {return dateHelpers.formatSFBriefDate(salesforce.value.brief.date);};
let brief = computed(() => {return salesforce.value.brief?  salesforce.value.brief : {}});


let isSeoOffer = computed(() => {status.value.isLocalPresence || (status.value.isLocalBoost && !partner.value.hasVisibility)});
let isMiniOffer = () => {
	return status.value.isLocalWeb || status.value.isLocalStart;
};
let isUser = () => {
	return authDpHelper.isUser(identity);
};
let currentUserStatus = () => {
	return authDpHelper.getUserStatus(salesforceUser);
};
let deniedAccessClass = () => {
	return identity.value &&
	identity.value.allowedToEdit &&
	accountStatus &&
	!accountStatus.value.isStopEditing
			? ""
			: "input-edition-disabled";
};
let Cr_ation_logo__c = () => {
	return salesforce.value.opportunity.Cr_ation_logo__c;
};
let hasLogo = () => {
	return currentPartnerFolder.value &&
	currentPartnerFolder.value.sites &&
	currentPartnerFolder.value.sites[0]
			? currentPartnerFolder.value.sites[0].hasLogo
			: null;
};
let selectedOpportunityName = () => {
	return selected.value ? selected.value.offerName : null;
};
let selectedOpportunitySignatureDate = () => {
	return selected.value ? selected.value.signatureDate : null;
};
let isNewLocalRestoOffer = () => {
	return status.value.isLocalRestoBoutique || status.value.isNewLocalResto;
};
let isClickAndCollectOffer = () => {
	return status.value.isLocalRestoBoutique || status.value.isNewLocalBoutique;
};

let updatePartnerPropertyFromForm = () => store.dispatch("account/updatePartnerPropertyFromForm");
let setCurrentPartnerFolder = () => store.dispatch("account/setCurrentPartnerFolder");
let isChangedOpportunity = () => store.dispatch("account/isChangedOpportunity");
let handleOpportunityFolder = () => store.dispatch("account/handleOpportunityFolder");
let getOpportunityByPartnerFolder = () => store.dispatch("account/getOpportunityByPartnerFolder");

let resetStatusState = () => store.dispatch("globalStore/resetStatusState");
let setOpportunity = () => store.dispatch("globalStore/setOpportunity");



let updateOpportunityFolder = (opportunityFolder: never) => {
	handleOpportunityFolder(opportunityFolder);
	selected = opportunityFolder;
};
let checkPartnerFolderAccess = async () => {
	let interval = window.setInterval(() => {
		if (null === salesforce.value.dpValidated.canEdit || !accountStatus.value) {
			return;
		}

		window.clearInterval(interval);

		identity.value.allowedToEdit =
				authDpHelper.hasRoleToEditPartnerFolder(identity) &&
				salesforce.value.dpValidated.canEdit && (authDpHelper.canTransmitPf() || authDpHelper.canByPassRolesToUpdatePf()) &&
				!accountStatus.value.isStopEditing;

		if (authDpHelper.isSalesman(identity) && !identity.value.allowedToEdit) {
			let dateLabel = salesforce.value.dpValidated.validatedDpDate
					? ` depuis le ${salesforce.value.dpValidated.validatedDpDate}`
					: "";
			store.dispatch("alert/warn", {
				group: "general-error",
				type: "warn",
				message: `Ce dossier partenaire est validé${dateLabel}. Vous ne pouvez plus l'éditer.`,
				show: true,
				title: "Dossier partenaire",
			});
		}
	}, 50);
};
let canViewPartnerFolder = () => {
	return (
			authDpHelper.isSuperAdmin(identity) ||
			(authDpHelper.isSalesman(identity) && status.value.hasSharedSpaceAccess)
	);
};
let canSendReportAboutPartnerFolder = () => {
	return authDpHelper.isSuperAdmin(identity);
};
let showOrHidePfs = () => {
	showPfs.value = !showPfs.value;
};
let handleSelectedPartnerFolder = (opportunityFolder: any) => {
	showOrHidePfs();
	updateOpportunityFolder(opportunityFolder);
};
let getOfferNameByOpportunity = (opportunity: any) => {
	return opportunity
			? salesforceService.getOfferNameByOpportunity(opportunity)
			: null;
};
</script>
