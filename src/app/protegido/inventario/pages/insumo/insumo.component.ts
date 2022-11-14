import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Insumo } from './interfaces/insumo.interface';
import { InsumoService } from './services/insumo.service';
import { PermisosPantallaService } from '../../../services/permisos-pantalla.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { IngresosService } from '../../../services/ingresos.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-insumo',
  templateUrl: './insumo.component.html',
  styleUrls: ['./insumo.component.css']
})
export class InsumoComponent implements OnInit {

  constructor(private insumoService: InsumoService, private pantalla: PermisosPantallaService, private fb: FormBuilder, private usuario: AuthService, private ingresosService: IngresosService) { }

  // Subscripciones 
  subscripcion!: Subscription;
  ingreso!: Subscription;

  registros: Insumo[] = [];
  tamano: number = 0;
  limite: number = 0;
  indice: number = -1;
  desde: string = "0";

  generando: boolean = false;

  // Validador de busqueda
  buscando: boolean = false;

  // Referencia para páginador
  paginadorPorReferencia!: PageEvent;


  // Formulario
  formularioBusqueda: FormGroup = this.fb.group({
    buscar: ['', [Validators.required, Validators.maxLength(100)]]
  })

  // Al entrar por primera vez a la pantalla
  cargarRegistros() {
    const id_usuario: number = this.usuario.usuario.id_usuario;
    this.subscripcion = this.insumoService.getInsumos(id_usuario)
      .subscribe(
        resp => {
          console.log(resp)
          this.registros = this.insumoService.insumos
          this.tamano = resp.countInsumos!
          this.limite = resp.limite!
        }
      )
  }

  registrarIngreso() {
    // Id del usuario logeado
    const id_usuario = this.usuario.usuario.id_usuario;

    // Registrar evento
    this.ingreso = this.ingresosService.eventoIngreso(id_usuario, 8)
    .subscribe();

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
