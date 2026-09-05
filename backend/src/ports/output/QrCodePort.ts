export interface QrCodePort {
  generarQR(data: string): Promise<string>;
}
