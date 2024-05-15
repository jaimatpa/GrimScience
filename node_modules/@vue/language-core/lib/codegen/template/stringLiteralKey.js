"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStringLiteralKey = void 0;
const common_1 = require("../common");
function* generateStringLiteralKey(code, offset, info) {
    if (offset === undefined || !info) {
        yield `"${code}"`;
    }
    else {
        yield* (0, common_1.wrapWith)(offset, offset + code.length, info, `"`, [code, 'template', offset, common_1.combineLastMapping], `"`);
    }
}
exports.generateStringLiteralKey = generateStringLiteralKey;
//# sourceMappingURL=stringLiteralKey.js.map