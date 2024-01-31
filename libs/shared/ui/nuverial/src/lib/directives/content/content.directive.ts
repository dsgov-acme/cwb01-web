/* istanbul ignore file */

import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[nuverialContentType]',
  standalone: true,
})
export class NuverialContentDirective {
  @Input() public nuverialContentType: 'content' | 'footer' | 'image' | 'title' | 'label' = 'content';

  @HostBinding('class') public get contentClass() {
    switch (this.nuverialContentType) {
      case 'content':
        return 'nuverial-content-content';
      case 'footer':
        return 'nuverial-content-footer';
      case 'image':
        return 'nuverial-content-image';
      case 'title':
        return 'nuverial-content-title';
      case 'label':
        return 'nuverial-content-label';
    }
  }
}
