import { Injectable, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';

import { server } from '../server';

@Injectable()
export class WebSocketService implements OnInit {

  connection: WebSocket;

  listeners = [];

  constructor() {
    this.connection = new WebSocket(server.WS_URL);
    this.connection.onopen = (() => {
      console.log('Web socket connection opened @ ' + server.WS_URL);
    });

    this.connection.onerror = ((error) => {
      console.error(error);
    });

    /**
     * Call all the registered listers
     */
    this.connection.onmessage = ((message) => {
      let data = JSON.parse(message.data);
      this.listeners.forEach((listener) => {
        listener(data);
      })
    });
  }

  ngOnInit() {

  }

  register(callback): number {
    return this.listeners.push(callback);
  }

  unRegister(index): void {
    delete this.listeners[index];
  }
}
