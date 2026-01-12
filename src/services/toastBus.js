let showToastRef = null;

export const toastBus = {
  bind(fn) {
    showToastRef = fn;
  },
  error(msg) {
    showToastRef?.(msg, "error");
  },
  success(msg) {
    showToastRef?.(msg, "success");
  },
  info(msg) {
    showToastRef?.(msg, "info");
  },
};
