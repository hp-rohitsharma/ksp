import { Injectable } from '@angular/core';

@Injectable()
export class GlobalDataService {

  private map = new Map();

  get(key: String) {
    return this.map.get(key);
  }

  put(key: String, value: any) {
    this.map.set(key, value);
  }

}