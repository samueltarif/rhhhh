import { d as defineEventHandler, c as createError, a as useRuntimeConfig } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const variaveis_get = defineEventHandler(async (event) => {
  useRuntimeConfig();
  {
    throw createError({
      statusCode: 403,
      message: "Debug n\xE3o dispon\xEDvel em produ\xE7\xE3o"
    });
  }
});

export { variaveis_get as default };
//# sourceMappingURL=variaveis.get.mjs.map
