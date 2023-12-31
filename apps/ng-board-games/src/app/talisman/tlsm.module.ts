import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Routes } from '@angular/router';
import { BgUtilsModule } from '@bg-utils';
import {
  TlsmMessageDialog,
  TlsmMessageService,
} from './tlsm-dragon-scales/services/tlsm-message.service';
import { TlsmDragonCardComponent } from './tlsm-dragon-scales/tlsm-dragon-card/tlsm-dragon-card.component';
import { TlsmDragonScalesComponent } from './tlsm-dragon-scales/tlsm-dragon-scales.component';

const routes: Routes = [
  { path: '', component: TlsmDragonScalesComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    TlsmDragonScalesComponent,
    TlsmMessageDialog,
    TlsmDragonCardComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatToolbarModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatGridListModule,
    BgUtilsModule,
  ],
  providers: [TlsmMessageService],
})
export class TlsmModule {}
