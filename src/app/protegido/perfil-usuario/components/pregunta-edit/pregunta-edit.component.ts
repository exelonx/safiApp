import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AuthService } from '../../../../auth/services/auth.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { PerfilUsuarioService } from '../../services/perfil-usuario.service';
import { IngresosService } from '../../../services/ingresos.service';
import { PreguntaListaTotal } from '../../../../auth/interfaces/PreguntaLista.interface';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { MatSelect } from '@angular/material/select';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-pregunta-edit',
  templateUrl: './pregunta-edit.component.html',
  styleUrls: ['./pregunta-edit.component.css']
})
export class PreguntaEditComponent implements OnInit {

  @ViewChild('selectPregunta') selectPregunta!: MatSelect;
  @ViewChild('editarPregunta') btnEditarPregunta!: MatButton;
  @ViewChild('cerrarModalPregunta') btnCerrarModalPregunta!: MatButton;

  @Input() index: number = 0;
  @Input() pregunta: string = "";
  @Input() idPregunta: number = 0;
  @Input() idRegistro: number = 0;
  @Input() listaPreguntas: PreguntaListaTotal[] = [];
  indiceSeleccionado!: number;
  indiceAnterior!: number;

  subsCambioPregunta!: Subscription

  enEjecucion: boolean = false;

  // Formulario para los inputs
  panelOpenState = false;
  hideContra: boolean = true;
  hideRepetir: boolean = true;
  hideContraVerifi: boolean = true;

  formularioPregunta: FormGroup = this.fb.group({
    contrasenaActual: ['', [Validators.required]],
    respuesta: ['', [Validators.required]]
  })

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private perfilService: PerfilUsuarioService,
    private ingresosService: IngresosService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.usadoPor()
    }, 500);
  }

  actualizarPregunta() {

    if(!this.enEjecucion) {

      this.enEjecucion = true // Evitar doble ejecución

      const id_usuario = this.authService.usuario.id_usuario;
      const { respuesta, contrasenaActual, respuestaActual } = this.formularioPregunta.value;
  
      const pregunta = this.selectPregunta
  
      this.subsCambioPregunta = this.perfilService.actualizarPregunta(id_usuario, this.idRegistro, pregunta.value, respuesta, contrasenaActual)
        .subscribe(resp => {
          if(resp.ok === true) {

              this.formularioPregunta.reset() // Limpiar formulario
              this.pregunta = pregunta.triggerValue  // Actualizar pregunta en la vista

              // -------- Liberar pregunta anterior----------
              // Buscar el indice de la pregunta seleccionada que coincida con el id de la pregunta del componente
              this.perfilService.listaPreguntas[this.indiceSeleccionado].usadoPor = -1
              this.indiceSeleccionado = this.listaPreguntas.findIndex( (pregunta) => pregunta.ID_PREGUNTA === this.selectPregunta.value )

              // Actualizar el id de la Pregunta
              this.idPregunta = this.selectPregunta.value
              
              // Acaparar la pregunta para este componente
              this.perfilService.listaPreguntas[this.indiceSeleccionado].usadoPor = this.index

              this.enEjecucion = false // pongo 2 porque la wea es asincrona

              this.btnEditarPregunta._elementRef.nativeElement.click(); // Cerrar collapse

              this.btnCerrarModalPregunta._elementRef.nativeElement.click() // Cerrar modal
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
              this.enEjecucion = false // pongo 2 porque la wea es asincrona
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

  toMayus(formControl: string) { 

    if(this.formularioPregunta.controls[formControl].value) {

      // Extraser el valor del control del formulario
      const valorFormulario = this.formularioPregunta.controls[formControl].value
      // Pasarlo a Mayúscula
      this.formularioPregunta.controls[formControl].setValue(valorFormulario.toUpperCase()) 

    }

  }

  // Necesario para que se acaparen las preguntas según el componente al cargarse la pantalla
  usadoPor() {

    // Buscar el indice de la pregunta seleccionada que coincida con el id de la pregunta del componente
    this.indiceSeleccionado = this.listaPreguntas.findIndex( (pregunta) => pregunta.ID_PREGUNTA === this.idPregunta )

    // Marcar las preguntas por el id del componente que la esta usando
    this.perfilService.listaPreguntas[this.indiceSeleccionado].usadoPor = this.index

  }

  limpiarFormularios() {
    this.formularioPregunta.reset();
    this.selectPregunta.value = this.idPregunta
  }

  limpiarModal(formulario: FormGroup, formControlName: string) {
    formulario.controls[formControlName].reset();
  }

}
