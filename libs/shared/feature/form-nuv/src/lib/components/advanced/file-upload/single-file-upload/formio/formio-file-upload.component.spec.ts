import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormioFileUploadComponent } from './formio-file-upload.component';

describe('FormioFileUploadComponent', () => {
  let component: FormioFileUploadComponent;
  let fixture: ComponentFixture<FormioFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormioFileUploadComponent, NoopAnimationsModule],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(FormioFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('fullWidth', () => {
    it('should return true when multiple is true and there is only one component', () => {
      component.props = { multiple: true };
      component.components = [{}];

      expect(component.fullWidth).toBeTruthy();
    });

    it('should return true when multiple is false and there are multiple components', () => {
      component.props = { multiple: false };
      component.components = [{}, {}];

      expect(component.fullWidth).toBeTruthy();
    });

    it('should return false when multiple is false and there is only one component', () => {
      component.props = { multiple: false };
      component.components = [{}];

      expect(component.fullWidth).toBeFalsy();
    });
  });

  describe('multiple', () => {
    it('should return true if props.multiple is true', () => {
      component.props = { multiple: true };

      expect(component.multiple).toBeTruthy();
    });
  });
});
