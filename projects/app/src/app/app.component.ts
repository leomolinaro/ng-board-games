import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TUI_DARK_MODE, TuiRoot } from '@taiga-ui/core';

@Component({
  imports: [RouterOutlet, TuiRoot],
  selector: 'app-root',
  template: `
    <tui-root theme="dark">
      <router-outlet></router-outlet>
    </tui-root>
  `,
  styles: `
    tui-root {
      height: 100%;
      width: 100%;
    }
    .bg-app {
      min-height: 100%;
    }
  `,
})
export class AppComponent implements OnInit {
  title = 'app';
  protected readonly darkMode = inject(TUI_DARK_MODE);
  ngOnInit() {
    this.darkMode.set(true);
  }
}
