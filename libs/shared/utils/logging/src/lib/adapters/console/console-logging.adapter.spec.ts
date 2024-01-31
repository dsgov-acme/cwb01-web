import { ConsoleLoggingService } from './console-logging.adapter';

const CONTEXT = 'ConsoleLoggingServiceTest';

describe('ConsoleLoggingService', () => {
  let service: ConsoleLoggingService;

  beforeEach(() => {
    service = new ConsoleLoggingService();
  });

  describe('consoleDebug', () => {
    it('should debug message', () => {
      const spy = jest.spyOn(console, 'debug').mockImplementation();
      service.debug(CONTEXT, 'message');
      expect(spy).toHaveBeenCalledWith([CONTEXT, 'message']);
      spy.mockReset();
    });

    it('should debug message with options', () => {
      const spy = jest.spyOn(console, 'debug').mockImplementation();
      service.debug(CONTEXT, 'message', ['options']);
      expect(spy).toHaveBeenCalledWith([CONTEXT, 'message', ['options']]);
      spy.mockReset();
    });

    it('should debug without message', () => {
      const spy = jest.spyOn(console, 'debug').mockImplementation();
      service.debug(CONTEXT, '', ['options']);
      expect(spy).toHaveBeenCalledWith([CONTEXT, ['options']]);
      spy.mockReset();
    });
  });

  describe('error', () => {
    it('should error message', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation();
      service.error(CONTEXT, 'message');
      expect(spy).toHaveBeenCalledWith([CONTEXT, 'message']);
      spy.mockReset();
    });

    it('should error with options', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation();
      service.error(CONTEXT, 'message', ['options']);
      expect(spy).toHaveBeenCalledWith([CONTEXT, 'message', ['options']]);
      spy.mockReset();
    });

    it('should error without message', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation();
      service.error(CONTEXT, '');
      expect(spy).toHaveBeenCalledWith([CONTEXT]);
      spy.mockReset();
    });
  });

  describe('info', () => {
    it('should info message', () => {
      const spy = jest.spyOn(console, 'info').mockImplementation();
      service.info(CONTEXT, 'message');
      expect(spy).toHaveBeenCalledWith([CONTEXT, 'message']);
      spy.mockReset();
    });

    it('should info message with options', () => {
      const spy = jest.spyOn(console, 'info').mockImplementation();
      service.info(CONTEXT, 'message', ['options']);
      expect(spy).toHaveBeenCalledWith([CONTEXT, 'message', ['options']]);
      spy.mockReset();
    });

    it('should info without message', () => {
      const spy = jest.spyOn(console, 'info').mockImplementation();
      service.info(CONTEXT, '', ['options']);
      expect(spy).toHaveBeenCalledWith([CONTEXT, ['options']]);
      spy.mockReset();
    });
  });

  describe('log', () => {
    it('should log message', () => {
      const spy = jest.spyOn(console, 'log').mockImplementation();
      service.log(CONTEXT, 'message');
      expect(spy).toHaveBeenCalledWith([CONTEXT, 'message']);
      spy.mockReset();
    });

    it('should log message with options', () => {
      const spy = jest.spyOn(console, 'log').mockImplementation();
      service.log(CONTEXT, 'message', ['options']);
      expect(spy).toHaveBeenCalledWith([CONTEXT, 'message', ['options']]);
      spy.mockReset();
    });

    it('should log without message', () => {
      const spy = jest.spyOn(console, 'log').mockImplementation();
      service.log(CONTEXT, '', ['options']);
      expect(spy).toHaveBeenCalledWith([CONTEXT, ['options']]);
      spy.mockReset();
    });
  });

  describe('warn', () => {
    it('should warn message', () => {
      const spy = jest.spyOn(console, 'warn').mockImplementation();
      service.warn(CONTEXT, 'message');
      expect(spy).toHaveBeenCalledWith([CONTEXT, 'message']);
      spy.mockReset();
    });

    it('should warn message with options', () => {
      const spy = jest.spyOn(console, 'warn').mockImplementation();
      service.warn(CONTEXT, 'message', ['options']);
      expect(spy).toHaveBeenCalledWith([CONTEXT, 'message', ['options']]);
      spy.mockReset();
    });

    it('should warn without message', () => {
      const spy = jest.spyOn(console, 'warn').mockImplementation();
      service.warn(CONTEXT, '', ['options']);
      expect(spy).toHaveBeenCalledWith([CONTEXT, ['options']]);
      spy.mockReset();
    });
  });
});
