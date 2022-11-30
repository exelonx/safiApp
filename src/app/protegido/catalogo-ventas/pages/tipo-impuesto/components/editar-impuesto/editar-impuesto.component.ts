import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InputMayus } from 'src/app/helpers/input-mayus';
import Swal from 'sweetalert2';
import { TipoImpuestoService } from '../../services/tipo-impuesto.service';

@Component({
  selector: 'app-editar-impuesto',
  templateUrl: './editar-impuesto.component.html',
  styleUrls: ['./editar-impuesto.component.css']
})
export class EditarImpuestoComponent implements OnInit {

  @ViewChild('cerrarEditar') cerrarEditar!: MatButton;
  @ViewChild('nombre') nombre!: ElementRef;
  @ViewChild('porcentaje') porcentaje!: ElementRef;
  
  @Output() onCerrar: EventEmitter<boolean> = new EventEmitter();

  @Output() onActualizacion: EventEmitter<void> = new EventEmitter();

  enEjecucion: boolean = false;
  editandoProveedor: boolean = false;

  async validarNumeros(e: KeyboardEvent) {
    if(e.key === '+' || e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '.') {
      e.preventDefault()
    }
  }

  async validarCantidad(max: number, valorRecibido: number, e: KeyboardEvent) {
    console.log(( parseInt(e.key) + valorRecibido )); 
    if (isNaN(parseInt(e.key))){
      return
    }
    if ( parseInt(( e.key) + valorRecibido.toString() ) > max) {
      e.preventDefault()
    }   
  }

  get getPorcentaje () : number{
    return parseInt(this.porcentaje.nativeElement.value);
  }


  constructor(private impuestoService:TipoImpuestoService, private authService: AuthService) { }
  
  get impuesto(){
    return this.impuestoService.impuesto;
  }

  actualizarImpuesto() {

    if(!this.enEjecucion) {

      this.enEjecucion = true;

      const id_usuario = this.authService.usuario.id_usuario;

      const nombre = this.nombre.nativeElement.value;
      const porcentaje = this.porcentaje.nativeElement.value;

      this.impuestoService.actualizarImpuesto(this.impuesto.ID, nombre, porcentaje, id_usuario)
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

  toMayus = InputMayus.toMayusNoReactivo;

  cerrar() {
    setTimeout(() => {
      this.onCerrar.emit(false)
    }, 100);
  }
  
  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    
    this.cerrarEditar._elementRef.nativeElement.click()
    
  }

}
