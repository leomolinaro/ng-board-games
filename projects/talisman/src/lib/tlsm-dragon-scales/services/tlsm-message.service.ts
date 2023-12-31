import { Component, Inject, Injectable } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Injectable()
export class TlsmMessageService {
  constructor(private dialog: MatDialog) {}

  public alert(message: string, tokenSource: string) {
    this.dialog.open(TlsmMessageDialog, {
      width: '400px',
      data: { message: message, tokenSource: tokenSource },
    });
  } // alert

  public confirm(
    message: string,
    tokenSource: string,
    confirm: string
  ): Observable<boolean> {
    let dialogRef = this.dialog.open(TlsmMessageDialog, {
      width: '400px',
      data: { message: message, tokenSource: tokenSource, confirm: confirm },
    });
    return dialogRef.afterClosed();
  } // alert
} // TlsmMessageService

@Component({
  selector: 'tlsm-message-dialog',
  templateUrl: 'tlsm-message-dialog.html',
})
export class TlsmMessageDialog {
  tokenSource: string;
  message: string;
  confirm: string;

  constructor(
    public dialogRef: MatDialogRef<TlsmMessageDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.tokenSource = data.tokenSource;
    this.message = data.message;
    this.confirm = data.confirm;
  } // constructor
} // TlsmMessageDialog
