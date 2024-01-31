import { AfterContentInit, Directive, Input, TemplateRef } from '@angular/core';
import { NuverialTabsComponent } from '../../components/tabs';

@Directive({
  selector: '[nuverialTabKey]',
  standalone: true,
})
export class NuverialTabKeyDirective implements AfterContentInit {
  @Input() public nuverialTabKey!: string;

  constructor(private readonly _tabsComponent: NuverialTabsComponent, private readonly _templateRef: TemplateRef<unknown>) {}

  public ngAfterContentInit(): void {
    this._tabsComponent.addTemplate(this.nuverialTabKey, this._templateRef);
  }
}
