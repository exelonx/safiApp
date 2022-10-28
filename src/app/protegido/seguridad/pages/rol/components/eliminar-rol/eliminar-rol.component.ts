import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { RolService } from '../../services/rol.service';
import { AuthService } from '../../../../../../auth/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-eliminar-rol',
  templateUrl: './eliminar-rol.component.html',
  styleUrls: ['./eliminar-rol.component.css']
})
export class EliminarRolComponent implements OnInit {

  @Input() id_rol: number = 0;
  @Input() rol: string = "";

  @Output() onEliminar: EventEmitter<void> = new EventEmitter(); 

  enEjecucion: boolean = false;

  // Subscripciones
  subscripcion!: Subscription;

  constructor(private rolService: RolService, private authService: AuthService) { }

  eliminarRol() {

    if(!this.enEjecucion) {
      this.enEjecucion = true;
      const quienElimina = this.authService.usuario.id_usuario;
  
      this.subscripcion = this.rolService.eliminarRol(this.id_rol, quienElimina)
        .subscribe(resp => {
          if(resp.ok === true) {
            this.onEliminar.emit();
            Swal.fire('¡Éxito!', resp.msg, 'success')
            this.enEjecucion = false;
          } else {
            Swal.fire('Error', resp, 'warning')
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
