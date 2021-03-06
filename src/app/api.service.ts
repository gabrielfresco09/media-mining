import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { LoginPayload } from "./apiModel/login.payload";
import { LoginResponse } from "./apiModel/login.response";

import { environment } from "../environments/environment";

@Injectable({
  providedIn: "root"
})
export class ApiService {
  constructor(private httpClient: HttpClient) {}

  public loginRequest(loginPayload: LoginPayload): Observable<LoginResponse> {
    return this.httpClient
      .post<LoginResponse>(environment.apiBaseUrl + "login/auth", loginPayload)
      .pipe(
        catchError((err, caught) => {
          console.error("Error login in", err);
          return caught;
        })
      );
  }

  public queryRequest(queryPayload: {}, headers: HttpHeaders): Observable<{}> {
    return this.httpClient.post<{}>(
      environment.apiBaseUrl + "query/query?e=CombinedSearch",
      queryPayload,
      { headers }
    );
  }
}
