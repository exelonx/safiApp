import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Rol } from '../rol/interfaces/rolItems.interface';
import { RolService } from '../rol/services/rol.service';
import { Subscription } from 'rxjs';
import { PermisoService } from './services/permiso.service';
import { Pantalla } from './interfaces/pantalla.interfaces';
import { TipoNotificacion } from './interfaces/tipo-notificacion.interfaces';
import { PermisosSistemaComponent } from './pages/permisos-sistema/permisos-sistema.component';
import { PermisosNotificacionComponent } from './pages/permisos-notificacion/permisos-notificacion.component';

@Component({
  selector: 'app-permiso',
  templateUrl: './permiso.component.html',
  styleUrls: ['./permiso.component.css']
})
export class PermisoComponent implements OnInit, OnDestroy {

  // Atributos
  roles: Rol[] = [];
  listaPantalla: Pantalla[] = [];
  listaTipoNoti: TipoNotificacion[] = [];
  editandoSistema:boolean = false;
  editandoNotificacion:boolean = false;
  @ViewChild('hijoPermisoSistema') permisoSistema!: PermisosSistemaComponent;
  @ViewChild('hijoPermisoNotificacion') permisoNotificacion!: PermisosNotificacionComponent;

  // Subscripciones
  rolSubs!: Subscription;
  pantallaSubs!: Subscription;
  tipoNotiSubs!: Subscription;
  permisoCargadoSub!: Subscription;

  constructor(private rolService: RolService, private authService: AuthService, private permiso: PermisoService) { }

  ngOnInit(): void {
    this.cargarRoles()
    this.cargarListaPantallas()
    this.cargarListaTipoNotificacion()
  }

  cargarRoles() {
    const id_usuario = this.authService.usuario.id_usuario
    this.rolSubs = this.rolService.getRoles(id_usuario, "", "999999")
      .subscribe(resp => {
        this.roles = resp.roles!;
      })

  }

  cargarListaPantallas() {
    this.pantallaSubs = this.permiso.getListaPantallas()
      .subscribe( pantallas => {
        this.listaPantalla = pantallas.pantallas;
      })
  }

  ngOnDestroy(): void {

    if(this.rolSubs) {
      this.rolSubs.unsubscribe()
    }
    if(this.tipoNotiSubs) {
      this.tipoNotiSubs.unsubscribe()
    }
    if(this.pantallaSubs) {
      this.pantallaSubs.unsubscribe()
    }
    if(this.permisoCargadoSub) {
      this.permisoCargadoSub.unsubscribe()
    }
    
  }

  cargarListaTipoNotificacion() {
    this.tipoNotiSubs = this.permiso.getListaTipoNotificaciones()
      .subscribe( tipo => {
        this.listaTipoNoti = tipo.tipoNotificacion!;
      })
    
  }

  cargarPermiso(idPermiso: number) {
    this.permiso.cargarPermiso(idPermiso)
      .subscribe()
  }

  cargarPermisoNoti(idPermiso: number) {
    this.permiso.cargarPermisoNotificacion(idPermiso)
      .subscribe()
  }

  // Método que se dispara con el output del componente editar, y llama al método del componente hijo de la tabla
  recargar() {
    this.permisoSistema.recargar();
  }

  recargarNotificacion() {
    this.permisoNotificacion.recargar();
  }

}
