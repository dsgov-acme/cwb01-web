import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[nuverialCardContentType]',
  standalone: true,
})
export class NuverialCardContentDirective {
  @Input() public nuverialCardContentType: 'content' | 'footer' | 'image' | 'title' = 'content';

  @HostBinding('class') public get contentClass() {
    switch (this.nuverialCardContentType) {
      case 'content':
        return 'nuverial-card-content';
      case 'footer':
        return 'nuverial-card-footer';
      case 'image':
        return 'nuverial-card-image';
      case 'title':
        return 'nuverial-card-title';
    }
  }
}
