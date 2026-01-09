import { useState } from "react";

export default function useFormEdit(initialState = {}) {
  const [form, setForm] = useState(initialState);
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({ ...initialState, ...item });
  };

  const resetForm = () => {
    setForm(initialState);
    setEditingId(null);
  };

  return {
    form,
    setForm,
    editingId,
    setEditingId,
    handleChange,
    startEdit,
    resetForm,
  };
}
