import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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

  @ViewChild('selectRol') selectRol!: ElementRef;
  @ViewChild('selectPantalla') selectPantalla!: ElementRef;

  // Atributos = controlar paginador y la tabla
  registros: PermisoNotificacion[] = [];
  tamano: number = 0;
  limite: number = 0;
  indice: number = -1;
  desde: number = 0;

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

    // Limpiar subscripción
    this.subscripcion.unsubscribe();

    // data necesaria
    const id_usuario: number = this.usuario.usuario.id_usuario;
    const id_rol: string = this.selectRol.nativeElement.value;
    const id_pantalla: string = this.selectPantalla.nativeElement.value
    
    this.subscripcion = this.permisoService.getPermisosNotificacion(id_usuario, id_rol, id_pantalla)
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
    const id_pantalla: string = this.selectPantalla.nativeElement.value

    // Calcular posición de página
    let desde: string = (evento.pageIndex * evento.pageSize).toString();
    this.desde = evento.pageIndex;

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
  
}
