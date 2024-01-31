import { ChangeDetectorRef, Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged, ReplaySubject, switchMap, tap } from 'rxjs';
import { Capabilities } from '../../models/access-control.model';
import { AccessControlService } from '../../services/access-control.service';

/**
 * This directive provides an easy way to enable/disable features in your application
 * Use it like a *ngIf directive
 * ```html
 *    <a *dsgUnauthorized="'name-of-capability'">content</a>
 * ````
 */

@UntilDestroy()
@Directive({
  selector: '[dsgUnauthorized]',
})
export class UnauthorizedDirective implements OnInit {
  @Input('dsgUnauthorized')
  public set capability(key: Capabilities) {
    this._capability.next(key);
  }

  private readonly _capability = new ReplaySubject<Capabilities>(1);
  private _viewCreated = false;

  constructor(
    private readonly _accessControlService: AccessControlService,
    private readonly _templateRef: TemplateRef<unknown>,
    private readonly _viewContainer: ViewContainerRef,
    private readonly _changeDetectorRef: ChangeDetectorRef,
  ) {}

  public ngOnInit() {
    this._capability
      .pipe(
        distinctUntilChanged(),
        switchMap(key => this._accessControlService.isAuthorized$(key)),
        tap(isEnabled => this._updateView(isEnabled)),
        untilDestroyed(this),
      )
      .subscribe();
  }

  private _updateView(isEnabled: boolean) {
    if (isEnabled) {
      this._viewCreated = false;
      this._viewContainer.clear();
    } else if (!this._viewCreated) {
      this._viewCreated = true;
      this._viewContainer.createEmbeddedView(this._templateRef);

      this._changeDetectorRef.markForCheck();
    }
  }
}
