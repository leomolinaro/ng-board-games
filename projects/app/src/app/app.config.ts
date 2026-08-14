import { HttpClientModule } from "@angular/common/http";
import { ApplicationConfig, importProvidersFrom, provideAppInitializer } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";
import { provideTaiga } from "@taiga-ui/core";
import { getApps, initializeApp } from "firebase/app";
import { environment } from "../environments/environment";
import { appRoutes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    importProvidersFrom(HttpClientModule, BrowserAnimationsModule),
    provideAppInitializer(() => {
      if (!getApps().length) {
        initializeApp(environment.firebase);
      }
    }),
    provideTaiga()
  ]
};
