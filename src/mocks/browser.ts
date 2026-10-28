import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";
import { graphHandlers } from "./graphHandlers";

export const worker = setupWorker(...handlers, ...graphHandlers);
