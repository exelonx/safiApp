import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { Rol } from '../../../rol/interfaces/rolItems.interface';
import { RolService } from '../../../rol/services/rol.service';
import { AuthService } from '../../../../../../auth/services/auth.service';
import { Pantalla } from '../../interfaces/pantalla.interfaces';
import { PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IngresosService } from 'src/app/protegido/services/ingresos.service';
import { PermisoService } from '../../services/permiso.service';
import { PermisoSistema } from '../../interfaces/permiso.interfaces';

@Component({
  selector: 'app-permisos-sistema',
  templateUrl: './permisos-sistema.component.html',
  styleUrls: ['./permisos-sistema.component.css']
})
export class PermisosSistemaComponent implements OnInit {
  
  @Input() roles: Rol[] = [];
  @Input() pantallas: Pantalla[] = [];

  @Output() onSeleccionar: EventEmitter<number> = new EventEmitter();
  @Output() onAbrirMenu: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('selectRol') selectRol!: ElementRef;
  @ViewChild('selectPantalla') selectPantalla!: ElementRef;

  registros: PermisoSistema[] = [];

  // Atributos = controlar paginador y la tabla
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

  deshabilitar(click: any) {
    click.stopPropagation();
  }

  // Al entrar por primera vez a la pantalla
  cargarRegistros() {
    const id_usuario: number = this.usuario.usuario.id_usuario;
    
    this.subscripcion = this.permisoService.getPermisos(id_usuario, '1')
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
    const id_pantalla: string = this.selectPantalla.nativeElement.value
    
    this.subscripcion = this.permisoService.getPermisos(id_usuario, id_rol, id_pantalla)
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
    this.desde = desde;

    console.log(desde)
    // Consumo
    this.subscripcion = this.permisoService.getPermisos(id_usuario, id_rol, id_pantalla, "", evento.pageSize.toString(), desde)
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
    const id_pantalla: string = this.selectPantalla.nativeElement.value

    // Consumo
    this.subscripcion = this.permisoService.getPermisos(id_usuario, id_rol, id_pantalla, "", this.limite.toString(), this.desde)
      .subscribe(
        resp => {
          this.registros = resp.permisos!
          this.tamano = resp.countPermisos!
          this.limite = resp.limite!
        }
      )
  }

}
