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
      label: 'Pedidos',
      items: [
        {

          routeLink: 'seguridad/rol',
          label: 'Gestión de estados',
          icon: 'autorenew'

        },
        {

          routeLink: 'seguridad/rol',
          label: 'Gestión de descuentos',
          icon: 'discount'

        },
        {

          routeLink: 'seguridad/rol',
          label: 'Gestión de certificados',
          icon: 'local_activity'

        },
        {

          routeLink: 'pedido/atencion',
          label: 'Vista atención',
          icon: 'table_restaurant'

        },
        {

          routeLink: 'pedido/cocina',
          label: 'Vista cocina',
          icon: 'local_dining'

        },
        {

          routeLink: 'seguridad/rol',
          label: 'Vista clientes',
          icon: 'mood'

        }
      ]
    },
    {
      routeLink: '',
      icon: 'inventory_2',
      label: 'Inventario',
      items: [
        {

          routeLink: 'seguridad/rol',
          label: 'Gestión de insumos',
          icon: 'kitchen'

        },
        {

          routeLink: 'seguridad/rol',
          label: 'Unidades',
          icon: 'scale'

        },
        {

          routeLink: 'seguridad/rol',
          label: 'Proveedores',
          icon: 'storefront'

        }
      ]
    },
    {
      routeLink: '',
      icon: 'fastfood',
      label: 'Catálogo de Ventas',
      items: [
        {

          routeLink: 'seguridad/rol',
          label: 'Gestión de categorías',
          icon: 'menu_book'

        },
        {

          routeLink: 'seguridad/rol',
          label: 'Gestión de productos',
          icon: 'lunch_dining'

        },
        {

          routeLink: 'seguridad/rol',
          label: 'Tipos de impuestos',
          icon: 'tune'

        }
      ]
    },
    {
      routeLink: 'seguridad',
      icon: 'verified_user',
      label: 'Seguridad',
      items: [
        {

          routeLink: 'seguridad/rol',
          label: 'Gestión de roles',
          icon: 'assignment_ind'

        },
        {

          routeLink: 'seguridad/pregunta',
          label: 'Gestión de preguntas',
          icon: 'question_mark'

        },
        {

          routeLink: 'seguridad/permiso',
          label: 'Gestión de permisos',
          icon: 'fact_check'

        },
        {

          routeLink: 'seguridad/parametro',
          label: 'Gestión de parámetros',
          icon: 'settings'

        }

      ]
    },
    {
      routeLink: 'seguridad/rol',
      icon: 'policy',
      label: 'Administración',
      items: [
        
        {

          routeLink: 'administracion/usuario',
          label: 'Gestión de usuarios',
          icon: 'people'

        },
        {

          routeLink: 'administracion/bitacora',
          label: 'Bitácora del sistema',
          icon: 'history'

        }

      ]
    },
  ];

  constructor() { }
}
