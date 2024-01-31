import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Renderer2, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NuverialTextInputComponent } from '../../components';
import { NuverialTrimInputDirective } from './trim-input.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NuverialTrimInputDirective],
  selector: 'nuverial-test-trim',
  template: ` <nuverial-text-input [formControl]="control" nuverialTrimInput></nuverial-text-input> `,
})
class TestComponent {
  public control = new FormControl('');
  @ViewChild(NuverialTextInputComponent, { static: true }) public textInputComponent!: NuverialTextInputComponent;
}

describe('NuverialTrimInputDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputElement: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [FormsModule, ReactiveFormsModule, NuverialTextInputComponent, NuverialTrimInputDirective, NoopAnimationsModule],
      providers: [Renderer2],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
  it('should trim input value on focusout', () => {
    inputElement.value = '  test value  ';
    inputElement.dispatchEvent(new Event('input'));
    inputElement.dispatchEvent(new Event('focusout'));
    fixture.detectChanges();

    expect(component.control.value).toBe('test value');
  });
});
