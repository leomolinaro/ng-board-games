import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { BgAccountButtonComponent } from "./bg-account-button/bg-account-button.component";
import { BgIfUserDirective } from "./bg-if-user-of.directive";

@NgModule ({
  declarations: [
    BgAccountButtonComponent,
    BgIfUserDirective
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule
  ],
  exports: [
    BgAccountButtonComponent,
    BgIfUserDirective
  ]
})
export class BgAuthModule { }
