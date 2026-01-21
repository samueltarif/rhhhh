import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "UiAvatar",
  __ssrInlineRender: true,
  props: {
    name: {},
    src: {},
    avatarType: {},
    size: { default: "md" },
    color: { default: "primary" }
  },
  setup(__props) {
    const props = __props;
    const initials = computed(() => {
      return props.name.split(" ").map((n) => n.charAt(0)).slice(0, 2).join("").toUpperCase();
    });
    const sizeClasses = computed(() => {
      const sizes = {
        sm: "w-10 h-10",
        md: "w-12 h-12",
        lg: "w-16 h-16",
        xl: "w-32 h-32"
      };
      return sizes[props.size];
    });
    const textSizeClass = computed(() => {
      const sizes = {
        sm: "text-sm",
        md: "text-lg",
        lg: "text-2xl",
        xl: "text-5xl"
      };
      return sizes[props.size];
    });
    const colorClasses = computed(() => {
      if (props.avatarType) {
        return "bg-gray-100";
      }
      const colors = {
        primary: "bg-primary-100 text-primary-700",
        green: "bg-green-100 text-green-700",
        orange: "bg-orange-200 text-orange-700",
        purple: "bg-purple-100 text-purple-700",
        gray: "bg-gray-100 text-gray-500"
      };
      return colors[props.color];
    });
    const avatarMap = {
      // Avatares básicos
      "person-1": "👤",
      // GERENTE - Responsável por Fiscal, Financeiro, Comercial, RH e Administrativo
      "gerente-1": "👨‍💼",
      "gerente-2": "👩‍💼",
      "gerente-3": "👨🏽‍💼",
      "gerente-4": "👩🏽‍💼",
      // ASSISTENTE COMERCIAL
      "ass-comercial-1": "🧑‍💼",
      "ass-comercial-2": "👨‍💼",
      "ass-comercial-3": "👩‍💼",
      "ass-comercial-4": "👨🏽‍💼",
      "ass-comercial-5": "👩🏽‍💼",
      // REPRESENTANTE COMERCIAL
      "rep-comercial-1": "🤝",
      "rep-comercial-2": "👔",
      "rep-comercial-3": "💼",
      // AUXILIAR COMERCIAL
      "aux-comercial-1": "📊",
      "aux-comercial-2": "📈",
      "aux-comercial-3": "💹",
      // ASSISTENTE DE PRODUÇÃO
      "ass-producao-1": "👷‍♂️",
      "ass-producao-2": "👷‍♀️",
      "ass-producao-3": "👷🏽‍♂️",
      "ass-producao-4": "👷🏽‍♀️",
      // AUXILIAR DE PRODUÇÃO
      "aux-producao-1": "🔧",
      "aux-producao-2": "⚙️",
      "aux-producao-3": "🛠️",
      // SOLDADOR
      "soldador-1": "👨‍🔧",
      "soldador-2": "👩‍🔧",
      "soldador-3": "👨🏽‍🔧",
      "soldador-4": "👩🏽‍🔧",
      "soldador-5": "🔥",
      "soldador-6": "⚡",
      // AUXILIAR ADMINISTRATIVO
      "aux-admin-1": "📋",
      "aux-admin-2": "📝",
      "aux-admin-3": "🗂️",
      "aux-admin-4": "📄",
      // LÍDER DE ESTOQUE
      "lider-estoque-1": "📦",
      "lider-estoque-2": "🏪",
      "lider-estoque-3": "👨🏽‍💼",
      "lider-estoque-4": "👩🏽‍💼",
      // AUXILIAR DE ESTOQUE
      "aux-estoque-1": "📋",
      "aux-estoque-2": "📊",
      "aux-estoque-3": "🏷️",
      "aux-estoque-4": "📈",
      // AUXILIAR DE EXPEDIÇÃO
      "aux-expedicao-1": "🚚",
      "aux-expedicao-2": "📦",
      "aux-expedicao-3": "🚛",
      "aux-expedicao-4": "📮",
      // AUXILIAR DE SERVIÇOS GERAIS
      "aux-servicos-1": "🧹",
      "aux-servicos-2": "🧽",
      "aux-servicos-3": "🧴",
      "aux-servicos-4": "🗑️",
      // TI (Técnico de Informática)
      "ti-1": "👨‍💻",
      "ti-2": "👩‍💻",
      "ti-3": "👨🏽‍💻",
      "ti-4": "👩🏽‍💻",
      "ti-5": "💻",
      "ti-6": "🖥️"
    };
    const getAvatarEmoji = (avatarType) => {
      return avatarMap[avatarType] || "👤";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: [
          "rounded-xl flex items-center justify-center font-bold",
          unref(sizeClasses),
          unref(colorClasses)
        ]
      }, _attrs))}>`);
      if (__props.src) {
        _push(`<img${ssrRenderAttr("src", __props.src)}${ssrRenderAttr("alt", __props.name)} class="w-full h-full object-cover rounded-xl">`);
      } else if (__props.avatarType) {
        _push(`<div class="${ssrRenderClass(unref(textSizeClass))}">${ssrInterpolate(getAvatarEmoji(__props.avatarType))}</div>`);
      } else {
        _push(`<span class="${ssrRenderClass(unref(textSizeClass))}">${ssrInterpolate(unref(initials))}</span>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/UiAvatar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "UiAvatar" });

export { __nuxt_component_1 as _ };
//# sourceMappingURL=UiAvatar-BMVSUvdY.mjs.map
