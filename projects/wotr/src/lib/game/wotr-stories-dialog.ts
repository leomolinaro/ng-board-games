import { JsonPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  viewChild
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { getStoryId } from "../../../../commons/src";
import { WotrAssetsStore } from "../assets/wotr-assets-store";
import { WotrRemoteService } from "../remote/wotr-remote";

export type WotrStoriesDialogRef = MatDialogRef<WotrStoriesDialog, void>;
export interface WotrStoriesDialogData {
  gameId: string;
}
@Component({
  selector: "wotr-region-dialog",
  imports: [JsonPipe],
  template: `
    <div
      class="box"
      role="region"
      aria-label="Demo panel with toolbar and scrollable content">
      @let s = stories();
      <div class="toolbar">
        <div class="title">Edit stories</div>
        <button
          class="btn"
          type="button"
          (click)="delete()">
          Delete
        </button>
        <button
          class="btn"
          type="button"
          (click)="reload()">
          Reload
        </button>
      </div>
      <div
        class="content"
        #content>
        @for (story of s; track story.time + "." + story.playerId) {
          <p>{{ story | json }}</p>
        }
      </div>
    </div>
  `,
  styles: [
    `
      @use "wotr-variables" as wotr;

      .box {
        width: var(--box-width);
        height: var(--box-height);
        background: #151515;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        box-shadow:
          0 10px 30px rgba(0, 0, 0, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.06);
        color: #e5e7eb; /* slate-200 */

        /* Layout */
        display: flex;
        flex-direction: column;
        overflow: hidden; /* clip toolbar radius */
      }

      .toolbar {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        // background: #151515;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }

      .title {
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0.2px;
        color: #f3f4f6; /* slate-100 */
        margin-right: auto; /* push controls to the right */
      }

      .btn {
        appearance: none;
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: rgba(255, 255, 255, 0.06);
        color: #e5e7eb;
        padding: 6px 10px;
        font-size: 12px;
        border-radius: 10px;
        cursor: pointer;
        transition:
          transform 120ms ease,
          background 120ms ease,
          border-color 120ms ease;
      }
      .btn:hover {
        background: rgba(255, 255, 255, 0.12);
        border-color: rgba(255, 255, 255, 0.2);
      }
      .btn:active {
        transform: translateY(1px);
      }

      .content {
        flex: 1 1 auto;
        overflow: auto; /* make inner content scroll */
        padding: 14px;
        line-height: 1.5;
        scrollbar-gutter: stable both-edges; /* keeps layout stable during scroll */
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WotrStoriesDialog {
  protected data = inject<WotrStoriesDialogData>(MAT_DIALOG_DATA);
  private assets = inject(WotrAssetsStore);
  private dialogRef: WotrStoriesDialogRef = inject(MatDialogRef);

  private remote = inject(WotrRemoteService);
  protected content = viewChild<ElementRef<HTMLDivElement>>("content");

  private scrollToBottom = effect(() => {
    this.stories();
    setTimeout(() => {
      const content = this.content();
      if (!content) return;
      content.nativeElement.scrollTop = content.nativeElement.scrollHeight;
    });
  });

  protected stories = toSignal(this.remote.selectStories$(this.data.gameId));

  delete() {
    const lastStory = this.stories()!.slice(-1)[0];
    if (lastStory) {
      this.remote
        .deleteStory$(getStoryId(lastStory.time, lastStory.playerId), this.data.gameId)
        .subscribe();
    }
  }

  reload() {
    location.reload();
  }
}
