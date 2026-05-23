import { getJson } from "../../../services/httpClient";

export const DEFAULT_SITE_SETTINGS = {
  site_url: "https://iasdsni.com.ar",
  site_name: "IASD San Nicolás Centro",
  site_subtitle: "Iglesia Adventista del Séptimo Día",
  logo_header_url: "",
  logo_footer_url: "",
  logo_url: "",
  favicon_url: "",
  facebook_url: "https://facebook.com/iasdsni",
  instagram_url: "https://instagram.com/iasdsni",
  youtube_url: "",
  whatsapp_number: "3364683017",
  contact_email: "info@iasdsni.com.ar",
  address: "Rivadavia 161, San Nicolás de los Arroyos",
  service_hours: "",
  google_maps_url:
    "https://www.google.com/maps?q=Rivadavia+161+San+Nicolás+de+los+Arroyos&output=embed",
  footer_text:
    "Una comunidad que anuncia esperanza y se prepara para la segunda venida de Jesús.",
};

let cachedSettings = null;
let pendingRequest = null;

function normalizeSettings(settings) {
  return {
    ...DEFAULT_SITE_SETTINGS,
    ...(settings || {}),
  };
}

export async function getPublicSiteSettings() {
  if (cachedSettings) {
    return cachedSettings;
  }

  if (!pendingRequest) {
    pendingRequest = getJson("/public/settings/list.php")
      .then(({ data }) => {
        cachedSettings = normalizeSettings(data?.data);
        return cachedSettings;
      })
      .catch(() => {
        cachedSettings = normalizeSettings({});
        return cachedSettings;
      })
      .finally(() => {
        pendingRequest = null;
      });
  }

  return pendingRequest;
}
