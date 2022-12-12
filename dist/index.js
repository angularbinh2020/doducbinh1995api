"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const request_logger_1 = __importDefault(require("./middlewares/request-logger"));
const role_table_1 = require("./database/role-table");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(request_logger_1.default);
app.get("/", (req, res) => {
    (0, role_table_1.createRoleTable)()
        .then(() => {
        res.send("Create success");
    })
        .catch(() => {
        res.send("Create failed");
    });
});
app.listen(port, () => {
    console.log(`[server]: Server is running at https://localhost:${port}`);
});
