import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as DOMPurify from 'dompurify';

@Pipe({
  name: 'nuverialSafeHtml',
  standalone: true,
})
export class NuverialSafeHtmlPipe implements PipeTransform {
  constructor(private readonly _sanitizer: DomSanitizer) {}

  public transform(htmlString?: string): SafeHtml {
    const sanitizedContent = this.sanitizeHtml(htmlString);

    return this._sanitizer.bypassSecurityTrustHtml(sanitizedContent);
  }

  public sanitizeHtml(htmlString?: string): string {
    if (!htmlString) return '';

    return DOMPurify.sanitize(htmlString);
  }
}
