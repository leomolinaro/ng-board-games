import { Routes } from "@angular/router";
import { BgRootGuard } from "@leobg/commons";
import { GAME_PATH } from "./app-games.service";

export const appRoutes: Routes = [
  { path: "", loadChildren: () => import("./app-home-page/app-home-page.module").then(m => m.AppHomePageModule) },
  {
    path: GAME_PATH.barony,
    canActivate: [BgRootGuard],
    loadChildren: () => import("@leobg/barony").then(m => m.BaronyModule)
  },
  {
    path: GAME_PATH.britannia,
    canActivate: [BgRootGuard],
    loadChildren: () => import("@leobg/britannia").then(m => m.BritModule)
  },
  { path: GAME_PATH.agotLcg2, loadChildren: () => import("@leobg/agot").then(m => m.AgotModule) },
  { path: GAME_PATH.talisman, loadChildren: () => import("@leobg/talisman").then(m => m.TlsmModule) },
  {
    path: GAME_PATH.wort,
    canActivate: [BgRootGuard],
    loadChildren: () => import("@leobg/wotr").then(m => m.WotrModule)
  },
  { path: "**", redirectTo: "", pathMatch: "full" }
];
