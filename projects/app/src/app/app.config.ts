import { provideHttpClient } from "@angular/common/http";
import { ApplicationConfig, provideAppInitializer } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideTaiga } from "@taiga-ui/core";
import { getApps, initializeApp } from "firebase/app";
import { environment } from "../environments/environment";
import { appRoutes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(),
    provideAppInitializer(() => {
      if (!getApps().length) {
        initializeApp(environment.firebase);
      }
    }),
    provideTaiga()
  ]
};
