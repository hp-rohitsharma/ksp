import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { server } from '../server';

@Injectable()
export class FeedbackService {

  result: any;
  constructor(private http: HttpClient) { }

  save(data) {
    const uri = server.url + '/feedback/';
    return this
      .http
      .post(uri, data)
      .map(res => {
        return res;
      });
  }

}
