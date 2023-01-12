import { toolboxService } from "./toolbox.service";
import { tedsService } from "./teds.service";
import { store } from "../store";

export const websiteService = {
  getWebsiteAutologin,
  getUbiflowUrl,
};

async function getWebsiteAutologin() {
  if (!store.state.account || !store.state.account.currentPartner) {
    return null;
  }

  switch (store.state.account.currentPartner.source) {
    case "toolbox":
      store.dispatch("globalStore/toggleIsToolbox", true);
      store.dispatch("globalStore/toggleIsEcommerce", false);
      store.dispatch("globalStore/toggleIsWebtool", false);
      return await toolboxService.getAutologin(
        store.state.account.currentPartner.customerCode
      );
    case "ecommerce":
      store.dispatch("globalStore/toggleIsToolbox", false);
      store.dispatch("globalStore/toggleIsEcommerce", true);
      store.dispatch("globalStore/toggleIsWebtool", false);
      return import.meta.env.OXATIS_URL;
    default:
      store.dispatch("globalStore/toggleIsToolbox", false);
      store.dispatch("globalStore/toggleIsEcommerce", false);
      store.dispatch("globalStore/toggleIsWebtool", true);

      if (
        store.state.globalStore.status.isNewLocalBoutique ||
        store.state.globalStore.status.isLocalRestoBoutique
      ) {
        tedsService
          .getAutologin(
            store.state.account.currentPartner.customerCode,
            store.state.account.identity.email,
            store.state.globalStore.websiteLink
          )
          .catch(() => {
            store.dispatch(
              "alert/error",
              {
                group: "auth-error",
                message: "Impossible d'accéder à la boutique Click&Collect",
                show: true,
                title: "Service indisponible",
                type: "error",
              },
              { root: true }
            );
          });
      }
      if (
        store.state.globalStore.status.isLocalRestoBoutique ||
        store.state.globalStore.status.isNewLocalResto
      ) {
        toolboxService
          .getAutologin(store.state.account.currentPartner.customerCode)
          .then((toolBoxUrl) =>
            store.dispatch("globalStore/setToolBoxPartnerUrl", toolBoxUrl, {
              root: true,
            })
          );
      }

      if (
        store.state.account.impersonatedUser &&
        store.state.account.impersonatedUser.access_token
      ) {
        store.state.account.user.access_token =
          store.state.account.impersonatedUser.access_token;
      }
      return (
        import.meta.env.VITE_WEBTOOL_BASE_URL +
        import.meta.env.VITE_WEBTOOL_TOKEN_CONNECTION +
        "?bearer=" +
        store.state.account.user.access_token
      );
  }
}

function getUbiflowUrl() {
  return import.meta.env.UBIFLOW_URL;
}
