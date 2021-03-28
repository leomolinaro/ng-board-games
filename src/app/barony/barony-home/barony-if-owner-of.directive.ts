import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";
import { BgAuthService } from "@bg-services";
import { BaronyGameDoc } from "../barony-remote.service";

@Directive ({
  selector: "[bIfOwnerOf]"
})
export class BaronyIfOwnerOfDirective {

  constructor (
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: BgAuthService
  ) { }

  private hasView = false;
  @Input () set bIfOwnerOf (gameDoc: BaronyGameDoc) {
    const condition = gameDoc.owner.id === this.authService.getUser ().id;
    if (condition && !this.hasView) {
      this.viewContainer.createEmbeddedView (this.templateRef);
      this.hasView = true;
    } else if (!condition && this.hasView) {
      this.viewContainer.clear ();
      this.hasView = false;
    } // if - else
  } // bIfOwnerOf

} // BaronyIfOwnerOfDirective
