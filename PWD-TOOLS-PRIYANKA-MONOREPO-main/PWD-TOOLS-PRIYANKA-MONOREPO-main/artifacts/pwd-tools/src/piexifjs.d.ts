declare module "piexifjs" {
  const piexifjs: {
    load(data: string): Record<string, any>;
    dump(exifObj: Record<string, any>): string;
    insert(exifStr: string, jpegData: string): string;
    remove(jpegData: string): string;
    ImageIFD: Record<string, number>;
    ExifIFD: Record<string, number>;
    GPSIFD: Record<string, number>;
  };
  export = piexifjs;
}
