import { HttpClientModule } from "@angular/common/http";
import { importProvidersFrom } from "@angular/core";
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { bootstrapApplication } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";
import { routes } from "./app/app-routes";
import { AppComponent } from "./app/app.component";
import { environment } from "./environments/environment";

bootstrapApplication (AppComponent, {
  providers: [
    provideRouter (routes),
    importProvidersFrom (
      HttpClientModule,
      BrowserAnimationsModule,
      provideFirebaseApp (() => initializeApp (environment.firebase)),
      provideAuth (() => getAuth ()),
      provideFirestore (() => getFirestore ())
    )
  ]
}).catch (err => console.error (err));
