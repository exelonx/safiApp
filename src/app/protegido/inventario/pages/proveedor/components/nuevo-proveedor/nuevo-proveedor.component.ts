import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InputMayus } from 'src/app/helpers/input-mayus';
import Swal from 'sweetalert2';
import { ProveedorService } from '../../services/proveedor.service';
import { DireccionesService } from '../../../../../services/direcciones.service';
import { Departamento } from '../../../../../interfaces/departamento.interface';
import { Municipio } from '../../../../../interfaces/municipio.interface';

@Component({
  selector: 'app-nuevo-proveedor',
  templateUrl: './nuevo-proveedor.component.html',
  styleUrls: ['./nuevo-proveedor.component.css']
})
export class NuevoProveedorComponent implements OnInit {

  @ViewChild('cerrarCrear') cerrarCrear!: MatButton;

  @Output() onCerrar: EventEmitter<boolean> = new EventEmitter();

  @Output() onCrear: EventEmitter<void> = new EventEmitter();

  // Propiedad para evitar doble ejecuciones al cliclear más de una vez
  enEjecucion: boolean = false;
  cambiandoContra: boolean = false;

  // Subscripciones
  subscripcion!: Subscription;

  // Formulario
  formularioProveedor: FormGroup = this.fb.group({
    nombre:    ['', [Validators.required, Validators.maxLength(50)]],
    detalle: ['', [Validators.required, Validators.maxLength(50)]],
    telefono: ['', [Validators.required, Validators.maxLength(15)]],
    departamento: ['', [Validators.required]],
    municipio: ['', [Validators.required]]
  })

  //Listas
  listaDepartamento: Departamento[] = [];
  listaMunicipio: Municipio[] = [];

  constructor( private proveedorService: ProveedorService, private authService: AuthService, private direccionService: DireccionesService, private fb: FormBuilder) { }
  
  crearProveedor() {
    if( !this.enEjecucion ) {
      const {nombre, detalle, telefono} = this.formularioProveedor.value
      const id_usuario = this.authService.usuario.id_usuario;
      
      this.enEjecucion = true;
      
      this.subscripcion = this.proveedorService.crearProveedor(nombre, detalle, telefono, id_usuario)
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

  cargarDepartamentos(){

    this.direccionService.getDepartamentos().subscribe((resp)=>{

      this.listaDepartamento = resp.departamento!

    })

  }

  cargarMunicipios(){

    const{departamento}=this.formularioProveedor.value;

    this.direccionService.getMunicipios(departamento).subscribe((resp)=>{

      this.listaMunicipio = resp.municipio!

    })

  }

  ngOnInit(): void {

    this.cargarDepartamentos();
  }

  cerrar() {
    setTimeout(() => {
      this.onCerrar.emit(false)
    }, 250);
  }

  toMayus = InputMayus.toMayus;

}
