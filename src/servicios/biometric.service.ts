import { Injectable } from '@angular/core';
import { NativeBiometric } from '@capgo/capacitor-native-biometric';

@Injectable({ providedIn: 'root' })
export class BiometricService {
  
  private serviceName = 'com.yavirac.jsv'; // Asegúrate que coincida con capacitor.config.ts

  // Verifica solo si el HARDWARE existe
  async isAvailable() {
    try {
      return await NativeBiometric.isAvailable();
    } catch {
      return { isAvailable: false };
    }
  }

  // Verifica si ya hemos guardado credenciales antes (para saber si mostrar el botón)
  hasSavedCredentials(): boolean {
    return localStorage.getItem('bio_setup_complete') === 'true';
  }

  // Guarda credenciales en el chip Y pone la marca en localStorage
  async saveCredentials(username: string, tokenOrPass: string) {
    try {
      await NativeBiometric.setCredentials({
        username: username,
        password: tokenOrPass,
        server: this.serviceName,
      });
      
      // MARCA IMPORTANTE: Decimos "Sí, ya configuré la huella"
      localStorage.setItem('bio_setup_complete', 'true');

    } catch (e) {
      console.error("Error guardando credenciales biométricas", e);
    }
  }

  // Recupera credenciales (Forzando el prompt de seguridad)
  async getCredentials() {
    try {
      // 1. Forzamos que aparezca la ventanita "Pon tu huella"
      await NativeBiometric.verifyIdentity({
        reason: 'Confirma tu identidad',
        title: 'Iniciar Sesión',
        subtitle: 'Seguridad',
        description: 'Usa tu huella para entrar'
      });

      // 2. Si pasa la huella, recuperamos los datos
      const credentials = await NativeBiometric.getCredentials({
        server: this.serviceName,
      });
      return credentials;

    } catch {
      return null;
    }
  }
  
  async deleteCredentials() {
    try {
       await NativeBiometric.deleteCredentials({ server: this.serviceName });
       // Si borramos las credenciales, quitamos la marca
       localStorage.removeItem('bio_setup_complete');
    } catch (e) {}
  }
}