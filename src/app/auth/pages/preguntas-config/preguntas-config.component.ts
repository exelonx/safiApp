import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PreguntasConfigService } from '../../services/preguntas-config.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ListaDeRespuestas } from '../../interfaces/ListaRespuestas.interface';

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

    lista.forEach(respuesta => {
      // Validar respuestas
      if(respuesta.ID_PREGUNTA === -1 || respuesta.RESPUESTA === '') {
        Swal.fire('Falta información', 'Llene todas las respuestas', 'info')
      }
    });

    if( !this.enEjecucion ) { // Evitar que se ejecute más de una vez

      this.enEjecucion = true
      
      // Inserción de la lista
      this.preguntaConfigService.insertarRespuestas( lista )
        .subscribe( resp => {
          if(resp.ok === true) {
            // Si todo sale correcto, desactivar preguntas, activar cambio de contraseña
            this.hidePreguntas = true;
            this.hideCambioContrasena = false;
            Swal.fire('!Éxito!', resp.msg, 'success')
          } 
          this.enEjecucion = false
        });

    }

  }

  siguiente() {
    const botonSig = document.getElementById('btn-gris') as HTMLButtonElement;
    const botonVolver = document.getElementById('btn-rojo') as HTMLButtonElement;

    // Si los botones ya estan deshabilitados, no hacer nada
    if (botonSig.disabled === true || botonVolver.disabled === true) {
      return
    }

    // Deshabilitar botones
    botonSig.disabled = true;
    botonVolver.disabled = true

    // Despues de 0.75 segundos, habilitar
    setTimeout(() => {
      botonSig.disabled = false;
      botonVolver.disabled = false
    }, 1000);

    // Restar posición
    this.posicionActual++;
  }

  anterior() {
    const botonVolver = document.getElementById('btn-rojo') as HTMLButtonElement;
    const botonSig = document.getElementById('btn-gris') as HTMLButtonElement;

    // Si los botones ya estan deshabilitados, no hacer nada
    if (botonVolver.disabled === true || botonSig.disabled === true) {
      return
    }

    // Deshabilitar botones
    botonVolver.disabled = true;
    botonSig.disabled = true

    // Despues de 0.75 segundos, habilitar
    setTimeout(() => {
      botonVolver.disabled = false;
      botonSig.disabled = false
    }, 1000);

    // Restar posición
    this.posicionActual--;
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.router.navigateByUrl('/auth/login');
  }
}
