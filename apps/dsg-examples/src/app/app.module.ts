import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExampleSidebarComponent } from '@dsg/dsg-examples/feature-shell';
import { SharedUtilsLoggingModule } from '@dsg/shared/utils/logging';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    MatNativeDateModule,
    MatSnackBarModule,
    AppRoutingModule,
    ExampleSidebarComponent,
    SharedUtilsLoggingModule.useConsoleLoggingAdapter(),
  ],
})
export class AppModule {}
