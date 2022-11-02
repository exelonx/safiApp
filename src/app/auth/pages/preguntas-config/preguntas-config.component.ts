import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PreguntasConfigService } from '../../services/preguntas-config.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ListaDeRespuestas } from '../../interfaces/ListaRespuestas.interface';
import { MatButton } from '@angular/material/button';

const transicionSalida = transition(':leave', [
  style({
    opacity: 1
  }),
  animate('0.5s ease-out', style({ opacity: 0 }))
])
const fadeOut = trigger('fadeOut', [transicionSalida]);

@Component({
  selector: 'app-preguntas-config',
  templateUrl: './preguntas-config.component.html',
  styleUrls: ['./preguntas-config.component.css'],
  animations: []
})
export class PreguntasConfigComponent implements OnInit {

  // Instancia de los botones
  @ViewChild('btngris') btngris!: MatButton;
  @ViewChild('btnrojo') btnrojo!: MatButton;
  eventoClick: boolean = false;

  hideCambioContrasena: boolean = true;
  hidePreguntas: boolean = false;

  // Propiedad para evitar doble ejecuciones al cliclear más de una vez
  enEjecucion: boolean = false;

  constructor(private authService: AuthService, private preguntaConfigService: PreguntasConfigService, private router: Router) { }

  // Preguntas por cargar
  faltantes!: number[];
  limite!: number;
  posicionActual: number = 1;
  nombreUser: string = "";

  ngOnInit(): void {
    this.calcularFaltantes();
    this.preguntaConfigService.cargarPreguntas().subscribe();
  }

  calcularFaltantes() {
    // Traer el id del usuario
    this.nombreUser = this.authService.usuario.nombre;
    const idUsuario: number = this.authService.usuario.id_usuario;
    this.preguntaConfigService.calcularPreguntasFaltantes(idUsuario)
      .subscribe(resp => {
        if(resp < 1) {
          this.hidePreguntas = true;
          this.hideCambioContrasena = false;
          return
        }
        this.faltantes = Array(resp).fill(0).map((x, i) => i);  // Crear arreglo para generar los componentes acorde al número de preguntas requeridas

        // Inicializar objeto con la cantidad de preguntas con el ID del usuario
        for (let i = 0; i < resp; i++) {
          this.preguntaConfigService.listaRespuestas.push({
            ID_USUARIO: idUsuario,
            ID_PREGUNTA: -1,
            RESPUESTA: ''
          })
        }

        this.limite = resp  // Asigna el número máximo de preguntas
      });
  }

  insertarRespuestas(){
    // cargar la lista de respuestas
    const lista: ListaDeRespuestas[] = this.preguntaConfigService.listaRespuestas
    let vacio: boolean = false;

    lista.forEach(respuesta => {
      // Validar respuestas
      if(respuesta.ID_PREGUNTA === -1 || respuesta.RESPUESTA === '') {
        this.enEjecucion = false
        Swal.fire({
          title: 'Falta información',
          text: 'Llene todas las respuestas',
          icon: 'info',
          iconColor: 'white',
          background: '#3fc3ee',
          color: 'white',
          toast: true,
          position: 'top-right',
          showConfirmButton: false,
          timer: 4500,
          timerProgressBar: true,
        })
        vacio = true;
      }
    });

    if (vacio) return

    if( !this.enEjecucion ) { // Evitar que se ejecute más de una vez

      this.enEjecucion = true
      
      // Inserción de la lista
      this.preguntaConfigService.insertarRespuestas( lista )
        .subscribe( resp => {
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

            // Validar si fue autoregistrado o creado en gestión usuario
            if(resp.cod === 'autoregistrado') {
              this.router.navigateByUrl('/auth/login');
            }

            // Creado en gestión
            if(resp.cod === 'creado') {
              // Si todo sale correcto, desactivar preguntas, activar cambio de contraseña
              this.hidePreguntas = true;
              this.hideCambioContrasena = false;
              this.enEjecucion = false
            }

          } else {
            // Si todo sale correcto, desactivar preguntas, activar cambio de contraseña
            Swal.fire({
              title: 'Atención',
              text: resp,
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
           /*  Swal.fire('!Éxito!', resp, 'warning') */
            this.enEjecucion = false
          }
        });

    }

  }

  siguiente() {
    const botonSig = document.getElementById('btn-gris') as HTMLButtonElement;
    const botonVolver = document.getElementById('btn-rojo') as HTMLButtonElement;

    // Si los botones ya estan deshabilitados, no hacer nada
    if (this.eventoClick === true) {
      return
    }

    // Deshabilitar botones
    this.eventoClick = true
    botonSig.disabled = true;
    botonVolver.disabled = true;

    // Despues de 0.75 segundos, habilitar
    setTimeout(() => {
      this.eventoClick = false
      botonSig.disabled = false;
      botonVolver.disabled = false;
    }, 750);

    // Restar posición
    this.posicionActual++;
  }

  anterior() {
    const botonVolver = document.getElementById('btn-rojo') as HTMLButtonElement;
    const botonSig = document.getElementById('btn-gris') as HTMLButtonElement;

    // Si los botones ya estan deshabilitados, no hacer nada
    if (this.eventoClick === true) {
      return
    }

    // Deshabilitar botones
    this.eventoClick = true
    botonSig.disabled = true;
    botonVolver.disabled = true;

    // Despues de 0.75 segundos, habilitar
    setTimeout(() => {
      this.eventoClick = false
      botonSig.disabled = false;
      botonVolver.disabled = false;
    }, 750);

    // Restar posición
    this.posicionActual--;
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.router.navigateByUrl('/auth/login');
  }
}
