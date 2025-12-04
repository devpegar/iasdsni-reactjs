import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../services/api";
import {
  Switch,
  FormControlLabel,
  Button,
  Box,
  Typography,
} from "@mui/material";

export default function SettingsPage() {
  const [maintenance, setMaintenance] = useState(false);

  // Cargar configuración al inicio
  useEffect(() => {
    apiGet("/maintenance/get.php").then((res) => {
      if (res.success) setMaintenance(res.maintenance);
    });
  }, []);

  // Guardar en servidor
  const updateMaintenance = async () => {
    const res = await apiPost("/maintenance/update.php", { maintenance });
    console.log(res);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Configuración del sitio
      </Typography>

      <FormControlLabel
        control={
          <Switch
            checked={maintenance}
            onChange={(e) => setMaintenance(e.target.checked)}
            color="primary"
          />
        }
        label="Activar modo mantenimiento"
      />

      <Box sx={{ mt: 3 }}>
        <Button variant="contained" onClick={updateMaintenance}>
          Guardar cambios
        </Button>
      </Box>
    </Box>
  );
}
