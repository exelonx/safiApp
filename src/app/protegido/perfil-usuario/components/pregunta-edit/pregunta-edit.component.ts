import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AuthService } from '../../../../auth/services/auth.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { PerfilUsuarioService } from '../../services/perfil-usuario.service';
import { IngresosService } from '../../../services/ingresos.service';
import { PreguntaListaTotal } from '../../../../auth/interfaces/PreguntaLista.interface';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-pregunta-edit',
  templateUrl: './pregunta-edit.component.html',
  styleUrls: ['./pregunta-edit.component.css']
})
export class PreguntaEditComponent implements OnInit {

  @ViewChild('selectPregunta') selectPregunta!: MatSelect;

  @Input() index: number = 0;
  @Input() pregunta: string = "";
  @Input() idPregunta: number = 0;
  @Input() idRegistro: number = 0;
  @Input() listaPreguntas: PreguntaListaTotal[] = [];

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
  }

  actualizarPregunta() {

    if(!this.enEjecucion) {

      this.enEjecucion = true // Evitar doble ejecución

      const id_usuario = this.authService.usuario.id_usuario;
      const { respuesta, contrasenaActual } = this.formularioPregunta.value;
  
      const pregunta = this.selectPregunta
  
      this.subsCambioPregunta = this.perfilService.actualizarPregunta(id_usuario, this.idRegistro, pregunta.value, respuesta, contrasenaActual)
        .subscribe(resp => {
          if(resp.ok === true) {
              this.formularioPregunta.reset() // Limpiar formulario
              this.pregunta = pregunta.triggerValue  // Actualizar correo en la vista
              this.enEjecucion = false // pongo 2 porque la wea es asincrona
              Swal.fire('¡Éxito!', resp.msg, 'success')
            } else {
              this.enEjecucion = false // pongo 2 porque la wea es asincrona
              Swal.fire('Error', resp, 'warning')
            }
          })

    }
  }

}
