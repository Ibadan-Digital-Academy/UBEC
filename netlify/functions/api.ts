// netlify/functions/api.ts
import serverless from "serverless-http";
import { app } from "../../server/index";
import { registerRoutes } from "../../server/routes";
import { Server } from "http";

let preparedApp: any = null;

export const handler = async (event: any, context: any) => {
  if (!preparedApp) {
    // Create a dummy server object to satisfy the first argument of registerRoutes
    // We cast it as Server because we only need the 'app' to have routes registered
    const dummyServer = {} as Server; 
    
    await registerRoutes(dummyServer, app);
    preparedApp = serverless(app);
  }
  
  return preparedApp(event, context);
};