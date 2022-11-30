import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FacturacionService } from './services/facturacion.service';
import { Detalle, Pedido } from '../atencion/interfaces/pedido.interfaces';
import { CAI } from '../../../administracion/pages/cai/interfaces/cai.interface';
import { AuthService } from '../../../../auth/services/auth.service';
import { Descuento } from '../descuento/interfaces/descuento.interface';
import { DescuentoService } from '../descuento/services/descuento.service';
import { MetodoPago } from './interfaces/factura.interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']
})
export class FacturaComponent implements OnInit {

  panelOpenState = false;

  pedido: Pedido = {
    ID: 0,
    ID_USUARIO: 0,
    USUARIO: "",
    NOMBRE_USUARIO: "",
    ID_ESTADO: 0,
    ID_MESA: 0,
    NOMBRE: "",
    TIPO: "",
    ID_CAJA: 0,
    SUBTOTAL: 0.00,
    NOMBRE_CLIENTE: "",
    HORA_SOLICITUD: new Date(),
    HORA_FINALIZACION: new Date(),
    MODIFICADO_POR: "",
    FECHA_MODIFICACION: new Date()
  };
  detalle: Detalle[] = [];
  cai: CAI[] = []
  listaDescuento: Descuento[] = [];
  listaMetodoPago: MetodoPago[] = [];

  fechaActual: Date = new Date();
  descuento: number = 0.00
  exento: number = 0.00
  exonerado: number = 0.00
  cambio: number = 0.00

  // Atributos pedido
  impuesto15: number = 0.00;
  impuesto18: number = 0.00;

  get usuario() {
    return this.authService.usuario.nombre
  }

  constructor(private descuentoService: DescuentoService, private activatedRouter: ActivatedRoute, private facturaService: FacturacionService, private authService: AuthService, private fb: FormBuilder) { }

  // Formulario
  formularioDescuento: FormGroup = this.fb.group({
    tipoDescuento:    ['', [Validators.required, Validators.maxLength(100)]],
    descuento:        ['', [Validators.required, Validators.maxLength(100)]]
  })

  // Formulario
  formularioCambio: FormGroup = this.fb.group({
    recibido:    ['', [Validators.required, Validators.maxLength(100)]]
  })

  async validarNumeros(e: KeyboardEvent) {
    console.log(e.key)
    if(e.key === '+' || e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '.') {
      e.preventDefault()
    }
  }

  ngOnInit(): void {
    this.cargarInformacion()
    this.cargarDescuentos()
    this.cargarTipoPago()
  }

  toFloat(valor: any): number {
    return parseFloat(valor)
  }

  toFixedHTML(valor: number) {
    return valor.toFixed(2)
  }

  cargarTipoPago() {
    const usuario = this.authService.usuario.id_usuario
    this.facturaService.getTipoPago()
      .subscribe(
        resp => {
          this.listaMetodoPago = resp.tipoPago!;
        }
      )
  }

  cargarInformacion() {
    let id_pedido: number = 0
    this.activatedRouter.params.subscribe(parametro => {
      id_pedido = parametro['id_pedido']
    
      this.facturaService.getInformacion( id_pedido )
        .subscribe( 
          resp => {
            this.pedido = resp.pedido!;
            this.cai = resp.cai!;
            this.detalle = resp.detalle!;
            this.getTotalImpuesto()
          }
        )

    })
  }

  cargarDescuentos() {
    const usuario = this.authService.usuario.id_usuario
    this.descuentoService.getDescuentos(usuario, "", "99999")
      .subscribe(
        resp => {
          this.listaDescuento = resp.descuentos!;
        }
      )
  }

  ingresarDescuento() {
    const { descuento } = this.formularioDescuento.value

    if(descuento > this.pedido.SUBTOTAL) {
      this.descuento = this.toFloat((this.toFloat(this.pedido.SUBTOTAL)+this.impuesto15+this.impuesto18).toFixed(2))
    } else {
      this.descuento = this.toFloat(descuento)
    }
  }

  canjearDescuento() {
    const { tipoDescuento } = this.formularioDescuento.value

    if( tipoDescuento.ID_TIPO_DESCUENTO === 1) {
      this.descuento = tipoDescuento.CANTIDAD;

    } else {
      this.descuento = this.toFloat((this.toFloat(this.pedido.SUBTOTAL) * tipoDescuento.CANTIDAD/100).toFixed(2));

    }
  }

  calcularCambio() {

  }

  getTotalImpuesto() {
    this.impuesto15 = 0.00;
    this.impuesto18 = 0.00;
    this.exento = 0.00
    this.detalle.forEach(producto => {
      if( !producto.EXENTA ) {

        console.log('hola')
        if( producto.ID_IMPUESTO == 1) {
          this.impuesto15 += parseFloat( producto.TOTAL_IMPUESTO ) * producto.CANTIDAD 
        } else {
          this.impuesto18 += parseFloat( producto.TOTAL_IMPUESTO ) * producto.CANTIDAD
        }

      } else {
        this.exento += this.toFloat(this.toFixedHTML(this.toFloat(producto.PRECIO_DETALLE) * (this.toFloat(producto.PORCENTAJE_IMPUESTO)/100)))
      }
    });
  }

}
