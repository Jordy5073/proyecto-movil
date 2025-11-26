import {Injectable} from '@angular/core';
import {Camera, CameraResultType, CameraSource, Photo} from '@capacitor/camera';
import {Geolocation, Position} from '@capacitor/geolocation';
import {Haptics, ImpactStyle} from '@capacitor/haptics';
import {Toast} from '@capacitor/toast';
import {Directory, Filesystem} from '@capacitor/filesystem';
import {Capacitor} from '@capacitor/core';

export interface SavedPhoto {
  fileName: string;
  webviewPath: string;
  timestamp: number;
  fotoBase64?: string
}

@Injectable({providedIn: 'root'})
export class DeviceService {
  private PHOTOS_DIR = 'photos';

  async takePhoto(): Promise<Photo> {
    const photo = await Camera.getPhoto({
      source: CameraSource.Prompt,
      resultType: CameraResultType.Uri,
      quality: 85,
      saveToGallery: true,
      promptLabelHeader: 'Elegir',
      promptLabelPhoto: 'Abrir galeria',
      promptLabelPicture: 'Usar cámara'
    });

    await this.successTap('Foto tomada');

    return photo;
  }

  async getCurrentPosition(): Promise<Position> {
    const perm = await Geolocation.checkPermissions();

    if (perm.location !== 'granted') {
      const req = await Geolocation.requestPermissions();

      if (req.location !== 'granted') {
        await Toast.show({text: 'Permiso de ubicación denegado'});
        throw new Error('Location permission denied');
      }
    }

    const pos = await Geolocation.getCurrentPosition({enableHighAccuracy: true});

    await this.softTap('Ubicación obtenida');

    return pos;
  }

  private async readAsBase64(photo: Photo): Promise<string> {
    const response = await fetch(photo.webPath!);

    const blob = await response.blob();

    return await this.convertBlobToBase64(blob) as string;
  }

  private convertBlobToBase64(blob: Blob) {
    return new Promise((resolve, reject) => { 
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob); // data:image/jpeg;base64,....
    });
  }

  async savePhoto(photo: Photo): Promise<SavedPhoto> {
    const base64 = await this.readAsBase64(photo);

    const fileName = `${Date.now()}.jpeg`;

    await Filesystem.mkdir({
      path: this.PHOTOS_DIR,
      directory: Directory.Data,
      recursive: true
    }).catch(() => {/* ya existe */
    });

    await Filesystem.writeFile({
      path: `${this.PHOTOS_DIR}/${fileName}`,
      data: base64,
      directory: Directory.Data
    });

    const uri = await Filesystem.getUri({
      path: `${this.PHOTOS_DIR}/${fileName}`,
      directory: Directory.Data
    });

    const webviewPath = Capacitor.convertFileSrc(uri.uri);

    await Toast.show({text: 'Foto guardada localmente'});

    return {fileName, webviewPath, timestamp: Date.now(),fotoBase64:base64};
  }

  async loadAllPhotos(): Promise<SavedPhoto[]> {
    try {
      const dir = await Filesystem.readdir({path: this.PHOTOS_DIR, directory: Directory.Data});

      const photos: SavedPhoto[] = [];

      for (const file of dir.files) {
        const uri = await Filesystem.getUri({path: `${this.PHOTOS_DIR}/${file.name}`, directory: Directory.Data});
        const webviewPath = Capacitor.convertFileSrc(uri.uri);
        photos.push({fileName: file.name, webviewPath, timestamp: Number(file.name.split('.')[0]) || Date.now()});
      }

      return photos.sort((a, b) => b.timestamp - a.timestamp);
    } catch (e) {
      return [];
    }
  }

  async deletePhoto(fileName: string) {
    await Filesystem.deleteFile({path: `${this.PHOTOS_DIR}/${fileName}`, directory: Directory.Data});

    await Toast.show({text: 'Foto eliminada'});
  }

  async successTap(message?: string) {
    await Haptics.impact({style: ImpactStyle.Heavy});

    if (message) await Toast.show({text: message});
  }

  async softTap(message?: string) {
    await Haptics.impact({style: ImpactStyle.Heavy});

    if (message) await Toast.show({text: message});
  }
}
