import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NuverialButtonComponent, NuverialSnackBarService, NuverialSnackBarType } from '@dsg/shared/ui/nuverial';
import { tap } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NuverialButtonComponent],
  selector: 'dsg-examples-divider',
  standalone: true,
  styleUrls: ['./snackbar.component.scss'],
  templateUrl: './snackbar.component.html',
})
export class ExampleSnackBarComponent {
  constructor(public nuverialSnackBarService: NuverialSnackBarService) {}

  public onClickOpenSnackbar(type: NuverialSnackBarType) {
    this.nuverialSnackBarService
      .openConfigured({
        dismissible: true,
        message: 'Default sub message',
        title: 'Title Message',
        type,
      })
      .closed()
      .subscribe();
  }

  public onClickOpenSnackbarActions(type: NuverialSnackBarType, withDuration: boolean) {
    this.nuverialSnackBarService
      .openConfigured({
        dismissible: false,
        ...(withDuration ? { duration: 5000 } : null),
        message:
          'Lorem Ipsum dolor sit amet consectetur adipiscing elit Lorem Ipsum dolor sit amet consectetur adipiscing elit Lorem Ipsum dolor sit amet consectetur adipiscing elit ',
        nuverialActions: [
          {
            ariaLabel: 'label',
            buttonStyle: 'outlined',
            colorTheme: 'primary',
            context: 'action1',
            label: 'action 1',
          },
          {
            ariaLabel: 'label',
            buttonStyle: 'filled',
            colorTheme: 'primary',
            context: 'action2',
            label: 'action button 2',
            uppercaseText: true,
          },
        ],
        title: 'Title Message',
        type,
      })
      .action()
      .pipe(
        tap(action => {
          switch (action) {
            case 'action1':
              // logic for action1
              // console.log('action1 triggered');
              break;
            case 'action2':
              // logic for action2
              // console.log('action2 triggered');
              break;
          }
        }),
      )
      .subscribe();
  }
}
