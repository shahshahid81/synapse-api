import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

function getSecretKey(configService: ConfigService): crypto.KeyObject {
  const secretKey = configService.get('SECRET_KEY');
  return crypto.createSecretKey(secretKey, 'utf-8');
}

export function encrypt(configService: ConfigService, value: string): string {
  const key = getSecretKey(configService);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
  const encryptedData =
    cipher.update(value, 'utf8', 'base64') + cipher.final('base64');
  return iv.toString('hex') + encryptedData;
}

export function decrypt(configService: ConfigService, value: string): string {
  const key = getSecretKey(configService);
  const iv = Buffer.from(value.slice(0, 32), 'hex');
  const encryptedText = value.slice(32);
  const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
  return (
    decipher.update(encryptedText, 'base64', 'utf8') + decipher.final('utf8')
  );
}
