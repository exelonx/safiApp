import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Pedido, Detalle } from '../../interfaces/pedido.interfaces';
import { PedidoService } from '../../services/pedido.service';

@Component({
  selector: 'app-tabla-atencion',
  templateUrl: './tabla-atencion.component.html',
  styleUrls: ['./tabla-atencion.component.css']
})
export class TablaAtencionComponent implements OnInit {

  @Output() onAgregar: EventEmitter<boolean> = new EventEmitter();
  @Input() load: boolean = false; //Para hacer lazy-load de los datos
  @Input() pedido!: Pedido;
  detalles: Detalle[] = [];

  constructor( private pedidoService: PedidoService ) { }

  ngOnInit(): void {
    this.cargarDetalleEnTabla()
  }

  getColorPlato(paraLlevar: boolean): string {
    if(paraLlevar){
      return 'llevar'
    } else {
      return 'noLlevar'
    }
  }

  getTotalMesa() {
    let total: number = 0;
    this.detalles.forEach(producto => {
      total += (producto.PRECIO_PRODUCTO * producto.CANTIDAD);
    });
    return total;
  }

  cargarDetalleEnTabla() {
    this.pedidoService.getDetallePedido( this.pedido.ID )
      .subscribe( detalles => {
        this.detalles = detalles.detalleDePedido!;
        console.log(this.detalles)
      })
  }

}
