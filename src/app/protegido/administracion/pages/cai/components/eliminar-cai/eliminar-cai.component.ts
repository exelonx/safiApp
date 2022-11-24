import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CAIService } from '../../services/cai.service';
import { AuthService } from '../../../../../../auth/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-eliminar-cai',
  templateUrl: './eliminar-cai.component.html',
  styleUrls: ['./eliminar-cai.component.css']
})
export class EliminarCAIComponent implements OnInit, OnDestroy{

  @Output() onEliminar: EventEmitter<void> = new EventEmitter(); 

  enEjecucion: boolean = false;

  // Subscripciones
  subscripcion!: Subscription;

  get cai(){
    return this.caiService.cai;
  }

  constructor(private caiService: CAIService, private authService: AuthService) { }

  eliminarCAI() {

    if(!this.enEjecucion) {
      this.enEjecucion = true;
      
      const quienElimina = this.authService.usuario.id_usuario;
  
      this.subscripcion = this.caiService.deleteCAI(this.cai.ID, quienElimina)
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
