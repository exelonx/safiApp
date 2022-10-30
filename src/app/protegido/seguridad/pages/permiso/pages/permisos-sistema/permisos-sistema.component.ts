import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-permisos-sistema',
  templateUrl: './permisos-sistema.component.html',
  styleUrls: ['./permisos-sistema.component.css']
})
export class PermisosSistemaComponent implements OnInit {
  
  // Atributos = controlar paginador y la tabla
  registros: any[] = [];
  
  constructor() { }

  ngOnInit(): void {
  }

}
