import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { IngresosService } from 'src/app/protegido/services/ingresos.service';
import { Caja } from '../../interface/cajaItems.interface';
import { CajaService } from '../../services/caja.service';

@Component({
  selector: 'app-historial-caja',
  templateUrl: './historial-caja.component.html',
  styleUrls: ['./historial-caja.component.css']
})
export class HistorialCajaComponent implements OnInit {

  // Subscripciones
  subscripcion!: Subscription;
  ingreso!: Subscription;

  // Atributos
  registros: Caja[] = [];
  tamano: number = 0;
  limite: number = 0;
  indice: number = -1;

  generando: boolean = false;

  creando: boolean = false;
  editando: boolean = false;

  // Validador de busqueda
  buscando: boolean = false;

  // Referencia para páginador
  paginadorPorReferencia!: PageEvent;

  // Formulario
  formularioBusqueda: FormGroup = this.fb.group({
    fechaInicial: [''],
    fechaFinal: [''],
    /* buscar:    ['', [Validators.required, Validators.maxLength(100)]] */
  })

  constructor( private cajaService: CajaService, private fb: FormBuilder, private usuario: AuthService, private ingresosService: IngresosService ) { }

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
    this.subscripcion = this.cajaService.getCajas( id_usuario )
      .subscribe(
        resp => {
          this.registros = this.cajaService.cajas!
          this.tamano = resp.countCajas!
          this.limite = resp.limite!
          /* console.log(resp) */
        }
      )
  }

  /* seleccionar(id_registro: number) {
    
    this.cajaService.getCajaAbierta()
    .subscribe()
  } */

  registrarIngreso() {
    // Id del usuario logeado
    const id_usuario = this.usuario.usuario.id_usuario;

    // Registrar evento
    this.ingreso = this.ingresosService.eventoIngreso(id_usuario, 11)
      .subscribe();

  }

  recargar() {
    // Datos requeridos
    const id_usuario: number = this.usuario.usuario.id_usuario;
    let { buscar } = this.formularioBusqueda.value;

    // Consumo
    this.subscripcion = this.cajaService.getCajaAbierta()
    .subscribe(
      resp => {
        this.registros = resp.cajas!
        this.tamano = resp.countCajas!
        this.limite = resp.limite!
        console.log(resp)
      }
    )
  }

}
