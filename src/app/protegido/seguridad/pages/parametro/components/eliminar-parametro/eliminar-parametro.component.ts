import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ParametroService } from '../../services/parametro.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-eliminar-parametro',
  templateUrl: './eliminar-parametro.component.html',
  styleUrls: ['./eliminar-parametro.component.css']
})
export class EliminarParametroComponent implements OnInit, OnDestroy {

  @Input() id_parametro: number = 0;
  @Input() parametro: string = "";

  @Output() onEliminar: EventEmitter<void> = new EventEmitter(); 

  // Subscripciones
  subscripcion!: Subscription;

  constructor(private parametroService: ParametroService, private authService: AuthService) { }

  eliminarParametro() {

    const quienElimina = this.authService.usuario.id_usuario;

    this.subscripcion = this.parametroService.EliminarParametro(this.id_parametro, quienElimina)
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
        }
      })
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if(this.subscripcion) {
      this.subscripcion.unsubscribe();
    };
  }

}
