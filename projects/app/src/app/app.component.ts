import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component ({
  imports: [RouterOutlet],
  selector: "app-root",
  template: `
    <div class="bg-app mat-typography mat-app-background">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: `
    .bg-app {
      min-height: 100%;
    }
  `
})
export class AppComponent {
  title = "app";
}
