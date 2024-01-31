import { Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { FormBuilderComponent } from '@formio/angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CanDeactivateFormBuilderContract<T extends { formioComponent: FormBuilderComponent | undefined }> {
  public canDeactivate(component: T): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (component.formioComponent?.formio?.dialog) {
      component.formioComponent.formio.dialog.close();
    }

    return true;
  }
}

/**
 * Use it like a canDeactivate guard
 * ```
 *    {
        canDeactivate: [CanDeactivateFormBuilderGuard],
        ...
      },
 * ````
 */
export const CanDeactivateFormBuilder = <T extends { formioComponent: FormBuilderComponent | undefined }>(component: T) => {
  return new CanDeactivateFormBuilderContract<T>().canDeactivate(component);
};
