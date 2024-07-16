import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { Observable } from 'rxjs';
import { ResponseAllUsers } from '../interface/ResponseAllUsers';
import { Getusers } from '../models/Getusers';
import { ResponseProfile } from '../interface/ResponseProfile';
import { UsuariosInsertAdmin } from '../models/UsuariosInsertAdmin';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private http = inject(HttpClient);
  private baseUrl: string = appsettings.apiUrl;
  constructor() { }

  getAllUsers(): Observable<ResponseAllUsers> {
    return this.http.get<ResponseAllUsers>(`${this.baseUrl}/users`);
  }

  getProfile(objeto:Getusers): Observable<ResponseProfile>{
    return this.http.get<ResponseProfile>(`${this.baseUrl}/users/profile`);
  }

  registerUsers(users: UsuariosInsertAdmin[]): Observable<boolean> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<boolean>(`${this.baseUrl}/users/ad/registrar`, users, { headers });
  }

}
