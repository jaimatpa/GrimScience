import { useState } from "#imports";
export function useToast() {
  const notifications = useState("notifications", () => []);
  function add(notification) {
    const body = {
      id: (/* @__PURE__ */ new Date()).getTime().toString(),
      ...notification
    };
    const index = notifications.value.findIndex((n) => n.id === body.id);
    if (index === -1) {
      notifications.value.push(body);
    }
    return body;
  }
  function remove(id) {
    notifications.value = notifications.value.filter((n) => n.id !== id);
  }
  function update(id, notification) {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index !== -1) {
      const previous = notifications.value[index];
      notifications.value.splice(index, 1, { ...previous, ...notification });
    }
  }
  function clear() {
    notifications.value = [];
  }
  return {
    add,
    remove,
    update,
    clear
  };
}
