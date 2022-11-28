import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Pedido, Detalle } from '../../interfaces/pedido.interfaces';
import { PedidoService } from '../../services/pedido.service';
import { Router } from '@angular/router';
import { WebsocketService } from 'src/app/protegido/services/websocket.service';
import { AuthService } from '../../../../../../auth/services/auth.service';
import Swal from 'sweetalert2';

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

  actualizandoEstado: boolean = false;

  // Atributos pedido
  impuesto15: number = 0.00;
  impuesto18: number = 0.00;

  constructor( private pedidoService: PedidoService, private router: Router, public swService: WebsocketService, public authService: AuthService ) { }

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
    
    this.swService.listen('actualizarTabla')
      .subscribe( (resp: any) => {
        if( resp.idPedido === this.pedido.ID ) {

          this.cargarDetalleEnTabla();
          this.pedido = resp.newPedidoVista;

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

  getTotalImpuesto() {
    this.impuesto15 = 0.00;
    this.impuesto18 = 0.00;
    this.detalles.forEach(producto => {
      if( producto.ID_IMPUESTO == 1) {
        this.impuesto15 += parseFloat( producto.TOTAL_IMPUESTO ) * producto.CANTIDAD 
      } else {
        this.impuesto18 += parseFloat( producto.TOTAL_IMPUESTO ) * producto.CANTIDAD
      }
    });
  }

  getTotalMesa() {
    let total: number = 0;
    this.detalles.forEach(producto => {
      total += (producto.PRECIO_PRODUCTO * producto.CANTIDAD);
    });
    return total;
  }

  toFloat(valor: any): number {
    return parseFloat(valor)
  }

  cargarDetalleEnTabla() {
    this.pedidoService.getDetallePedido( this.pedido.ID )
      .subscribe( detalles => {
        this.detalles = detalles.detalleDePedido!;
        // Calcular impuestos
        this.getTotalImpuesto()
      })
  }

  facturar() {
    this.router.navigateByUrl('/main/pedido/factura')
  }

  seleccionar() {
    this.pedidoService.pedidoSeleccionado = this.pedido
  }

  actualizarEstado(id_detalle: number) {
    if(!this.actualizandoEstado) {

      this.actualizandoEstado = true;

      this.pedidoService.putEstadoDetalle(id_detalle, this.authService.usuario.id_usuario)
        .subscribe(resp=> {
          if(resp.ok === true) {
            this.actualizandoEstado = false;
            
          } else {
            this.actualizandoEstado = false
            Swal.fire({
              title: 'Advertencia',
              text: resp.msg,
              icon: 'warning',
              iconColor: 'white',
              background: '#f8bb86',
              color: 'white',
              toast: true,
              position: 'top-right',
              showConfirmButton: false,
              timer: 4500,
              timerProgressBar: true,
            })
          }
        })

    }
  }

}
