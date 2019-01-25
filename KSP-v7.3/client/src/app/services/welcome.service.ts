import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { server } from '../server';

@Injectable()
export class WelcomeService {

  constructor(private http: HttpClient) { }

  get(name) {
    const uri = server.url+'/welcome/' + name;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }

}
