import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DocumentApiRoutesService, ProcessorInfo } from '@dsg/shared/data-access/document-api';
import { NuverialCheckboxCardComponent, NuverialSelectComponent } from '@dsg/shared/ui/nuverial';
import { tap } from 'rxjs';
import { FormioBaseCustomComponent } from '../../base';
import { AttributeBaseProperties } from '../../base/formio/formio-attribute-base.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialSelectComponent, NuverialCheckboxCardComponent, FormsModule, ReactiveFormsModule],
  selector: 'dsg-formio-processor-checkbox-cards',
  standalone: true,
  styleUrls: ['./formio-processor-checkbox-cards.component.scss'],
  templateUrl: './formio-processor-checkbox-cards.component.html',
})
export class FormioProcessorCheckboxCardsComponent extends FormioBaseCustomComponent<string, AttributeBaseProperties> implements OnInit {
  public processors: ProcessorInfo[] = [];
  public formGroup = new FormGroup({});
  public selectedProcessors: string[] = [];

  public gotProcessors = false;

  constructor(private readonly _documentApiRoutesService: DocumentApiRoutesService, private readonly _changeDetectorRef: ChangeDetectorRef) {
    super();
  }

  public ngOnInit(): void {
    this._documentApiRoutesService
      .getDocumentProcessors$()
      .pipe(
        tap((processors: ProcessorInfo[]) => {
          this.processors = processors;

          if (this.value) {
            this.selectedProcessors = JSON.parse(this.value);
          }
          this.processors.forEach(processor => {
            this.formGroup.addControl(processor.id, new FormControl());
            if (this.selectedProcessors.includes(processor.id)) {
              (this.formGroup.controls as Record<string, AbstractControl>)[processor.id].setValue(true);
            }
          });

          this.gotProcessors = true;
          this.updateValue(this.value);
          this._changeDetectorRef.markForCheck();
          this._observeProcessorSelection();
        }),
      )
      .subscribe();
  }

  private _observeProcessorSelection() {
    this.formGroup.valueChanges
      .pipe(
        tap((value: Record<string, boolean>) => {
          this.selectedProcessors = Object.keys(value).filter(key => value[key] === true);
          this.updateValue(JSON.stringify(this.selectedProcessors));
          this._changeDetectorRef.markForCheck();
        }),
      )
      .subscribe();
  }

  public trackByFn(index: number): number {
    return index;
  }
}
