import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-nueva-compra',
  templateUrl: './nueva-compra.component.html',
  styleUrls: ['./nueva-compra.component.css']
})
export class NuevaCompraComponent implements OnInit {

  // Formularios
  formularioCreacion: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    cantidad: ['0.00', [Validators.required]],
    precio: ['0.00', [Validators.required]],
    total: ['0.00']
  })

  constructor( private authService: AuthService, private fb: FormBuilder ) { }

  enEjecucion: boolean = false;

  async validarNumeros(e: KeyboardEvent) {
    if(e.key === '+' || e.key === '-') {
      e.preventDefault()
    }
  }

  ngOnInit(): void {
  }

}
