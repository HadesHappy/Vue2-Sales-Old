import { requestHelpers } from "@/helpers";

export const adplorerService = {
  getAdwordsData,
  getCustomerInformation,
};

function getAdwordsData(customerCode, agency, startDate, endDate) {
  return requestHelpers.securedAxiosInstance.post(
    `${import.meta.env.VITE_LOCALETMOI_BASE_URL}/api/adplorer/adwords`,
    { customerCode, agency, startDate, endDate }
  );
}

function getCustomerInformation(customerCode, agency) {
  return requestHelpers.securedAxiosInstance.get(
    `${
      import.meta.env.VITE_LOCALETMOI_BASE_URL
    }/api/adplorer/customer/information`,
    {
      params: {
        customerCode,
        agency,
      },
    }
  );
}
