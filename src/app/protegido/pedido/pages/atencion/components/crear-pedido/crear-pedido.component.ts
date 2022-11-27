import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { InputMayus } from 'src/app/helpers/input-mayus';
import Swal from 'sweetalert2';
import { PedidoService } from '../../services/pedido.service';
import { AuthService } from '../../../../../../auth/services/auth.service';

@Component({
  selector: 'app-crear-pedido',
  templateUrl: './crear-pedido.component.html',
  styleUrls: ['./crear-pedido.component.css']
})
export class CrearPedidoComponent implements OnInit {
  
  @ViewChild('cerrarCrear') cerrarCrear!: MatButton;
  @ViewChild('checkDividido') checkDividido!: ElementRef;
  @ViewChild('numeroPersonas') numeroPersonas!: ElementRef;
  @ViewChild('acordion') acordion!: ElementRef;
  @Output() onCerrar: EventEmitter<boolean> = new EventEmitter();
  @Output() onCrear: EventEmitter<void> = new EventEmitter();

  manipulado: boolean = false;
  enEjecucion: boolean = false;
  pedidoNormalForm: boolean = true;
  checked: boolean = false;

  // Formulario
  formularioMostrador: FormGroup = this.fb.group({
    nombre:    ['', [Validators.required, Validators.maxLength(15)]],
    informacion:    ['', Validators.maxLength(20)]
    
  })

  formularioCuentaDividida: FormGroup = this.fb.group({
    // Arreglo de formularios
    nombre: this.fb.array([
      ['', [Validators.required, Validators.maxLength(45)]],
      ['', [Validators.required, Validators.maxLength(45)]]
    ], Validators.required)
  })

  formularioNuevoNormal: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(15)]]
  })

  panelOpenState = false;

  get cuentaDivididaArr() {
    return this.formularioCuentaDividida.get('nombre') as FormArray
  }

  
  async changeChecked() {
    this.checked = this.checkDividido.nativeElement.checked
  }

  constructor( private fb: FormBuilder, private pedidoService: PedidoService, private authService: AuthService ) { }

  checkedControl() {

    if(this.checked) {
      return this.formularioCuentaDividida.invalid || this.formularioNuevoNormal.invalid
    }
    return this.formularioNuevoNormal.invalid;

  }

  async validarNumeros(e: KeyboardEvent) {
    if(e.key === '+' || e.key === '-' || e.key === 'e' || e.key === 'E'|| e.key === '.') {
      e.preventDefault()
    }
  }

  subirValor() {
    console.log(this.checkDividido.nativeElement.checked)
    this.numeroPersonas.nativeElement.value++;
    this.actualizarDivisionDeCuenta();
  }

  bajarValor() {
    if(this.numeroPersonas.nativeElement.value > 2) {
      this.numeroPersonas.nativeElement.value--;
      this.actualizarDivisionDeCuenta();
    }
    
  }

  actualizarDivisionDeCuenta() {

    let nuevaCantidad: number = parseInt(this.numeroPersonas.nativeElement.value)

    // Si el número nuevo es mayor al existente
    if(nuevaCantidad > this.cuentaDivididaArr.length) {
      for (let index = 0; index < nuevaCantidad-this.cuentaDivididaArr.length; index++) {
        
        this.cuentaDivididaArr.push(this.fb.control('', [Validators.required, Validators.maxLength(45)]))
        
      }
    }

    if(nuevaCantidad < this.cuentaDivididaArr.length) {
      for (let index = nuevaCantidad; index < this.cuentaDivididaArr.length; index++) {
        
        this.cuentaDivididaArr.removeAt(index)
        
      }
    }

  }

  postMesaPedido() {
    let tipo: string = "MESA";
    let nombre: string = this.formularioNuevoNormal.get('nombre')?.value || "";
    let informacion: string = "";
    let listaNombre: string[] = [];
    let usuario: number = this.authService.usuario.id_usuario;

    if( !this.enEjecucion) {

      if(!this.pedidoNormalForm) {  // Si es falso es tipo Mostrador
        tipo = "MOSTRADOR";
        nombre = this.formularioMostrador.get('nombre')?.value || "";
        informacion = this.formularioNuevoNormal.get('informacion')?.value || "";
      }
  
      if(this.pedidoNormalForm && this.checked) {
        listaNombre = this.cuentaDivididaArr.value;
      }
  
      this.pedidoService.postMesaPedido(tipo, nombre, usuario, informacion, listaNombre)
        .subscribe( resp => {
          if(resp.ok === true) {
            this.onCrear.emit();
            this.enEjecucion = false;
            this.manipulado = false;
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

  }

  cerrar() {
    if(this.manipulado) {

      Swal.fire({
        title: '¡Cambios sin guardar!',
        text: "¿Desea salir del formulario sin guardar los cambios?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#898989',
        cancelButtonColor: '#d12609',
        confirmButtonText: 'Salir sin guardar',
        cancelButtonText: 'Permanecer',
        reverseButtons: true,
        background: '#2B2B2B',
        color: '#fff',
        heightAuto: false
      }).then((result) => {
        if (result.isConfirmed) {
          // Cerrar formulario
          this.manipulado = false;
          this.cerrarCrear._elementRef.nativeElement.click()
  
          // Destruir componente
          setTimeout(() => {
            this.onCerrar.emit(false)
          }, 100);
        }
      })

    } else {
      // Cerrar formulario
      this.cerrarCrear._elementRef.nativeElement.click()
      // Destruir componente
      setTimeout(() => {
        this.onCerrar.emit(false)
      }, 100);
    }
    
  }

  ngOnInit(): void {
  }

  toMayus = InputMayus.toMayus;

}
