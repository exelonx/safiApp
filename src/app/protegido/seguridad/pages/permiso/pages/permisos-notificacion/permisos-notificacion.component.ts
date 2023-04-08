import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Rol } from '../../../rol/interfaces/rolItems.interface';
import { PermisoService } from '../../services/permiso.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { IngresosService } from 'src/app/protegido/services/ingresos.service';
import { TipoNotificacion } from '../../interfaces/tipo-notificacion.interfaces';
import { PermisoNotificacion } from '../../interfaces/permiso.interfaces';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-permisos-notificacion',
  templateUrl: './permisos-notificacion.component.html',
  styleUrls: ['./permisos-notificacion.component.css']
})
export class PermisosNotificacionComponent implements OnInit {

  // Inputs
  @Input() roles: Rol[] = [];
  @Input() tiposDeNotificacion: TipoNotificacion[] = [];

  @Output() onSeleccionar: EventEmitter<number> = new EventEmitter();
  @Output() onAbrirMenu: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('selectRol') selectRol!: ElementRef;
  @ViewChild('selectTipo') selectTipo!: ElementRef;
  @ViewChild('mostrarTodo') mostrarTodo!: MatSlideToggle;
  @ViewChild('selectPantalla') selectPantalla!: ElementRef;

  // Atributos = controlar paginador y la tabla
  registros: PermisoNotificacion[] = [];
  tamano: number = 0;
  limite: number = 0;
  indice: number = -1;
  desde: string = "0";

  generando: boolean = false;

  // Validador de busqueda
  buscando: boolean = false;

  // Referencia para páginador
  paginadorPorReferencia!: PageEvent;

  // Subscripciones
  subscripcion!: Subscription;

  constructor(private permisoService: PermisoService, private fb: FormBuilder, private usuario: AuthService, private ingresosService: IngresosService) { }

  formularioBusqueda: FormGroup = this.fb.group({
    buscar: ['', [Validators.required, Validators.maxLength(100)]]
  })

  ngOnInit(): void {
    this.cargarRegistros()
  }

  // Al entrar por primera vez a la pantalla
  cargarRegistros() {
    const id_usuario: number = this.usuario.usuario.id_usuario;
    this.subscripcion = this.permisoService.getPermisosNotificacion(id_usuario, '1')
      .subscribe(
        resp => {
          this.registros = resp.permisos!
          this.tamano = resp.countPermisos!
          this.limite = resp.limite!
        }
      )
  }

  filtrarPermiso() {

    // Si se ha cambiado el páginador
    if (this.paginadorPorReferencia) {
      this.indice = -1;
    }

    this.desde = "0"

    // Limpiar subscripción
    this.subscripcion.unsubscribe();

    // data necesaria
    const id_usuario: number = this.usuario.usuario.id_usuario;
    const id_rol: string = this.selectRol.nativeElement.value;
    const id_tipo: string = this.selectTipo.nativeElement.value

    this.subscripcion = this.permisoService.getPermisosNotificacion(id_usuario, id_rol, id_tipo)
      .subscribe(
        resp => {
          this.indice = 0;
          this.registros = resp.permisos!
          this.tamano = resp.countPermisos!
          this.limite = resp.limite!
        }
      )
  }

  // Cambiar de página
  cambioDePagina(evento: PageEvent) {

    // Hacer referencia al páginador
    this.paginadorPorReferencia = evento

    // Limpiar subscripción
    this.subscripcion.unsubscribe();

    // Datos requeridos
    const id_usuario: number = this.usuario.usuario.id_usuario;
    const id_rol: string = this.selectRol.nativeElement.value;
    const id_pantalla: string = this.selectTipo.nativeElement.value

    // Calcular posición de página
    let desde: string = (evento.pageIndex * evento.pageSize).toString();
    this.desde = desde;

    // Consumo
    this.subscripcion = this.permisoService.getPermisosNotificacion(id_usuario, id_rol, id_pantalla, "", evento.pageSize.toString(), desde)
      .subscribe(
        resp => {
          this.registros = resp.permisos!
          this.tamano = resp.countPermisos!
          this.limite = resp.limite!
        }
      )
  }

  seleccionarPermiso(id: number) {
    this.onSeleccionar.emit( id )
  }

  // Para activar el modal de edición de sistema
  abrirMenu() {
    this.onAbrirMenu.emit(true)
  }

  recargar() {
    // Datos requeridos
    const id_usuario: number = this.usuario.usuario.id_usuario;
    const id_rol: string = this.selectRol.nativeElement.value;
    const id_pantalla: string = this.selectTipo.nativeElement.value

    // Consumo
    this.subscripcion = this.permisoService.getPermisosNotificacion(id_usuario, id_rol, id_pantalla, "", this.limite.toString(), this.desde)
      .subscribe(
        resp => {
          this.registros = resp.permisos!
          this.tamano = resp.countPermisos!
          this.limite = resp.limite!
        }
      )
  }

  generarReporte() {

    if (!this.generando) {


      this.generando = true;

      let { buscar } = this.formularioBusqueda.value;

      const id_rol: string = this.selectRol.nativeElement.value;
      const id_tipo: string = this.selectTipo.nativeElement.value
      const mostrar: boolean = this.mostrarTodo.checked

      this.permisoService.getReporteNoti(buscar, this.usuario.usuario.id_usuario, id_rol, id_tipo, mostrar)
        .subscribe(res => {
          let blob = new Blob([res], { type: 'application/pdf' });
          let pdfUrl = window.URL.createObjectURL(blob);

          let PDF_link = document.createElement('a');
          PDF_link.href = pdfUrl;

          window.open(pdfUrl, '_blank');

          /* PDF_link.download = "Reporte de Unidades.pdf";
          PDF_link.click(); */
          this.generando = false
        })

    }

  }
  
}
