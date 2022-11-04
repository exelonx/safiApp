import { Component, OnInit } from '@angular/core';
import { RolService } from './services/rol.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Subscription } from 'rxjs';
import { Rol } from './interfaces/rolItems.interface';
import { PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { IngresosService } from '../../../services/ingresos.service';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.css']
})
export class RolComponent implements OnInit {

  

  constructor( private rolService:RolService, private fb: FormBuilder, private usuario: AuthService, private ingresosService: IngresosService) { }

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

  // Atributos = controlar paginador y la tabla
  id_rol: number = 0
  rol: string = ""
  descripcion: string = ""
  registros: Rol[] = [];
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

  // Al entrar por primera vez a la pantalla
  cargarRegistros() {
    const id_usuario: number = this.usuario.usuario.id_usuario;
    this.subscripcion = this.rolService.getRoles( id_usuario )
      .subscribe(
        resp => {
          console.log(resp)
          this.registros = this.rolService.roles
          this.tamano = resp.countRoles!
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
    this.subscripcion = this.rolService.getRoles(id_usuario, buscar, evento.pageSize.toString(), desde)
    .subscribe(
      resp => {
        this.registros = resp.roles!
        this.tamano = resp.countRoles!
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
    this.subscripcion = this.rolService.getRoles(id_usuario, buscar)
    .subscribe(
      resp => {
        this.indice = 0;
        this.registros = resp.roles!
        this.tamano = resp.countRoles!
        this.limite = resp.limite!
      }
    )
  }

  seleccionar(id_rol: number, rol: string, descripcion: string) {

    this.id_rol = id_rol;
    this.rol = rol;
    this.descripcion = descripcion;
  
  }

  recargar() {
    // Datos requeridos
    const id_usuario: number = this.usuario.usuario.id_usuario;

    // Calcular posición de página
    let desde: string = (this.desde * this.limite).toString();

    // Consumo
    this.subscripcion = this.rolService.getRoles(id_usuario, "", this.limite.toString(), desde)
    .subscribe(
      resp => {
        this.registros = resp.roles!
        this.tamano = resp.countRoles!
        this.limite = resp.limite!
      }
    )
  }

  generarReporte() {
    let { buscar } = this.formularioBusqueda.value;
    let { fechaInicial } = this.formularioBusqueda.value
    let { fechaFinal } = this.formularioBusqueda.value
    
    this.rolService.getReporte(buscar)
      .subscribe( res =>{
        let blob = new Blob([res], {type: 'application/pdf'});
        let pdfUrl = window.URL.createObjectURL(blob);

        let PDF_link = document.createElement('a');
        PDF_link.href = pdfUrl;

        // window.open(pdfUrl, '_blank');

        PDF_link.download = "Reporte de Roles.pdf";
        PDF_link.click();
      })
  }


  registrarIngreso() {
    // Id del usuario logeado
    const id_usuario = this.usuario.usuario.id_usuario;

    // Registrar evento
    this.ingreso = this.ingresosService.eventoIngreso(id_usuario, 8)
    .subscribe();

  }

  

}
