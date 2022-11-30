import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InputMayus } from 'src/app/helpers/input-mayus';
import Swal from 'sweetalert2';
import { Estado } from '../../interfaces/estadoItems.interface';
import { EstadoService } from '../../services/estado.service';

@Component({
  selector: 'app-editar-estado',
  templateUrl: './editar-estado.component.html',
  styleUrls: ['./editar-estado.component.css']
})
export class EditarEstadoComponent implements OnInit {

  @ViewChild('cerrarEditar') cerrarEditar!: MatButton;
  @ViewChild('inputEstado') inputEstado!: ElementRef;
  @ViewChild('inputColor') inputColor!: ElementRef;

  @Output() onActualizacion: EventEmitter<undefined> = new EventEmitter();
  @Output() onCerrar: EventEmitter<boolean> = new EventEmitter();

  enEjecucion: boolean = false;

  constructor(private estadoService: EstadoService, private fb: FormBuilder, private usuario: AuthService) { }

  ngOnInit(): void {
  }

  actualizar() {

    if(!this.enEjecucion) {
      this.enEjecucion = true;

      const estado = this.inputEstado.nativeElement.value;
      const color = this.inputColor.nativeElement.value;
      /* this.formularioRol.value.rol === "" ? this.rol :  this.formularioRol.value.rol */
      const id_usuario = this.usuario.usuario.id_usuario;
      
      this.estadoService.actualizarEstado(this.estado.ID, estado, color, id_usuario)
        .subscribe(
          (resp => {
            this.onActualizacion.emit();
            if(resp.ok === true) {
              this.cerrarEditar._elementRef.nativeElement.click();
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
        )

    }
      
  };

  public get estado() : Estado {
    return this.estadoService.estado;
  }

  toMayus = InputMayus.toMayusNoReactivo;

  ngOnDestroy(): void {
    
    this.cerrarEditar._elementRef.nativeElement.click()
    
  }

}
