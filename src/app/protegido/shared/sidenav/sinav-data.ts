import { RouterLink } from "@angular/router";

export const sidenavbarData = [
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
        routeLink: 'seguridad/usuario',
        icon: 'verified_user',
        label: 'Seguridad',
        /* items:[

            routeLink:

        ] */
    },
    {
        routeLink: 'seguridad/rol',
        icon: 'policy',
        label: 'Administración'
    },
];