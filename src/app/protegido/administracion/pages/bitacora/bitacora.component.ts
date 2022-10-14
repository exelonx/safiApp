import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatPaginatorIntl, PageEvent } from "@angular/material/paginator";
import { BitacoraService } from './services/bitacora.service';
import { Registro } from './interfaces/bitacoraResp.interface';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../auth/services/auth.service';

@Component({
  selector: 'app-bitacora',
  templateUrl: './bitacora.component.html',
  styleUrls: ['./bitacora.component.css']
})
export class BitacoraComponent implements OnInit, OnDestroy {

  // Subscripciones
  subscripcion!: Subscription;

  // Atributos
  registros: Registro[] = [];
  tamano: number = 0;
  limite: number = 0;
  indice: number = -1;

  // Validador de busqueda
  buscando: boolean = false;

  // Referencia para páginador
  paginadorPorReferencia!: PageEvent;

  // Formulario
  formularioBusqueda: FormGroup = this.fb.group({
    buscar:    ['', [Validators.required, Validators.maxLength(100)]]
  })

  constructor( private bitacoraService: BitacoraService, private fb: FormBuilder, private usuario: AuthService ) { 
  }

  ngOnInit(): void {
    this.cargarRegistros()
  }
  
  ngOnDestroy(): void {
    // Destruir subscripciones
    if(this.subscripcion) {
      this.subscripcion.unsubscribe();
    }
  }


  // Al entrar por primera vez a la pantalla
  cargarRegistros() {
    const id_usuario: number = this.usuario.usuario.id_usuario;
    this.subscripcion = this.bitacoraService.getBitacora( id_usuario )
      .subscribe(
        resp => {
          this.registros = resp.registros!
          this.tamano = resp.countBitacora!
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

    // Consumo
    this.subscripcion = this.bitacoraService.getBitacora( id_usuario, buscar, evento.pageSize.toString(), desde )
      .subscribe(
        resp => {
          this.registros = resp.registros!
          this.tamano = resp.countBitacora!
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
    this.subscripcion = this.bitacoraService.getBitacora( id_usuario, buscar )
      .subscribe(
        resp => {
          this.indice = 0;
          this.registros = resp.registros!
          this.tamano = resp.countBitacora!
          this.limite = resp.limite!
        }
      )
  }

}
