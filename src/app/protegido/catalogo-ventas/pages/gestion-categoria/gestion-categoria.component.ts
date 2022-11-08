import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-gestion-categoria',
  templateUrl: './gestion-categoria.component.html',
  styleUrls: ['./gestion-categoria.component.css']
})
export class GestionCategoriaComponent implements OnInit {


  generando: boolean = false;

  tamano: number = 0;
  limite: number = 0;
  indice: number = -1;
  desde: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  // Referencia para páginador
  paginadorPorReferencia!: PageEvent;

  // Cambiar de página
  cambioDePagina(evento: PageEvent) {

    // Hacer referencia al páginador
    this.paginadorPorReferencia = evento
  }

  // Cuando se presione Enter en la casilla buscar
  buscarRegistro() {
    // Si se ha cambiado el páginador
    if (this.paginadorPorReferencia) {
      this.indice = -1;
    }
  }

}
