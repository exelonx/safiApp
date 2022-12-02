import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { async } from '@angular/core/testing';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { BackupService } from '../../../services/backup.service';
import { AuthService } from '../../../../../../../auth/services/auth.service';

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

  generando: boolean = false;

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
    tamano: ['',[Validators.required]],
    nombre: ['', [Validators.required, Validators.maxLength(20), Validators.pattern('[a-zA-Z0-9]+$')]],
    ubicacion: ['', [Validators.maxLength(20)]]
  })

  conectado: boolean = false;

  constructor(private backupService: BackupService, private fb: FormBuilder, private authService: AuthService) { }

  async nombreInput() {
    this.formularioRespaldo.get('ubicacion')?.setValue(this.formularioRespaldo.get('nombre')?.value)
  }

  probarConexion(){

    const { servidor, base, usuario, contrasena } = this.formularioConexion.value;

    this.backupService.getValidarConexion(servidor, base, usuario, contrasena)
      .subscribe(resp => {
        this.formularioRespaldo.controls['tamano'].setValue(resp.result+' MB')
        this.formularioRespaldo.get('nombre')?.enable()

        if(resp.ok === true) {
          this.conectado = true;
          Swal.fire({
            title: '¡Éxito!',
            text: resp.msg,
            icon: 'success',
            iconColor: 'white',
            background: '#a5dc86',
            color: 'white',
            toast: true,
            position: 'bottom',
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
            position: 'bottom',
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
        this.formularioRespaldo.get('ubicacion')?.disable()
        this.formularioRespaldo.get('nombre')?.disable()
        this.formularioConexion.updateValueAndValidity()
      })
  }

  getBackup() {

    if(!this.generando) {
      this.generando = true
      const idUsuario = this.authService.usuario.id_usuario
      const { nombre, ubicacion } = this.formularioRespaldo.value
      this.backupService.getBackup(idUsuario ,nombre , "")
        .subscribe(
          resp => {        
            
            let blob: Blob = resp.body as Blob;
            let a = document.createElement('a');
            a.download=nombre+'.sql';
            a.href = window.URL.createObjectURL(blob);
            a.click();
            this.generando = false

            }
          
        )
    }
  }
  
  ngOnInit(): void {
    this.cargarParametros()
  }

}
