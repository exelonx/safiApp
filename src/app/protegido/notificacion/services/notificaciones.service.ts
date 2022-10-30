import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  constructor() { }

  notificaciones: any[] = [
    {icono: 'inventory',mensaje: 'el weon de la wea hizo un cambio de una wea a la wea fome del pedido po csm', tiempo: '2 min'},
    {icono: 'inventory',mensaje: 'hola mundo', tiempo: '2 min'},
    {icono: 'restaurant',mensaje: 'hola mundo', tiempo: '2 min'},
    {icono: 'restaurant',mensaje: 'hola mundo', tiempo: '2 min'},
   ];
}
