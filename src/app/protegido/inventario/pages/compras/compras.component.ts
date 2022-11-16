import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { IngresosService } from 'src/app/protegido/services/ingresos.service';
import { PermisosPantallaService } from 'src/app/protegido/services/permisos-pantalla.service';
import { ComprasService } from './services/compras.service';
import { Compra } from './interfaces/compra.interfaces';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit, OnDestroy {

  constructor(private comprasService: ComprasService, private pantalla:PermisosPantallaService, private fb: FormBuilder, private usuario: AuthService, private ingresosService: IngresosService) { }

  ngOnInit(): void {

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

  public get permisos() {
    return this.pantalla.permisos;
  }

  // Subscripciones 
  subscripcion!: Subscription;
  ingreso!: Subscription;

  // Atributos = controlar paginador y la tabla
  id_seleccion: number = 0;
  registros: Compra[] = [];
  tamano: number = 0;
  limite: number = 0;
  indice: number = -1;
  desde: string = "0";

  // Controlar existencia de los modales
  ingresando: boolean = false;
  verDetalle: boolean = false;
  generando: boolean = false;
  editando: boolean = false;

  // Validador de busqueda
  buscando: boolean = false;

  // Referencia para páginador
  paginadorPorReferencia!: PageEvent;

  // Formulario
  formularioBusqueda: FormGroup = this.fb.group({
    buscar:    ['', [Validators.required, Validators.maxLength(100)]]
  })

  // Al entrar por primera vez a la pantalla
  cargarRegistros() {
    const id_usuario: number = this.usuario.usuario.id_usuario;
    this.subscripcion = this.comprasService.getCompras( id_usuario )
      .subscribe(
        resp => {
          this.registros = resp.compras || []
          this.tamano = resp.countCompra!
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
    this.subscripcion = this.comprasService.getCompras(id_usuario, buscar, evento.pageSize.toString(), desde)
    .subscribe(
      resp => {
        this.registros = resp.compras!
        this.tamano = resp.countCompra!
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
    this.subscripcion = this.comprasService.getCompras(id_usuario, buscar)
    .subscribe(
      resp => {
        this.indice = 0;
        this.registros = resp.compras!
        this.tamano = resp.countCompra!
        this.limite = resp.limite!
      }
    )
  }

  seleccionar(id_registro: number) {
    
    this.comprasService.getUnaCompra(id_registro)
      .subscribe()
  }

  recargar() {
    // Datos requeridos
    const id_usuario: number = this.usuario.usuario.id_usuario;
    let { buscar } = this.formularioBusqueda.value;

    // Consumo
    this.subscripcion = this.comprasService.getCompras(id_usuario, buscar, this.limite.toString(), this.desde)
    .subscribe(
      resp => {
        this.registros = resp.compras!
        this.tamano = resp.countCompra!
        this.limite = resp.limite!
      }
    )
  }

  generarReporte() {

    // if(!this.generando) {

      
    //   this.generando = true;
    
    //   let { buscar } = this.formularioBusqueda.value;
    
    //   this.rolService.getReporte(buscar)
    //   .subscribe( res =>{
    //     let blob = new Blob([res], {type: 'application/pdf'});
    //     let pdfUrl = window.URL.createObjectURL(blob);

    //     let PDF_link = document.createElement('a');
    //     PDF_link.href = pdfUrl;

    //     // window.open(pdfUrl, '_blank');

    //     PDF_link.download = "Reporte de Roles.pdf";
    //     PDF_link.click();
    //     this.generando = false
    //   })

    // }
    
  }

  registrarIngreso() {
    // Id del usuario logeado
    const id_usuario = this.usuario.usuario.id_usuario;

    // Registrar evento
    this.ingreso = this.ingresosService.eventoIngreso(id_usuario, 8)
    .subscribe();

  }

}
