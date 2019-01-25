import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { server } from '../server';

@Injectable()
export class UserService {

  result: any;
  constructor(private http: HttpClient) { }

  getCurrentUser() {
    const uri = server.url + '/user/';
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }

  saveUser(data) {
    const uri = server.url + '/user/';
    return this
      .http
      .post(uri, data)
      .map(res => {
        return res;
      });
  }

  getAllUsers() {
    const uri = server.url + '/users/';
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }

  getUser(userName) {
    const uri = server.url + '/user/'+userName;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }

}
