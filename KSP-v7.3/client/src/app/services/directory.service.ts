import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { server } from '../server';
import 'rxjs/add/operator/map';

@Injectable()
export class DirectoryService {

  constructor(private http: HttpClient) { }

  get() {
    const uri = server.url+'/directory';
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }

  add(folder) {
    const uri = server.url+'/directory';
    return this
      .http
      .post(uri, folder)
      .map(res => {
        return res;
      });
  }

  update(folder) {
    const uri = server.url+'/directory';
    return this
      .http
      .put(uri, folder)
      .map(res => {
        return res;
      });
  }

  delete(id) {
    const uri = server.url+'/directory/' + id;
    return this
      .http
      .delete(uri)
      .map(res => {
        return res;
      });
  }
}
