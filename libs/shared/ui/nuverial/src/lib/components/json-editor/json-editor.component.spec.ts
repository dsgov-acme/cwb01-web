import { CommonModule } from '@angular/common';
import { render } from '@testing-library/angular';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { MockBuilder } from 'ng-mocks';
import { NuverialJsonEditorWrapperComponent } from './json-editor.component';

const dependencies = MockBuilder(NuverialJsonEditorWrapperComponent).keep(CommonModule).keep(NgJsonEditorModule).build();

const getFixture = async (props: Record<string, Record<string, unknown>>) => {
  const { fixture } = await render(NuverialJsonEditorWrapperComponent, {
    ...dependencies,
    ...props,
  });

  return { fixture };
};

const testJson = '{"test": "test"}';

describe('JsonEditorWrapperComponent', () => {
  it('should create', async () => {
    const { fixture } = await getFixture({});
    expect(fixture).toBeTruthy();
  });

  describe('initJsonEditorOptions', () => {
    it('should set jsonEditorOptions', async () => {
      const { fixture } = await getFixture({});
      const component = fixture.componentInstance;
      component.initJsonEditorOptions();
      expect(component.jsonEditorOptions).toBeTruthy();
      expect(component.jsonEditorOptions.mode).toEqual('code');
      expect(component.jsonEditorOptions.modes).toEqual(['code', 'text', 'tree', 'view']);
      expect(component.jsonEditorOptions.onChangeText).toBeDefined();
    });
  });

  describe('update json', () => {
    it('should set edited json', async () => {
      const { fixture } = await getFixture({});
      const component = fixture.componentInstance;
      component.initJsonEditorOptions();
      component.jsonEditorOptions.onChangeText(testJson);
      expect(component.editedJson).toEqual(JSON.parse(testJson));
    });

    it('should emit edited json', async () => {
      const { fixture } = await getFixture({});
      const component = fixture.componentInstance;
      component.initJsonEditorOptions();

      const jsonChangeSpy = jest.spyOn(component['jsonChange'], 'emit');
      component.jsonEditorOptions.onChangeText(testJson);

      expect(jsonChangeSpy).toHaveBeenCalledWith(JSON.parse(testJson));
    });
  });

  describe('ngAfterViewChecked', () => {
    it('should set textarea to readOnly if readOnly is true', async () => {
      const { fixture } = await getFixture({});
      const component = fixture.componentInstance;
      const textArea: HTMLTextAreaElement = fixture.debugElement.nativeElement.querySelector('.ace_text-input');

      component.readOnly = true;
      fixture.detectChanges();

      component.ngAfterViewChecked();

      expect(textArea.readOnly).toBe(true);
    });

    it('should not set textarea to readOnly if it has not rendered yet', async () => {
      const { fixture } = await getFixture({});
      const component = fixture.componentInstance;
      const textArea: HTMLTextAreaElement = fixture.debugElement.nativeElement.querySelector('.ace_text-input');

      Object.defineProperty(component, '_aceEditorWrapper', { get: () => undefined });
      component.readOnly = true;
      fixture.detectChanges();

      expect(component['_aceEditorWrapper']).toBeUndefined();
      expect(textArea.readOnly).not.toBeTruthy();
    });
  });
});
