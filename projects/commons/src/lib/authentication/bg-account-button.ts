import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ExhaustingEvent, UntilDestroy } from '@leobg/commons/utils';
import { TuiButton, TuiDataList, TuiDropdown } from '@taiga-ui/core';
import { switchMap } from 'rxjs/operators';
import { BgAuthService, BgUserLoginType } from './bg-auth.service';

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
@UntilDestroy
export class BgAccountButton implements OnInit, OnDestroy {
  private authService = inject(BgAuthService);
  private router = inject(Router);

  user$ = this.authService.getUser$();

  protected dropdownOpen = false;

  ngOnInit() {}
  ngOnDestroy() {}

  @ExhaustingEvent()
  onSignInClick(type: BgUserLoginType) {
    return this.authService.signIn$(type);
  }

  @ExhaustingEvent()
  onSignOutClick() {
    return this.authService
      .signOut$()
      .pipe(switchMap(() => this.router.navigate([''])));
  }

  @ExhaustingEvent()
  onDeleteAccountClick() {
    return this.authService
      .deleteUser$()
      .pipe(switchMap(() => this.router.navigate([''])));
  }
}
