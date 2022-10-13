import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { ItemSideNavData } from '../../interfaces/sideNavItem.interface'; /* INavbarData */

@Component({
  selector: 'app-sub-nivel-menu',
  templateUrl: './sub-nivel-menu.component.html',
  styleUrls: ['./sub-nivel-menu.component.css'],

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
