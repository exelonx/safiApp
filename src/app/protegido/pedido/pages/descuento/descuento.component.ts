import { Component, OnInit } from '@angular/core';
import { DescuentoService } from './services/descuento.service';
import { PermisosPantallaService } from '../../../services/permisos-pantalla.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../auth/services/auth.service';
import { IngresosService } from '../../../services/ingresos.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Descuento } from './interfaces/descuento.interface';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-descuento',
  templateUrl: './descuento.component.html',
  styleUrls: ['./descuento.component.css']
})
export class DescuentoComponent implements OnInit {

  constructor(private descuentoSerice: DescuentoService, private pantalla: PermisosPantallaService, private fb: FormBuilder,
    private usuario: AuthService, private ingresosService: IngresosService, private router: Router) { }

  // Subscripciones 
  subscripcion!: Subscription;
  ingreso!: Subscription;

  id_seleccion: number = 0;
  registros: Descuento[] = [];
  tamano: number = 0;
  limite: number = 0;
  indice: number = -1;
  desde: string = "0";

  generando: boolean = false;

  // Validador de busqueda
  buscando: boolean = false;

  // Referencia para páginador
  paginadorPorReferencia!: PageEvent;

  creando: boolean = false;
  editando: boolean = false;


  // Formulario
  formularioBusqueda: FormGroup = this.fb.group({
    buscar: ['', [Validators.required, Validators.maxLength(100)]]
  })

  // Al entrar por primera vez a la pantalla
  cargarRegistros() {
    const id_usuario: number = this.usuario.usuario.id_usuario;
    this.subscripcion = this.descuentoSerice.getDescuentos(id_usuario)
      .subscribe(
        resp => {
          this.registros = this.descuentoSerice.descuentos
          this.tamano = resp.countDescuentos!
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
    this.subscripcion = this.descuentoSerice.getDescuentos(id_usuario, buscar, evento.pageSize.toString(), desde)
      .subscribe(
        resp => {
          this.registros = resp.descuentos!
          this.tamano = resp.countDescuentos!
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
    this.subscripcion = this.descuentoSerice.getDescuentos(id_usuario, buscar)
      .subscribe(
        resp => {
          this.indice = 0;
          this.registros = resp.descuentos!
          this.tamano = resp.countDescuentos!
          this.limite = resp.limite!
        }
      )
  }

  seleccionar(id_registro: number) {

    this.descuentoSerice.getDescuento(id_registro)
      .subscribe()
  }

  recargar() {
    // Datos requeridos
    const id_usuario: number = this.usuario.usuario.id_usuario;
    let { buscar } = this.formularioBusqueda.value;

    // Consumo
    this.subscripcion = this.descuentoSerice.getDescuentos(id_usuario, buscar, this.limite.toString(), this.desde)
      .subscribe(
        resp => {
          this.registros = resp.descuentos!
          this.tamano = resp.countDescuentos!
          this.limite = resp.limite!
        }
      )
  }

  generarReporte() {

    if (!this.generando) {


      this.generando = true;

      let { buscar } = this.formularioBusqueda.value;

      this.descuentoSerice.getReporte(buscar)
        .subscribe(res => {
          let blob = new Blob([res], { type: 'application/pdf' });
          let pdfUrl = window.URL.createObjectURL(blob);

          let PDF_link = document.createElement('a');
          PDF_link.href = pdfUrl;

          window.open(pdfUrl, '_blank');

          /* PDF_link.download = "Reporte de Productos.pdf";
          PDF_link.click() */;
          this.generando = false
        })

    }

  }



  registrarIngreso() {
    // Id del usuario logeado
    const id_usuario = this.usuario.usuario.id_usuario;

    // Registrar evento
    this.ingreso = this.ingresosService.eventoIngreso(id_usuario, 29)
      .subscribe();

  }

  public get permisos() {
    return this.pantalla.permisos;
  }


  ngOnInit(): void {

    this.registrarIngreso()
    this.cargarRegistros();

  }

  ngOnDestroy(): void {
    // Destruir subscripciones
    if (this.subscripcion) {
      this.subscripcion.unsubscribe();
    }
    if (this.ingreso) {
      this.ingreso.unsubscribe();
    }
  }

}
