import { CdkScrollable } from "@angular/cdk/scrolling";
import { NgIf } from "@angular/common";
import { Component, Injectable, inject } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { Observable } from "rxjs";

@Injectable ()
export class TlsmMessageService {
  private dialog = inject (MatDialog);


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
  
  dialogRef = inject<MatDialogRef<TlsmMessageDialog>> (MatDialogRef);
  data = inject (MAT_DIALOG_DATA);

  tokenSource: string;
  message: string;
  confirm: string;

  constructor () {
    const data = this.data;

    this.tokenSource = data.tokenSource;
    this.message = data.message;
    this.confirm = data.confirm;
  } // constructor
  
} // TlsmMessageDialog
