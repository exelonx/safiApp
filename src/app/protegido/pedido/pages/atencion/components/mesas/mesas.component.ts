import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Mesa, Pedido } from '../../interfaces/pedido.interfaces';
import { PedidoService } from '../../services/pedido.service';

@Component({
  selector: 'app-mesas',
  templateUrl: './mesas.component.html',
  styleUrls: ['./mesas.component.css']
})
export class MesasComponent implements OnInit {

  @Output() onAbrirAgregar: EventEmitter<boolean> = new EventEmitter();
  @Input() mesa: Mesa = {
    ID: 0,
    ID_ESTADO: 0,
    ESTADO: "Pendiente",
    COLOR: "#248df6",
    NOMBRE: "rircardo",
    INFORMACION: '',
    TIPO: "MESA",
    FECHA: new Date()
  };
  @Input() filtro: string = ''
 
  colorEstado: string = '';   //Recibe el código hexadecimal de color para el estado
  estadoNombre: string = '';

  load: boolean = false;
  pedidos: Pedido[] = [];

  constructor( private pedidoSerice: PedidoService ) { }

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
    if(!this.load){
      this.pedidoSerice.getPedidoDeMesa(this.mesa.ID)
        .subscribe(pedidos => {
          this.pedidos = pedidos.pedidos!;
          this.load = true
        });

    }
  }

}
