import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface FormResponsePayload {
  formId: number;
  responseJson: string;
}

export interface FormResponseSummary {
  id: number;
  formId: number;
  responseJson: string;
  createdDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class FormResponseApiService {
  private baseUrl = `${environment.apiUrl}/formresponse`;

  constructor(private http: HttpClient) { }

  submitResponse(payload: FormResponsePayload): Observable<any> {
    return this.http.post(`${this.baseUrl}`, payload);
  }

  getResponsesByForm(formId: number): Observable<FormResponseSummary[]> {
    return this.http.get<FormResponseSummary[]>(
      `${this.baseUrl}/form/${formId}`
    );
  }
}
