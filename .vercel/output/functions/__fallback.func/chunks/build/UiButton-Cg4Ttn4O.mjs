import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "UiButton",
  __ssrInlineRender: true,
  props: {
    type: { default: "button" },
    variant: { default: "primary" },
    size: { default: "md" },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    icon: {}
  },
  setup(__props) {
    const props = __props;
    const sizeClasses = computed(() => {
      const sizes = {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-3 text-base",
        lg: "px-6 py-4 text-lg font-bold"
      };
      return sizes[props.size];
    });
    const variantClasses = computed(() => {
      const variants = {
        primary: "text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-200",
        secondary: "text-gray-600 bg-gray-100 hover:bg-gray-200 focus:ring-gray-200",
        danger: "text-red-600 bg-red-50 hover:bg-red-100 focus:ring-red-200",
        success: "text-white bg-green-600 hover:bg-green-700 focus:ring-green-200",
        ghost: "text-primary-600 bg-primary-50 hover:bg-primary-100 focus:ring-primary-200"
      };
      return variants[props.variant];
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        type: __props.type,
        disabled: __props.disabled || __props.loading,
        class: [
          "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all",
          "focus:ring-4 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
          unref(sizeClasses),
          unref(variantClasses)
        ]
      }, _attrs))}>`);
      if (__props.loading) {
        _push(`<svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.icon && !__props.loading) {
        _push(`<span class="text-lg">${ssrInterpolate(__props.icon)}</span>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</button>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/UiButton.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "UiButton" });

export { __nuxt_component_1 as _ };
//# sourceMappingURL=UiButton-Cg4Ttn4O.mjs.map
