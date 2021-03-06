// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { AuthenticationService } from '@app/authentication/authentication.service';
// import { Observable } from 'rxjs';
// import { GenericResponse } from '@shared/models/GenericResponse';
// import { environment } from '@env';

// @Injectable({
//   providedIn: 'root'
// })
// export class FileStorageService {

//   constructor(private http: HttpClient, private authorizationService: AuthenticationService) { }

//   public store(file: any): Observable<GenericResponse<any>> {
//     const applicationId = environment.storageApplicationId;
//     const accountingId = environment.storageAccountingId;
//     const formData = new FormData();
//     formData.append('file', file);
//     const url = `${environment.serviceUrl}/storage/${applicationId}/accounting/${accountingId}/store`;
//     const headers = this.authorizationService.getNoBearerAuthorizationHeaders();
//     return this.http.post<GenericResponse<any>>(url, formData, { headers });
//   }

//   getResourceURL(resourceId: string): string {
//     return `${environment.serviceUrl}/storage/${resourceId}`;
//   }

//   // public fetch(resourceId: string): Observable<GenericResponse<any>> {
//   //   const url = `${environment.serviceUrl}/storage/v1/organizations/${id}`;
//   //   const headers = this.authorizationService.getAuthorizationHeaders();
//   //   return this.http.get<GenericResponse<any>>(url, { headers });
//   // }

//   // public download(resourceId: string): Observable<GenericResponse<any>> {
//   //   const url = `${environment.serviceUrl}/storage/v1/organizations`;
//   //   const headers = this.authorizationService.getAuthorizationHeaders();
//   //   return this.http.post<GenericResponse<any>>(url, organization, { headers });
//   // }

// }
