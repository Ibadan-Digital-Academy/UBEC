import serverless from "serverless-http";
import { app, initApp } from "../../server/index";

let preparedApp: any;

export const handler = async (event: any, context: any) => {
  // Ensure routes are registered before handling the first request
  if (!preparedApp) {
    preparedApp = await initApp();
  }
  
  const h = serverless(preparedApp);
  return h(event, context);
};