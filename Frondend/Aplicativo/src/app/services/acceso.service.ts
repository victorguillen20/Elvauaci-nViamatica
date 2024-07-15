import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appsettings } from '../settings/appsettings';
import { Observable } from 'rxjs';
import { Usersinsert } from '../models/Usersinsert';
import { Login } from '../models/Login';
import { ResponseLogin } from '../interface/ResponseLogin';
import { ResponseRegistroUsers } from '../interface/ResponseRegistroUsers';


@Injectable({
  providedIn: 'root'
})
export class AccesoService {

  private http = inject(HttpClient);
  private baseUrl: string = appsettings.apiUrl;
  constructor() { }

  registrarse(objeto:Usersinsert): Observable<ResponseRegistroUsers>{
    return this.http.post<ResponseRegistroUsers>(`${this.baseUrl}/users/registrar`,objeto);
  }

  loguearse(objeto:Login): Observable<ResponseLogin>{
    return this.http.post<ResponseLogin>(`${this.baseUrl}/users/login`,objeto);
  }

}
