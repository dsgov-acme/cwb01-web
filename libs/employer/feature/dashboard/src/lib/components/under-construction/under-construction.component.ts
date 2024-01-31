import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dsg-under-construction',
  template: '<div>Under Construction</div>',
})
export class UnderConstructionComponent {}
