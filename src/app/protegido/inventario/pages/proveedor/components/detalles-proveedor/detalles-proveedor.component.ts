import { Component, OnInit } from '@angular/core';
import { Departamento } from 'src/app/protegido/interfaces/departamento.interface';
import { Municipio } from 'src/app/protegido/interfaces/municipio.interface';
import { DireccionesService } from 'src/app/protegido/services/direcciones.service';
import { ProveedorService } from '../../services/proveedor.service';

@Component({
  selector: 'app-detalles-proveedor',
  templateUrl: './detalles-proveedor.component.html',
  styleUrls: ['./detalles-proveedor.component.css']
})
export class DetallesProveedorComponent implements OnInit {


  listaDepartamento: Departamento[] = [];
  listaMunicipio: Municipio[] = [];

  constructor(private proveedorService: ProveedorService, private direccionService: DireccionesService) { }

  get proveedor() {
    return this.proveedorService.proveedor;
  }

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

    console.log(this.listaDepartamento)

  }

  ngOnInit(): void {
  }

}
