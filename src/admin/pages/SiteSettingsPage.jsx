import { useEffect, useMemo, useState } from "react";
import Field from "../components/form/Field";
import FormLayout from "../layout/FormLayout";
import {
  listSiteSettings,
  updateSiteSettings,
} from "../services/siteSettingsService";
import { toastBus } from "../../services/toastBus";

const groupLabels = {
  identidad: "Identidad institucional",
  contacto: "Contacto",
  redes: "Redes sociales",
  textos: "Textos reutilizables",
  general: "General",
};

function getInputType(setting) {
  if (setting.setting_type === "email") return "email";
  if (setting.setting_type === "url") return "url";
  if (setting.setting_type === "phone") return "tel";
  return "text";
}

function shouldUseTextarea(setting) {
  return (
    setting.setting_type === "longtext" ||
    setting.setting_type === "textarea" ||
    (setting.setting_value || "").length > 120
  );
}

function buildInitialValues(groups) {
  return Object.values(groups).reduce((acc, settings) => {
    settings.forEach((setting) => {
      acc[setting.setting_key] = setting.setting_value ?? "";
    });

    return acc;
  }, {});
}

export default function SiteSettingsPage() {
  const [groups, setGroups] = useState({});
  const [values, setValues] = useState({});
  const [initialValues, setInitialValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const hasChanges = useMemo(
    () => JSON.stringify(values) !== JSON.stringify(initialValues),
    [values, initialValues],
  );

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await listSiteSettings();

      if (res.success === false) {
        setError(res.message || "No se pudo cargar la configuración del sitio");
        return;
      }

      const nextGroups = res.groups ?? {};
      const nextValues = buildInitialValues(nextGroups);

      setGroups(nextGroups);
      setValues(nextValues);
      setInitialValues(nextValues);
      setError(null);
    } catch (err) {
      setError(err.message || "No se pudo cargar la configuración del sitio");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const changedSettings = Object.entries(values).reduce((acc, [key, value]) => {
      if (value !== initialValues[key]) {
        acc[key] = value;
      }

      return acc;
    }, {});

    try {
      setSaving(true);
      const res = await updateSiteSettings(changedSettings);

      if (res.success === false) {
        return;
      }

      toastBus.success("Configuración del sitio guardada");
      await fetchSettings();
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="site-settings-page">
        <h2>Configuración del sitio</h2>
        <p>Cargando configuración...</p>
      </div>
    );
  }

  return (
    <div className="site-settings-page">
      <div className="site-settings-page__header">
        <div>
          <h2>Configuración del sitio</h2>
          <p>Datos globales usados por Header, Footer y Contacto.</p>
        </div>
      </div>

      {error && <p>{error}</p>}

      {Object.keys(groups).length === 0 ? (
        <div className="card">
          <p>No hay configuraciones registradas. Aplicá la migración manual para habilitar esta pantalla.</p>
        </div>
      ) : (
        <FormLayout columns={1} onSubmit={handleSubmit} className="site-settings-form">
          {Object.entries(groups).map(([groupName, settings]) => (
            <section className="card site-settings-group" key={groupName}>
              <div className="card-header">
                <h3>{groupLabels[groupName] || groupName}</h3>
              </div>

              <div className="site-settings-group__grid">
                {settings.map((setting) => (
                  <Field
                    key={setting.setting_key}
                    label={setting.label || setting.setting_key}
                    name={setting.setting_key}
                    type={shouldUseTextarea(setting) ? "textarea" : getInputType(setting)}
                    value={values[setting.setting_key] ?? ""}
                    onChange={handleChange}
                    rows={setting.setting_type === "longtext" ? 4 : 3}
                    span={shouldUseTextarea(setting)}
                  />
                ))}
              </div>
            </section>
          ))}

          <div className="form-actions site-settings-form__actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving || !hasChanges}
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </FormLayout>
      )}
    </div>
  );
}
