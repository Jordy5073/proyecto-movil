// src/app/servicios/lugares.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; // Importante para manejar las respuestas

// (Opcional pero RECOMENDADO)
// Define una "interfaz" para tus datos. Esto le da a TypeScript
// superpoderes para detectar errores.

export interface Lugar {
  id?: string; // El ID es opcional al crear, pero vendrá en la respuesta
  nombre: string;
  categoria: string;
  descripcion: string;
  direccion: string;
  calificacion: number;
  contacto: string;
  fotoUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class LugaresService {

  // Esta es la URL de tu backend.
  // ¡Asegúrate de que tu backend (node index.js) esté corriendo!
  private apiUrl = 'http://localhost:3000';

  // 1. Inyectamos el HttpClient de Angular en el constructor
  constructor(private http: HttpClient) { }

  /**
   * Método para CREAR un nuevo lugar.
   * Recibe los datos del formulario (de tipo 'Lugar')
   */
  crearLugar(datosDelLugar: Lugar): Observable<Lugar> {
    // Usamos http.post
    // 1er arg: La URL completa (ej: http://localhost:3000/lugares)
    // 2do arg: El cuerpo (body) de la petición (tus datos)
    //
    // Esto DEVUELVE un "Observable", que es como una promesa
    // que el componente "escuchará".
    return this.http.post<Lugar>(`${this.apiUrl}/lugares`, datosDelLugar);
  }

  /**
   * (BONUS) Ya que estamos aquí, hagamos el método para OBTENER lugares
   */
  obtenerLugares(): Observable<Lugar[]> {
    // Hacemos un GET a la misma URL y esperamos un array de Lugares
    return this.http.get<Lugar[]>(`${this.apiUrl}/lugares`);
  }

  // (Aquí podrías agregar metodos para actualizar, borrar, etc.)
}