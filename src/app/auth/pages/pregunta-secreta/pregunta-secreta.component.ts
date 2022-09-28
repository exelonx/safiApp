import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormBuilder } from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { PreguntasService } from '../../services/preguntas.service';
import { PreguntaLista } from '../../interfaces/PreguntaLista.interface';

@Component({
  selector: 'app-pregunta-secreta',
  templateUrl: './pregunta-secreta.component.html',
  styleUrls: ['./pregunta-secreta.component.css']
})
export class PreguntaSecretaComponent implements OnInit {

  preguntas: PreguntaLista[] = [];

  constructor( private fb: FormBuilder,
               private router: Router,
               private authService: AuthService,
               private rutaActiva: ActivatedRoute,
               private preguntaUsuario: PreguntasService ) { }

  ngOnInit(): void {
    
    this.cargarPreguntas();

  }

  cargarPreguntas() {

    const id_usuario = this.authService.idUsuario;
    this.preguntaUsuario.cargarPreguntasUsuario(id_usuario!)
      .subscribe( resp => {
        console.log(resp)
        this.preguntas = resp
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
