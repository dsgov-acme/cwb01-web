import { FileUploadControl } from './file-upload-control.model';

const fileData = 'new file doc';
const fileName = 'file.doc';
const fileType = 'application/msword';

const file = new File([fileData], fileName, { type: fileType });

describe('FileUploadControl', () => {
  let control: FileUploadControl;

  beforeEach(() => {
    control = new FileUploadControl(1000);
  });

  describe('value', () => {
    it('should return an array of files', () => {
      const file2 = new File([fileData], 'file2.doc', { type: fileType });

      control.multiple = true;
      control.addFiles([file, file2]);
      expect(control.value).toEqual([file, file2]);
    });
  });

  describe('valueChanges', () => {
    it('should emit when a file is added', () => {
      const spy = jest.fn();
      const file2 = new File([fileData], 'file2.doc', { type: fileType });

      control.valueChanges$.subscribe(spy);
      control.addFile(file);
      control.addFile(file2);
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should emit when a file is removed', () => {
      const spy = jest.fn();
      const file2 = new File([fileData], 'file2.doc', { type: fileType });

      control.addFiles([file, file2]);
      control.valueChanges$.subscribe(spy);
      control.removeFile(file.name);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('size', () => {
    it('should return the number of files', () => {
      const file2 = new File([fileData], 'file2.doc', { type: fileType });

      control.multiple = true;
      control.addFiles([file, file2]);

      expect(control.size).toEqual(2);
    });
  });

  describe('addFile', () => {
    it('should add a single file', () => {
      control.addFile(file);
      expect(control.size).toEqual(1);
    });
  });

  describe('addFiles', () => {
    it('should add multiple files if multiple is true', () => {
      const file2 = new File([fileData], 'file2.doc', { type: fileType });

      control.multiple = true;
      control.addFiles([file, file2]);
      expect(control.size).toEqual(2);
    });

    it('should truncate to the first file and replace the existing file if multiple is false', () => {
      const file2 = new File([fileData], 'file2.doc', { type: fileType });
      const file3 = new File([fileData], 'file3.doc', { type: fileType });

      control.multiple = false;
      control.addFiles([file]);
      control.addFiles([file2, file3]);

      expect(control.size).toEqual(1);
      expect(control.value[0]).toEqual(file2);
    });

    it('should do nothing if no files are passed', () => {
      control.addFiles([]);
      expect(control.size).toEqual(0);
    });
  });

  describe('removeFile', () => {
    it('should remove a file', () => {
      control.addFile(file);
      control.removeFile(file.name);
      expect(control.size).toEqual(0);
    });
  });

  describe('getErrors', () => {
    it('should return fileSize error if file is bigger than max size', async () => {
      control = new FileUploadControl(0);

      control.addFile(file);

      expect(control.getErrors()).toEqual([{ errors: { fileSize: true }, name: file.name }]);
    });

    it('should return empty array if no errors', () => {
      control = new FileUploadControl(1000);

      control.addFile(file);
      expect(control.getErrors()).toEqual([]);
    });
  });

  describe('clear', () => {
    it('should clear all files', () => {
      const file2 = new File([fileData], 'file2.doc', { type: fileType });

      control.addFiles([file, file2]);
      control.clear();
      expect(control.size).toEqual(0);
    });
  });
});
