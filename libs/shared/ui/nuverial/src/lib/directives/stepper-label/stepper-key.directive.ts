import { AfterViewChecked, Directive, Input, TemplateRef } from '@angular/core';
import { NuverialStepperComponent } from '../../components/stepper';

@Directive({
  selector: '[nuverialStepperKey]',
  standalone: true,
})
export class NuverialStepperKeyDirective implements AfterViewChecked {
  @Input() public nuverialStepperKey!: string;

  constructor(private readonly _stepperComponent: NuverialStepperComponent, private readonly _templateRef: TemplateRef<unknown>) {}

  public ngAfterViewChecked(): void {
    this._stepperComponent.addTemplate(this.nuverialStepperKey, this._templateRef);
  }
}
