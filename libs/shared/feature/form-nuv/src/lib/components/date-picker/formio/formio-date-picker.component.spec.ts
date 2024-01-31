import { render } from '@testing-library/angular';
import { MatNativeDateModule } from '@angular/material/core';
import { FormioDatePickerComponent } from './formio-date-picker.component';

const getFixture = async (props?: Record<string, unknown>) => {
  const { fixture } = await render(FormioDatePickerComponent, {
    ...props,
    imports: [MatNativeDateModule],
  });

  return { fixture };
};

describe('FormioDatePickerComponent', () => {
  it('should create', async () => {
    const { fixture } = await getFixture();

    expect(fixture).toBeTruthy();
  });
});
