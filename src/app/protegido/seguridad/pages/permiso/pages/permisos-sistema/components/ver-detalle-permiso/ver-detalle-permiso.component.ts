import { Component, OnInit } from '@angular/core';
import { PermisoService } from '../../../../services/permiso.service';

@Component({
  selector: 'app-ver-detalle-permiso',
  templateUrl: './ver-detalle-permiso.component.html',
  styleUrls: ['./ver-detalle-permiso.component.css']
})
export class VerDetallePermisoComponent implements OnInit {

  constructor(private permisoService: PermisoService) { }

  get permiso() {
    return this.permisoService.permiso;
  }

  ngOnInit(): void {
  }

}