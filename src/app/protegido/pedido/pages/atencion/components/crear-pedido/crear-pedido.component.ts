import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { InputMayus } from 'src/app/helpers/input-mayus';
import Swal from 'sweetalert2';

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
    informacion:    ['', [Validators.required, Validators.maxLength(20)]]
    
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

  constructor(private fb: FormBuilder) { }

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
