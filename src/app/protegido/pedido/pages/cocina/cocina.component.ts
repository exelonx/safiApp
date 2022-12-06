import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InputMayus } from 'src/app/helpers/input-mayus';
import { IngresosService } from 'src/app/protegido/services/ingresos.service';
import { PermisosPantallaService } from 'src/app/protegido/services/permisos-pantalla.service';
import Swal from 'sweetalert2';
import { Detalle } from './interfaces/cocina.interface';
import { CocinaService } from './services/cocina.service';
import { WebsocketService } from '../../../services/websocket.service';

@Component({
  selector: 'app-cocina',
  templateUrl: './cocina.component.html',
  styleUrls: ['./cocina.component.css']
})
export class CocinaComponent implements OnInit, OnDestroy {

  @Output() onAbrirMenu: EventEmitter<boolean> = new EventEmitter();

  constructor(private usuario: AuthService, private pantalla: PermisosPantallaService,
    private cocinaService: CocinaService, private fb: FormBuilder,
    public authService: AuthService, private ingresosService: IngresosService, private wsService: WebsocketService) { }



  public get permisos() {
    return this.pantalla.permisos;
  }

  public get detalles() {
    return this.cocinaService.detalle
  }

  toMayus = InputMayus.toMayusNoReactivo;

  // Subscripciones 
  subscripcion!: Subscription;
  ingreso!: Subscription;

  // Atributos = controlar paginador y la tabla

  tamano: number = 0;
  limite: number = 0;
  indice: number = -1;
  desde: string = "0";
  registros: Detalle[] = [];

  generando: boolean = false;

  // Validador de busqueda
  buscando: boolean = false;

  actualizandoEstado: boolean[] = [];

  subsSocket1!: Subscription
  subsSocket2!: Subscription
  subsSocket3!: Subscription

  // Formulario
  formularioBusqueda: FormGroup = this.fb.group({
    buscar: ['', [Validators.required, Validators.maxLength(100)]]
  })

  // Referencia para páginador
  paginadorPorReferencia!: PageEvent;

  creando: boolean = false;
  editando: boolean = false;

  // Al entrar por primera vez a la pantalla
  cargarRegistros() {
    const id_usuario: number = this.usuario.usuario.id_usuario;
    this.subscripcion = this.cocinaService.getDetallePedido(id_usuario)
      .subscribe(
        resp => {
          console.log(resp)
          this.registros = resp.detalles!
          this.tamano = resp.countDetalles!
          this.limite = resp.limite!
        }
      )
  }

  generarReporte() {

    if (!this.generando) {


      this.generando = true;

      let { buscar } = this.formularioBusqueda.value;

      this.cocinaService.getReporte(buscar)
        .subscribe(res => {
          let blob = new Blob([res], { type: 'application/pdf' });
          let pdfUrl = window.URL.createObjectURL(blob);

          let PDF_link = document.createElement('a');
          PDF_link.href = pdfUrl;

          window.open(pdfUrl, '_blank');

          this.generando = false
        })
    }
  }

  // Cambiar de página
  cambioDePagina(evento: PageEvent) {

    // Hacer referencia al páginador
    this.paginadorPorReferencia = evento

    // Limpiar subscripción
    this.subscripcion.unsubscribe();

    // Datos requeridos
    const id_usuario: number = this.usuario.usuario.id_usuario;
    let { buscar } = this.formularioBusqueda.value;

    // Si no se esta buscando no se envia nada
    if (!this.buscando) {
      buscar = ""
    }

    // Calcular posición de página
    let desde: string = (evento.pageIndex * evento.pageSize).toString();
    this.desde = desde;

    // Consumo
    this.subscripcion = this.cocinaService.getDetallePedido(id_usuario, buscar, evento.pageSize.toString(), desde)
      .subscribe(
        resp => {
          this.registros = resp.detalles!
          this.tamano = resp.countDetalles!
          this.limite = resp.limite!
        }
      )
  }

  buscarRegistro() {
    // Si se ha cambiado el páginador
    if (this.paginadorPorReferencia) {
      this.indice = -1;
    }

    // Limpiar subscripción
    this.subscripcion.unsubscribe();

    // Datos requeridos
    const id_usuario: number = this.usuario.usuario.id_usuario;
    const { buscar } = this.formularioBusqueda.value;

    // Para evitar conflictos con el páginador
    if (buscar !== "") {
      this.buscando = true
    } else {
      this.buscando = false
    }

    this.desde = "0"

    // Consumo
    this.subscripcion = this.cocinaService.getDetallePedido(id_usuario, buscar)
      .subscribe(
        resp => {
          this.indice = 0;
          this.registros = resp.detalles!
          this.tamano = resp.countDetalles!
          this.limite = resp.limite!
        }
      )
  }

  /* seleccionar(id_unidad: number) {
    this.unidadService.getUnidad(id_unidad)
      .subscribe()
  } */

  recargar() {
    // Datos requeridos
    const id_usuario: number = this.usuario.usuario.id_usuario;
    let { buscar } = this.formularioBusqueda.value;

    // Consumo
    this.subscripcion = this.cocinaService.getDetallePedido(id_usuario, buscar, this.limite.toString(), this.desde)
      .subscribe(
        resp => {
          this.registros = resp.detalles!
          this.tamano = resp.countDetalles!
          this.limite = resp.limite!
        }
      )
  }

  // Para activar el modal de edición de sistema
  abrirMenu() {
    this.onAbrirMenu.emit(true)
  }

  registrarIngreso() {
    // Id del usuario logeado
    const id_usuario = this.usuario.usuario.id_usuario;

    // Registrar evento
    this.ingreso = this.ingresosService.eventoIngreso(id_usuario, 31)
      .subscribe();

  }

  actualizarEstado(id_detalle: number, index: number) {
    if (!this.actualizandoEstado[index]) {

      this.actualizandoEstado[index] = true;

      this.cocinaService.putEstadoDetalle(id_detalle, this.authService.usuario.id_usuario)
        .subscribe(resp => {
          if (resp.ok === true) {
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

  ngOnInit(): void {

    this.subsSocket1 = this.wsService.listen('productoAgregado')
      .subscribe((resp: any) => {

        this.recargar();
      })

    this.subsSocket2 = this.wsService.listen('actualizarTabla')
      .subscribe((resp: any) => {

        this.recargar();
      })

    this.subsSocket3 = this.wsService.listen('actualizarMesa')
      .subscribe((resp: any) => {

        this.recargar();
      })

    this.registrarIngreso()
    this.cargarRegistros();

  }

  ngOnDestroy(): void {
    // Destruir subscripciones
    if (this.subsSocket1) {
      this.subsSocket1.unsubscribe();
    }
    if (this.subsSocket2) {
      this.subsSocket2.unsubscribe();
    }
    if (this.subsSocket3) {
      this.subsSocket3.unsubscribe();
    }
    if (this.subscripcion) {
      this.subscripcion.unsubscribe();
    }
    if (this.ingreso) {
      this.ingreso.unsubscribe();
    }
  }

  getColorPlato(paraLlevar: boolean): string {
    if(paraLlevar){
      return 'llevar'
    } else {
      return 'noLlevar'
    }
  }
}
