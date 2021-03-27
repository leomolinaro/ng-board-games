import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'barony-room-dialog',
  templateUrl: './barony-room-dialog.component.html',
  styleUrls: ['./barony-room-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaronyRoomDialogComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
