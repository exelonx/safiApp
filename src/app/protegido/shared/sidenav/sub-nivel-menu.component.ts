import { Component, Input, OnInit } from '@angular/core';
import { ItemSideNavData } from './interfaces/sideNavItem.interface';
import { of } from 'rxjs';

@Component({
  selector: 'app-sub-nivel-menu',
  template: `
    <ul *ngIf="data.items && data.items.length >0"
    [@sub] 
    class="subnivel-nav"><!-- collapsed &&  -->
      
      <li *ngFor="let item of data.items"
      class="subnivel-nav-item"
      (click)="handleClick(item)">

        <a class="subnivel-nav-link"
        *ngIf="item.items && item.items.length >0">
      
          <mat-icon class="subnivel-link-icon material-icons-outlined" 
          mat-list-icon id="icon">

            lunch_dining
                    
          </mat-icon>

          <span class="subnivel-link-text" ><!-- *ngIf="collapsed" -->

            {{item.label}}

          </span>

          <mat-icon *ngIf="item.items " 
          class="menu-collapse-icon"
          [ngClass]="!item.expanded ? 'keyboard_arrow_right' : 'keyboard_arrow_down'"><!-- && collapsed -->
          </mat-icon>

        </a>

        <a class="subnivel-nav-link"
        *ngIf="!item.items || (item.items && item.items.length === 0)"
        [routerLink]="[item.routeLink]"
        routerLinkActive="active-subnivel"
        [routerLinkActiveOptions]="{exact: true}">
          
          <mat-icon class="material-icons-outlined" 
          mat-list-icon id="icon">

            lunch_dining
                    
          </mat-icon>

          <span class="subnivel-link-text" ><!-- *ngIf="collapsed" -->

            {{item.label}}
          
          </span>

          <div *ngIf="item.items && item.items.length >0">

            <app-sub-nivel-menu
            
            [multiple]="multiple"
            [expanded]="item.expanded"><!-- [collapsed]="collapsed" -->

            

            </app-sub-nivel-menu>

          </div>

        </a>

      </li>

    </ul>
  `,
  styleUrls: ['./sidenav.component.css'],

  animations: [`
  
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

  `]

})
export class SubNivelMenuComponent implements OnInit {


  @Input() data: ItemSideNavData ={

    routeLink: '',
    icon: '',
    label: '',
    items: []

  }

  /* @Input() collapsed=false; */

  @Input() animated: boolean | undefined;

  @Input() expanded: boolean | undefined;

  @Input() multiple: boolean=false;

  constructor() { }

  ngOnInit(): void {
  }

  handleClick(item:any):void{

    if(!this.multiple){

      if(this.data.items && this.data.items.length >0){

        for(let modelItem of this.data.items) {
          
          if (item !==modelItem &&  modelItem.expanded) {
            
            modelItem.expanded = false;

          }
          
        }

      }

    }

    item.expanded = !item.expanded;

  }

}
