import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface FontOption {
  key: string;
  label: string;
  family: string;
}

export interface WatchFaceOption {
  key: string;
  label: string;
  description: string;
}

export interface AppSettings {
  fonts: FontOption[];
  watchFaces: WatchFaceOption[];
}

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>({
    fonts: [],
    watchFaces: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Fetch font options
        const { data: fontsData, error: fontsError } = await supabase
          .from("app_settings")
          .select("*")
          .eq("category", "font")
          .eq("is_active", true)
          .order("order_index");

        if (fontsError) throw fontsError;

        // Fetch watch face options
        const { data: watchFacesData, error: watchFacesError } = await supabase
          .from("app_settings")
          .select("*")
          .eq("category", "watch_face")
          .eq("is_active", true)
          .order("order_index");

        if (watchFacesError) throw watchFacesError;

        const fonts: FontOption[] = (fontsData || []).map((item: any) => ({
          key: item.key,
          label: item.label,
          family: item.value.family,
        }));

        const watchFaces: WatchFaceOption[] = (watchFacesData || []).map(
          (item: any) => ({
            key: item.key,
            label: item.label,
            description: item.value.description || "",
          })
        );

        setSettings({ fonts, watchFaces });
      } catch (error) {
        console.error("Failed to fetch app settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading };
}
