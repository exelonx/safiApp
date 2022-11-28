import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { IngresosService } from 'src/app/protegido/services/ingresos.service';
import { PermisosPantallaService } from 'src/app/protegido/services/permisos-pantalla.service';
import { Estado } from './interfaces/estadoItems.interface';
import { EstadoService } from './services/estado.service';

@Component({
  selector: 'app-estado',
  templateUrl: './estado.component.html',
  styleUrls: ['./estado.component.css']
})
export class EstadoComponent implements OnInit {

  constructor(private estadoService:EstadoService, private fb: FormBuilder, 
    private pantalla: PermisosPantallaService, private usuario: AuthService, private ingresosService: IngresosService) { }

  // Atributos = controlar paginador y la tabla
  id: number = 0
  registros: Estado[] = [];
  tamano: number = 0;
  limite: number = 0;
  indice: number = -1;
  desde: string = "0";

  generando: boolean = false;

  creando: boolean = false;
  editando: boolean = false;

  // Validador de busqueda
  buscando: boolean = false;

  ngOnInit(): void {

    this.registrarIngreso()
    this.cargarRegistros();

  }

  ngOnDestroy(): void {
    // Destruir subscripciones
    if(this.subscripcion) {
      this.subscripcion.unsubscribe();
    }
    if (this.ingreso){
      this.ingreso.unsubscribe();
    }
  }

  // Subscripciones 
  subscripcion!: Subscription;
  ingreso!: Subscription;


  // Referencia para páginador
  paginadorPorReferencia!: PageEvent;

  // Formulario
  formularioBusqueda: FormGroup = this.fb.group({
    buscar:    ['', [Validators.required, Validators.maxLength(100)]]
  })

  // Al entrar por primera vez a la pantalla
  cargarRegistros() {
    const id_usuario: number = this.usuario.usuario.id_usuario;
    this.subscripcion = this.estadoService.getEstados( id_usuario )
      .subscribe(
        resp => {
          this.registros = this.estadoService.estados
          this.tamano = resp.countEstados!
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
    this.desde = desde;

    // Consumo
    this.subscripcion = this.estadoService.getEstados(id_usuario, buscar, evento.pageSize.toString(), desde)
      .subscribe(
        resp => {
          this.registros = resp.estados!
          this.tamano = resp.countEstados!
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

    this.desde = "0"

    // Consumo
    this.subscripcion = this.estadoService.getEstados(id_usuario, buscar)
    .subscribe(
      resp => {
        this.indice = 0;
        this.registros = resp.estados!
        this.tamano = resp.countEstados!
        this.limite = resp.limite!
      }
    )
  }

  registrarIngreso() {
    // Id del usuario logeado
    const id_usuario = this.usuario.usuario.id_usuario;

    // Registrar evento
    this.ingreso = this.ingresosService.eventoIngreso(id_usuario, 17)
    .subscribe();

  }

  seleccionar(id_registro: number) {
    
    this.estadoService.getUnEstado(id_registro)
      .subscribe()
  }

  public get permisos() {
    return this.pantalla.permisos;
  }


  recargar() {
    // Datos requeridos
    const id_usuario: number = this.usuario.usuario.id_usuario;
    let { buscar } = this.formularioBusqueda.value;

    // Consumo
    this.subscripcion = this.estadoService.getEstados(id_usuario, buscar, this.limite.toString(), this.desde)
    .subscribe(
      resp => {
        this.registros = resp.estados!
        this.tamano = resp.countEstados!
        this.limite = resp.limite!
        console.log(resp)
      }
    )
  }

}
