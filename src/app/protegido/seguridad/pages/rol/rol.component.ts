import { Component, OnInit } from '@angular/core';
import { RolService } from './services/rol.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Subscription } from 'rxjs';
import { Rol } from './interfaces/rolItems.interface';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.css']
})
export class RolComponent implements OnInit {

  

  constructor( private rolService:RolService, private fb: FormBuilder, private usuario: AuthService ) { }

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
          this.registros = this.rolService.roles
          this.tamano = resp.countParametro!
          this.limite = resp.limite!
        }
      )
  }

}
