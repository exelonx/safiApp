import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { PreguntasService } from '../../services/preguntas.service';
import { PreguntaLista, PreguntaListaTotal } from '../../interfaces/PreguntaLista.interface';
import Swal from 'sweetalert2';
import { InputMayus } from 'src/app/helpers/input-mayus';

@Component({
  selector: 'app-pregunta-secreta',
  templateUrl: './pregunta-secreta.component.html',
  styleUrls: ['./pregunta-secreta.component.css']
})
export class PreguntaSecretaComponent implements OnInit {

  // Atributo para activar el componente de contraseña
  hideComponentContrasena: boolean = true;

  // Propiedad para evitar doble ejecuciones al cliclear más de una vez
  enEjecucion: boolean = false;

  // Formulario
  formularioPreguntas: FormGroup = this.fb.group({
    pregunta: ['', Validators.required ],
    respuesta: ['', Validators.required ]
  })


  preguntas: PreguntaListaTotal[] = [];

  constructor( private fb: FormBuilder,
               private router: Router,
               private authService: AuthService,
               private preguntaUsuario: PreguntasService ) { }

  ngOnInit(): void {
    
    this.cargarPreguntas();

  }

  cargarPreguntas() {

    // Consumo
    this.preguntaUsuario.cargarPreguntasUsuario()
      .subscribe( resp => {
        this.preguntas = resp.preguntas
      })
    
  }

  compararPregunta() {

    // Extraer los datos del formulario de preguntas
    const { pregunta, respuesta } = this.formularioPreguntas.value;
    const id_usuario: number = this.authService.idUsuario!;

    if( !this.enEjecucion ) { // Evitar que se ejecute más de una vez

      this.enEjecucion = true
      
      // Consumo
      this.preguntaUsuario.compararRespuestas( pregunta, respuesta, id_usuario )
        .subscribe( resp => {
  
          if( resp !== true ) {
            // No hubo coincidencia
            Swal.fire({
              title: 'Error',
              text: resp,
              icon: 'error',
              iconColor: 'white',
              background: '#d12609',
              color: 'white',
              toast: true,
              position: 'top-right',
              showConfirmButton: false,
              timer: 4500,
              timerProgressBar: true,
            })
            this.router.navigateByUrl( 'auth/login' )
          }
          // Mostrar componente y ocultar botones
          this.hideComponentContrasena = false;
        })

    }

  }

  // Instanciar método
  toMayus = InputMayus.toMayus;

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
