import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Parametro } from './interfaces/parametroItems.interface';
import { ParametroService } from './services/parametro.service';

@Component({
  selector: 'app-parametro',
  templateUrl: './parametro.component.html',
  styleUrls: ['./parametro.component.css']
})

export class ParametroComponent implements OnInit, OnDestroy{


  constructor( private parametroService:ParametroService, private fb: FormBuilder, private usuario: AuthService ) { }

  ngOnInit(): void {

    this.cargarRegistros();

  }

  ngOnDestroy(): void {
    // Destruir subscripciones
    if(this.subscripcion) {
      this.subscripcion.unsubscribe();
    }
  }

  // Subscripciones 
  subscripcion!: Subscription;

  // Atributos = controlar paginador y la tabla
  registros: any[] = [];
  tamano: number = 0;
  limite: number = 0;
  indice: number = -1;

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
    this.subscripcion = this.parametroService.getParametros( id_usuario )
      .subscribe(
        resp => {
          console.log(resp)
          this.registros = resp.parametros!
          this.tamano = resp.countParametro!
          this.limite = resp.limite!
        }
      )
  }

}
