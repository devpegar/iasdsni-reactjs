import { useEffect, useState } from "react";
import {
  DEFAULT_SITE_SETTINGS,
  getPublicSiteSettings,
} from "../services/siteSettingsService";

export default function useSiteSettings() {
  const [settings, setSettings] = useState(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getPublicSiteSettings()
      .then((data) => {
        if (mounted) {
          setSettings(data);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { settings, loading };
}
