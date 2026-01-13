import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { createServer } from "http";

export const app = express();
export const httpServer = createServer(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

export const initApp = async () => {
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    res.status(status).json({ message: err.message || "Internal Server Error" });
  });

  const isProd = process.env.NODE_ENV === "production" || !!process.env.NETLIFY;

  if (!isProd) {
    // Using a template literal `${...}` hides this from the static bundler
    const viteModule = "./vite";
    const { setupVite } = await import(viteModule);
    await setupVite(httpServer, app);
  }
  
  return app;
};

// Only listen when running locally
if (!process.env.NETLIFY && process.env.NODE_ENV !== "production") {
  initApp().then(() => {
    const port = 5001;
    httpServer.listen(port, "0.0.0.0", () => {
      console.log(`[express] serving on port ${port}`);
    });
  });
}