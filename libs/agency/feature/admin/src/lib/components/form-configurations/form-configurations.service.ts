import { Injectable } from '@angular/core';
import { IForm, WorkApiRoutesService } from '@dsg/shared/data-access/work-api';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormConfigurationService {
  private readonly _formConfigurationList = new BehaviorSubject<IForm[]>([]);

  constructor(private readonly _workApiRoutesService: WorkApiRoutesService) {}

  public formConfigurationsList$: Observable<IForm[]> = this._formConfigurationList.asObservable();

  public getFormConfigurations$(transactionDefinitionKey: string): Observable<IForm[]> {
    return this._workApiRoutesService.getFormConfigurations$(transactionDefinitionKey).pipe(
      tap(forms => {
        this._formConfigurationList.next(forms);
      }),
    );
  }

  public notifyNewFormConfig(formConfig: IForm) {
    this._formConfigurationList.next([...this._formConfigurationList.value, formConfig]);
  }
}
