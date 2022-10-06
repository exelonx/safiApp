import { ItemSideNavData } from "./interfaces/sideNavItem.interface";

export const sidenavbarData: ItemSideNavData[] = [
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
        items:[

           { 
            
            routeLink: 'seguridad/usuario',
            label: 'Gestión de Usuario'
        
          },
          { 
            
            routeLink: 'seguridad/rol',
            label: 'Gestión de Roles'
        
          }

        ]
    },
    {
        routeLink: 'seguridad/rol',
        icon: 'policy',
        label: 'Administración'
    },
];