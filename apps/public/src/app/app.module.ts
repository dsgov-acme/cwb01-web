import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PublicShellModule } from '@dsg/public/shell';
import { SharedFeatureAuthenticationModule } from '@dsg/shared/feature/authentication';
import { AccessControlModule } from '@dsg/shared/utils/access-control';
import { SharedUtilsEnvironmentModule } from '@dsg/shared/utils/environment';
import { FeatureFlagModule } from '@dsg/shared/utils/feature-flagging';
import { SharedUtilsLoggingModule } from '@dsg/shared/utils/logging';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSnackBarModule,
    PublicShellModule,
    SharedUtilsEnvironmentModule.forRoot(environment),
    SharedUtilsLoggingModule.useConsoleLoggingAdapter(),
    SharedFeatureAuthenticationModule.useFirebaseAuthenticationAdapter(environment),
    AngularFireModule.initializeApp(environment.authenticationConfiguration.firebaseConfiguration.firebase),
    FeatureFlagModule.useEnvironmentAdapter(),
    AccessControlModule.forRoot(),
  ],
})
export class AppModule {}
