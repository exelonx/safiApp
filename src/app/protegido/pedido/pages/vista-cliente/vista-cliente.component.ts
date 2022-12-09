import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InputMayus } from 'src/app/helpers/input-mayus';
import { IngresosService } from 'src/app/protegido/services/ingresos.service';
import { WebsocketService } from 'src/app/protegido/services/websocket.service';
import Swal from 'sweetalert2';
import { Detalle } from '../cocina/interfaces/cocina.interface';
import { CocinaService } from '../cocina/services/cocina.service';

@Component({
  selector: 'app-vista-cliente',
  templateUrl: './vista-cliente.component.html',
  styleUrls: ['./vista-cliente.component.css']
})
export class VistaClienteComponent implements OnInit, OnDestroy {

  constructor(private usuario: AuthService, private cocinaService: CocinaService, private fb: FormBuilder, 
    public authService: AuthService, private ingresosService: IngresosService, private wsService: WebsocketService) { }


  public get detalles() {
    return this.cocinaService.detalle
  }



  // Subscripciones 
  subscripcion!: Subscription;
  ingreso!: Subscription;

  // Atributos = controlar paginador y la tabla
  
  tamano: number = 0;
  limite: number = 0;
  indice: number = -1;
  desde: string = "0";
  registros: Detalle[] = [];

  generando: boolean = false;

  // Validador de busqueda
  buscando: boolean = false;

  actualizandoEstado: boolean[] = [];

  subsSocket1!: Subscription
  subsSocket2!: Subscription
  subsSocket3!: Subscription
  subsSocket4!: Subscription

  creando: boolean = false;
  editando: boolean = false;

  formularioBusqueda: FormGroup = this.fb.group({
    buscar: ['', [Validators.required, Validators.maxLength(100)]]
  })

  // Al entrar por primera vez a la pantalla
  cargarRegistros() {
    const id_usuario: number = this.usuario.usuario.id_usuario;
    this.subscripcion = this.cocinaService.getDetalleVistaCliente(id_usuario)
      .subscribe(
        resp => {

          this.registros = resp.detalles!
          this.tamano = resp.countDetalles!
          this.limite = resp.limite!
        }
      )
  } 

  recargar() {
    // Datos requeridos
    const id_usuario: number = this.usuario.usuario.id_usuario;
    let { buscar } = this.formularioBusqueda.value;

    // Consumo
    this.subscripcion = this.cocinaService.getDetalleVistaCliente(id_usuario, buscar, this.limite.toString(), this.desde)
      .subscribe(
        resp => {
          this.registros = resp.detalles!
          this.tamano = resp.countDetalles!
          this.limite = resp.limite!
        }
      ) 
  }


  registrarIngreso() {
    // Id del usuario logeado
    const id_usuario = this.usuario.usuario.id_usuario;

    // Registrar evento
    this.ingreso = this.ingresosService.eventoIngreso(id_usuario, 31)
      .subscribe();

  }

  /* actualizarEstado(id_detalle: number, index: number) {
    if(!this.actualizandoEstado[index]) {

      this.actualizandoEstado[index] = true;

      this.cocinaService.putEstadoDetalle(id_detalle, this.authService.usuario.id_usuario)
        .subscribe(resp=> {
          if(resp.ok === true) {
            this.actualizandoEstado[index] = false;
            
          } else {
            this.actualizandoEstado[index] = false
            Swal.fire({
              title: 'Advertencia',
              text: resp.msg,
              icon: 'warning',
              iconColor: 'white',
              background: '#f8bb86',
              color: 'white',
              toast: true,
              position: 'top-right',
              showConfirmButton: false,
              timer: 4500,
              timerProgressBar: true,
            })
          }
        })

    }
  } */

  getColorPlato(paraLlevar: boolean): string {
    if(paraLlevar){
      return 'llevar'
    } else {
      return 'noLlevar'
    }
  }

  ngOnInit(): void {

    this.subsSocket1 = this.wsService.listen('actualizarTabla')
      .subscribe( (resp: any) => {

          this.recargar();
      })

      this.subsSocket2 = this.wsService.listen('productoAgregado')
      .subscribe( (resp: any) => {

          this.recargar();
      })

      this.subsSocket3 = this.wsService.listen('actualizarMesa')
      .subscribe( (resp: any) => {

          this.recargar();
      })

      this.subsSocket4 = this.wsService.listen('recargar')
      .subscribe((resp: any) => {
        this.recargar();
      })

    this.cargarRegistros(); 

  }

  ngOnDestroy(): void {
    // Destruir subscripciones
    if (this.subsSocket1){
      this.subsSocket1.unsubscribe();
    }
    if (this.subsSocket2){
      this.subsSocket2.unsubscribe();
    }
    if (this.subsSocket3){
      this.subsSocket3.unsubscribe();
    }
    if (this.subscripcion) {
      this.subscripcion.unsubscribe();
    }
    if (this.subsSocket4) {
      this.subsSocket4.unsubscribe();
    }
    if (this.ingreso) {
      this.ingreso.unsubscribe();
    }
  }

}
