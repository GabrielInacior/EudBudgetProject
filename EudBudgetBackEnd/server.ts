import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import cors from "cors";
import "./src/scripts/initializeDatabase";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Middleware para log de requisições
app.use((req: Request, res: Response, next: NextFunction) => {
  const startTime = new Date().getTime();

  res.on("finish", () => {
    const duration = new Date().getTime() - startTime;
    const logMessage = `
      Method: ${req.method},
      Path: ${req.path},
      Status: ${res.statusCode},
      Duration: ${duration}ms,
      Success: ${res.statusCode >= 200 && res.statusCode < 400 ? "yes" : "no"}
    `;
    console.log(logMessage);
  });

  next();
});

const manifestPath = path.join(
  __dirname,
  "..",
  "/EudBudgetBackEnd/manifest.json"
);
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

// Definindo tipos válidos para métodos HTTP
type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

manifest.routes.forEach((route: any) => {
  const { path: routePath, method, controller, action } = route;

  try {
    // Adicione o caminho relativo à pasta Controller sem extensão
    const controllerFilePath = path.join(
      __dirname,
      "../EudBudgetBackEnd/src/Controller",
      controller
    );

    // Use import dinâmico para carregar funções exportadas
    import(controllerFilePath)
      .then((controllerModule) => {
        if (
          ["get", "post", "put", "delete", "patch"].includes(
            method.toLowerCase()
          )
        ) {
          app[method.toLowerCase() as HttpMethod](
            routePath,
            async (req: Request, res: Response) => {
              try {
                console.log(`Route called: ${method} ${routePath}`);
                await controllerModule[action](req, res);
              } catch (error: unknown) {
                console.error(
                  `Error handling route ${method} ${routePath}:`,
                  error
                );
                if (error instanceof Error) {
                  res.status(500).json({
                    message: "Internal Server Error",
                    error: error.message,
                  });
                } else {
                  res.status(500).json({
                    message: "Internal Server Error",
                    error: String(error),
                  });
                }
              }
            }
          );

          console.log(`Route ${method} ${routePath} loaded.`);
        } else {
          console.error(
            `Invalid HTTP method: ${method} for route ${routePath}`
          );
        }
      })
      .catch((err) => {
        console.error(
          `Error loading controller for route ${routePath}: ${err}`
        );
      });
  } catch (e) {
    console.error(`Error loading controller for route ${routePath}: ${e}`);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(5000, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
