export interface Status {
  loggedIn: boolean;
  isPartnerHistoryLoading: boolean;
  isStopEditing: boolean;
  impersonated: boolean;
  performanceCookie: null;
  targetingCookie: null;
  isPartnerHistoriesLoading: boolean;
  isSalesforceUsersLoading: any;
  logoutModal: any
}

export interface PfPreviewInformation {
  isPreview: boolean;
  stepOwner: null;
  creationDate: null;
  updateDate: null;
  userFullname: null;
}
