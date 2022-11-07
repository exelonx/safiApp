import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
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

          routeLink: '',
          label: 'Gestión de estados',
          icon: 'autorenew'

        },
        {

          routeLink: '',
          label: 'Gestión de descuentos',
          icon: 'discount'

        },
        {

          routeLink: '',
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

          routeLink: '',
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

          routeLink: '',
          label: 'Gestión de insumos',
          icon: 'kitchen'

        },
        {

          routeLink: '',
          label: 'Unidades',
          icon: 'scale'

        },
        {

          routeLink: '',
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

          routeLink: 'catalogo/gestion-categoria',
          label: 'Gestión de categorías',
          icon: 'menu_book'

        },
        {

          routeLink: 'catalogo/gestion-producto',
          label: 'Gestión de productos',
          icon: 'lunch_dining'

        },
        {

          routeLink: '',
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
      routeLink: '',
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

        },
        {

          routeLink: 'administracion/base-de-datos',
          label: 'Gestión de base de datos',
          icon: 'dataset'

        }

      ]
    },
  ];


  // Dirección de las API's
  private baseURL: string = environment.baseURL;

  constructor( private http: HttpClient ) { }

  eventoLogout( id_usuario: number ) {

    // Url de la apí
    const url: string = `${this.baseURL}/bitacora/logout`

    const body = {
      id_usuario
    }

    // Consumo
    return this.http.post(url, body)
      .pipe(
        catchError( err => of(err.error))
      );

  }
  
}
