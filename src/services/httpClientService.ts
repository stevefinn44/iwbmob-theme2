import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()


export class HttpClientService {
    private protocol: string = "http";
    constructor(private http: HttpClient) {

    }

    public get<T>(uri: string): Observable<object> {
        return this.http.get(`${this.protocol}://localhost:8518/api/${uri}`);
    }
}