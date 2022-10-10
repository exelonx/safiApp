export interface ItemSideNavData{ /* INavbarData */

    routeLink: string;
    icon?: string;
    label: string;
    expanded?: boolean;
    items?: ItemSideNavData[];

}