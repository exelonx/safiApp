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
  
}
