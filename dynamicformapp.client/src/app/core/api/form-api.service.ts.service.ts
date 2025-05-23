import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface FormField {
  label: string | null;
  type: 'dropdown' | 'checkbox' | 'text' | 'numeric';
  min?: number | null;
  max?: number | null;
  isRequired: boolean;
  options: FieldOption[];
  allowAlphabetOnly: boolean;
  validationMode: 'open' | 'alpha' | 'alpha-special' | 'alpha-numeric';
  customSpecialChars?: string;
  isPhoneNumber: false,
}

export interface FormModel {
  id?: number;
  title: string | null;
  description: string;
  fields: FormField[];
  createdDate: Date;
  responseCount?: number;
  publicId?: string;
  privacyPolicy?: string;
  bannerUrl?: string;
}

export interface FieldOption {
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class FormApiService {
  private baseUrl = `${environment.apiUrl}/form`;

  constructor(private http: HttpClient) { }

  createForm(form: FormModel): Observable<FormModel> {
    return this.http.post<FormModel>(this.baseUrl, form);
  }

  getForm(id: number): Observable<FormModel> {
    return this.http.get<FormModel>(`${this.baseUrl}/${id}`);
  }

  getAllForms(): Observable<FormModel[]> {
    return this.http.get<FormModel[]>(this.baseUrl);
  }

  updateForm(id: number, form: FormModel): Observable<FormModel> {
    return this.http.put<FormModel>(`${this.baseUrl}/${id}`, form);
  }

  deleteForm(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getFormByPublicId(publicId: string): Observable<FormModel> {
    return this.http.get<FormModel>(`${this.baseUrl}/public/${publicId}`);
  }

  uploadBanner(formData: FormData) {
    return this.http.post<{ url: string }>(`${environment.apiUrl}/upload/banner`, formData);
  }

}
