import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-atencion',
  templateUrl: './atencion.component.html',
  styleUrls: ['./atencion.component.css']
})
export class AtencionComponent implements OnInit {

  // Atributos
  filtro: string = '';
  mesas: any[] = [];

  // Destruir y crear modales
  creando: boolean = false;

  // Para usarse en reportería
  generando: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  getFiltro( evento: string ) {
    this.filtro = evento;
  }

}
