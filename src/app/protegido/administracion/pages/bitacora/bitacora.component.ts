import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginatorIntl, PageEvent } from "@angular/material/paginator";
import { BitacoraService } from './services/bitacora.service';
import { Registro } from './interfaces/bitacoraResp.interface';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../auth/services/auth.service';
import { IngresosService } from '../../../services/ingresos.service';

@Component({
  selector: 'app-bitacora',
  templateUrl: './bitacora.component.html',
  styleUrls: ['./bitacora.component.css']
})
export class BitacoraComponent implements OnInit, OnDestroy {

  // Subscripciones
  subscripcion!: Subscription;
  ingreso!: Subscription;

  // Atributos
  registros: Registro[] = [];
  tamano: number = 0;
  limite: number = 0;
  indice: number = -1;

  generando: boolean = false;

  // Validador de busqueda
  buscando: boolean = false;

  // Referencia para páginador
  paginadorPorReferencia!: PageEvent;

  // Formulario
  formularioBusqueda: FormGroup = this.fb.group({
    fechaInicial: [''],
    fechaFinal: [''],
    buscar:    ['', [Validators.required, Validators.maxLength(100)]]
  })

  constructor( private bitacoraService: BitacoraService, private fb: FormBuilder, private usuario: AuthService, private ingresosService: IngresosService ) { }

  ngOnInit(): void {
    // Registrar el ingreso a la pantalla
    this.registrarIngreso();

    // Lo que dice la función jaja
    this.cargarRegistros();
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
    this.subscripcion = this.bitacoraService.getBitacora( id_usuario, buscar, evento.pageSize.toString(), desde, fechaInicial, fechaFinal )
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
    this.subscripcion = this.bitacoraService.getBitacora( id_usuario, buscar, "", "", this.formularioBusqueda.value.fechaInicial, this.formularioBusqueda.value.fechaFinal )
      .subscribe(
        resp => {
          this.indice = 0;
          this.registros = resp.registros!
          this.tamano = resp.countBitacora!
          this.limite = resp.limite!
        }
      )
  }

  generarReporte() {

    if(!this.generando) {

      this.generando = true;

      let { buscar } = this.formularioBusqueda.value;
      let { fechaInicial } = this.formularioBusqueda.value
      let { fechaFinal } = this.formularioBusqueda.value
      
      this.bitacoraService.getReporte(buscar, fechaInicial, fechaFinal, this.usuario.usuario.id_usuario)
        .subscribe( res =>{
          let blob = new Blob([res], {type: 'application/pdf'});
          let pdfUrl = window.URL.createObjectURL(blob);
  
          let PDF_link = document.createElement('a');
          PDF_link.href = pdfUrl;
  
          window.open(pdfUrl, '_blank');
  
          /* PDF_link.download = "Reporte de bitácora";
          PDF_link.click(); */
          this.generando = false
        })

    }
  }

  registrarIngreso() {
    // Id del usuario logeado
    const id_usuario = this.usuario.usuario.id_usuario;

    // Registrar evento
    this.ingreso = this.ingresosService.eventoIngreso(id_usuario, 11)
      .subscribe();

  }

}
