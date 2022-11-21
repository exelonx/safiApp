import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mesas',
  templateUrl: './mesas.component.html',
  styleUrls: ['./mesas.component.css']
})
export class MesasComponent implements OnInit {

  @Input() mesa: any = {
    ID_MESA: 0,
    ID_ESTADO: 0,
    ESTADO: "Pendiente",
    COLOR: "#248df6",
    NOMBRE: "rircardo",
    TIPO: "MESA",
    FECHA: new Date()
  };
  @Input() filtro: string = ''
 
  colorEstado: string = '';   //Recibe el código hexadecimal de color para el estado
  estadoNombre: string = '';

  load: boolean = false;
  pedidos: any[] = [];

  constructor(  ) { }

  ngOnInit(): void {
    this.colorEstado = this.mesa.COLOR;
  }

  getImgEstado(estado: string): string {
    if(estado === 'Pendiente') {
      return '/assets/icons/Pendiente.svg'
    } else if (estado === 'Cocinando') {
      return '/assets/icons/Cocinando.svg'
    } else if (estado === 'Listo') {
      return '/assets/icons/Listo.svg'
    } else {
      return '/assets/icons/Servido.svg'
    }
  }

  cargarPedidos(){
    
  }

}
