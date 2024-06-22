"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cluster_1 = __importDefault(require("cluster"));
const os_1 = __importDefault(require("os"));
const PORT = process.env.PORT || 3000;
const numCPUs = os_1.default.cpus().length - 2;
if (cluster_1.default.isPrimary) {
    console.log(`Primary ${process.pid} is running`);
    console.log(`Forking ${numCPUs} workers`);
    for (let i = 0; i < numCPUs; i++) {
        cluster_1.default.fork();
    }
    cluster_1.default.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        console.log(`forking new worker`);
        cluster_1.default.fork();
    });
}
else {
    const app = (0, express_1.default)();
    console.log(`worker ${process.pid} started`);
    app.get("/", (req, res) => {
        res.send(`Hello from worker ${process.pid}`);
    });
    app.listen(PORT, () => console.log(`listening worker ${process.pid} on port ${PORT}`));
}
