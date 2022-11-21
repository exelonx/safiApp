import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-barra-estado',
  templateUrl: './barra-estado.component.html',
  styleUrls: ['./barra-estado.component.css']
})
export class BarraEstadoComponent implements OnInit {

  @Output() onFiltro: EventEmitter<string> = new EventEmitter();

  estado: string = ''

  constructor() { }

  ngOnInit(): void {
  }

  filtrar(estado: string) {
    this.estado = estado;
    this.onFiltro.emit(estado)
  }

  bgFiltro(estado: string):string {
    if(this.estado === estado) {
      return 'bg-dark';
    } else {
      return '';
    }
  }
}
