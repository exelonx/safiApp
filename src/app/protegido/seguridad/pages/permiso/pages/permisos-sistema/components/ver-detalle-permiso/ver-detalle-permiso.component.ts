import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { PermisoService } from '../../../../services/permiso.service';

@Component({
  selector: 'app-ver-detalle-permiso',
  templateUrl: './ver-detalle-permiso.component.html',
  styleUrls: ['./ver-detalle-permiso.component.css']
})
export class VerDetallePermisoComponent implements OnInit {

  
  @ViewChild('cerrarDetalle') cerrarDetalle!: MatButton;

  constructor(private permisoService: PermisoService) { }

  get permiso() {
    return this.permisoService.permiso;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    
    this.cerrarDetalle._elementRef.nativeElement.click()
    
  }

}