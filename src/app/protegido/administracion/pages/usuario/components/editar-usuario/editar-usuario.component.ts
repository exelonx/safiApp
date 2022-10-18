import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Rol } from 'src/app/protegido/seguridad/pages/rol/interfaces/rolItems.interface';
import { RolService } from 'src/app/protegido/seguridad/pages/rol/services/rol.service';
import { UsuarioService } from '../../services/usuario.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent implements OnInit {

  //Subscripciones
  rolSubscripcion!: Subscription;

  checked = false;

  roles: Rol[] = [];

  constructor( private usuarioServices: UsuarioService, private rolServices: RolService, private authService: AuthService) { }

  ngOnInit(): void {
    this.cargarPreguntas()
  }

  check(evento: MatCheckboxChange) {
    this.checked = evento.checked;
  }

  cargarPreguntas() {
    const id_usuario = this.authService.usuario.id_usuario
    this.rolSubscripcion = this.rolServices.getRoles(id_usuario, "", "99999")
      .subscribe(
        resp => {
          this.roles = resp.roles!
        }
      )
  }
}
