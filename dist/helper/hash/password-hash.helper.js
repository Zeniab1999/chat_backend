"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordHashHelper = void 0;
const bcrypt = require("bcrypt");
const string_helper_1 = require("../string/string.helper");
class PasswordHashHelper {
    static async hash(password) {
        const passKey = string_helper_1.StringHelper.generateRandomString(10);
        const hash = await bcrypt.hash(password + passKey, 10);
        return {
            passKey: passKey,
            hash: hash,
        };
    }
    static comparePassword(password, passKey, hash) {
        return bcrypt.compare(password + passKey, hash);
    }
}
exports.PasswordHashHelper = PasswordHashHelper;
//# sourceMappingURL=password-hash.helper.js.map