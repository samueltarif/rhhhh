import { defineComponent, watch, computed, unref, useSSRContext } from 'vue';
import { ssrRenderTeleport, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrRenderStyle, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "UiNotification",
  __ssrInlineRender: true,
  props: {
    show: { type: Boolean },
    title: {},
    message: {},
    variant: { default: "success" },
    duration: { default: 5e3 }
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    watch(() => props.show, (newShow) => {
      if (newShow && props.duration > 0) {
        setTimeout(() => {
          emit("close");
        }, props.duration);
      }
    });
    const variantClasses = computed(() => {
      const variants = {
        success: "border-green-500 text-green-700 bg-green-50",
        error: "border-red-500 text-red-700 bg-red-50",
        warning: "border-yellow-500 text-yellow-700 bg-yellow-50",
        info: "border-blue-500 text-blue-700 bg-blue-50"
      };
      return variants[props.variant];
    });
    const iconPath = computed(() => {
      const icons = {
        success: "M5 13l4 4L19 7",
        error: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
        warning: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
        info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      };
      return icons[props.variant];
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.show) {
          _push2(`<div class="${ssrRenderClass([
            "fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-xl shadow-lg border-l-4 p-4",
            unref(variantClasses)
          ])}" data-v-09772c10><div class="flex items-start gap-3" data-v-09772c10><div class="flex-shrink-0" data-v-09772c10><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-09772c10><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${ssrRenderAttr("d", unref(iconPath))} data-v-09772c10></path></svg></div><div class="flex-1" data-v-09772c10><p class="font-semibold" data-v-09772c10>${ssrInterpolate(__props.title)}</p>`);
          if (__props.message) {
            _push2(`<p class="text-sm opacity-90 mt-1" data-v-09772c10>${ssrInterpolate(__props.message)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><button class="flex-shrink-0 p-1 rounded-lg hover:bg-black/10 transition-colors" data-v-09772c10><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-09772c10><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-09772c10></path></svg></button></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/UiNotification.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_7 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-09772c10"]]), { __name: "UiNotification" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "UiModal",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: Boolean },
    title: {},
    maxWidth: { default: "max-w-lg" },
    maxHeight: { default: "max-h-[90vh]" },
    contentPadding: { default: "p-6" },
    contentMaxHeight: { default: "calc(90vh - 180px)" },
    closeOnBackdrop: { type: Boolean, default: true }
  },
  emits: ["update:modelValue"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.modelValue) {
          _push2(`<div class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" data-v-d7b8f265><div class="${ssrRenderClass(["bg-white rounded-2xl w-full overflow-hidden", __props.maxWidth, __props.maxHeight])}" data-v-d7b8f265><div class="sticky top-0 bg-white border-b p-6 flex items-center justify-between" data-v-d7b8f265><h2 class="text-2xl font-bold text-gray-800" data-v-d7b8f265>${ssrInterpolate(__props.title)}</h2><button class="p-2 hover:bg-gray-100 rounded-lg transition-colors" data-v-d7b8f265><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-d7b8f265><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-d7b8f265></path></svg></button></div><div class="${ssrRenderClass(["overflow-y-auto", __props.contentPadding])}" style="${ssrRenderStyle({ maxHeight: __props.contentMaxHeight })}" data-v-d7b8f265>`);
          ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent);
          _push2(`</div>`);
          if (_ctx.$slots.footer) {
            _push2(`<div class="border-t p-6 flex justify-end gap-3" data-v-d7b8f265>`);
            ssrRenderSlot(_ctx.$slots, "footer", {}, null, _push2, _parent);
            _push2(`</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/UiModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-d7b8f265"]]), { __name: "UiModal" });

export { __nuxt_component_7 as _, __nuxt_component_3 as a };
//# sourceMappingURL=UiModal-C-UfYvvP.mjs.map
