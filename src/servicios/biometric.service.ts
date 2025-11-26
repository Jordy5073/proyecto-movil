import { Injectable } from '@angular/core';
import { NativeBiometric } from '@capgo/capacitor-native-biometric';

@Injectable({ providedIn: 'root' })
export class BiometricService {
  
  private serviceName = 'com.yavirac.jsv'; 

  async isAvailable() {
    try {
      return await NativeBiometric.isAvailable();
    } catch {
      return { isAvailable: false };
    }
  }

  hasSavedCredentials(): boolean {
    return localStorage.getItem('bio_setup_complete') === 'true';
  }

  async saveCredentials(username: string, tokenOrPass: string) {
    try {
      // Borramos primero para asegurar que no se duplique o corrompa
      await this.deleteCredentials(); 
      
      await NativeBiometric.setCredentials({
        username: username,
        password: tokenOrPass,
        server: this.serviceName,
      });
      localStorage.setItem('bio_setup_complete', 'true');
    } catch (e) {
      console.error("Error guardando credenciales", e);
    }
  }

  // Asegúrate de que tu función getCredentials se vea así:
  async getCredentials() {
    try {
      // 1. PASO NUEVO: Obligamos a mostrar la pantalla de huella primero
      await NativeBiometric.verifyIdentity({
        reason: "Escanea tu huella para iniciar sesión",
        title: "Autenticación Requerida",
        subtitle: "Ingreso Biométrico",
        description: "Toca el sensor"
      });

      // 2. Si la huella es correcta, AHORA pedimos los datos guardados
      // (El celular ya no pedirá huella dos veces, o si lo hace, es por seguridad extrema)
      const credentials = await NativeBiometric.getCredentials({
        server: this.serviceName,
      });
      
      return credentials;

    } catch (error) {
      // Si el usuario pone "Cancelar" o la huella falla
      console.log('Autenticación biométrica cancelada o fallida');
      return null;
    }
  }
  
  async deleteCredentials() {
    try {
       await NativeBiometric.deleteCredentials({ server: this.serviceName });
       localStorage.removeItem('bio_setup_complete');
    } catch (e) {}
  }
}