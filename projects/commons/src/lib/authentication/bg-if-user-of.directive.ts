import { Directive, Input, TemplateRef, ViewContainerRef, inject } from "@angular/core";
import { BgAuthService, BgUser } from "./bg-auth.service";

@Directive({ selector: "[bgIfUser]" })
export class BgIfUserDirective {
  private templateRef = inject<TemplateRef<any>>(TemplateRef);
  private viewContainer = inject(ViewContainerRef);
  private authService = inject(BgAuthService);

  private hasView = false;
  @Input() set bgIfUser(expectedUser: BgUser) {
    const condition = expectedUser.id === this.authService.getUser().id;
    if (condition && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!condition && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
