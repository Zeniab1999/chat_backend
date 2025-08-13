"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerConfig = void 0;
const swagger_1 = require("@nestjs/swagger");
class SwaggerConfig {
    static config(app) {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('NestJS Chat App API')
            .setDescription('NestJS Chat App API')
            .setVersion('1.0')
            .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
        })
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('docs', app, document);
    }
}
exports.SwaggerConfig = SwaggerConfig;
//# sourceMappingURL=swagger.config.js.map