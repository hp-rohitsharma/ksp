import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { server } from '../server';

@Injectable()
export class DocumentService {

  constructor(private http: HttpClient) { }

  add(document) {
    const uri = server.url+'/documents/document/';
    return this
      .http
      .post(uri, document)
      .map(res => {
        return res;
      });
  }

  getAll() {
    const uri = server.url+'/documents/';
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }

  get(id) {
    const uri = server.url+'/documents/document/' + id;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }

  download(id, responseType) {
    const uri = server.url+'/documents/document/download/' + id;
    return this
      .http
      .get(uri, { responseType: responseType })
      .map(res => {
        return res;
      });
  }

  delete(id) {
    const uri = 'http://rohits-10:2020/documents/document/' + id;
    return this
      .http
      .delete(uri)
      .map(res => {
        return res;
      });
  }

  
  update(id, document) {
    const uri = 'http://rohits-10:2020/documents/document/' + id
    return this
      .http
      .put(uri, document)
      .map(res => {
        return res;
      });
  }

  /*upload(blog, config) {
  const uri = 'http://rohits-10:2020/blogs/blog';
  return this
    .http
    .post(uri, blog, config)
    .map(res => {
      return res;
    });
}*/

}
