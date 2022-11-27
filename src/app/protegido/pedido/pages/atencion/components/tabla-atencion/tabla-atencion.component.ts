import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Pedido, Detalle } from '../../interfaces/pedido.interfaces';
import { PedidoService } from '../../services/pedido.service';
import { Router } from '@angular/router';
import { WebsocketService } from 'src/app/protegido/services/websocket.service';

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

  constructor( private pedidoService: PedidoService, private router: Router, public swService: WebsocketService ) { }

  ngOnInit(): void {
    this.cargarDetalleEnTabla()

    // Recargar tabla
    this.swService.listen('productoAgregado')
      .subscribe( (resp: any) => {
        if( resp.id_pedido === this.pedido.ID ) {

          this.cargarDetalleEnTabla();
          this.pedido = resp.pedidoPayload;

        }
      })
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

  toFloat(valor: string): number {
    return parseFloat(valor)
  }

  cargarDetalleEnTabla() {
    this.pedidoService.getDetallePedido( this.pedido.ID )
      .subscribe( detalles => {
        this.detalles = detalles.detalleDePedido!;
        console.log(detalles)
      })
  }

  facturar() {
    this.router.navigateByUrl('/main/pedido/factura')
  }

  seleccionar() {
    this.pedidoService.pedidoSeleccionado = this.pedido
  }

}
