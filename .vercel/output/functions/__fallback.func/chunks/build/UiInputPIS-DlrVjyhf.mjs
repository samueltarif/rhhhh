import { defineComponent, computed, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "UiInputPIS",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    label: {},
    placeholder: { default: "000.00000.00-0" },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    error: {}
  },
  emits: ["update:modelValue", "blur"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const id = computed(() => `pis-${Math.random().toString(36).substr(2, 9)}`);
    const displayValue = computed(() => {
      return formatarPIS(props.modelValue);
    });
    const formatarPIS = (valor) => {
      if (!valor) return "";
      const numeros = valor.replace(/\D/g, "");
      if (numeros.length <= 3) {
        return numeros;
      } else if (numeros.length <= 8) {
        return `${numeros.slice(0, 3)}.${numeros.slice(3)}`;
      } else if (numeros.length <= 10) {
        return `${numeros.slice(0, 3)}.${numeros.slice(3, 8)}.${numeros.slice(8)}`;
      } else {
        return `${numeros.slice(0, 3)}.${numeros.slice(3, 8)}.${numeros.slice(8, 10)}-${numeros.slice(10, 11)}`;
      }
    };
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
      _push(`<input${ssrRenderAttr("id", unref(id))} type="text"${ssrRenderAttr("value", unref(displayValue))}${ssrRenderAttr("placeholder", __props.placeholder)}${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""}${ssrIncludeBooleanAttr(__props.required) ? " required" : ""} class="${ssrRenderClass([
        "w-full px-4 py-3 text-lg border-2 rounded-xl outline-none transition-colors",
        __props.disabled ? "border-gray-100 bg-gray-50 text-gray-500" : "border-gray-200 focus:border-primary-500"
      ])}" maxlength="14">`);
      if (__props.error) {
        _push(`<p class="mt-1 text-sm text-red-600">${ssrInterpolate(__props.error)}</p>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/UiInputPIS.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "UiInputPIS" });

export { __nuxt_component_1 as _ };
//# sourceMappingURL=UiInputPIS-DlrVjyhf.mjs.map
