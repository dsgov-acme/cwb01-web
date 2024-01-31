import { MatRadioModule } from '@angular/material/radio';
import { fireEvent, render, screen } from '@testing-library/angular';
import { MockBuilder } from 'ng-mocks';
import { NuverialRadioButtonComponent } from './radio-button.component';

describe('NuverialRadioButtonComponent', () => {
  const dependencies = MockBuilder(NuverialRadioButtonComponent).keep(MatRadioModule).build();

  const getFixture = async (props: Record<string, Record<string, any>>) => {
    const { fixture } = await render(NuverialRadioButtonComponent, {
      ...dependencies,
      ...props,
    });

    return { fixture, radio: screen.getByRole('radio') };
  };

  it('can define a default radio component', async () => {
    const { fixture, radio } = await getFixture({});

    expect(fixture).toBeTruthy();
    expect(radio).toBeTruthy();
    expect(fixture.componentInstance.checked).toEqual(false);
  });

  it('can set checked to be true', async () => {
    const { radio } = await getFixture({ componentProperties: { checked: true } });

    expect((radio as HTMLInputElement).checked).toEqual(true);
  });

  it('can emit radio button click event component', async () => {
    let emitted = false;
    const { radio, fixture } = await getFixture({});

    fixture.componentInstance.click.subscribe(() => (emitted = true));
    fireEvent.click(radio);
    expect(emitted).toEqual(true);
  });
});
