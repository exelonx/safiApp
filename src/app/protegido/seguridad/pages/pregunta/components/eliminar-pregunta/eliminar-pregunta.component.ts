import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { PreguntaService } from '../../services/pregunta.service';
import { AuthService } from '../../../../../../auth/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-eliminar-pregunta',
  templateUrl: './eliminar-pregunta.component.html',
  styleUrls: ['./eliminar-pregunta.component.css']
})
export class EliminarPreguntaComponent implements OnInit {

  @Input() id_pregunta: number = 0;
  @Input() pregunta: string = "";

  @Output() onEliminar: EventEmitter<void> = new EventEmitter(); 

  enEjecucion: boolean = false;

  // Subscripciones
  subscripcion!: Subscription;

  constructor(private preguntaService: PreguntaService, private authService: AuthService) { }

  eliminarPregunta() {

    if(!this.enEjecucion) {
      this.enEjecucion = true;
      const quienElimina = this.authService.usuario.id_usuario;
  
      this.subscripcion = this.preguntaService.eliminarPregunta(this.id_pregunta, quienElimina)
        .subscribe(resp => {
          if(resp.ok === true) {
            this.onEliminar.emit();
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
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if(this.subscripcion) {
      this.subscripcion.unsubscribe();
    };
  }

}
