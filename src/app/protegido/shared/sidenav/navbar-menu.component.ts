import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-menu',
  template: `
    <!-- <p>
      navbar-menu works!
    </p> -->

    <nav class="navbar navbar-expand-lg navbar-dark">

      <div class="container-fluid">
  
        <a class="navbar-brand visible" href="#">DR.BUGER</a>

        <button class="navbar-toggler position-relative" type="button" data-bs-toggle="collapse"
        data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
        aria-label="Toggle navigation">
         
          <span class="navbar-toggler-icon"></span>
          
          <span *ngIf="notificaciones.length > 0"
          class="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
           
            <span class="visually-hidden">New alerts</span>

          </span>

        </button>

        <div class="collapse navbar-collapse justify-content-between centerCollapse" id="navbarNav">
    
          <ul class="navbar-nav derechaIzquierda">
    
            <li class="nav-item dropdown">
    
              <a class="nav-link dropdown-toggle align-middle" href="#" role="button"
              data-bs-toggle="dropdown" aria-expanded="false"> <!-- active -->
    
                <img src="../../../../assets/icons/JS.png" height="35" width="35"
                class="rounded-circle img-fluid mr-2 px-1">
                
                {{usuario.nombre | titlecase}}
    
              </a>
    
              <ul class="dropdown-menu">
    
                <li>
    
                  <a class="dropdown-item" routerLink="perfil">Configuración</a>
    
                </li>
    
                <li>
    
                  <hr class="dropdown-divider">
    
                </li>
    
                <li>
                  
                  <a class="dropdown-item" (click)="cerrarSesion()">Cerrar Sesión</a>
                
                </li>
    
              </ul>
    
            </li>
    
          </ul>
    
        </div>
  
        <div class="container-fluid d-flex justify-content-center p-2">
  
          <a class="nav-link mx-2" routerLink="">
  
              <img src="../../../assets/icons/DRBURGERW.svg" height="45" width="50" alt="">
              
          </a>
  
        </div>
  
        <ul class="navbar-nav derechaIzquierda justify-content-end">
  
          <li class="nav-item dropdown"> <!-- Necesito esto -->
  
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
            aria-expanded="false">
  
               <!-- Campana de notificaciones -->
              <mat-icon *ngIf="notificaciones.length>0; else notificacion" 
              [matBadge]="notificaciones.length"
              matBadgeColor="warn">
              
                notifications
            
              </mat-icon>
  
              <!-- En caso de no tener notificaciones nuevas, se ocultara el badge -->
              <ng-template #notificacion>
        
                <mat-icon>notifications</mat-icon>
  
              </ng-template>
  
            </a>
  
            <ul class="dropdown-menu position-absolute dropdown-menu-lg-end  bg-secondary p-0">
            
              <li class="m-0 p-0">
  
                <div class="d-flex align-items-center justify-content-between">
  
                  <div class="d-flex align-items-center">
  
                    <h6 class="fw-bold text-light ms-4 mt-2" style="font-size:small ;">
  
                      Notificaciones
  
                    </h6>
  
                  </div>
  
                  <a class="nav-link " href="">
                                  
                    <img src="../../../assets/icons/check-white.png" 
                    width="15px" class="me-3 mt-0"
                    alt="">
  
                  </a>
  
                </div>
  
                <div class="overflow-auto " style="height: 300px; background-color: rgb(224, 224, 224);">
  
                  <div *ngFor="let notificacion of notificaciones" class="dropdown-item rounded my-2">
  
                    <div class="row">
  
                      <div class="col-1">
  
                        <img src="../../../assets/icons/campana-mesa.png" width="15px" alt="">
  
                      </div>
  
                      <div class="col">
  
                        <div class="d-flex flex-column">
  
                          <h6 class="fw-semibold" style="font-size:x-small ;">
  
                            {{notificacion.mensaje}}
                          
                          </h6>
  
                          <h6 class="fw-semibold" style="font-size:xx-small ;">
  
                            {{notificacion.tiempo}}
  
                          </h6>
  
                          <a routerLink="/notificaciones/lista"
                          class="nav-link text-black text-end fw-bold m-0 p-0"
                          style="font-size:x-small ;">
  
                            Ver notificación completa
  
                          </a>
  
                        </div>
  
                      </div>
  
                    </div>
  
                  </div>
  
                </div>
  
              </li>
  
              <li class="m-0 p-0">
  
                <div class="">
  
                  <a class="nav-link d-flex justify-content-center" routerLink="/notificaciones/lista">
                                
                    <button type="button" class="btn btn-ver-todo" data-bs-toggle="modal"
                    data-bs-target="#exampleModal" style="background-color:#1e120d ; color:white;">
                                  
                      Ver todo
  
                    </button>
  
                  </a>
  
                </div>
                            
              </li>
  
            </ul>
  
          </li>
  
        </ul>

      </div>

    </nav>
  `,
  styleUrls: ['./sidenav.component.css']
})
export class NavbarMenuComponent implements OnInit {

  usuario = {
    nombre: '',
    apellido: '',
    email: '',
    numero: '',
    usuario: '',
    pregunta: [],
    rol: ''
  }

  notificaciones: any[] = [];


  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.usuario.nombre = this.authService.usuario.nombre
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.router.navigateByUrl('/auth/login');
  }

}
