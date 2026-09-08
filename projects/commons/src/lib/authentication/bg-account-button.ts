import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TuiButton, TuiDataList, TuiDropdown } from '@taiga-ui/core';
import { switchMap } from 'rxjs/operators';
import type { BgUserLoginType } from './bg-auth.service';
import { BgAuthService } from './bg-auth.service';

@Component({
  selector: 'bg-account-button',
  imports: [TuiButton, TuiDropdown, AsyncPipe, TuiDataList],
  template: `
    @if (user$ | async; as user) {
      <button
        tuiIconButton
        appearance="secondary-grayscale"
        iconStart="@tui.circle-user"
        [tuiDropdown]="dropdownContent"
        [(tuiDropdownOpen)]="dropdownOpen"
      ></button>
      <ng-template #dropdownContent>
        <tui-data-list>
          <header>
            <div>Signed in as</div>
            <strong>{{ user.displayName }}</strong>
          </header>
          <hr />
          <button
            tuiOption
            appearance="flat"
            type="button"
            (click)="onSignOutClick()"
          >
            Sign out
          </button>
          <button
            tuiOption
            appearance="flat"
            type="button"
            (click)="onDeleteAccountClick()"
          >
            Delete account
          </button>
        </tui-data-list>
      </ng-template>
    } @else {
      <button
        tuiButton
        appearance="secondary"
        [tuiDropdown]="dropdownContent"
        [(tuiDropdownOpen)]="dropdownOpen"
      >
        Sign in
      </button>
      <ng-template #dropdownContent>
        <tui-data-list>
          <button
            tuiOption
            appearance="flat"
            type="button"
            (click)="onSignInClick('guest')"
          >
            Sign in as guest
          </button>
          <button
            tuiOption
            appearance="flat"
            type="button"
            (click)="onSignInClick('google')"
          >
            Sign in with Google
          </button>
        </tui-data-list>
      </ng-template>
    }
  `,
  styles: [
    `
      tui-data-list header {
        padding: 0.5rem;
      }
    `,
  ],
})
export class BgAccountButton {
  private authService = inject(BgAuthService);
  private router = inject(Router);

  user$ = this.authService.getUser$();

  protected dropdownOpen = false;

  onSignInClick(type: BgUserLoginType) {
    this.authService.signIn$(type).subscribe();
  }

  onSignOutClick() {
    this.authService
      .signOut$()
      .pipe(switchMap(() => this.router.navigate([''])))
      .subscribe();
  }

  onDeleteAccountClick() {
    this.authService
      .deleteUser$()
      .pipe(switchMap(() => this.router.navigate([''])))
      .subscribe();
  }
}
