import { Component, OnInit } from "@angular/core";

@Component ({
  selector: "barony-actions",
  templateUrl: "./barony-actions.component.html",
  styleUrls: ["./barony-actions.component.scss"]
})
export class BaronyActionsComponent implements OnInit {

  constructor () { }

  actions = [
    { label: "Recruitment" },
    { label: "Movement" },
    { label: "Construction" },
    { label: "New city" },
    { label: "Expedition" },
    { label: "Noble title" }
  ];

  ngOnInit (): void {
  }

}
