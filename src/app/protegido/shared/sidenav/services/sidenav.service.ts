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
          label: 'Gestión de Estados',
          icon: 'autorenew'

        },
        {

          routeLink: 'seguridad/rol',
          label: 'Gestión de Descuentos',
          icon: 'discount'

        },
        {

          routeLink: 'seguridad/rol',
          label: 'Gestión de Certificados',
          icon: 'local_activity'

        },
        {

          routeLink: 'pedido/atencion',
          label: 'Vista Atención',
          icon: 'table_restaurant'

        },
        {

          routeLink: 'pedido/cocina',
          label: 'Vista Cocina',
          icon: 'local_dining'

        },
        {

          routeLink: 'seguridad/rol',
          label: 'Vista Clientes',
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
          label: 'Gestión de Insumo',
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
          label: 'Gestión de Categorías',
          icon: 'menu_book'

        },
        {

          routeLink: 'seguridad/rol',
          label: 'Gestión de Productos',
          icon: 'lunch_dining'

        },
        {

          routeLink: 'seguridad/rol',
          label: 'Tipos de Impuestos',
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
          label: 'Gestión de Roles',
          icon: 'assignment_ind'

        },
        {

          routeLink: 'seguridad/pregunta',
          label: 'Gestión de Preguntas',
          icon: 'question_mark'

        },
        {

          routeLink: 'seguridad/permiso',
          label: 'Gestión de Permisos',
          icon: 'fact_check'

        },
        {

          routeLink: 'seguridad/parametro',
          label: 'Gestión de Parámetros',
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
          label: 'Gestión de Usuario',
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
