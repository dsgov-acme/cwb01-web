import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormioAppConfig } from '@formio/angular';

@NgModule({
  imports: [CommonModule],
  providers: [
    {
      provide: FormioAppConfig,
      useValue: {
        apiUrl: 'api',
        appUrl: '',
        projectId: '123',
      },
    },
  ],
})
export class FormBuilderModule {}
