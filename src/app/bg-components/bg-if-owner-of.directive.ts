import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";
import { BgAuthService, BgUser } from "@bg-services";

@Directive ({
  selector: "[bgIfUser]"
})
export class BgIfUserDirective {

  constructor (
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: BgAuthService
  ) { }

  private hasView = false;
  @Input () set bgIfUser (expectedUser: BgUser) {
    const condition = expectedUser.id === this.authService.getUser ().id;
    if (condition && !this.hasView) {
      this.viewContainer.createEmbeddedView (this.templateRef);
      this.hasView = true;
    } else if (!condition && this.hasView) {
      this.viewContainer.clear ();
      this.hasView = false;
    } // if - else
  } // bgIfUser

} // BgIfUserDirective
