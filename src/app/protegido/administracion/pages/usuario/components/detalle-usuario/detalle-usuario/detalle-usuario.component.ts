import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-detalle-usuario',
  templateUrl: './detalle-usuario.component.html',
  styleUrls: ['./detalle-usuario.component.css']
})
export class DetalleUsuarioComponent implements OnInit {

  constructor(private usuarioServices: UsuarioService) { }

  get usuario() {
    return this.usuarioServices.usuario;
  }

  ngOnInit(): void {
  }

}
