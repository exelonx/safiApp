import { Component, OnInit } from '@angular/core';
import { ItemSideNavData } from './interfaces/sideNavItem.interface';/* INavbarData */
import { SidenavService } from './services/sidenav.service';/*sidenavbarData === navbarData*/

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})

export class SidenavComponent implements OnInit {


  sidenavData = this.sidenavService.sidenavbarData;
  multiple: boolean = false;

  ngOnInit(): void {
  }


  constructor(private sidenavService:SidenavService) {

    

  }

  handleClick(item: ItemSideNavData): void{

    if(!this.multiple){

      for (let modelItem of this.sidenavData) {
        
        if (item !== modelItem && modelItem.expanded) {
          
          
          modelItem.expanded  = false;

        }
        
      }

    }

    item.expanded = !item.expanded;

  }
  
}

