import { Component, OnInit } from '@angular/core';
import { ItemSideNavData } from './interfaces/sideNavItem.interface';/* INavbarData */
import { SidenavService } from './services/sidenav.service';/*sidenavbarData === navbarData*/
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})

export class SidenavComponent implements OnInit {

  nombre!: string;

  sidenavData = this.sidenavService.sidenavbarData;
  multiple: boolean = false;

  ngOnInit(): void {
    this.getPrimerNombre()
  }


  constructor(private sidenavService:SidenavService, private authService: AuthService, private router: Router) {

    

  }

  handleClick(item: ItemSideNavData): void{

    if(!this.multiple){

      for (let modelItem of this.sidenavData) {
        
        if (item !== modelItem && modelItem.expanded) {
          
          
          modelItem.expanded  = false;

        }
        
      }

    }

    item.expanded = !item.expanded;

  }

  getPrimerNombre() {
    const nombre: string[] = this.authService.usuario.nombre.split(" ")
    this.nombre = nombre[0];
  }
  
  cerrarSesion() {
    this.authService.cerrarSesion();
    this.router.navigateByUrl('/auth/login');
  }
}

