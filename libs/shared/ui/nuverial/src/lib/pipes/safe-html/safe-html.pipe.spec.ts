import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { MockProvider } from 'ng-mocks';
import { NuverialSafeHtmlPipe } from './safe-html.pipe';

describe('NuverialSafeHtmlPipe', () => {
  let pipe: NuverialSafeHtmlPipe;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(DomSanitizer, { bypassSecurityTrustHtml: (val: string) => val })],
    });
    sanitizer = TestBed.inject(DomSanitizer);
    pipe = new NuverialSafeHtmlPipe(sanitizer);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('sanitizeHtml', () => {
    it('should sanitize HTML string', () => {
      const htmlString = `<p style="color: red" onclick="alert('Testing')">Hello, world!</p><script>alert('Hello world!')</script>`;
      const sanitizedHtml = pipe.sanitizeHtml(htmlString);

      expect(sanitizedHtml).toBe('<p style="color: red">Hello, world!</p>');
      expect(sanitizedHtml).not.toContain('<script>');
    });

    it('should return empty string if input is undefined', () => {
      const sanitizedHtml = pipe.sanitizeHtml(undefined);

      expect(sanitizedHtml).toBe('');
    });
  });

  describe('transform', () => {
    it('should sanitize HTML string', () => {
      const htmlString = `<p style="color: red" onclick="alert('Testing')">Hello, world!</p><script>alert('Hello world!')</script>`;
      const sanitizedHtml = pipe.transform(htmlString);

      expect(sanitizedHtml).toBe('<p style="color: red">Hello, world!</p>');
      expect(sanitizedHtml).not.toContain('<script>');
    });

    it('should return empty string if input is undefined', () => {
      const sanitizedHtml = pipe.transform(undefined);

      expect(sanitizedHtml).toBe('');
    });
  });
});
