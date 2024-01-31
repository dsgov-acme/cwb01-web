import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AlertModalComponent, IFormError } from '@dsg/shared/ui/nuverial';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FormlyModule } from '@ngx-formly/core';
import { Observable, take, tap } from 'rxjs';
import { FormRendererService } from '../../../../services';
import { FormlyBaseComponent } from '../../../base';
import { LogicValidatorProperties } from '../models/formly-logic-validator.model';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormlyModule],
  selector: 'dsg-formly-logic-validator',
  standalone: true,
  template: '',
})
export class FormlyLogicValidatorComponent extends FormlyBaseComponent<LogicValidatorProperties> implements OnInit {
  public formErrors$: Observable<IFormError[]> = this._formRendererService.formErrors$;
  private _isModalOpen = false;

  constructor(private readonly _formRendererService: FormRendererService, private readonly _dialog: MatDialog) {
    super();
  }

  public ngOnInit(): void {
    this.field.className = 'formly-field-hide';

    this.formErrors$
      .pipe(
        tap(errors => {
          if (!this._isModalOpen && errors.some(item => item.controlName === this.field.key)) {
            this._isModalOpen = true;
            this._openModal();
          }
        }),
        untilDestroyed(this),
      )
      .subscribe();
  }

  private _openModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.data = {
      body: this.props.modalBody,
      dismissalButtonLabel: this.props.dismissalButtonLabel,
      icon: this.props.modalIcon,
      title: this.props.modalTitle,
    };

    this._dialog
      .open(AlertModalComponent, dialogConfig)
      .afterClosed()
      .pipe(
        tap(_ => {
          this._isModalOpen = false;
        }),
        take(1),
      )
      .subscribe();
  }
}
