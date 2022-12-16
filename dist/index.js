"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const request_logger_1 = __importDefault(require("./middlewares/request-logger"));
const cors_1 = __importDefault(require("cors"));
const cors_2 = require("./configs/cors");
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use((0, cors_1.default)(cors_2.CORS_OPTIONS));
app.use(request_logger_1.default);
app.get("/", (req, res) => {
    res.status(200);
    res.send("test failed");
});
app.listen(port, () => {
    console.log(`[server]: Server is running at https://localhost:${port}`);
});
