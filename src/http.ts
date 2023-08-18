import express from "express";
import http from "http";
import path from "path";
import { websocket } from "@cousinear/services/websocket";

const app = express();

app.use(
    express.static(path.join(__dirname, "..", "public"))
);

const server = http.createServer(app);

websocket.attach(server);

export { server };