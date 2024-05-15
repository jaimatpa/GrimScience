<script>
import { componentName } from "#color-mode-options";
export default {
  name: componentName,
  functional: true,
  props: {
    placeholder: String,
    tag: {
      type: String,
      default: "span"
    }
  },
  render(createElement, { data, props, children }) {
    props = {
      placeholder: props.placeholder,
      placeholderTag: props.tag
    };
    return createElement("client-only", { ...data, props }, children);
  }
};
</script>
