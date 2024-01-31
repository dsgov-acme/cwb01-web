import { render, screen } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { MockBuilder } from 'ng-mocks';
import { NuverialSafeHtmlPipe } from './../../../pipes';
import { NuverialRichTextViewerComponent } from './rich-text-viewer.component';

const dependencies = MockBuilder(NuverialRichTextViewerComponent).keep(NuverialSafeHtmlPipe).build();

const getFixture = async (props: Record<string, Record<string, unknown>>) => {
  const { detectChanges, fixture } = await render(NuverialRichTextViewerComponent, {
    componentProperties: {
      content: `<p style="color: red" onclick="alert('Testing')">Hello, world!</p><script>alert('Hello world!')</script>`,
    },
    providers: [NuverialSafeHtmlPipe],
    ...props,
  });

  detectChanges();

  return { component: fixture.componentInstance, fixture };
};

const getFixtureByTemplate = async (
  template = `<nuverial-rich-text-viewer  data-testId="content" [content]="'<p>Hello, world!</p><script>alert(true)</script>'"></nuverial-rich-text-viewer>`,
) => {
  const { fixture } = await render(template, dependencies);

  return { component: fixture.componentInstance as NuverialRichTextViewerComponent, fixture };
};

describe('NuverialRichTextViewerComponent', () => {
  it('should create', async () => {
    const { fixture } = await getFixtureByTemplate();

    expect(fixture).toBeTruthy();
  });

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { fixture } = await getFixtureByTemplate();
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });
  });

  it('should preserve safe html and remove unsafe html', async () => {
    const { component, fixture } = await getFixture({});

    const element = fixture.nativeElement.querySelector('div');

    expect(component.content).toBe(`<p style="color: red" onclick="alert('Testing')">Hello, world!</p><script>alert('Hello world!')</script>`);
    expect(element.innerHTML).toContain('<p style="color: red">Hello, world!</p>');
    expect(element.innerHTML).not.toContain('script');
    expect(element.innerHTML).not.toContain('onclick');
  });

  it('should remove safe html and remove unsafe html - by template', async () => {
    await getFixtureByTemplate();
    const element = screen.getByTestId('content');

    expect(element.innerHTML).not.toContain('script');
    expect(element.innerHTML).toContain('<p>Hello, world!</p>');
  });
});
