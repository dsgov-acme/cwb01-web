import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { TitleService } from './title.service';

describe('TitleService', () => {
  let service: TitleService;
  let ngTitleService: Title;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Title, // Provide the real HTML title service
        TitleService,
      ],
    });
    service = TestBed.inject(TitleService);
    ngTitleService = TestBed.inject(Title);

    ngTitleService.setTitle('Test Portal');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set the html title', () => {
    service.setHtmlTitle('test');

    const ngHtmlTitle = ngTitleService.getTitle();
    expect(ngHtmlTitle).toBe('test');
  });
});
