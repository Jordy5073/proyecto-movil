import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {

  private url = 'http://192.168.18.24:8080/places';

  private http = inject(HttpClient);


  // 1. Crear 
  save(place: any) {
    return this.http.post(this.url + "/create", place)
  }
  showAllPlaces() {
    return this.http.get(`${this.url}/show`);
  }
  // 3. ACTUALIZAR (Update)
  updatePlace(id: number, place: any): Observable<any> {
    return this.http.put<any>(`${this.url}/update/${id}`, place);
  }

  // 4. ELIMINAR (Delete)
  deletePlace(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/delete/${id}`);
  }
  constructor() { }

}
