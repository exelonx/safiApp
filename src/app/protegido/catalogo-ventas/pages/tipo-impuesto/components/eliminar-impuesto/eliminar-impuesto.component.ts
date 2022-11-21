import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';
import { TipoImpuestoService } from '../../services/tipo-impuesto.service';

@Component({
  selector: 'app-eliminar-impuesto',
  templateUrl: './eliminar-impuesto.component.html',
  styleUrls: ['./eliminar-impuesto.component.css']
})
export class EliminarImpuestoComponent implements OnInit {

  @Output() onEliminar: EventEmitter<void> = new EventEmitter(); 

  enEjecucion: boolean = false;

  // Subscripciones
  subscripcion!: Subscription;

  get impuesto(){
    return this.impuestoService.impuesto;
  }
  constructor(private impuestoService: TipoImpuestoService, private authService: AuthService) { }

  eliminarImpuesto() {

    if(!this.enEjecucion) {
      this.enEjecucion = true;
      
      const quienElimina = this.authService.usuario.id_usuario;
  
      this.subscripcion = this.impuestoService.eliminarImpuesto(this.impuesto.ID, quienElimina)
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
