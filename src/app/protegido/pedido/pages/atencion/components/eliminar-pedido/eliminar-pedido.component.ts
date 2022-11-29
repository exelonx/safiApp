import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';
import { PedidoService } from '../../services/pedido.service';

@Component({
  selector: 'app-eliminar-pedido',
  templateUrl: './eliminar-pedido.component.html',
  styleUrls: ['./eliminar-pedido.component.css']
})
export class EliminarPedidoComponent implements OnInit {

  @Output() onCerrar: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('cerrarEliminar') cerrarEliminar!: MatButton;

  @Input() nombre: string = "";
  @Input() mesa: string = "";
  @Input() id_pedido: number = 0;
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

      console.log(this.id_pedido)
      this.pedidoService.deletePedido(this.id_pedido, usuario, motivo)
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
