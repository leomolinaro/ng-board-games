import { AsyncPipe, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from "@angular/core";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatDivider } from "@angular/material/divider";
import { MatIcon } from "@angular/material/icon";
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";
import { Router } from "@angular/router";
import { ExhaustingEvent, UntilDestroy } from "@leobg/commons/utils";
import { switchMap } from "rxjs/operators";
import { BgAuthService, BgUserLoginType } from "./bg-auth.service";

@Component ({
  selector: "bg-account-button",
  template: `
    <ng-container *ngIf="user$ | async as user; else signInTemplate">
      <button
        class="bg-account-button"
        mat-icon-button
        [matMenuTriggerFor]="accountMenu">
        <mat-icon>account_circle</mat-icon>
      </button>
      <mat-menu #accountMenu="matMenu">
        <div class="bg-account-menu">
          <div class="bg-account-signed-in mat-typography">
            <div class="mat-body">Signed in as</div>
            <strong class="mat-body-strong">{{ user!.displayName }}</strong>
          </div>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="onSignOutClick()">Sign out</button>
          <mat-divider></mat-divider>
          <button mat-menu-item color="warn" (click)="onDeleteAccountClick()">
            Delete account
          </button>
        </div>
      </mat-menu>
    </ng-container>
    <ng-template #signInTemplate>
      <button class="bg-sign-in-button" mat-button [matMenuTriggerFor]="signInMenu">
        Sign in
      </button>
      <mat-menu #signInMenu="matMenu">
        <button mat-menu-item (click)="onSignInClick('guest')">
          Sign in as guest
        </button>
        <button mat-menu-item (click)="onSignInClick('google')">
          Sign in with Google
        </button>
      </mat-menu>
    </ng-template>
  `,
  styles: [`
    :host {
      margin-left: auto;
    }

    .bg-account-signed-in {
      padding: 16px;
    }

    .bg-account-menu {
      min-width: 180px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, MatIconButton, MatMenuTrigger, MatIcon, MatMenu, MatDivider, MatMenuItem, MatButton, AsyncPipe]
})
@UntilDestroy
export class BgAccountButtonComponent implements OnInit, OnDestroy {
  
  private authService = inject (BgAuthService);
  private router = inject (Router);

  user$ = this.authService.getUser$ ();

  ngOnInit () {}
  ngOnDestroy () {}

  @ExhaustingEvent ()
  onSignInClick (type: BgUserLoginType) {
    return this.authService.signIn$ (type);
  } // onSignInClick

  @ExhaustingEvent ()
  onSignOutClick () {
    return this.authService
      .signOut$ ()
      .pipe (switchMap (() => this.router.navigate ([""])));
  } // onSignOutClick

  @ExhaustingEvent ()
  onDeleteAccountClick () {
    return this.authService
      .deleteUser$ ()
      .pipe (switchMap (() => this.router.navigate ([""])));
  } // onDeleteAccountClick
} // BgAccountButtonComponent
