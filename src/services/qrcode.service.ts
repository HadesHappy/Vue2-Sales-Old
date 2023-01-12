import { requestHelpers } from "@/helpers";

export const qrcodeService = {
  createQrcode: function (text, format) {
    return requestHelpers.securedAxiosInstance.post(
      `${import.meta.env.VITE_LOCALETMOI_BASE_URL}/api/qrcode/create`,
      {
        text,
        format: format || "png",
      },
      {
        responseType: "blob",
      }
    );
  },
};
