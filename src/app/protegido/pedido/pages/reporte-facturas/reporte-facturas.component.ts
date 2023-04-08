import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { IngresosService } from 'src/app/protegido/services/ingresos.service';
import { PermisosPantallaService } from 'src/app/protegido/services/permisos-pantalla.service';
import { Factura } from './interfaces/reporteFactura.interfaces';
import { ReporteFacturaService } from './services/reporte-factura.service';

@Component({
  selector: 'app-reporte-facturas',
  templateUrl: './reporte-facturas.component.html',
  styleUrls: ['./reporte-facturas.component.css']
})
export class ReporteFacturasComponent implements OnInit {

  // Subscripciones
  subscripcion!: Subscription;
  ingreso!: Subscription;

  // Atributos
  registros: Factura[] = [];
  tamano: number = 0;
  limite: number = 0;
  indice: number = -1;

  generando: boolean = false;

  creando: boolean = false;
  editando: boolean = false;

  estadoCaja: boolean = false;

  miFecha = new Date();
  currentDate = new Date();
 

  // Validador de busqueda
  buscando: boolean = false;

  // Referencia para páginador
  paginadorPorReferencia!: PageEvent;

  // Formulario
  formularioBusqueda: FormGroup = this.fb.group({
    fechaInicial: [''],
    fechaFinal: [''],
    buscar:    ['', [Validators.required, Validators.maxLength(100)]]
  })

  enEjecucion: boolean = false;

  constructor( private reporteFacturaService: ReporteFacturaService, private fb: FormBuilder, 
    private pantalla: PermisosPantallaService, private usuario: AuthService, private ingresosService: IngresosService) {}

  ngOnInit(): void {
    // Registrar el ingreso a la pantalla
    this.registrarIngreso();

    // Lo que dice la función jaja
    this.cargarRegistros();
  }
  
  ngOnDestroy(): void {
    // Destruir subscripciones
    if(this.subscripcion) {
      this.subscripcion.unsubscribe();
    }

    if(this.ingreso) {
      this.ingreso.unsubscribe();
    }
  }

  // Al entrar por primera vez a la pantalla
  cargarRegistros() {
    const id_usuario: number = this.usuario.usuario.id_usuario;
    this.subscripcion = this.reporteFacturaService.getFacturas()
      .subscribe(
        resp => {
          this.registros = resp.facturas!
          this.tamano = resp.countFactura!
          this.limite = resp.limite!
        }
      )
  }

  registrarIngreso() {
    // Id del usuario logeado
    const id_usuario = this.usuario.usuario.id_usuario;

    // Registrar evento
    this.ingreso = this.ingresosService.eventoIngreso(id_usuario, 34)
      .subscribe();

  }

  public get permisos() {
    return this.pantalla.permisos;
  }

  cambioDePagina(evento: PageEvent) {

    // Hacer referencia al páginador
    this.paginadorPorReferencia = evento

    // Limpiar subscripción
    this.subscripcion.unsubscribe();

    // Datos requeridos
    const id_usuario: number = this.usuario.usuario.id_usuario;
    let { buscar } = this.formularioBusqueda.value;
    let { fechaInicial } = this.formularioBusqueda.value
    let { fechaFinal } = this.formularioBusqueda.value

    // Si no se esta buscando no se envia nada
    if(!this.buscando) {
      buscar = "";
      fechaInicial = "";
      fechaFinal = "";
    }

    // Calcular posición de página
    let desde: string = (evento.pageIndex * evento.pageSize).toString();

    // Consumo
    this.subscripcion = this.reporteFacturaService.getFacturas( evento.pageSize.toString(), desde, fechaInicial, fechaFinal )
      .subscribe(
        resp => {
          this.registros = resp.facturas!
          this.tamano = resp.countFactura!
          this.limite = resp.limite!
        }
      )
  }

  // Cuando se presione Enter en la casilla buscar
  buscarRegistro() {
    
    // Si se ha cambiado el páginador
    if( this.paginadorPorReferencia ) {
      this.indice = -1;
    }

    // Limpiar subscripción
    this.subscripcion.unsubscribe();

    // Datos requeridos
    const id_usuario: number = this.usuario.usuario.id_usuario;
    const { buscar } = this.formularioBusqueda.value;

    // Para evitar conflictos con el páginador
    if( buscar !== "" ) {
      this.buscando = true
    } else {
      this.buscando = false
    }

    // Consumo
    this.subscripcion = this.reporteFacturaService.getFacturas( "", "", this.formularioBusqueda.value.fechaInicial, this.formularioBusqueda.value.fechaFinal )
      .subscribe(
        resp => {
          this.indice = 0;
          this.registros = resp.facturas!
          this.tamano = resp.countFactura!
          this.limite = resp.limite!
        }
      )
  }

  facturar(id_pedido: number) {
    if(!this.enEjecucion) {
      this.enEjecucion = true;

      this.reporteFacturaService.postImprimirFactura(id_pedido, this.usuario.usuario.id_usuario)
        .subscribe(
          res => {
            let blob = new Blob([res], { type: 'application/pdf' });
            let pdfUrl = window.URL.createObjectURL(blob);
  
            let PDF_link = document.createElement('a');
            PDF_link.href = pdfUrl;
  
            window.open(pdfUrl, '_blank');

            /* PDF_link.download = "Reporte de Productos.pdf";
            PDF_link.click() */;
            this.enEjecucion = false
            
          }
        );
    }
  }

}
