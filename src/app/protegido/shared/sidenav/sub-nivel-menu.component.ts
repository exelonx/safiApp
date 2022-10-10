import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { ItemSideNavData } from './interfaces/sideNavItem.interface'; /* INavbarData */

@Component({
  selector: 'app-sub-nivel-menu',
  template: `
    <ul *ngIf="data.items && data.items.length > 0"
    class="subnivel-nav"
    [@submenu]="expanded
      ? {value: 'visible', 
          params: {transitionParams:'400ms cubic-bezier(0.86, 0, 0.07, 1)', height: '*'}}
      : {value: 'hidden',
        params: {transitionParams:'400ms cubic-bezier(0.86, 0, 0.07, 1)', height: '0'}}">
  
      <li *ngFor="let item of data.items"
      class="subnivel-nav-item"
      (click)="handleClick(item)">

        <a class="subnivel-nav-link"
        *ngIf="item.items && item.items.length > 0"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasWithBothOptions" 
        aria-controls="offcanvasWithBothOptions">
      
          <mat-icon class="subnivel-link-icon material-icons-outlined" 
          mat-list-icon id="icon">

            restaurant
                    
          </mat-icon>

          <span class="subnivel-link-text" >

            {{item.label}}

          </span>

          <mat-icon class="material-icons-outlined menu-collapse-icon" mat-list-icon id="icon" *ngIf="data.items"
          [ngClass]="!data.expanded ? 'hidden' : ''">
            <!-- si la data no está expandida ocultará este ícono -->
            expand_more
          </mat-icon>
          <mat-icon class="material-icons-outlined menu-collapse-icon" mat-list-icon id="icon" *ngIf="data.items"
          [ngClass]="!data.expanded ? '' : 'hidden'">
            <!-- si la data no está expandida mostrará este otro ícono-->
            chevron_right
          </mat-icon>

        </a>

        <a class="subnivel-nav-link"
        *ngIf="!item.items || (item.items && item.items.length === 0)"
        [routerLink]="[item.routeLink]"
        routerLinkActive="active-subnivel"
        [routerLinkActiveOptions]="{exact: true}"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasWithBothOptions" 
        aria-controls="offcanvasWithBothOptions">
          
          <mat-icon class="subnivel-link-icon material-icons-outlined" 
          mat-list-icon id="icon">

            restaurant
                    
          </mat-icon>

          <span class="subnivel-link-text" >

            {{item.label}}
          
          </span>

        </a>

        <div *ngIf="item.items && item.items.length > 0">

          <app-sub-nivel-menu
          [multiple]="multiple"
          [expanded]="item.expanded">

          </app-sub-nivel-menu>

        </div>

      </li>

    </ul>
  `,
  styleUrls: ['./sidenav.component.css'],

  animations: [
  
    trigger('submenu',[

      state('hidden', style({

        height: '0',
        overflow: 'hidden'

      })),
      state('visible', style({

        height: '*'

      })),
      transition('visible <=> hidden',
        [style({

         overflow: 'hidden'

        }),
          animate('{{transitionParams}}')
        ]
      ),
      transition('void => *', animate(0))

    ])

  ]

})
export class SubNivelMenuComponent implements OnInit {


  @Input() data: ItemSideNavData ={

    routeLink: '',
    icon: '',
    label: '',
    items: []

  }

  /* @Input() collapsed=false; */

  @Input() animating: boolean | undefined;

  @Input() expanded: boolean | undefined;

  @Input() multiple: boolean=false;

  constructor() { }

  ngOnInit(): void {
  }

  handleClick(item:any):void{

    if(!this.multiple){

      if(this.data.items && this.data.items.length >0){

        for(let modelItem of this.data.items) {
          
          if (item !== modelItem && modelItem.expanded) {
            
            modelItem.expanded = false;

          }
          
        }

      }

    }

    item.expanded = !item.expanded;

  }

}
