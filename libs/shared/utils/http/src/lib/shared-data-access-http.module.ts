import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpBaseService } from './services/http-base.service';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: [HttpBaseService],
})
export class SharedDataAccessHttpModule {}
