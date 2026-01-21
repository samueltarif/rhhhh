import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "UiCard",
  __ssrInlineRender: true,
  props: {
    title: {},
    subtitle: {},
    icon: {},
    padding: { default: "p-6 lg:p-8" },
    className: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["bg-white rounded-2xl shadow-sm border border-gray-100", __props.padding, __props.className]
      }, _attrs))}>`);
      if (__props.title || _ctx.$slots.header) {
        _push(`<div class="flex items-center justify-between mb-6">`);
        if (__props.title) {
          _push(`<h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">`);
          if (__props.icon) {
            _push(`<span class="text-xl">${ssrInterpolate(__props.icon)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(` ${ssrInterpolate(__props.title)} `);
          if (__props.subtitle) {
            _push(`<span class="text-sm font-normal text-gray-400">${ssrInterpolate(__props.subtitle)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</h3>`);
        } else {
          _push(`<!---->`);
        }
        ssrRenderSlot(_ctx.$slots, "header", {}, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/UiCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main, { __name: "UiCard" });

export { __nuxt_component_2 as _ };
//# sourceMappingURL=UiCard-Co7bHBSC.mjs.map
