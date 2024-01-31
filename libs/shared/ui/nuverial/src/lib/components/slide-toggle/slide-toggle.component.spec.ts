import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { render, screen } from '@testing-library/angular';
import { MockBuilder } from 'ng-mocks';
import { NuverialSlideToggleComponent } from './slide-toggle.component';

describe('SlideToggleComponent', () => {
  const dependencies = MockBuilder(NuverialSlideToggleComponent).keep(MatSlideToggleModule).build();

  const getFixture = async (props: Record<string, Record<string, any>>) => {
    const { fixture } = await render(NuverialSlideToggleComponent, {
      ...dependencies,
      ...props,
    });

    return { fixture, slideToggle: screen.getByRole('switch') };
  };

  it('can define a default slideToggle component', async () => {
    const { fixture, slideToggle } = await getFixture({});

    expect(fixture).toBeTruthy();
    expect(slideToggle).toBeTruthy();
    expect(fixture.componentInstance.checked).toEqual(false);
  });

  it('can set checked to be true', async () => {
    const { fixture } = await getFixture({ componentProperties: { checked: true } });
    const slideToggleComponent = fixture.componentInstance;

    expect(slideToggleComponent.checked).toEqual(true);
  });

  it('should toggle checked and emit change event on onChange', async () => {
    const { fixture } = await getFixture({ componentProperties: { checked: true } });
    const slideToggleComponent = fixture.componentInstance;
    const spy = jest.spyOn(slideToggleComponent.change, 'emit');

    slideToggleComponent.checked = false;
    slideToggleComponent.onChange();
    expect(slideToggleComponent.checked).toBe(true);
    expect(spy).toHaveBeenCalled();
  });
});
