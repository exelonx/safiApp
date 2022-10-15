import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UsuarioService } from './services/usuario.service';
import { Usuario } from './interfaces/usuario.interface';
import { PageEvent } from '@angular/material/paginator';



@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})


export class UsuarioComponent implements OnInit, OnDestroy {

  constructor( private usuarioService: UsuarioService, private fb: FormBuilder, private usuario: AuthService ) { }

  // Subscripciones 
  subscripcion!: Subscription;

  // Atributos = controlar paginador y la tabla
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
    buscar:    ['', [Validators.required, Validators.maxLength(100)]]
  })
  
  ngOnDestroy(): void {
    // Destruir subscripciones
    if(this.subscripcion) {
      this.subscripcion.unsubscribe();
    }
  }

  // Al entrar por primera vez a la pantalla
  cargarRegistros() {
    const id_usuario: number = this.usuario.usuario.id_usuario;
    this.subscripcion = this.usuarioService.getUsuarios( id_usuario )
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
    if(!this.buscando) {
      buscar = ""
    }

  // Calcular posición de página
  let desde: string = (evento.pageIndex * evento.pageSize).toString();
  this.desde = evento.pageIndex;

  // Consumo
  this.subscripcion = this.usuarioService.getUsuarios( id_usuario, buscar, evento.pageSize.toString(), desde )
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
  this.subscripcion = this.usuarioService.getUsuarios( id_usuario, buscar )
    .subscribe(
      resp => {
        this.indice = 0;
        this.registros = resp.usuarios!
        this.tamano = resp.countUsuarios!
        this.limite = resp.limite!
      }
    )
}

  ngOnInit(): void {
    this.cargarRegistros()
  }

}
