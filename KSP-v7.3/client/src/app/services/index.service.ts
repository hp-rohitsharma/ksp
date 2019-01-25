import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { server } from '../server';

@Injectable()
export class IndexService {

  constructor(private http: HttpClient) { }

  suggestions(text) {
    const uri = server.url+'/index/suggestions/'+ text;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }

  index(data) {
    const uri = server.url+'/index';
    return this
      .http
      .post(uri, data)
      .map(res => {
        return res;
      });
  }

  update(data) {
    const uri = server.url+'/index';
    return this
      .http
      .put(uri, data)
      .map(res => {
        return res;
      });
  }

  search(text) {
    const uri = server.url+'/index/search/'+text;
    return this
      .http
      .get(uri)
      .map(res => {
        return res;
      });
  }

}
