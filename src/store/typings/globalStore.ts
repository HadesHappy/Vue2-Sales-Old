export interface GlobalStore {
  status: Status;
  salesforce: Salesforce;
  adplorer: Adplorer;
  ubiflowLink?: null;
  websiteLink?: null;
  websitePublicationDate?: null;
  partner: Partner;
  uberall: Uberall;
  atInternetInformation?: null;
  filterAudienceRange?: null;
  atInternetVisitsData?: null;
  atInternetSourceData?: null;
  webtool: Webtool;
  offers?: null[] | null;
  paymentModes: [];
  languages: [];
  portals: [];
  documents?: null[] | null;
  salesforceTickets?: null[] | null;
  salesforceTicketThread?: null[] | null;
}

export interface Status {
  isPageLoading: boolean;
  isSalesforceAccountLoading: boolean;
  isSalesforceContactLoading: boolean;
  isSalesforceTaskLoading: boolean;
  isSalesforceOpportunitiesLoading: boolean;
  isSalesforceDocumentsLoading: boolean;
  isSalesforceProductionValidated: boolean;
  passwordResetForm: boolean;
  isPasswordResetting: boolean;
  isNewBillingInfoSending: boolean;
  isNewDropobNotification: boolean;
  isNotifyingUploadedFiles: boolean;
  isDropboxEmailSent: boolean;
  isGetRecentFolderLoading: boolean;
  websiteInfoDisabled: boolean;
  updateWebsiteDisabled: boolean;
  isWebsiteOnline: boolean;
  isUploadingDropboxFileSending: boolean;
  isDownloadingDropboxFileSending: boolean;
  isSalesforceTicketLoading: boolean;
  isSalesforceTicketsLoading: boolean;
  isSalesforceTicketCreating: boolean;
  isSalesforceTicketUpdating: boolean;
  isSalesforceTicketThreadLoading: boolean;
  isSalesforceTicketAttachmentSending: boolean;
  isS3Uploading: boolean;
  isRibLoading: boolean;
  isLoadingVisits: boolean;
  isLoadingSources: boolean;
  isSalesforceBriefAppointmentInfoLoading: boolean;
  isUberallAutologinLoading: boolean;
  isUberallAutologinFailure: boolean;
  isWebsiteAutologinLoading: boolean;
  isRetrieveListingsFailure: boolean;
  isRetrieveListingsLoading: boolean;
  isConnectingToAtInternet: boolean;
  isContactMessagesLoading: boolean;
  isCountContactMessagesLoading: boolean;
  isNbrSubscriberLoading: boolean;
  isFilesSubmitting: boolean;
  isPaymentModesLoading: boolean;
  isLanguagesLoading: boolean;
  isPortalsLoading: boolean;
  hasMostRecentFolder: boolean;
  hasPartnerFolderAccess: boolean;
  hasSharedSpaceAccess: boolean;
  mostRecentFolder: MostRecentFolder;
  isVisibilityOfferBeforeUberall: boolean;
  isWebtool: boolean;
  isToolbox: boolean;
}

export interface MostRecentFolder {
  path: string;
  multipleFolders?: null[] | null;
  message: string;
}

export interface Salesforce {
  account: Account;
  brief: Brief;
  contact: Contact;
  opportunity: Opportunity;
  taskTracking: TaskTracking;
  dpValidated: DpValidated;
  agenda: Agenda;
  opportunities?: null;
}

export interface Account {
  Agence__c?: null;
  BillingCity?: null;
  BillingPostalCode?: null;
  BillingStreet?: null;
  Code_Ape__c?: null;
  Code_Sage__c: string;
  Date_de_cr_ation__c?: null;
  Id?: null;
  Industry?: null;
  Libell_code_APE__c?: null;
  List_ContentDocumentId__c?: null;
  Name?: null;
  Ownership?: null;
  Phone?: null;
  Raison_sociale__c?: null;
  Satisfaction_client__c: number;
  Siren__c?: null;
  Nic__c?: null;
  Site_Local_fr__c?: null;
  Website?: null;
  Date_Mise_en_ligne_Site__c?: null;
}

export interface Brief {
  date?: null;
  callResult?: null;
  ownerName?: null;
}

export interface Contact {
  Id?: null;
  Birthdate?: null;
  Email?: null;
  FirstName?: null;
  LastName?: null;
  MobilePhone?: null;
  Phone?: null;
}

export interface Opportunity {
  Signalement__c?: null;
  Signalement_Commentaire__c?: null;
  Cr_ation_logo__c?: null;
}

export interface TaskTracking {
  NDD_transf_rer__c?: null;
  Registrar__c?: null;
  Adresses_Mail_liees_coche__c?: null;
  Adresses_Mail_liees__c?: null;
  Offres_sp_cifiques_exchange__c?: null;
}

export interface DpValidated {
  canEdit?: null;
  validatedDpDate?: null;
}

export interface Agenda {
  crm?: null;
  visio?: null;
  online?: null;
}

export interface Adplorer {
  companyId?: null;
  orderId?: null;
}

export interface Partner {
  hasVisibility: boolean;
  url?: null;
  hasRib: boolean;
  boutiqueUrl?: null;
  isLoading: boolean;
  loaded?: null;
  toolBoxUrl?: null;
}

export interface Uberall {
  listingsTab?: null;
  listingsLength?: null;
}

export interface Webtool {
  newsletter: Newsletter;
}

export interface Newsletter {
  userList?: null[] | null;
  nbrUser: number;
}
