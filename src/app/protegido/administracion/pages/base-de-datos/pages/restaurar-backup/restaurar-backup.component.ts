import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BackupService } from '../../services/backup.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-restaurar-backup',
  templateUrl: './restaurar-backup.component.html',
  styleUrls: ['./restaurar-backup.component.css']
})
export class RestaurarBackupComponent implements OnInit {

  nombreRespaldo: string = "";
  archivo: File | undefined;
  restaurando: boolean = false;

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

  ngOnInit(): void {
    this.cargarParametros()
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

  capturarFile(event: any) {

    const extencion: string = event.target.files[0].name.split(".")
    
    // Validar extención
    if( extencion[extencion.length-1] !== "sql" ) {
      Swal.fire({
        title: 'Advertencia',
        text: "Extención inválida",
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
      return
    }

    const respaldo = event.target.files[0]
    this.nombreRespaldo = respaldo.name
    this.archivo = event.target.files[0]
    
  }

  restaurar() {

    if(!this.restaurando) {
      this.restaurando = true;
      this.backupService.postBackup(this.archivo!)
      ?.subscribe((resp) => {
        this.restaurando = false
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

        this.archivo = undefined;
        this.nombreRespaldo = "";
      })
    }
    
  }

}
