import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {

    private url = 'http://192.168.18.24:8080/lugares';

    private http = inject(HttpClient);

    save(place: any){
        
        return this.http.post(this.url + "/crear", place)

        
    }


  
}
