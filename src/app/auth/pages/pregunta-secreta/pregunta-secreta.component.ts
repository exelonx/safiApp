import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormBuilder } from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pregunta-secreta',
  templateUrl: './pregunta-secreta.component.html',
  styleUrls: ['./pregunta-secreta.component.css']
})
export class PreguntaSecretaComponent implements OnInit {

  validacionTokenSubs!: Subscription;
  tokenParam!: string;
  private _idUsuario!: string;

  constructor( private fb: FormBuilder,
               private router: Router,
               private authService: AuthService,
               private rutaActiva: ActivatedRoute ) { }

  ngOnInit(): void {
    // Extraer el token de la ruta
    this.rutaActiva.params.subscribe(
      (parametro: Params) => {
        const { token } = parametro;
        this.tokenParam = token;
      }
    )
    // Validar Token
    this.validacionTokenSubs = this.authService.validarPantallaPreguntas( this.tokenParam )
      .subscribe( resp => {
        if( resp.ok === true ) {
          this._idUsuario = resp.id_usuario
        } else {
          // Token inválido == Sacarlo de la pantalla
          this.router.navigateByUrl('/auth/login')
        }
      })
  }

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  matcher = new MyErrorStateMatcher();

}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {

    const isSubmitted = form && form.submitted;

    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));

  }

}
