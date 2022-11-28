import { Component, EventEmitter, LOCALE_ID, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { IngresosService } from 'src/app/protegido/services/ingresos.service';
import { Caja } from './interface/cajaItems.interface';
import { CajaService } from './services/caja.service';
/* import { DatePipe, registerLocaleData } from '@angular/common'; */
/* import localeEs from '@angular/common/locales/es'; */
import Swal from 'sweetalert2';
/* registerLocaleData(localeEs, 'es'); */

@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css'],
  /* providers: [DatePipe, {provide: LOCALE_ID, useValue: 'es-HN' }] */
})
export class CajaComponent implements OnInit {

  

  // Subscripciones
  subscripcion!: Subscription;
  ingreso!: Subscription;

  // Atributos
  registros: Caja[] = [];
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

  @Output() onActualizacion: EventEmitter<undefined> = new EventEmitter();

  // Formulario
  formularioBusqueda: FormGroup = this.fb.group({
    fechaInicial: [''],
    fechaFinal: [''],
    /* buscar:    ['', [Validators.required, Validators.maxLength(100)]] */
  })

  enEjecucion: boolean = false;

  constructor( private cajaService: CajaService, private fb: FormBuilder, private usuario: AuthService, private ingresosService: IngresosService) {}

  ngOnInit(): void {
    // Registrar el ingreso a la pantalla
    this.registrarIngreso();

    // Lo que dice la función jaja
    this.cargarRegistros();

    // Lo que dice la función jaja
    this.cargarRegistro();
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
  cargarRegistro() {
    const id_usuario: number = this.usuario.usuario.id_usuario;
    this.subscripcion = this.cajaService.getCajaAbierta( )
      .subscribe(
        resp => {

          this.estadoCaja = true;
          
        }
      )
  }

  // Al entrar por primera vez a la pantalla
  cargarRegistros() {
    const id_usuario: number = this.usuario.usuario.id_usuario;
    this.subscripcion = this.cajaService.getCajasCerradas( id_usuario )
      .subscribe(
        resp => {
          this.registros = this.cajaService.cajas!
          this.tamano = resp.countCajas!
          this.limite = resp.limite!
        }
      )
  }

  registrarIngreso() {
    // Id del usuario logeado
    const id_usuario = this.usuario.usuario.id_usuario;

    // Registrar evento
    this.ingreso = this.ingresosService.eventoIngreso(id_usuario, 11)
      .subscribe();

  }

  public get cajaAbierta() : Caja {
    return this.cajaService.cajaAbierta;
  }

  /* abrirCaja(){

    this.caja.ESTADO == true;

  } */

  recargar() {
    // Datos requeridos
    const id_usuario: number = this.usuario.usuario.id_usuario;
    let { buscar } = this.formularioBusqueda.value;

    // Consumo
    this.subscripcion = this.cajaService.getCajasCerradas(id_usuario)
    .subscribe(
      resp => {
        this.registros = resp.cajas!
        this.tamano = resp.countCajas!
        this.limite = resp.limite!
        console.log(resp)
      }
    )
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
    this.subscripcion = this.cajaService.getCajasCerradas( id_usuario, buscar, evento.pageSize.toString(), desde, fechaInicial, fechaFinal )
      .subscribe(
        resp => {
          this.registros = resp.cajas!
          this.tamano = resp.countCajas!
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
    this.subscripcion = this.cajaService.getCajasCerradas( id_usuario, buscar, "", "", this.formularioBusqueda.value.fechaInicial, this.formularioBusqueda.value.fechaFinal )
      .subscribe(
        resp => {
          this.indice = 0;
          this.registros = resp.cajas!
          this.tamano = resp.countCajas!
          this.limite = resp.limite!
        }
      )
  }
  
  actualizarCajaEstado() {

    if(!this.enEjecucion) {
      this.enEjecucion = true;

      const id_usuario = this.usuario.usuario.id_usuario;
      
      this.cajaService.actualizarCajaCerrada(this.cajaAbierta.id, id_usuario)
        .subscribe(
          (resp => {
            this.onActualizacion.emit();
            if(resp.ok === true) {
              /* this.cerrarEditar._elementRef.nativeElement.click(); */
              Swal.fire({
                title: '¡Éxito!',
                text: resp.msg,
                icon: 'success',
                iconColor: 'white',
                background: '#a5dc86',
                color: 'white',
                toast: true,
                position: 'top-right',
                showConfirmButton: false,
                timer: 4500,
                timerProgressBar: true,
              })  
              this.enEjecucion = false;
              this.cargarRegistros();
              this.cajaAbierta.ESTADO=false;
            } else {
              Swal.fire({
                title: 'Advertencia',
                text: resp,
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
              this.enEjecucion = false;
            }
          })
        )

    }
      
  }; 

  

}
