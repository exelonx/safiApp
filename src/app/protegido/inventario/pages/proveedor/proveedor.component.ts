import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Proveedor } from './interfaces/proveedorItems.interface';
import { ProveedorService } from './services/proveedor.service';
import { IngresosService } from '../../../services/ingresos.service';
import { PermisosPantallaService } from 'src/app/protegido/services/permisos-pantalla.service';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit {
  
  constructor(private proveedorService:ProveedorService, private fb: FormBuilder, 
    private pantalla: PermisosPantallaService, private usuario: AuthService, private ingresosService: IngresosService) { }

  // Atributos = controlar paginador y la tabla
  id: number = 0
  nombre: string = ""
  detalle: string = ""
  telefono: string = ""
  registros: Proveedor[] = [];
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
    this.subscripcion = this.proveedorService.getProveedores( id_usuario )
      .subscribe(
        resp => {
          this.registros = this.proveedorService.proveedores
          this.tamano = resp.countProveedores!
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
    this.subscripcion = this.proveedorService.getProveedores(id_usuario, buscar, evento.pageSize.toString(), desde)
    .subscribe(
      resp => {
        this.registros = resp.proveedores!
        this.tamano = resp.countProveedores!
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
    this.subscripcion = this.proveedorService.getProveedores(id_usuario, buscar)
    .subscribe(
      resp => {
        this.indice = 0;
        this.registros = resp.proveedores!
        this.tamano = resp.countProveedores!
        this.limite = resp.limite!
      }
    )
  }

  seleccionar(id: number) {

   
    this.proveedorService.getUnProveedor(id).subscribe()
  
  }

  recargar() {
    // Datos requeridos
    const id_usuario: number = this.usuario.usuario.id_usuario;
    let { buscar } = this.formularioBusqueda.value;

    // Consumo
    this.subscripcion = this.proveedorService.getProveedores(id_usuario, buscar, this.limite.toString(), this.desde)
    .subscribe(
      resp => {
        this.registros = resp.proveedores!
        this.tamano = resp.countProveedores!
        this.limite = resp.limite!
      }
    )
  }

  generarReporte() {

    if(!this.generando) {

      
      this.generando = true;
    
      let { buscar } = this.formularioBusqueda.value;
    
      this.proveedorService.getReporte(buscar)
      .subscribe( res =>{
        let blob = new Blob([res], {type: 'application/pdf'});
        let pdfUrl = window.URL.createObjectURL(blob);

        let PDF_link = document.createElement('a');
        PDF_link.href = pdfUrl;

        window.open(pdfUrl, '_blank');

        /* PDF_link.download = "Reporte de CAI.pdf";
        PDF_link.click(); */
        this.generando = false
      })

    }
    
  }

  public get permisos() {
    return this.pantalla.permisos;
  }

  registrarIngreso() {
    // Id del usuario logeado
    const id_usuario = this.usuario.usuario.id_usuario;

    // Registrar evento
    this.ingreso = this.ingresosService.eventoIngreso(id_usuario, 15)
    .subscribe();

  }

}
