import { FormControl, Validators } from '@angular/forms';
import { render } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { NuverialRichTextEditorComponent } from './rich-text-editor.component';

const getFixture = async (props: Record<string, Record<string, unknown>>) => {
  const { detectChanges, fixture } = await render(NuverialRichTextEditorComponent, {
    componentProperties: {
      formControl: new FormControl(`<p style="color: red" onclick="alert('Testing')">Hello, world!</p><script>alert('Hello world!')</script>`, [
        Validators.required,
      ]),
    },
    ...props,
  });

  detectChanges();

  return { component: fixture.componentInstance, fixture };
};

describe('NuverialRichTextEditorComponent', () => {
  it('should create', async () => {
    const { fixture } = await getFixture({});

    expect(fixture).toBeTruthy();
  });

  describe('Accessibility', () => {
    it('should have no violations, when aria-label is not set', async () => {
      const { fixture } = await getFixture({});
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });

    it('should have no violations, when aria-label is set', async () => {
      const { component, fixture } = await getFixture({});
      component.ariaLabel = 'test';
      fixture.detectChanges();
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });
  });

  it('should preserve safe html and remove unsafe html', async () => {
    const { component, fixture } = await getFixture({});

    const element = fixture.nativeElement.querySelector('[contenteditable]');

    expect(component.formControl.value).toBe(`<p style="color: red" onclick="alert('Testing')">Hello, world!</p><script>alert('Hello world!')</script>`);
    expect(element.innerHTML).toContain('<p><span style="color:red;">Hello, world!</span></p>');
    expect(element.innerHTML).not.toContain('script');
    expect(element.innerHTML).not.toContain('onclick');
  });

  it('should update the form control on focus out', async () => {
    const { component, fixture } = await getFixture({});
    component.onFocusOut();
    fixture.detectChanges();

    expect(component.formControl.valid).toBeFalsy;
  });
});
