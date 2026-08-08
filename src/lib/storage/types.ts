export type UploadInput = { key: string; file: File; contentType?: string };
export interface StorageProvider { upload(input: UploadInput): Promise<{ key: string }>; delete(key: string): Promise<void>; getUrl(key: string, options?: { expiresIn?: number }): Promise<string>; }
