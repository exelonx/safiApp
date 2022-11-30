import { Component, EventEmitter, OnInit, Output, ViewChild, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { AuthService } from '../../../../../../auth/services/auth.service';
import { InputMayus } from 'src/app/helpers/input-mayus';
import { ParametroService } from '../../services/parametro.service';

@Component({
  selector: 'app-nuevo-parametro',
  templateUrl: './nuevo-parametro.component.html',
  styleUrls: ['./nuevo-parametro.component.css']
})
export class NuevoParametroComponent implements OnInit, OnDestroy {

  @ViewChild('cerrarCrear') cerrarCrear!: MatButton;

  @Output() onCrear: EventEmitter<void> = new EventEmitter();

  // Propiedad para evitar doble ejecuciones al cliclear más de una vez
  enEjecucion: boolean = false;
  cambiandoContra: boolean = false;

  // Subscripciones
  subscripcion!: Subscription;

  // Formulario
  formularioParametro: FormGroup = this.fb.group({
    valor:    ['', [Validators.required, Validators.maxLength(100)]],
    parametro: ['', [Validators.required, Validators.maxLength(50)]]
  })

  constructor( private parametroServices: ParametroService, private authService: AuthService, private fb: FormBuilder) { }
  
  
  crearParametro() {
    if( !this.enEjecucion ) {
      const {valor, parametro} = this.formularioParametro.value
      const id_usuario = this.authService.usuario.id_usuario;
      
      this.enEjecucion = true;
      
      this.subscripcion = this.parametroServices.crearParametro(parametro, valor, id_usuario)
      .subscribe(resp => {
        this.onCrear.emit();
        if(resp.ok === true) {
          this.enEjecucion = false
          this.cerrarCrear._elementRef.nativeElement.click()
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
  }
  
  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if(this.subscripcion) {
      this.subscripcion.unsubscribe();
    }
    this.cerrarCrear._elementRef.nativeElement.click()
  }
  
  toMayus = InputMayus.toMayus;
  
  limpiarFormulario() {
    this.formularioParametro.reset();
  }

}
