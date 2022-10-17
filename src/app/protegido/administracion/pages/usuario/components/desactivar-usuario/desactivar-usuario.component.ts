import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Usuario } from '../../interfaces/usuario.interface';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../../../../../auth/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-desactivar-usuario',
  templateUrl: './desactivar-usuario.component.html',
  styleUrls: ['./desactivar-usuario.component.css']
})
export class DesactivarUsuarioComponent implements OnInit {

  @Input() usuario: string = "";
  @Input() id_usuario: number = 0;
  

  @Output() onDesactivar: EventEmitter<undefined> = new EventEmitter(); 

  constructor(private usuarioService: UsuarioService, private authService: AuthService) { }

  desactivarUsuario(){

    const quienDesactiva = this.authService.usuario.id_usuario; 

    this.usuarioService.desactivarUsuario( this.id_usuario, quienDesactiva )
      .subscribe(resp => { 
        if(resp.ok === true) {
          this.onDesactivar.emit();
          Swal.fire('¡Éxito!', resp.msg, 'success')
        } else {
          Swal.fire('Error', resp, 'warning')
        }
      });
  }

  ngOnInit(): void {
  }

}
