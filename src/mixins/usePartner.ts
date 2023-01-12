import {authDpHelper, normalizer} from "../helpers";
import {useStore, mapActions, mapState} from "vuex";
import {computed, nextTick, onMounted, ref} from "vue";
import {useRoute} from "vue-router";


export default function usePartner() {
    const store = useStore();
    const route = useRoute();
    const identity = computed(() => store.state.account.identity);
    const currentPartner = computed(() => store.state.account.currentPartner);
    const currentPartnerFolder = computed(() => store.state.account.currentPartnerFolder);
    const accountStatus = computed(() => store.state.account.accountStatus);

    const status = computed(() => store.state.globalStore.status);
    const salesforce = computed(() => store.state.globalStore.salesforce);
    const websiteLink = computed(() => store.state.globalStore.websiteLink);

    const customerCode = computed(() => {
        return currentPartner.value && currentPartner.value.customerCode
            ? currentPartner.value.customerCode
            : null;
    });

    const userEmail = computed(() => {
        return identity.value && identity.value.email ? identity.value.email : null;
    });

    const displayPartnerFolder = ref(false);
    const isPageLoading = ref(true);

    onMounted(() => {
        nextTick(() => {

            const customerCode =
                route.params.customerCode ||
                (currentPartner.value && currentPartner.value.customerCode) ||
                (identity.value &&
                    identity.value.partners &&
                    identity.value.partners[0] &&
                    identity.value.partners[0].customerCode);

            // LOAD PARTENR missing
            loadPartner(customerCode);
            console.log('MINXINS GET PARTNER currentPartner: ', currentPartner.value, currentPartnerFolder.value);
            if (currentPartner.value && currentPartnerFolder) {

                Promise.resolve(
                    setCurrentPartnerFolderSnapshot({
                        currentPartnerFolder: currentPartnerFolder.value || null,
                        salesforce: salesforce,
                    })
                ).then(() => {
                    console.log('promise', identity);
                    console.log('accountStatus', accountStatus);
                    identity.value.allowedToEdit =
                        authDpHelper.hasRoleToEditPartnerFolder(identity) &&
                        salesforce.value.dpValidated.canEdit
                        && (authDpHelper.canTransmitPf()
                            || authDpHelper.canByPassRolesToUpdatePf()) &&
                        !accountStatus.value.isStopEditing;
                    displayPartnerFolder.value =
                        !status.value.isPageLoading &&
                        currentPartner &&
                        currentPartner.value.hasPartnerFolder;
                    isPageLoading.value = false;
                });
                return;
            }
        });
    });

    const setCurrentPartner = (partner: any) => store.dispatch("account/setCurrentPartner", partner);
    const setCurrentPartnerFolderSnapshot = (partner: any) => store.dispatch("account/setCurrentPartner", partner);
    const getSalesforceAccount = (account: any) => store.dispatch("globalStore/getSalesforceAccount", account);
    const getSalesforceContact = (account: any) => store.dispatch("globalStore/getSalesforceContact", account);
    const getSalesforceOpportunities = (account: any) => store.dispatch("globalStore/getSalesforceOpportunities", account);
    const toggleIsWebtool = (value: boolean) => store.dispatch("globalStore/toggleIsWebtool", value);
    const resetState = () => store.dispatch("globalStore/resetState");
    const getPartner = (customerCode: any) => store.dispatch("globalStore/getPartner", customerCode);

    const loadPartner = (customerCode: any) => {
        if (!customerCode || !parseInt(customerCode)) {
            onFailure();
            return;
        }
        isPageLoading.value = true;
        if (authDpHelper.isUser(identity)) {
            isPageLoading.value = false;
            return;
        }

        console.log('LOADING PARTNER');
        return getPartner(customerCode)
            .then(
                (partners) => {

                    if (partners["hydra:member"] && partners["hydra:member"].length) {
                        const partner = partners["hydra:member"][0];
                        // let snapshot = JSON.parse(JSON.stringify(partner));
                        // console.log(snapshot);
                        // console.log(normalizer.formatEntity(snapshot, 'partner'));
                        const accountId = partner.company;
                        toggleIsWebtool("webtool" === partner.source);
                        return Promise.all([
                            setCurrentPartner({currentPartner: partner}),
                            getSalesforceAccount({accountId}),
                            getSalesforceContact({accountId}),
                            getSalesforceOpportunities({accountId}),
                        ])
                            .then(() => {
								console.log('[MINXINS] load oothers');
                                    setCurrentPartnerFolderSnapshot({
                                        currentPartnerFolder:
                                            partner &&
                                            partner.partnerFolders &&
                                            partner.partnerFolders.length
                                                ? partner.partnerFolders[0]
                                                : null,
                                        salesforce: salesforce,
                                    });
                                }
                            )
                            .then(() => {
								console.log('[MINXINS] laccount status',accountStatus.value);

                                identity.value.allowedToEdit =
                                    authDpHelper.hasRoleToEditPartnerFolder(identity.value) &&
                                    salesforce.value.dpValidated.canEdit &&
									(authDpHelper.canTransmitPf() || authDpHelper.canByPassRolesToUpdatePf())

                                displayPartnerFolder.value =
                                    !status.value.isPageLoading &&
                                    currentPartner &&
                                    currentPartner.value.hasPartnerFolder;
                                isPageLoading.value = false;
                            });
                    } else {
                        onFailure();
                    }
                },
                (error) => {
                    onFailure();
                    console.error(error);
                }
            )
            .finally(() => {
                isPageLoading.value = false;
            });
    };

    const onFailure = () => {
        displayPartnerFolder.value = false;
        isPageLoading.value = false;
        setCurrentPartner({currentPartner: null});
        resetState();
    };

    return {
        customerCode,
        userEmail,
        websiteLink,
        status,
        isPageLoading,
        displayPartnerFolder,
    };
}
