import { defineComponent, computed, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderList } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "UiSelect",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    options: {},
    label: {},
    placeholder: {},
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const getOptionValue = (opt) => {
      if (opt.value === null) return "";
      return opt.value.toString();
    };
    const isSelected = (opt) => {
      if (opt.value === null) {
        return props.modelValue === null || props.modelValue === "" || props.modelValue === void 0;
      }
      if (props.modelValue === null || props.modelValue === void 0) {
        return false;
      }
      return opt.value === props.modelValue || opt.value.toString() === props.modelValue.toString();
    };
    const id = computed(() => `select-${Math.random().toString(36).substr(2, 9)}`);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (__props.label) {
        _push(`<label${ssrRenderAttr("for", unref(id))} class="block text-sm font-medium text-gray-600 mb-1">${ssrInterpolate(__props.label)} `);
        if (__props.required) {
          _push(`<span class="text-red-500">*</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</label>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<select${ssrRenderAttr("id", unref(id))}${ssrRenderAttr("value", __props.modelValue)}${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""}${ssrIncludeBooleanAttr(__props.required) ? " required" : ""} class="${ssrRenderClass([
        "w-full px-4 py-3 text-lg border-2 rounded-xl outline-none transition-colors",
        __props.disabled ? "border-gray-100 bg-gray-50 text-gray-500" : "border-gray-200 focus:border-primary-500"
      ])}">`);
      if (__props.placeholder) {
        _push(`<option value="">${ssrInterpolate(__props.placeholder)}</option>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(__props.options, (opt) => {
        _push(`<option${ssrRenderAttr("value", getOptionValue(opt))}${ssrIncludeBooleanAttr(isSelected(opt)) ? " selected" : ""}>${ssrInterpolate(opt.label)}</option>`);
      });
      _push(`<!--]--></select></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/UiSelect.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_6 = Object.assign(_sfc_main, { __name: "UiSelect" });

export { __nuxt_component_6 as _ };
//# sourceMappingURL=UiSelect-DFt9aazW.mjs.map
