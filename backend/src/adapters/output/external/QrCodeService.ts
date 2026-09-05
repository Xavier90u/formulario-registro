import QRCode from 'qrcode';
import { QrCodePort } from '../../../ports/output/QrCodePort';

export class QrCodeService implements QrCodePort {
  async generarQR(data: string): Promise<string> {
    try {
      const qrDataUrl = await QRCode.toDataURL(data, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      return qrDataUrl;
    } catch (error) {
      throw new Error('Error al generar código QR');
    }
  }
}
