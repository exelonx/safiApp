export interface ItemSideNavData{

    routeLink: string;
    icon?: string;
    label: string;
    expanded?: boolean;
    items?: ItemSideNavData[];

}