import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Pedido, Detalle } from '../../interfaces/pedido.interfaces';
import { PedidoService } from '../../services/pedido.service';
import { Router } from '@angular/router';
import { WebsocketService } from 'src/app/protegido/services/websocket.service';
import { AuthService } from '../../../../../../auth/services/auth.service';
import Swal from 'sweetalert2';
import { PermisosPantallaService } from 'src/app/protegido/services/permisos-pantalla.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tabla-atencion',
  templateUrl: './tabla-atencion.component.html',
  styleUrls: ['./tabla-atencion.component.css']
})
export class TablaAtencionComponent implements OnInit, OnDestroy {

  @Output() onAgregar: EventEmitter<boolean> = new EventEmitter();
  @Input() load: boolean = false; //Para hacer lazy-load de los datos
  @Input() pedido!: Pedido;
  detalles: Detalle[] = [];
  subsSocket1!: Subscription;
  subsSocket2!: Subscription;

  actualizandoEstado: boolean[] = [];

  nombre: string = "";
  cantidad: number = 0;
  idDetalle: number = 0;
  eliminando: boolean = false;

  // Atributos pedido
  impuesto15: number = 0.00;
  impuesto18: number = 0.00;

  public get permisos() {
    return this.pantalla.permisos;
  }

  constructor( private pedidoService: PedidoService, private router: Router, public swService: WebsocketService, public authService: AuthService, private pantalla: PermisosPantallaService ) { }

  ngOnInit(): void {
    this.cargarDetalleEnTabla()

    // Recargar tabla
    this.subsSocket1 = this.swService.listen('productoAgregado')
      .subscribe( (resp: any) => {
        if( resp.id_pedido === this.pedido.ID ) {

          this.cargarDetalleEnTabla();
          this.pedido = resp.pedidoPayload;

        }
      })
    
    this.subsSocket2 = this.swService.listen('actualizarTabla')
      .subscribe( (resp: any) => {
        if( resp.idPedido === this.pedido.ID ) {

          this.cargarDetalleEnTabla();
          this.pedido = resp.newPedidoVista;

        }
      })
  }

  ngOnDestroy(): void {
    if(this.subsSocket1) {
      this.subsSocket1.unsubscribe()
    }

    if(this.subsSocket2) {
      this.subsSocket2.unsubscribe()
    }
    
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
        for (let index = 0; index < this.detalles.length; index++) {
          const element = this.detalles[index];
          this.actualizandoEstado.push(false)
        }
      })
  }

  facturar() {
    this.router.navigateByUrl('/main/pedido/factura/'+this.pedido.ID)
  }

  seleccionar() {
    this.pedidoService.pedidoSeleccionado = this.pedido
  }

  seleccionarDetalle(detalle: Detalle) {
    this.pedidoService.detalleSeleccionado = detalle
  }

  actualizarEstado(id_detalle: number, index: number) {
    if(!this.actualizandoEstado[index]) {

      this.actualizandoEstado[index] = true;

      this.pedidoService.putEstadoDetalle(id_detalle, this.authService.usuario.id_usuario)
        .subscribe(resp=> {
          if(resp.ok === true) {
            this.actualizandoEstado[index] = false;
            
          } else {
            this.actualizandoEstado[index] = false
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

  eliminarDetalle(id_detalle: number, nombre: string, cantidad: number) {
    this.nombre = nombre;
    this.cantidad = cantidad;
    this.idDetalle = id_detalle;
  }

}
