import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { render } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { MockBuilder, MockService, ngMocks } from 'ng-mocks';
import { Subject } from 'rxjs';
import { CardTypes } from '../../directives';
import { NuverialCheckboxCardComponent } from '../checkbox-card';
import { NuverialIconComponent } from '../icon';
import { NuverialRadioCardComponent } from '../radio-card';
import { NuverialCardGroupComponent } from './card-group.component';

const focusEvents = new Subject<FocusOrigin | null>();
const focusMonitor = MockService(FocusMonitor, {
  monitor: _ => focusEvents.asObservable(),
});

const dependencies = MockBuilder(NuverialCardGroupComponent)
  .keep(CommonModule)
  .keep(MatCheckboxModule)
  .keep(MatRadioModule)
  .keep(MatFormFieldModule)
  .keep(FormsModule)
  .keep(ReactiveFormsModule)
  .keep(NuverialCheckboxCardComponent)
  .keep(NuverialIconComponent)
  .mock(NuverialRadioCardComponent)
  .mock(FocusMonitor, focusMonitor)
  .build();

const getFixture = async (props: Record<string, Record<string, string>>) => {
  const { fixture } = await render(NuverialCardGroupComponent, {
    ...dependencies,
    ...props,
  });

  return { fixture };
};

const cardChangeEvent = (type: CardTypes, id: string, pointValue: number) => {
  const mockComponent = ngMocks.find<NuverialRadioCardComponent>(`.card-${id}`).componentInstance;
  mockComponent.cardType = type;
  mockComponent.inputId = id;
  mockComponent.change.emit({ checked: true, pointValue, value: `card-${id}` });
};

describe('CardGroupComponent', () => {
  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { fixture } = await getFixture({});
      fixture.detectChanges();
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });
  });

  it('can create card-group component default', async () => {
    const { fixture } = await getFixture({});
    const component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.formControl).toBeFalsy();
    expect(component.maxPoints).toEqual(0);
    expect(component.minPoints).toEqual(0);
  });

  it('can create card-group component with params', async () => {
    const template = `<nuverial-card-group
            [formControl]="formControl"
            [maxPoints]="maxPoints"
            [minPoints]="minPoints">
        </nuverial-card-group>`;
    const fixture = await render(template, {
      ...dependencies,
      componentProperties: {
        formControl: new FormControl(false, [Validators.required]),
        maxPoints: 20,
        minPoints: 10,
      },
    });
    const component = fixture.fixture.componentInstance;

    expect((component as NuverialCardGroupComponent).formControl).toBeTruthy();
    expect((component as NuverialCardGroupComponent).maxPoints).toEqual(20);
    expect((component as NuverialCardGroupComponent).minPoints).toEqual(10);
  });

  it('can create card-group component with radio cards', async () => {
    const template = `<nuverial-card-group
            [formControl]="formControl"
            [maxPoints]="maxPoints"
            [minPoints]="minPoints"
            (change)="onChange($event)"
            (changeCard)="onChangeCard($event)"
            (changePoints)="onChangePoints($event)"
            (validationErrors)="onValidationErrors($event)">
          <nuverial-radio-card class="card-1" value="card-1" [pointValue]="1"></nuverial-radio-card>
          <nuverial-radio-card class="card-2" value="card-2" [pointValue]="1"></nuverial-radio-card>
        </nuverial-card-group>`;

    const changeSpy = jest.fn();
    const changeCardSpy = jest.fn();
    const changePointsSpy = jest.fn();
    const errorsSpy = jest.fn();
    const fixture = await render(template, {
      ...dependencies,
      componentProperties: {
        formControl: new FormControl(false, [Validators.required]),
        maxPoints: 1,
        minPoints: 1,
        onChange: changeSpy,
        onChangeCard: changeCardSpy,
        onChangePoints: changePointsSpy,
        onValidationErrors: errorsSpy,
      },
    });

    cardChangeEvent('radio', '1', 1);
    cardChangeEvent('radio', '2', 1);
    focusEvents.next(null);

    fixture.detectChanges();
    expect(changeSpy).toHaveBeenLastCalledWith(
      expect.arrayContaining([
        { checked: false, pointValue: 1, value: 'card-1' },
        { checked: true, pointValue: 1, value: 'card-2' },
      ]),
    );

    expect((fixture.fixture.componentInstance as NuverialCardGroupComponent).formControl.value).toEqual('card-2');

    expect(changeCardSpy).toHaveBeenLastCalledWith({ checked: true, pointValue: 1, value: 'card-2' });
    expect(changePointsSpy).toHaveBeenLastCalledWith({ currentPoints: 1, maxPoints: 1, minPoints: 1 });
    expect(errorsSpy).toBeCalledTimes(0);
  });

  it('can create card-group component with checkbox cards', async () => {
    const template = `<nuverial-card-group
            [formControl]="formControl"
            [maxPoints]="maxPoints"
            [minPoints]="minPoints"
            (change)="onChange($event)"
            (changeCard)="onChangeCard($event)"
            (changePoints)="onChangePoints($event)"
            (validationErrors)="onValidationErrors($event)">
          <nuverial-checkbox-card class="card-1" value="card-1" [pointValue]="1"></nuverial-checkbox-card>
          <nuverial-checkbox-card class="card-2" value="card-2" [pointValue]="1"></nuverial-checkbox-card>
        </nuverial-card-group>`;

    const changeSpy = jest.fn();
    const changeCardSpy = jest.fn();
    const changePointsSpy = jest.fn();
    const errorsSpy = jest.fn();
    const fixture = await render(template, {
      ...dependencies,
      componentProperties: {
        formControl: new FormControl(false, [Validators.required]),
        maxPoints: 2,
        minPoints: 1,
        onChange: changeSpy,
        onChangeCard: changeCardSpy,
        onChangePoints: changePointsSpy,
        onValidationErrors: errorsSpy,
      },
    });

    cardChangeEvent('checkbox', '1', 1);
    cardChangeEvent('checkbox', '2', 1);
    focusEvents.next(null);

    fixture.detectChanges();
    expect(changeSpy).toHaveBeenLastCalledWith(
      expect.arrayContaining([
        { checked: true, pointValue: 1, value: 'card-1' },
        { checked: true, pointValue: 1, value: 'card-2' },
      ]),
    );
    expect(changePointsSpy).toHaveBeenLastCalledWith({ currentPoints: 2, maxPoints: 2, minPoints: 1 });
    expect(errorsSpy).toBeCalledTimes(0);
  });

  it('card-group with radio cards error', async () => {
    const template = `<nuverial-card-group
            [formControl]="formControl"
            [maxPoints]="maxPoints"
            [minPoints]="minPoints"
            (changePoints)="onChangePoints($event)"
            (validationErrors)="onValidationErrors($event)">
          <nuverial-radio-card class="card-1" value="card-1" [pointValue]="1"></nuverial-radio-card>
          <nuverial-radio-card class="card-2" value="card-2" [pointValue]="1"></nuverial-radio-card>
        </nuverial-card-group>`;

    const changePointsSpy = jest.fn();
    const errorsSpy = jest.fn();
    const fixture = await render(template, {
      ...dependencies,
      componentProperties: {
        formControl: new FormControl(null, [Validators.required]),
        maxPoints: 1,
        minPoints: 1,
        onChangePoints: changePointsSpy,
        onValidationErrors: errorsSpy,
      },
    });
    focusEvents.next(null);

    fixture.detectChanges();

    expect(changePointsSpy).toBeCalledTimes(0);
    expect(errorsSpy).toHaveBeenLastCalledWith([{ required: 'Required' }]);
  });

  it('card-group with checkbox cards select all', async () => {
    const template = `<nuverial-card-group
            [formControl]="formControl"
            [maxPoints]="maxPoints"
            [minPoints]="minPoints"
            (changePoints)="onChangePoints($event)"
            (validationErrors)="onValidationErrors($event)">
          <nuverial-checkbox-card class="card-1" value="card-1" [pointValue]="1"></nuverial-checkbox-card>
          <nuverial-checkbox-card class="card-2" value="card-2" [pointValue]="1"></nuverial-checkbox-card>
          <nuverial-checkbox-card class="card-3" value="card-3" [pointValue]="1"></nuverial-checkbox-card>
        </nuverial-card-group>`;

    const changePointsSpy = jest.fn();
    const errorsSpy = jest.fn();
    const fixture = await render(template, {
      ...dependencies,
      componentProperties: {
        formControl: new FormControl(false, [Validators.required]),
        maxPoints: 0,
        minPoints: 0,
        onChangePoints: changePointsSpy,
        onValidationErrors: errorsSpy,
      },
    });
    cardChangeEvent('checkbox', '1', 1);
    cardChangeEvent('checkbox', '2', 1);
    cardChangeEvent('checkbox', '3', 1);
    focusEvents.next(null);
    fixture.detectChanges();

    expect(changePointsSpy).toHaveBeenLastCalledWith({ currentPoints: 3, maxPoints: 0, minPoints: 0 });
    expect(errorsSpy).toBeCalledTimes(0);
  });

  it('card-group with checkbox cards min error', async () => {
    const template = `<nuverial-card-group
            [formControl]="formControl"
            [maxPoints]="maxPoints"
            [minPoints]="minPoints"
            (changePoints)="onChangePoints($event)"
            (validationErrors)="onValidationErrors($event)">
          <nuverial-checkbox-card class="card-1" value="card-1" [pointValue]="1"></nuverial-checkbox-card>
          <nuverial-checkbox-card class="card-2" value="card-2" [pointValue]="1"></nuverial-checkbox-card>
          <nuverial-checkbox-card class="card-3" value="card-3" [pointValue]="1"></nuverial-checkbox-card>
        </nuverial-card-group>`;

    const changePointsSpy = jest.fn();
    const errorsSpy = jest.fn();
    const fixture = await render(template, {
      ...dependencies,
      componentProperties: {
        formControl: new FormControl(false, [Validators.required]),
        maxPoints: 0,
        minPoints: 4,
        onChangePoints: changePointsSpy,
        onValidationErrors: errorsSpy,
      },
    });
    cardChangeEvent('checkbox', '1', 1);
    cardChangeEvent('checkbox', '2', 1);
    cardChangeEvent('checkbox', '3', 1);
    focusEvents.next(null);
    fixture.detectChanges();

    expect(changePointsSpy).toHaveBeenLastCalledWith({ currentPoints: 3, maxPoints: 0, minPoints: 4 });
    expect(errorsSpy).toHaveBeenLastCalledWith([{ min: 'Invalid minimum value' }]);
  });

  it('card-group with checkbox cards max error', async () => {
    const template = `<nuverial-card-group
            [formControl]="formControl"
            [maxPoints]="maxPoints"
            [minPoints]="minPoints"
            (changePoints)="onChangePoints($event)"
            (validationErrors)="onValidationErrors($event)">
          <nuverial-checkbox-card class="card-1" value="card-1" [pointValue]="1"></nuverial-checkbox-card>
          <nuverial-checkbox-card class="card-2" value="card-2" [pointValue]="1"></nuverial-checkbox-card>
          <nuverial-checkbox-card class="card-3" value="card-3" [pointValue]="1"></nuverial-checkbox-card>
        </nuverial-card-group>`;

    const changePointsSpy = jest.fn();
    const errorsSpy = jest.fn();
    const fixture = await render(template, {
      ...dependencies,
      componentProperties: {
        formControl: new FormControl(false, [Validators.required]),
        maxPoints: 2,
        minPoints: 1,
        onChangePoints: changePointsSpy,
        onValidationErrors: errorsSpy,
      },
    });
    cardChangeEvent('checkbox', '1', 1);
    cardChangeEvent('checkbox', '2', 1);
    cardChangeEvent('checkbox', '3', 1);
    focusEvents.next(null);
    fixture.detectChanges();

    expect(changePointsSpy).toHaveBeenLastCalledWith({ currentPoints: 3, maxPoints: 2, minPoints: 1 });
    expect(errorsSpy).toHaveBeenLastCalledWith([{ max: 'Invalid maximum value' }]);
  });

  it('card-group with checkbox cards max error no form', async () => {
    const template = `<nuverial-card-group
            [maxPoints]="maxPoints"
            [minPoints]="minPoints"
            (changePoints)="onChangePoints($event)"
            (validationErrors)="onValidationErrors($event)">
          <nuverial-checkbox-card class="card-1" value="card-1" [pointValue]="1"></nuverial-checkbox-card>
          <nuverial-checkbox-card class="card-2" value="card-2" [pointValue]="1"></nuverial-checkbox-card>
          <nuverial-checkbox-card class="card-3" value="card-3" [pointValue]="1"></nuverial-checkbox-card>
        </nuverial-card-group>`;

    const changePointsSpy = jest.fn();
    const errorsSpy = jest.fn();
    const fixture = await render(template, {
      ...dependencies,
      componentProperties: {
        formControl: new FormControl(false, [Validators.required]),
        maxPoints: 2,
        minPoints: 1,
        onChangePoints: changePointsSpy,
        onValidationErrors: errorsSpy,
      },
    });
    cardChangeEvent('checkbox', '1', 1);
    cardChangeEvent('checkbox', '2', 1);
    cardChangeEvent('checkbox', '3', 1);
    focusEvents.next(null);
    fixture.detectChanges();

    expect(changePointsSpy).toHaveBeenLastCalledWith({ currentPoints: 3, maxPoints: 2, minPoints: 1 });
    expect(errorsSpy).toBeCalledTimes(0);
  });
});
