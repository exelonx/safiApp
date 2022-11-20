import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { IngresosService } from 'src/app/protegido/services/ingresos.service';
import { KardexService } from './services/kardex.service';
import { Kardex } from './interfaces/kardex.interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { Insumo } from '../insumo/interfaces/insumo.interface';

@Component({
  selector: 'app-kardex',
  templateUrl: './kardex.component.html',
  styleUrls: ['./kardex.component.css']
})
export class KardexComponent implements OnInit, OnDestroy {

  // Indica en que pantalla estamos
  id_insumo: string = "";
  insumo: Insumo = {
    ID: 0,
    NOMBRE: "",
    ID_UNIDAD: 0,
    UNIDAD_MEDIDA: "",
    CANTIDAD_MAXIMA: 0,
    CANTIDAD_MINIMA: 0,
    EXISTENCIA: 0,
    ID_CREADO_POR: 0,
    CREADO_POR: "",
    FECHA_CREACION: new Date(),
    MODIFICACION_POR: "",
    FECHA_MODIFICACION: new Date()
  };

  // Subscripciones
  subscripcion!: Subscription;
  ingreso!: Subscription;
  routerSubs!: Subscription;
  nombreSubs!: Subscription;

  // Atributos
  registros: Kardex[] = [];
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

  constructor( private fb: FormBuilder, private usuario: AuthService, private ingresosService: IngresosService, private kardexService: KardexService,
    private router: Router, private activatedRouter: ActivatedRoute ) { }

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
    this.subscripcion = this.kardexService.getKardex( this.id_insumo, id_usuario, buscar, evento.pageSize.toString(), desde, fechaInicial, fechaFinal )
      .subscribe(
        resp => {
          this.registros = resp.registros!
          this.tamano = resp.countKardex!
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
    this.subscripcion = this.kardexService.getKardex( this.id_insumo, id_usuario, buscar, "", "", this.formularioBusqueda.value.fechaInicial, this.formularioBusqueda.value.fechaFinal )
      .subscribe(
        resp => {
          this.indice = 0;
          this.registros = resp.registros!
          this.tamano = resp.countKardex!
          this.limite = resp.limite!
        }
      )
  }

  generarReporte() {

    
  }

  // Al entrar por primera vez a la pantalla
  cargarRegistros() {
    const id_usuario: number = this.usuario.usuario.id_usuario;

    let id_insumo: string = ""

    // Subscribirse y leer el parametro de la ruta
    this.routerSubs = this.activatedRouter.params.subscribe(parametro => {
      id_insumo = parametro['id_insumo']
    
      this.subscripcion = this.kardexService.getKardex( id_insumo, id_usuario )
        .subscribe(
          resp => {
            this.registros = resp.registros!
            this.tamano = resp.countKardex!
            this.limite = resp.limite!
            this.id_insumo = id_insumo 
          }
        )
      
      this.nombreSubs = this.kardexService.getNombreInsumoKardex(id_insumo)
      .subscribe( resp => {
        this.insumo = resp.insumo!;
      })

    })
  }

  cargarNombreInsumo() {
    
  }

  ngOnInit(): void {
    // Registrar el ingreso a la pantalla
    this.registrarIngreso();

    // Lo que dice la función jaja
    this.cargarRegistros();

    this.cargarNombreInsumo()
  }

  ngOnDestroy(): void {
    // Destruir subscripciones
    if(this.subscripcion) {
      this.subscripcion.unsubscribe();
    }

    if(this.ingreso) {
      this.ingreso.unsubscribe();
    }

    if(this.routerSubs) {
      this.routerSubs.unsubscribe();
    }

    if(this.nombreSubs) {
      this.nombreSubs.unsubscribe();
    }
  }

  registrarIngreso() {
    // Id del usuario logeado
    const id_usuario = this.usuario.usuario.id_usuario;

    // Registrar evento
    this.ingreso = this.ingresosService.eventoIngreso(id_usuario, 22)
      .subscribe();

  }

}
