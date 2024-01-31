import { render, screen } from '@testing-library/angular';
import { AngularSplitModule } from 'angular-split';
import { MockBuilder } from 'ng-mocks';
import { NuverialSplitAreaComponent } from './split-area.component';

describe('NuverialSplitAreaComponent', () => {
  const dependencies = MockBuilder(NuverialSplitAreaComponent).keep(AngularSplitModule).build();

  const getFixture = async (props: Record<string, Record<string, any>>) => {
    const { fixture } = await render(NuverialSplitAreaComponent, {
      ...dependencies,
      ...props,
    });

    return { fixture, splitArea: screen.getByTestId('as-split') };
  };

  it('can define a default split area component', async () => {
    const { fixture, splitArea } = await getFixture({});

    expect(fixture).toBeTruthy();
    expect(splitArea).toBeTruthy();
    expect(fixture.componentInstance.area2InitialSize).toEqual(800);
    expect(fixture.componentInstance.area2MinWidth).toEqual(150);
  });

  it('can set area2InitialSize to be a number', async () => {
    const { fixture } = await getFixture({ componentProperties: { area2InitialSize: 1000 } });

    expect(fixture.componentInstance.area2InitialSize).toEqual(1000);
    expect(fixture.componentInstance.splitAreaSizes.area2).toEqual(1000);
  });

  it('can set area2MinWidth to be a number', async () => {
    const { fixture } = await getFixture({ componentProperties: { area2MinWidth: 1000 } });

    expect(fixture.componentInstance.area2MinWidth).toEqual(1000);
  });

  it('should drag the split area when the gutter is dragged', async () => {
    const { fixture, splitArea } = await getFixture({});
    const gutter = splitArea.querySelector('.as-split-gutter') as HTMLElement;
    const spy = jest.spyOn(fixture.componentInstance.splitDragging, 'emit');
    const event = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    gutter.dispatchEvent(event);
    const dragEvent = new MouseEvent('mousemove', { clientX: 100, clientY: 0 });
    document.dispatchEvent(dragEvent);
    const releaseEvent = new MouseEvent('mouseup');
    document.dispatchEvent(releaseEvent);

    expect(spy).toHaveBeenCalled();
  });

  it('should set the width of area2', async () => {
    const { fixture } = await getFixture({});
    const width = 500;

    fixture.componentInstance.setArea2Width(width);

    expect(fixture.componentInstance.splitAreaSizes.area2).toEqual(width);
  });
});
