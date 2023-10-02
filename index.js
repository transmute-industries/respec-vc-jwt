import { eventHandler } from "./src/eventHandler";

self.allowCrossOrigin();

self.addEventListener("message", eventHandler);