import serverless from "serverless-http";
import { app, initApp } from "../../server/index";

let cachedHandler: any;

export const handler = async (event: any, context: any) => {
  if (!cachedHandler) {
    // This calls registerRoutes and sets up middleware
    await initApp();
    cachedHandler = serverless(app);
  }
  
  return cachedHandler(event, context);
};