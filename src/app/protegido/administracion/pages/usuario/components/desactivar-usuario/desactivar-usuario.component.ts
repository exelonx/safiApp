import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Usuario } from '../../interfaces/usuario.interface';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../../../../../auth/services/auth.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-desactivar-usuario',
  templateUrl: './desactivar-usuario.component.html',
  styleUrls: ['./desactivar-usuario.component.css']
})
export class DesactivarUsuarioComponent implements OnInit, OnDestroy {

  @Input() usuario: string = "";
  @Input() id_usuario: number = 0;
  
  @Output() onDesactivar: EventEmitter<undefined> = new EventEmitter(); 

  enEjecucion: boolean = false;

  // Subscripciones
  subscripcion!: Subscription;

  constructor(private usuarioService: UsuarioService, private authService: AuthService) { }
  
  desactivarUsuario(){
    
    if(!this.enEjecucion) {

      this.enEjecucion = true;
      const quienDesactiva = this.authService.usuario.id_usuario; 
      
      this.subscripcion = this.usuarioService.desactivarUsuario( this.id_usuario, quienDesactiva )
      .subscribe(resp => { 
        if(resp.ok === true) {
          this.onDesactivar.emit();
          Swal.fire('¡Éxito!', resp.msg, 'success')
          this.enEjecucion = false;
        } else {
          Swal.fire('Error', resp, 'warning');
          this.enEjecucion = false;
        }
      });
    }
  }

  ngOnDestroy(): void {
    if(this.subscripcion) {
      this.subscripcion.unsubscribe();
    };
  }
  
  ngOnInit(): void {
  }

}
