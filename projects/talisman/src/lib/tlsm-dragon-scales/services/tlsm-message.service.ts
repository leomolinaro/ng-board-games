import { Component, Inject, Injectable } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { CdkScrollable } from "@angular/cdk/scrolling";
import { NgIf } from "@angular/common";
import { MatButton } from "@angular/material/button";

@Injectable ()
export class TlsmMessageService {
  constructor (private dialog: MatDialog) {}

  public alert (message: string, tokenSource: string) {
    this.dialog.open (TlsmMessageDialog, {
      width: "400px",
      data: { message: message, tokenSource: tokenSource },
    });
  } // alert

  public confirm (
    message: string,
    tokenSource: string,
    confirm: string
  ): Observable<boolean> {
    const dialogRef = this.dialog.open (TlsmMessageDialog, {
      width: "400px",
      data: { message: message, tokenSource: tokenSource, confirm: confirm },
    });
    return dialogRef.afterClosed ();
  } // alert
} // TlsmMessageService

@Component ({
  selector: "tlsm-message-dialog",
  templateUrl: "tlsm-message-dialog.html",
  imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatDialogActions, NgIf, MatButton, MatDialogClose]
})
export class TlsmMessageDialog {
  tokenSource: string;
  message: string;
  confirm: string;

  constructor (
    public dialogRef: MatDialogRef<TlsmMessageDialog>,
    @Inject (MAT_DIALOG_DATA) public data: any
  ) {
    this.tokenSource = data.tokenSource;
    this.message = data.message;
    this.confirm = data.confirm;
  } // constructor
} // TlsmMessageDialog
