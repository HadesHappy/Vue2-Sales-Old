import { requestHelpers } from "@/helpers";

export const ovhService = {
  checkDomainAvailability,
};

function checkDomainAvailability(domain) {
  return requestHelpers.securedAxiosInstance.get(
    `${import.meta.env.VITE_LOCALETMOI_BASE_URL}/api/ovh/check/${domain}`
  );
}
