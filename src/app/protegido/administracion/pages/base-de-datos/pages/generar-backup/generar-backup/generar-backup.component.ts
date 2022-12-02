import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { BackupService } from '../../../services/backup.service';

@Component({
  selector: 'app-generar-backup',
  templateUrl: './generar-backup.component.html',
  styleUrls: ['./generar-backup.component.css']
})
export class GenerarBackupComponent implements OnInit {
  
  @ViewChild('servidor') servidor!: ElementRef
  @ViewChild('base') base!: ElementRef
  @ViewChild('usuario') usuario!: ElementRef
  @ViewChild('contrasena') contrasena!: ElementRef
  @ViewChild('tamano') tamano!: ElementRef

  hideContrasena: boolean = false;
  formularioConexion: FormGroup = this.fb.group({
    // Arreglo de formularios
    servidor: ['',[Validators.required]],
    base: ['',[Validators.required]],
    usuario: ['',[Validators.required]],
    contrasena: ['',[Validators.required]]
  })

  formularioRespaldo: FormGroup = this.fb.group({
    // Arreglo de formularios
    tamano: ['',[Validators.required]]
  })

  conectado: boolean = false;

  constructor(private backupService: BackupService, private fb: FormBuilder) { }

  probarConexion(){
    this.backupService.getValidarConexion()
      .subscribe(resp => {
        this.formularioRespaldo.controls['tamano'].setValue(resp.result+' MB')
        
        if(resp.ok === true) {
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
        } else {
          Swal.fire({
            title: 'Advertencia',
            text: resp.msg,
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
        }

      })

      
  }

  cargarParametros(){
    this.backupService.getParametros()
      .subscribe(rest => {
        this.formularioConexion.controls['servidor'].setValue(rest.host)
        this.formularioConexion.controls['base'].setValue(rest.database)
        this.formularioConexion.controls['usuario'].setValue(rest.user)
        this.formularioConexion.controls['contrasena'].setValue(rest.password)
        this.formularioRespaldo.get('tamano')?.disable()
        this.formularioConexion.updateValueAndValidity()
      })
  }

  
  ngOnInit(): void {
    this.cargarParametros()
  }

}
