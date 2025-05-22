import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

export interface Role {
  id: number;
  name: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private baseUrl = `${environment.apiUrl}/role`;

  constructor(private http: HttpClient) {}

  getActiveRoles() {
    return this.http.get<Role[]>(`${this.baseUrl}/active`);
  }

  addRole(role: Partial<Role>) {
    return this.http.post<Role>(this.baseUrl, role);
  }

  updateRole(id: number, role: Partial<Role>) {
    return this.http.put<Role>(`${this.baseUrl}/${id}`, role);
  }

  deleteRole(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
