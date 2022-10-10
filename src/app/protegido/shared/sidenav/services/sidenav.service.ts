import { Injectable } from '@angular/core';
import { ItemSideNavData } from '../interfaces/sideNavItem.interface';

@Injectable({
  providedIn: 'root'
})

export class SidenavService {

  sidenavbarData: ItemSideNavData[] = [/*navbarData*/
    {
      routeLink: 'dashboard',
      icon: 'home',
      label: 'Dashboard'
    },
    {
      routeLink: '',
      icon: 'event_note',
      label: 'Pedidos'
    },
    {
      routeLink: '',
      icon: 'inventory_2',
      label: 'Inventario'
    },
    {
      routeLink: '',
      icon: 'fastfood',
      label: 'Catálogo de Ventas'
    },
    {
      routeLink: 'seguridad',
      icon: 'verified_user',
      label: 'Seguridad',
      items: [

        {

          routeLink: 'seguridad/usuario',
          label: 'Gestión de Usuario' /* TODO: Va para administración */

        },
        {

          routeLink: 'seguridad/rol',
          label: 'Gestión de Roles'

        },
        {

          routeLink: 'seguridad/pregunta',
          label: 'Gestión de Preguntas'

        },
        {

          routeLink: 'seguridad/permiso',
          label: 'Gestión de Permisos'

        },
        {

          routeLink: 'seguridad/parametro',
          label: 'Gestión de Parámetros'

        }

      ]
    },
    {
      routeLink: 'seguridad/rol',
      icon: 'policy',
      label: 'Administración'
    },
  ];

  constructor() { }
}
