import { Component, Input, OnInit } from '@angular/core';
import { PreguntasConfigService } from '../../../../services/preguntas-config.service';
import { AuthService } from '../../../../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PreguntaListaTotal } from '../../../../interfaces/PreguntaLista.interface';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-pregunta-formulario',
  templateUrl: './pregunta-formulario.component.html',
  styleUrls: ['./pregunta-formulario.component.css']
})
export class PreguntaFormularioComponent implements OnInit {

  // Formulario
  formularioPreguntas: FormGroup = this.fb.group({
    pregunta: ['', Validators.required ],
    respuesta: ['', Validators.required ]
  })

  // Pregunta Anterior
  preguntaAnterior!: number;

  constructor( private preguntaConfigService: PreguntasConfigService, private authService: AuthService, private fb: FormBuilder ) { }

  @Input() numDePregunta!: number;
  preguntas: PreguntaListaTotal[] = [];
  indiceDePregunta!: number;

  ngOnInit(): void {
    // Cargar las preguntas en el componente
    setTimeout(() => {
      this.preguntas = this.preguntaConfigService.listaPreguntas;
    }, 500);

    this.formularioPreguntas.get('respuesta')?.disable();

    // Cuando se selecciona la pregunta
    this.formularioPreguntas.get('pregunta')?.valueChanges
      .subscribe( (pregunta) => {
        // Se selecciona una pregunta válida
        
        console.log(pregunta)
        if(pregunta) {

          if(this.preguntaAnterior >= 0) {  // Si existe un indice, recupera el anterior

            this.preguntaConfigService.listaPreguntas[this.preguntaAnterior].usadoPor = -1  // Liberar pregunta
            this.preguntaConfigService.listaRespuestas[this.numDePregunta-1].ID_PREGUNTA = -1 // Limpiar respuesta
            this.preguntaAnterior = -1;

          } 

          this.preguntaConfigService.listaPreguntas.forEach( (e, index) => {
            // Filtrar por el id de la pregunta
            if(e.ID_PREGUNTA === pregunta) {
              e.usadoPor = this.numDePregunta-1 // Actualizar servicio
              return this.preguntaAnterior = index; // Guardar indice de la pregunta usada
            }
            return
          });

          this.preguntaConfigService.listaRespuestas[this.numDePregunta-1].ID_PREGUNTA = pregunta // Guardar id de la pregunta

          // habilitar textbox
          this.formularioPreguntas.get('respuesta')?.reset('');
          this.formularioPreguntas.get('respuesta')?.enable();
        } else {
          // Por si elige una pregunta sin id
          if(this.preguntaAnterior >= 0) {  // Si existe un indice, recupera el anterior
            this.preguntaConfigService.listaPreguntas[this.preguntaAnterior].usadoPor = -1  // Liberar pregunta
            this.preguntaConfigService.listaRespuestas[this.numDePregunta-1].ID_PREGUNTA = -1 // Limpiar respuesta
            this.preguntaAnterior = -1;

            // deshabilitar textbox
            this.formularioPreguntas.get('respuesta')?.reset('');
            this.formularioPreguntas.get('respuesta')?.disable();
          } 
        }

      })

    this.formularioPreguntas.get('respuesta')?.valueChanges
      .subscribe( respuesta => {
        // Agregar respuesta
        this.preguntaConfigService.listaRespuestas[this.numDePregunta-1].RESPUESTA = respuesta
      } )
  }

}
