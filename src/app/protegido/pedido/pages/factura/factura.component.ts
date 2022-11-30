import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacturacionService } from './services/facturacion.service';
import { Detalle, Pedido } from '../atencion/interfaces/pedido.interfaces';
import { CAI } from '../../../administracion/pages/cai/interfaces/cai.interface';
import { AuthService } from '../../../../auth/services/auth.service';
import { Descuento } from '../descuento/interfaces/descuento.interface';
import { DescuentoService } from '../descuento/services/descuento.service';
import { MetodoPago } from './interfaces/factura.interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']
})
export class FacturaComponent implements OnInit {

  // Hijos
  @ViewChild('cambio') inputCambio!: ElementRef;
  @ViewChild('dineroRecibido') dineroRecibido!: ElementRef;
  @ViewChild('checkCai') checkCai!: MatCheckbox

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
  gravado: number = 0.00
  cambioAux: number = 0.00;

  clienteAbierto: boolean = false;

  enEjecucion: boolean = false;
  // Atributos pedido
  impuesto15: number = 0.00;
  impuesto18: number = 0.00;

  get usuario() {
    return this.authService.usuario.nombre
  }

  constructor(private router: Router, private descuentoService: DescuentoService, private activatedRouter: ActivatedRoute, private facturaService: FacturacionService, private authService: AuthService, private fb: FormBuilder) { }

  // Formulario
  formularioDescuento: FormGroup = this.fb.group({
    tipoDescuento:    ['', [Validators.required, Validators.maxLength(100)]],
    descuento:        ['', [Validators.required, Validators.maxLength(100)]]
  })

  // Formulario
  formularioCambio: FormGroup = this.fb.group({
    recibido:    ['', [Validators.required, Validators.maxLength(100)]],
    tipoPago:    ['', [Validators.required, Validators.maxLength(100)]]
  })

  formularioCliente: FormGroup = this.fb.group({
    nombre:      ['', [Validators.required, Validators.maxLength(150), Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]],
    RTN:    ['', [Validators.required, Validators.maxLength(16), Validators.minLength(16)]],
    direccion:   ['', [Validators.required, Validators.maxLength(200), Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]],
    ordenCompra:      ['', [Validators.maxLength(20)]],
    consReg:    ['', [Validators.maxLength(20)]],
    noReg:   ['', [Validators.maxLength(20)]]
  })

  async clienteAbiertoClick() {
    if(this.clienteAbierto) {
      this.formularioCliente.reset();
    }
    this.clienteAbierto = this.clienteAbierto ? false : true;
  }

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
    let { descuento } = this.formularioDescuento.value

    // Reiniciar el descuento e impuestos
    this.descuento = 0;
    this.impuesto15 = 0;
    this.impuesto18 = 0;
    this.exento = 0;

    this.detalle.forEach(producto => {

      if(descuento > (this.toFloat(producto.PRECIO_DETALLE)*producto.CANTIDAD) && descuento != 0) {

        // Asignar el descuento actual
        this.descuento += this.toFloat((this.toFloat(producto.PRECIO_DETALLE)).toFixed(2)) * producto.CANTIDAD;

        // Calcular nuevo impuesto del producto
        if( producto.ID_IMPUESTO == 1) {
          this.impuesto15 += 0
        } else {
          this.impuesto18 += 0
        }

        // Reducir la cantidad de descuento del contador
        descuento -= this.descuento
      } else {
        // Asignar el descuento actual
        this.descuento += descuento

        // Calcular nuevo impuesto del producto
        if (!producto.EXENTA) {
          if (producto.ID_IMPUESTO == 1) {
            this.impuesto15 += this.toFloat((this.toFixedHTML(((this.toFloat(producto.PRECIO_DETALLE) * producto.CANTIDAD - (descuento)) * this.toFloat(producto.PORCENTAJE_IMPUESTO / 100)))))
          } else {
            this.impuesto18 += this.toFloat((this.toFixedHTML(((this.toFloat(producto.PRECIO_DETALLE) * producto.CANTIDAD - (descuento)) * this.toFloat(producto.PORCENTAJE_IMPUESTO / 100)))))
          }
        } else {

          this.exento += this.toFloat((this.toFixedHTML(((this.toFloat(producto.PRECIO_DETALLE) * producto.CANTIDAD - (descuento)) * this.toFloat(producto.PORCENTAJE_IMPUESTO / 100)))))
        }
        descuento -= descuento
      }
      
    });

  }

  canjearDescuento() {
    const { tipoDescuento } = this.formularioDescuento.value

    let descuentoAux = 0.00;
    // Asignar cantidad de descuento a la variable auxiliar de descuento
    if( tipoDescuento.ID_TIPO_DESCUENTO === 1) {
      descuentoAux = tipoDescuento.CANTIDAD;  //FIJO
    } else {    // PORCENTAJE
      descuentoAux = this.toFloat((this.toFloat(this.pedido.SUBTOTAL) * tipoDescuento.CANTIDAD/100).toFixed(2));
    }

    // Reiniciar el descuento e impuestos
    this.descuento = 0;
    this.impuesto15 = 0;
    this.impuesto18 = 0;
    this.exento = 0;

    this.detalle.forEach(producto => {

      if(descuentoAux > (this.toFloat(producto.PRECIO_DETALLE)*producto.CANTIDAD) && descuentoAux != 0) {

        // Asignar el descuento actual
        this.descuento += this.toFloat((this.toFloat(producto.PRECIO_DETALLE)).toFixed(2)) * producto.CANTIDAD;

        // Calcular nuevo impuesto del producto
        if( producto.ID_IMPUESTO == 1) {
          this.impuesto15 += 0
        } else {
          this.impuesto18 += 0
        }

        // Reducir la cantidad de descuento del contador
        descuentoAux -= this.descuento
      } else {
        // Asignar el descuento actual
        this.descuento += descuentoAux

        // Calcular nuevo impuesto del producto
        if (!producto.EXENTA) {
          if (producto.ID_IMPUESTO == 1) {
            this.impuesto15 += this.toFloat((this.toFixedHTML(((this.toFloat(producto.PRECIO_DETALLE) * producto.CANTIDAD - (descuentoAux)) * this.toFloat(producto.PORCENTAJE_IMPUESTO / 100)))))
          } else {
            this.impuesto18 += this.toFloat((this.toFixedHTML(((this.toFloat(producto.PRECIO_DETALLE) * producto.CANTIDAD - (descuentoAux)) * this.toFloat(producto.PORCENTAJE_IMPUESTO / 100)))))
          }
        } else {

          this.exento += this.toFloat((this.toFixedHTML(((this.toFloat(producto.PRECIO_DETALLE) * producto.CANTIDAD - (descuentoAux)) * this.toFloat(producto.PORCENTAJE_IMPUESTO / 100)))))
        }
        descuentoAux -= descuentoAux

      }
      
    });

  }

  calcularCambio() {

    const { recibido } = this.formularioCambio.value;

    this.inputCambio.nativeElement.value = (this.toFloat(recibido) - (this.toFloat(this.pedido.SUBTOTAL) - this.toFloat(this.descuento) + this.toFloat(this.impuesto15) + this.toFloat(this.impuesto18))).toFixed(2)

    this.cambioAux = this.toFloat((this.toFloat(recibido) - (this.toFloat(this.pedido.SUBTOTAL) - this.toFloat(this.descuento) + this.toFloat(this.impuesto15) + this.toFloat(this.impuesto18))).toFixed(2))
  }

  getTotalImpuesto() {
    this.impuesto15 = 0.00;
    this.impuesto18 = 0.00;
    this.exento = 0.00
    this.gravado = 0.00;
    this.detalle.forEach(producto => {
      if( !producto.EXENTA ) {

        if( producto.ID_IMPUESTO == 1) {
          this.impuesto15 += parseFloat( producto.TOTAL_IMPUESTO ) * producto.CANTIDAD 
        } else {
          this.impuesto18 += parseFloat( producto.TOTAL_IMPUESTO ) * producto.CANTIDAD
        }
        this.gravado += this.toFloat(producto.PRECIO_DETALLE) * producto.CANTIDAD
      } else {
        this.exento += this.toFloat((this.toFixedHTML(this.toFloat(producto.PRECIO_DETALLE) * (this.toFloat(producto.PORCENTAJE_IMPUESTO)/100)* producto.CANTIDAD)))
        this.gravado += this.toFloat(producto.PRECIO_DETALLE) * producto.CANTIDAD
        
      }
    });
  }

  postFactura() {

    if (!this.enEjecucion) {
      this.enEjecucion = true
      const { nombre, RTN, direccion } = this.formularioCliente.value
      const { tipoDescuento, descuento } = this.formularioDescuento.value
      const { recibido, tipoPago } = this.formularioCambio.value;
      const total = (this.toFloat(this.pedido.SUBTOTAL) + this.toFloat(this.impuesto18) +
        this.toFloat(this.impuesto15)) - descuento
      console.log(this.exento, this.gravado)
      console.log(this.checkCai.checked)
      console.log(tipoDescuento)
      this.facturaService.postFactura(this.pedido.ID, nombre, RTN, direccion, false, tipoDescuento.ID, descuento, this.exento, this.gravado, this.impuesto15, this.impuesto18, total, tipoPago, recibido, this.cambioAux, this.checkCai.checked)
        .subscribe(resp => {
          if (resp.ok === true) {
            this.enEjecucion = false
            Swal.fire({
              title: '¡Éxito!',
              text: resp.msg,
              icon: 'success',
              showCancelButton: true,
              confirmButtonColor: '#898989',
              cancelButtonColor: '#d12609',
              confirmButtonText: 'Imprimir',
              cancelButtonText: 'Salir de facturación',
              background: '#2B2B2B',
              color: '#fff',
              heightAuto: false
            }).then((result) => {
              if (result.isConfirmed) {

                if(!this.enEjecucion) {

                  this.enEjecucion = true
                  this.facturaService.postImprimirFactura(this.pedido.ID, nombre, RTN, direccion, false, tipoDescuento.ID, descuento, this.exento, this.gravado, this.impuesto15, this.impuesto18, total, tipoPago, recibido, this.cambioAux, this.checkCai.checked)
                    .subscribe(res => {
                      let blob = new Blob([res], { type: 'application/pdf' });
                      let pdfUrl = window.URL.createObjectURL(blob);
            
                      let PDF_link = document.createElement('a');
                      PDF_link.href = pdfUrl;
            
                      window.open(pdfUrl, '_blank');

                      /* PDF_link.download = "Reporte de Productos.pdf";
                      PDF_link.click() */;
                      this.enEjecucion = false
                      this.router.navigateByUrl('/main/pedido/atencion')
                    })

                }

              } else {
                this.router.navigateByUrl('/main/pedido/atencion')
              }
            })

          } else {
            this.enEjecucion = false
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
