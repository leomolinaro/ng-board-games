import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { BgAccountButtonComponent } from "./bg-account-button.component";
import { BgIfUserDirective } from "./bg-if-user-of.directive";
import { BgIfUserPipe } from "./bg-if-user.pipe";

@NgModule ({
  declarations: [BgAccountButtonComponent, BgIfUserDirective, BgIfUserPipe],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
  ],
  exports: [BgAccountButtonComponent, BgIfUserDirective, BgIfUserPipe],
})
export class BgAuthModule {}
