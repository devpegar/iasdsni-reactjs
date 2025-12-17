import { useState, useEffect } from "react";
import { apiGet, apiPost } from "../services/api";

export default function useCrud(basePath) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await apiGet(`${basePath}/list.php`);

      // Buscar automáticamente el array devuelto
      const key = Object.keys(res).find((k) => Array.isArray(res[k]));
      setList(res[key] || []);

      setError(null);
    } catch (err) {
      setError(err.message || "Error al cargar");
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (data) => {
    const res = await apiPost(`${basePath}/create.php`, data);
    await fetchAll();
    return res;
  };

  const updateItem = async (id, data) => {
    const res = await apiPost(`${basePath}/update.php`, { id, ...data });
    await fetchAll();
    return res;
  };

  const deleteItem = async (id) => {
    const res = await apiGet(`${basePath}/delete.php?id=${id}`);
    await fetchAll();
    return res;
  };

  useEffect(() => {
    fetchAll();
  }, [basePath]);

  return {
    list,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    refresh: fetchAll,
  };
}
