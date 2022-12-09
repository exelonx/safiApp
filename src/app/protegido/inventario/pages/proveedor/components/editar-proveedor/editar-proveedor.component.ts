import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { AuthService } from '../../../../../../auth/services/auth.service';
import { InputMayus } from 'src/app/helpers/input-mayus';
import Swal from 'sweetalert2';
import { ProveedorService } from '../../services/proveedor.service';
import { Proveedor } from '../../interfaces/proveedorItems.interface';
import { Departamento } from 'src/app/protegido/interfaces/departamento.interface';
import { Municipio } from 'src/app/protegido/interfaces/municipio.interface';
import { DireccionesService } from 'src/app/protegido/services/direcciones.service';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-editar-proveedor',
  templateUrl: './editar-proveedor.component.html',
  styleUrls: ['./editar-proveedor.component.css']
})
export class EditarProveedorComponent implements OnInit {

  @ViewChild('cerrarEditar') cerrarEditar!: MatButton;
  @ViewChild('inputNombre') inputNombre!: ElementRef;
  @ViewChild('inputDetalle') inputDetalle!: ElementRef;
  @ViewChild('inputTelefono') inputTelefono!: ElementRef;
  @ViewChild('selectDepartamento') selectDepartamento!: MatSelect;
  @ViewChild('selectMunicipio') selectMunicipio!: MatSelect;

  @Output() onActualizacion: EventEmitter<undefined> = new EventEmitter();
  @Output() onCerrar: EventEmitter<boolean> = new EventEmitter();
  
  // Formulario
 /*  formularioProveedor: FormGroup = this.fb.group({
    departamento: ['', [Validators.required]],
    municipio: ['', [Validators.required]]
  })
   */

  //Listas
  listaDepartamento: Departamento[] = [];
  listaMunicipio: Municipio[] = [];


  public get proveedor() : Proveedor {

    return this.proveedorService.proveedor

  }
  

  enEjecucion: boolean = false;

  constructor(private proveedorService: ProveedorService, private direccionService: DireccionesService, private fb: FormBuilder, private usuario: AuthService) { }

  actualizar() {

    if(!this.enEjecucion) {
      this.enEjecucion = true;

      const nombre = this.inputNombre.nativeElement.value;/* this.formularioRol.value.rol === "" ? this.rol :  this.formularioRol.value.rol */
      const detalle = this.inputDetalle.nativeElement.value;
      const id_departamento = this.selectDepartamento.value;
      const id_municipio = this.selectMunicipio.value; /*  === "" ? this.descripcion : this.formularioRol.value.descripcion */
      const telefono = this.inputTelefono.nativeElement.value;
      const id_usuario = this.usuario.usuario.id_usuario;
      
      this.proveedorService.actualizarProveedor(this.proveedor.ID, nombre, detalle, this.proveedor.ID_DIRECCION, id_departamento, id_municipio, telefono, id_usuario)
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

  cargarDepartamentos(){

    this.direccionService.getDepartamentos().subscribe((resp)=>{

      this.listaDepartamento = resp.departamento!
      this.cargarMunicipios(this.proveedor.ID_DEPARTAMENTO)

    })

  }

  cargarMunicipios(id_departamento: number){

    /* const{departamento}=this.formularioProveedor.value; */

    this.direccionService.getMunicipios(id_departamento).subscribe((resp)=>{

      this.listaMunicipio = resp.municipio!

    })

  }

  ngOnInit(): void {

    this.cargarDepartamentos();
  }

  ngOnDestroy(): void {
    
    this.cerrarEditar._elementRef.nativeElement.click()
    
  }

  cerrar() {
    setTimeout(() => {
      this.onCerrar.emit(false)
    }, 100);
  }

  limpiarSelect(){

    this.selectMunicipio.value = null

  }

  toMayus = InputMayus.toMayusNoReactivo;


}
