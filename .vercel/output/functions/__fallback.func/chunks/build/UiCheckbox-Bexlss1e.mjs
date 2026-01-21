import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "UiCheckbox",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: Boolean },
    label: {}
  },
  emits: ["update:modelValue"],
  setup(__props) {
    const inputId = `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center" }, _attrs))}><input${ssrRenderAttr("id", inputId)} type="checkbox"${ssrIncludeBooleanAttr(__props.modelValue) ? " checked" : ""} class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded">`);
      if (__props.label) {
        _push(`<label${ssrRenderAttr("for", inputId)} class="ml-2 block text-sm text-gray-900">${ssrInterpolate(__props.label)}</label>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/UiCheckbox.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "UiCheckbox" });

export { __nuxt_component_0 as _ };
//# sourceMappingURL=UiCheckbox-Bexlss1e.mjs.map
