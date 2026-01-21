import { defineComponent, computed, ref, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrRenderStyle, ssrIncludeBooleanAttr } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "UiInput",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    type: { default: "text" },
    label: {},
    placeholder: {},
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    icon: {},
    hint: {},
    error: {},
    showPasswordToggle: { type: Boolean, default: false },
    uppercase: { type: Boolean, default: true }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const id = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`);
    const passwordVisible = ref(false);
    const computedType = computed(() => {
      if (props.type === "password" && passwordVisible.value) return "text";
      return props.type;
    });
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
      _push(`<div class="relative">`);
      if (__props.icon) {
        _push(`<span class="absolute left-4 top-1/2 -translate-y-1/2 text-lg">${ssrInterpolate(__props.icon)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<input${ssrRenderAttr("id", unref(id))}${ssrRenderAttr("type", unref(computedType))}${ssrRenderAttr("value", __props.modelValue)}${ssrRenderAttr("placeholder", __props.placeholder)}${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""}${ssrIncludeBooleanAttr(__props.required) ? " required" : ""} class="${ssrRenderClass([
        "w-full px-4 py-3 text-lg border-2 rounded-xl outline-none transition-colors",
        __props.icon ? "pl-12" : "",
        __props.showPasswordToggle ? "pr-14" : "",
        __props.disabled ? "border-gray-100 bg-gray-50 text-gray-500" : "border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100",
        __props.error ? "border-red-300" : "",
        __props.uppercase && __props.type !== "password" && __props.type !== "email" ? "uppercase" : ""
      ])}" style="${ssrRenderStyle(__props.uppercase && __props.type !== "password" && __props.type !== "email" ? "text-transform: uppercase;" : "")}">`);
      if (__props.showPasswordToggle && __props.type === "password") {
        _push(`<button type="button" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 transition-colors" tabindex="-1">`);
        if (!unref(passwordVisible)) {
          _push(`<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>`);
        } else {
          _push(`<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>`);
        }
        _push(`</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (__props.hint && !__props.error) {
        _push(`<p class="text-xs text-gray-400 mt-1">${ssrInterpolate(__props.hint)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.error) {
        _push(`<p class="text-xs text-red-500 mt-1">${ssrInterpolate(__props.error)}</p>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/UiInput.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main, { __name: "UiInput" });

export { __nuxt_component_4 as _ };
//# sourceMappingURL=UiInput-D3rcqyNi.mjs.map
