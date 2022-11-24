import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { IngresosService } from 'src/app/protegido/services/ingresos.service';
import { Caja } from './interface/cajaItems.interface';
import { CajaService } from './services/caja.service';
import { DatePipe, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css'],
  providers: [DatePipe, {provide: LOCALE_ID, useValue: 'es-ES' }]
})
export class CajaComponent implements OnInit {

  

  // Subscripciones
  subscripcion!: Subscription;
  ingreso!: Subscription;

  // Atributos
  registros: Caja[] = [];
  tamano: number = 0;
  limite: number = 0;
  indice: number = -1;

  generando: boolean = false;

  
  editando: boolean = false;

  miFecha = new Date();
  currentDate = new Date();
 

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

  constructor( private cajaService: CajaService, private fb: FormBuilder, private usuario: AuthService, private ingresosService: IngresosService, private datePipe: DatePipe ) { 

  }

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
    /* const miFecha: {{currentDate | date:'yyyy-MM-dd'}}; */ 
    /* this.currentDate.toLocaleString('en-US', { hour: 'numeric', hour12: true }) */
    const id_usuario: number = this.usuario.usuario.id_usuario;
    this.subscripcion = this.cajaService.getCajas( id_usuario )
      .subscribe(
        resp => {
          this.registros = this.cajaService.cajas!
          this.tamano = resp.countCajas!
          this.limite = resp.limite!
        }
      )
  }

  registrarIngreso() {
    // Id del usuario logeado
    const id_usuario = this.usuario.usuario.id_usuario;

    // Registrar evento
    this.ingreso = this.ingresosService.eventoIngreso(id_usuario, 11)
      .subscribe();

  }

  


  

}
