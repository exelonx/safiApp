import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InputMayus } from 'src/app/helpers/input-mayus';
import Swal from 'sweetalert2';
import { Unidad, UnidadResp } from '../../../unidad/interfaces/unidad.interface';
import { InsumoService } from '../../services/insumo.service';
import { UnidadService } from '../../../unidad/services/unidad.service';

@Component({
  selector: 'app-editar-insumo',
  templateUrl: './editar-insumo.component.html',
  styleUrls: ['./editar-insumo.component.css']
})
export class EditarInsumoComponent implements OnInit {

  @ViewChild('cerrarEditar') cerrarEditar!: MatButton;
  
  @Output() onCerrar: EventEmitter<boolean> = new EventEmitter();

  @Output() onActualizacion: EventEmitter<void> = new EventEmitter();


  listaUnidad: Unidad[] = []; 

  enEjecucion: boolean = false;
  editandoProveedor: boolean = false;


   // Formulario
   formularioEdicion: FormGroup = this.fb.group({
    nombre:    ['', [Validators.required, Validators.maxLength(150)]],
    unidad:    ['', [Validators.required]],
    cantidad_maxima: ['', [Validators.required]],
    cantidad_minima: ['', [Validators.required]]
  })

  get insumo(){
    return this.insumoService.insumo;
  }

  get unidad(){
    return this.unidadService.unidad;
  }

  constructor(private insumoService:InsumoService, private authService: AuthService, private fb: FormBuilder,
              private unidadService: UnidadService) { }

  actualizarInsumo() {

    if(!this.enEjecucion) {
      this.enEjecucion = true;

      const id_usuario = this.authService.usuario.id_usuario;

      const {nombre, unidad, cantidad_maxima, cantidad_minima} = this.formularioEdicion.value;

      this.insumoService.putInsumo(this.insumo.ID, id_usuario, nombre, unidad, cantidad_maxima, cantidad_minima )
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


  cargarUnidad() {
    const usuario = this.authService.usuario.id_usuario;
    this.unidadService.getUnidad(usuario)
      .subscribe((unidad: UnidadResp) => {
        this.listaUnidad = unidad.unidades!;
      });
  }

  async validarNumeros(e: KeyboardEvent) {
    if(e.key === '+' || e.key === '-' || e.key === 'e' || e.key === 'E') {
      e.preventDefault()
    }
  }

  toMayus = InputMayus.toMayus;
  
  ngOnInit(): void {
    this.cargarUnidad();
  }

  cerrar() {
    setTimeout(() => {
      this.onCerrar.emit(false)
    }, 100);
  }

}
