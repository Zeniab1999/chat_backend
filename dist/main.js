"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_config_1 = require("./config/docs/swagger.config");
const validate_pipe_1 = require("./config/pipe/validate.pipe");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    swagger_config_1.SwaggerConfig.config(app);
    app.useGlobalPipes(new validate_pipe_1.ValidateInputPipe());
    await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
//# sourceMappingURL=main.js.map