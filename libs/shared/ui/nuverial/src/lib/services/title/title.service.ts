import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  private readonly _portalTitle: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private readonly _htmlTitle: BehaviorSubject<string> = new BehaviorSubject<string>('');

  /**
   * The name of the portal, set initially to the <title> in index.html
   */
  public portalTitle$ = this._portalTitle.asObservable();

  constructor(private readonly _ngTitleService: Title) {
    const defaultTitle = this._ngTitleService.getTitle();
    this._portalTitle.next(defaultTitle);
    this._htmlTitle.next(defaultTitle);
  }

  /**
   * Set the HTML <title> tag
   * @param title The title to set
   * @param includePortalTitle Whether to include the portal title in the <title> tag
   */
  public setHtmlTitle(title: string, includePortalTitle?: boolean): void {
    let htmlTitle = title;
    if (includePortalTitle) {
      htmlTitle = `${this._portalTitle.value} - ${title}`;
    }
    this._ngTitleService.setTitle(htmlTitle);
    this._htmlTitle.next(htmlTitle);
  }

  /**
   * Reset the <title> tag back to the original index.html title
   */
  public resetHtmlTitle(): void {
    this._ngTitleService.setTitle(this._portalTitle.value);
    this._htmlTitle.next(this._portalTitle.value);
  }
}
