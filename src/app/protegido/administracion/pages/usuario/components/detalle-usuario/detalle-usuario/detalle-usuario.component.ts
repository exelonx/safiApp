import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-detalle-usuario',
  templateUrl: './detalle-usuario.component.html',
  styleUrls: ['./detalle-usuario.component.css']
})
export class DetalleUsuarioComponent implements OnInit {

  
  @ViewChild('cerrarDetalle') cerrarDetalle!: MatButton;

  constructor(private usuarioServices: UsuarioService) { }

  get usuario() {
    return this.usuarioServices.usuario;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    
    this.cerrarDetalle._elementRef.nativeElement.click()
    
  }

}
