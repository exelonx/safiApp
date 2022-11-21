import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputMayus } from 'src/app/helpers/input-mayus';

@Component({
  selector: 'app-crear-pedido',
  templateUrl: './crear-pedido.component.html',
  styleUrls: ['./crear-pedido.component.css']
})
export class CrearPedidoComponent implements OnInit {

  // Formulario
  formularioCreacion: FormGroup = this.fb.group({
    nombre:    ['', [Validators.required, Validators.maxLength(150)]],
    unidad:    ['', [Validators.required]],
    cantidad_maxima: ['', [Validators.required]],
    cantidad_minima: ['', [Validators.required]]
    
  })

  panelOpenState = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  toMayus = InputMayus.toMayus;

}
