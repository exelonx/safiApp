import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-permisos-notificacion',
  templateUrl: './permisos-notificacion.component.html',
  styleUrls: ['./permisos-notificacion.component.css']
})
export class PermisosNotificacionComponent implements OnInit {

  // Atributos = controlar paginador y la tabla
  registros: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
