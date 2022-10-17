import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UsuarioService } from './services/usuario.service';
import { Usuario } from './interfaces/usuario.interface';
import { PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { IngresosService } from '../../../services/ingresos.service';



@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})


export class UsuarioComponent implements OnInit, OnDestroy {

  constructor(private usuarioService: UsuarioService, private fb: FormBuilder, private usuario: AuthService, private ingresosService: IngresosService ) { }

  // Subscripciones 
  subscripcion!: Subscription;
  ingreso!: Subscription;

  // Atributos = controlar paginador y la tabla
  ID_USUARIO: number = 0
  NOMBRE_USUARIO: string = ""
  USUARIO: string = ""
  ESTADO_USUARIO: string = ""
  ID_ROL: number = 0
  CORREO_ELECTRONICO: string = ""
  registros: Usuario[] = [];
  tamano: number = 0;
  limite: number = 0;
  indice: number = -1;
  desde: number = 0;

  // Validador de busqueda
  buscando: boolean = false;

  // Referencia para páginador
  paginadorPorReferencia!: PageEvent;

  // Formulario
  formularioBusqueda: FormGroup = this.fb.group({
    buscar: ['', [Validators.required, Validators.maxLength(100)]]
  })

  // Al entrar por primera vez a la pantalla
  cargarRegistros() {
    const id_usuario: number = this.usuario.usuario.id_usuario;
    this.subscripcion = this.usuarioService.getUsuarios(id_usuario)
      .subscribe(
        resp => {
          this.registros = resp.usuarios!
          this.tamano = resp.countUsuarios!
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
    let { buscar } = this.formularioBusqueda.value;

    // Si no se esta buscando no se envia nada
    if (!this.buscando) {
      buscar = ""
    }

    // Calcular posición de página
    let desde: string = (evento.pageIndex * evento.pageSize).toString();
    this.desde = evento.pageIndex;

    // Consumo
    this.subscripcion = this.usuarioService.getUsuarios(id_usuario, buscar, evento.pageSize.toString(), desde)
      .subscribe(
        resp => {
          this.registros = resp.usuarios!
          this.tamano = resp.countUsuarios!
          this.limite = resp.limite!
        }
      )
  }

  // Cuando se presione Enter en la casilla buscar
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

    // Consumo
    this.subscripcion = this.usuarioService.getUsuarios(id_usuario, buscar)
      .subscribe(
        resp => {
          this.indice = 0;
          this.registros = resp.usuarios!
          this.tamano = resp.countUsuarios!
          this.limite = resp.limite!
        }
      )
  }

  seleccionar(id_opcion: number, nombreUsuario: string, usuario: string, estado: string, id_rol: number, correo: string) {

      this.ID_USUARIO = id_opcion;
      this.NOMBRE_USUARIO = nombreUsuario;
      this.USUARIO = usuario;
      this.ESTADO_USUARIO = estado;
      this.ID_ROL = id_rol;
      this.CORREO_ELECTRONICO = correo;
    
  }

  desactivarUsuario() {
    const id_usuario = this.usuario.usuario.id_usuario;
    this.usuarioService.desactivarUsuario(this.ID_USUARIO, id_usuario)
      .subscribe(resp => {
        if (resp.ok === true) {
          Swal.fire('¡Éxito!', resp.msg, 'success')
        } else {
          Swal.fire('Error', resp, 'warning')
        }
      });
  }

  recargar() {
    // Datos requeridos
    const id_usuario: number = this.usuario.usuario.id_usuario;

    // Calcular posición de página
    let desde: string = (this.desde * this.limite).toString();

    // Consumo
    this.subscripcion = this.usuarioService.getUsuarios(id_usuario, "", this.limite.toString(), desde)
      .subscribe(
        resp => {
          this.registros = resp.usuarios!
          this.tamano = resp.countUsuarios!
          this.limite = resp.limite!
        }
      )
  }

  registrarIngreso() {
    // Id del usuario logeado
    const id_usuario = this.usuario.usuario.id_usuario;

    // Registrar evento
    this.ingreso = this.ingresosService.eventoIngreso(id_usuario, 2)
      .subscribe();

  }

  ngOnInit(): void {
    this.registrarIngreso()
    this.cargarRegistros()
  }

  ngOnDestroy(): void {
    // Destruir subscripciones
    if (this.subscripcion) {
      this.subscripcion.unsubscribe();
    }
    if (this.ingreso){
      this.ingreso.unsubscribe();
    }
  }

}
