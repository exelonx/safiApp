import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Pedido } from '../../interfaces/pedido.interfaces';
import { PedidoService } from '../../services/pedido.service';
import { AuthService } from '../../../../../../auth/services/auth.service';
import { MatButton } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-eliminar-detalle',
  templateUrl: './eliminar-detalle.component.html',
  styleUrls: ['./eliminar-detalle.component.css']
})
export class EliminarDetalleComponent implements OnInit {
  
  @Output() onCerrar: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('cerrarEliminar') cerrarEliminar!: MatButton;

  @Input() cantidad: number = 0; //Para hacer lazy-load de los datos
  @Input() nombre: string = "";
  @Input() mesa: string = "";
  @Input() id_detalle: number = 0;
  enEjecucion: boolean = false;

  constructor( private pedidoService: PedidoService, private authSerive: AuthService, private fb: FormBuilder ) { }

  formularioEliminacion: FormGroup = this.fb.group({
    motivo: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(10)]]
  })

  cerrar() {
    setTimeout(() => {
      this.onCerrar.emit(false)
    }, 250);
  }

  eliminar() {
    if(!this.enEjecucion) {
      this.enEjecucion = true;

      const usuario = this.authSerive.usuario.id_usuario;
      const {motivo} = this.formularioEliminacion.value;

      this.pedidoService.deleteUnDetalle(this.id_detalle, usuario, motivo)
        .subscribe( resp => {
          if(resp.ok === true) {
            this.enEjecucion = false;
            this.cerrarEliminar._elementRef.nativeElement.click()
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
            this.enEjecucion = false
            Swal.fire({
              title: 'Advertencia',
              text: resp.msg,
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

  ngOnInit(): void {
  }

}
