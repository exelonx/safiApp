import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ParametroService } from '../../services/parametro.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../../../auth/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-parametro',
  templateUrl: './editar-parametro.component.html',
  styleUrls: ['./editar-parametro.component.css']
})
export class EditarParametroComponent implements OnInit {

  @Input() id: number = 0;
  @Input() parametro: string = "";
  @Input() valor: string = "";
  @Input() tamano: string = "";
  @Input() limite: string = "";
  
  @Output() onActualizacion: EventEmitter<undefined> = new EventEmitter();

  // Propiedad para evitar doble ejecuciones al cliclear más de una vez
  enEjecucion: boolean = false;

  constructor(private parametroService:ParametroService, private fb: FormBuilder, private usuario: AuthService) { }

  // Formulario
  formularioParametro: FormGroup = this.fb.group({
    valor:    ['', [Validators.required, Validators.maxLength(100)]]
  })

  ngOnInit(): void {
  }

  actualizar() {
    const valor = this.formularioParametro.value.valor === "" ? this.valor :  this.formularioParametro.value.valor
    const id_usuario = this.usuario.usuario.id_usuario;
    
    if( !this.enEjecucion ) {
    
      this.enEjecucion = true

      this.parametroService.actualizarParametro(this.id, valor, id_usuario)
        .subscribe(
          (resp => {
            this.onActualizacion.emit();
            if(resp.ok === true) {
              this.enEjecucion = false;
              Swal.fire('¡Éxito!', resp.msg, 'success')
            } else {
              this.enEjecucion = false;
              Swal.fire('Error', resp, 'warning')
            }
          })
        )
    }  
  };

}
