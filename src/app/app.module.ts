import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BgHomeComponent } from "./bg-home/bg-home.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularFireModule } from "@angular/fire";
import { environment } from "src/environments/environment";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { HttpClientModule } from "@angular/common/http";
import { BgUtilsModule } from "@bg-utils";

@NgModule ({
  declarations: [
    AppComponent,
    BgHomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp (environment.firebase),
    AngularFireDatabaseModule,
    BgUtilsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
