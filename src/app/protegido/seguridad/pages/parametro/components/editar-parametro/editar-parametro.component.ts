import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ParametroService } from '../../services/parametro.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../../../auth/services/auth.service';
import Swal from 'sweetalert2';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-editar-parametro',
  templateUrl: './editar-parametro.component.html',
  styleUrls: ['./editar-parametro.component.css']
})
export class EditarParametroComponent implements OnInit {
  
  @ViewChild('cerrarEditar') cerrarEditar!: MatButton;
  @ViewChild('inputValor') inputValor!: ElementRef;

  @Input() id: number = 0;
  @Input() parametro: string = "";
  @Input() valor: string = "";
  @Input() tamano: string = "";
  @Input() limite: string = "";
  
  @Output() onActualizacion: EventEmitter<undefined> = new EventEmitter();

  // Propiedad para evitar doble ejecuciones al cliclear más de una vez
  enEjecucion: boolean = false;

  constructor(private parametroService:ParametroService, private fb: FormBuilder, private usuario: AuthService) { }

 

  ngOnInit(): void {
  }

  actualizar() {
    const valor = this.inputValor.nativeElement.value 
    /* this.formularioParametro.value.valor === "" ? this.valor :  this.formularioParametro.value.valor */
    const id_usuario = this.usuario.usuario.id_usuario;
    
    if( !this.enEjecucion ) {
    
      this.enEjecucion = true

      this.parametroService.actualizarParametro(this.id, valor, id_usuario)
        .subscribe(
          (resp => {
            this.onActualizacion.emit();
            if(resp.ok === true) {
              this.enEjecucion = false;
              this.cerrarEditar._elementRef.nativeElement.click()
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
              this.enEjecucion = false;
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
        )
    }  
  };

  ngOnDestroy(): void {
    
    this.cerrarEditar._elementRef.nativeElement.click()
    
  }

  limpiarFormulario() {

   /*  this.formularioParametro.controls['valor'].setValue(this.valor) */

  }

}
