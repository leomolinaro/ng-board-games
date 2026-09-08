import { provideHttpClient } from '@angular/common/http';
import type { ApplicationConfig} from '@angular/core';
import { provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';
import type {
  TuiHintOptions} from '@taiga-ui/core';
import {
  provideTaiga,
  TUI_HINT_DEFAULT_OPTIONS,
  TUI_HINT_OPTIONS
} from '@taiga-ui/core';
import { getApps, initializeApp } from 'firebase/app';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(),
    provideAppInitializer(() => {
      if (getApps().length === 0) {
        initializeApp(environment.firebase);
      }
    }),
    provideTaiga(),
    {
      provide: TUI_HINT_OPTIONS,
      useValue: {
        ...TUI_HINT_DEFAULT_OPTIONS,
        showDelay: 100,
        hideDelay: 100,
        appearance: 'floating',
      } satisfies TuiHintOptions,
    },
  ],
};
