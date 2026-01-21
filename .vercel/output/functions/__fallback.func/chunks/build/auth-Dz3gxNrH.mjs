import { e as defineNuxtRouteMiddleware, a as useAuth, n as navigateTo } from './server.mjs';
import 'vue';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import '@supabase/ssr';

const auth = defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth();
  if (to.path === "/login") {
    if (isAuthenticated.value) {
      return navigateTo("/dashboard");
    }
    return;
  }
  if (!isAuthenticated.value) {
    return navigateTo("/login");
  }
});

export { auth as default };
//# sourceMappingURL=auth-Dz3gxNrH.mjs.map
