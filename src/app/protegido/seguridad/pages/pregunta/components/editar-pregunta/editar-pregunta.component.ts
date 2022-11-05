import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PreguntaService } from '../../services/pregunta.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../../../auth/services/auth.service';
import Swal from 'sweetalert2';
import { MatButton } from '@angular/material/button';
import { InputMayus } from '../../../../../../helpers/input-mayus';

@Component({
  selector: 'app-editar-pregunta',
  templateUrl: './editar-pregunta.component.html',
  styleUrls: ['./editar-pregunta.component.css']
})
export class EditarPreguntaComponent implements OnInit {

  @ViewChild('cerrarEditar') cerrarEditar!: MatButton;
  @ViewChild('inputPregunta') inputPregunta!: ElementRef;

  @Input() id: number = 0;
  @Input() pregunta: string = "";

  @Output() onActualizacion: EventEmitter<undefined> = new EventEmitter();

  enEjecucion: boolean = false;

  constructor(private preguntaService: PreguntaService, private fb: FormBuilder, private usuario: AuthService) { }

  // Formulario
  /* formularioRol: FormGroup = this.fb.group({
    rol:    ['', [Validators.required, Validators.maxLength(100)]],
    descripcion:    ['', [Validators.required, Validators.maxLength(100)]]
  }) */

  ngOnInit(): void {
  }

  actualizar() {

    if(!this.enEjecucion) {
      this.enEjecucion = true;

      const pregunta = this.inputPregunta.nativeElement.value;/* this.formularioRol.value.rol === "" ? this.rol :  this.formularioRol.value.rol */
      const id_usuario = this.usuario.usuario.id_usuario;
      
      this.preguntaService.actualizarPregunta(this.id, pregunta, id_usuario)
        .subscribe(
          (resp => {
            this.onActualizacion.emit();
            if(resp.ok === true) {
              this.cerrarEditar._elementRef.nativeElement.click();
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
              this.enEjecucion = false;
            } else {
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
              this.enEjecucion = false;
            }
          })
        )

    }
      
  };

  toMayus = InputMayus.toMayusNoReactivo;

  limpiarFormulario() {

    /* this.formularioRol.controls['rol'].setValue(this.rol)
    this.formularioRol.controls['descripcion'].setValue(this.descripcion) */

  }

}
