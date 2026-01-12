import { useState } from "react";

export default function useFormEdit(initialState = {}, options = {}) {
  const { formRef, scrollBehavior = "smooth" } = options;

  const [form, setForm] = useState(initialState);
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const startEdit = (item) => {
    setEditingId(item.id);

    setForm({
      ...initialState,
      ...item,
      has_access: Boolean(item.has_access),
    });

    if (formRef?.current) {
      formRef.current.scrollIntoView({
        behavior: scrollBehavior,
        block: "start",
      });
    }
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
