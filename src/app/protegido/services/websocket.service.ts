import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public socketStatus = false;

  constructor( private socket: Socket) { 
    this.checkStatus();
  }

  checkStatus() {

    this.socket.on('connect', () => {
      console.log('conectado al servidor');
      this.socketStatus = true;
    })

    this.socket.on('disconnect', () => {
      console.log('desconectado del servidor')
      this.socketStatus = false;
    })
  }

  // Emitir eventos hacia el servidor
  emit( evento: string, payload?: any, callback?: Function ) {

    // emit('EVENTO', payload, callback?)
    this.socket.emit( evento, payload, callback );

  }

  // Escuchar eventos del servidor
  listen( evento: string ) {

    return this.socket.fromEvent( evento );

  }
  
}
