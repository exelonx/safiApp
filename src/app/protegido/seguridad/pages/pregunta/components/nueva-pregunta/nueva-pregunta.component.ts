import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InputMayus } from 'src/app/helpers/input-mayus';
import Swal from 'sweetalert2';
import { PreguntaService } from '../../services/pregunta.service';

@Component({
  selector: 'app-nueva-pregunta',
  templateUrl: './nueva-pregunta.component.html',
  styleUrls: ['./nueva-pregunta.component.css']
})
export class NuevaPreguntaComponent implements OnInit {

  @ViewChild('cerrarCrear') cerrarCrear!: MatButton;

  @Output() onCrear: EventEmitter<void> = new EventEmitter();

  // Propiedad para evitar doble ejecuciones al cliclear más de una vez
  enEjecucion: boolean = false;
  cambiandoContra: boolean = false;

  // Subscripciones
  subscripcion!: Subscription;

  // Formulario
  formularioPregunta: FormGroup = this.fb.group({
    pregunta:    ['', [Validators.required, Validators.maxLength(100)]]
  })

  constructor( private preguntaService: PreguntaService, private authService: AuthService, private fb: FormBuilder) { }
  
  
  crearPregunta() {
    if( !this.enEjecucion ) {
      const { pregunta } = this.formularioPregunta.value;
      const id_usuario = this.authService.usuario.id_usuario;
      
      this.enEjecucion = true;
      
      this.subscripcion = this.preguntaService.crearPregunta(pregunta, id_usuario)
      .subscribe(resp => {
        if(resp.ok === true) {
          this.onCrear.emit()
          this.enEjecucion = false
          this.cerrarCrear._elementRef.nativeElement.click()
          Swal.fire({
            title: '¡Éxito!',
            text: resp.msg,
            icon: 'success',
            iconColor: 'white',
            background: '#a5dc86',
            color: 'white',
            toast: true,
            position: 'top-right',
            showConfirmButton: false,
            timer: 4500,
            timerProgressBar: true,
          })
        } else {
          this.enEjecucion = false
          Swal.fire({
            title: 'Advertencia',
            text: resp,
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
  }
  
  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if(this.subscripcion) {
      this.subscripcion.unsubscribe();
    }

    this.cerrarCrear._elementRef.nativeElement.click()
    
  }
  
  toMayus = InputMayus.toMayus;
  
  limpiarFormulario() {
    this.formularioPregunta.reset();
  }


}
