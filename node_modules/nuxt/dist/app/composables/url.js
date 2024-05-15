import { getRequestURL } from "h3";
import { useRequestEvent } from "./ssr.js";
export function useRequestURL() {
  if (import.meta.server) {
    return getRequestURL(useRequestEvent());
  }
  return new URL(window.location.href);
}
