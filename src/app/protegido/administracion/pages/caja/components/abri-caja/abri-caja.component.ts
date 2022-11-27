import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InputMayus } from 'src/app/helpers/input-mayus';
import Swal from 'sweetalert2';
import { Caja } from '../../interface/cajaItems.interface';
import { CajaService } from '../../services/caja.service';

@Component({
  selector: 'app-abri-caja',
  templateUrl: './abri-caja.component.html',
  styleUrls: ['./abri-caja.component.css']
})
export class AbriCajaComponent implements OnInit {

  constructor(private cajaService: CajaService, private fb: FormBuilder, private authService: AuthService) { }

  @Output() onCerrar: EventEmitter<boolean> = new EventEmitter();
  @Output() onCrear: EventEmitter<void> = new EventEmitter();
  @ViewChild('cerrarCrear') cerrarCrear!: MatButton;

  // Propiedad para evitar doble ejecuciones al cliclear más de una vez
  enEjecucion: boolean = false;
  cambiandoContra: boolean = false;

  /* estadoCaja: boolean = false; */

  // Atributos
  registros: Caja[] = [];
  tamano: number = 0;
  limite: number = 0;
  indice: number = -1;

  async validarNumeros(e: KeyboardEvent) {
    if (e.key === '+' || e.key === '-' || e.key === 'e' || e.key === 'E') {
      e.preventDefault()
    }
  }

  // Subscripciones
  subscripcion!: Subscription;

  // Formulario
  formularioCaja: FormGroup = this.fb.group({
    monto:['', [Validators.required]]
  })

  crearCajaAbierta() {
    if( !this.enEjecucion ) {
      const {monto} = this.formularioCaja.value
      const id_usuario = this.authService.usuario.id_usuario;
      
      this.enEjecucion = true;
      
      this.subscripcion = this.cajaService.crearCajaAbierta(monto, id_usuario)
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
  };

  recargar() {
    // Datos requeridos
  
    // Consumo
    this.subscripcion = this.cajaService.getCajaAbierta()
    .subscribe(
      resp => {
        this.registros = resp.cajas!
        this.tamano = resp.countCajas!
        this.limite = resp.limite!
        console.log(resp)
      }
    )
  }

  ngOnInit(): void {
  }

  public get cajaAbierta() : Caja {
    return this.cajaService.cajaAbierta;
  }

  cerrar() {
    setTimeout(() => {
      this.onCerrar.emit(false)
    }, 250);
  }

  toMayus = InputMayus.toMayus;

}
