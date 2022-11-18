import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { InsumoService } from '../../services/insumo.service';
import { AuthService } from '../../../../../../auth/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-eliminar-insumo',
  templateUrl: './eliminar-insumo.component.html',
  styleUrls: ['./eliminar-insumo.component.css']
})
export class EliminarInsumoComponent implements OnInit {

  @Output() onEliminar: EventEmitter<void> = new EventEmitter(); 

  enEjecucion: boolean = false;

  // Subscripciones
  subscripcion!: Subscription;

  get insumo(){
    return this.insumoService.insumo;
  }

  constructor(private insumoService: InsumoService, private authService: AuthService) { }

  eliminarInsumo() {

    if(!this.enEjecucion) {
      this.enEjecucion = true;
      
      const quienElimina = this.authService.usuario.id_usuario;
  
      this.subscripcion = this.insumoService.deleteInsumo(this.insumo.ID, quienElimina)
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
