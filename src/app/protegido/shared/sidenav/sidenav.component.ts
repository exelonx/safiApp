import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { sidenavbarData } from './sinav-data';
import { SidenavService } from './services/sidenav.service';

/* interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
} */


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})

export class SidenavComponent implements OnInit {

  /* collapsed: boolean = false; */
  sidenavData = this.sidenavService.sidenavbarData;

/*   @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = sidenavbarData;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if(this.screenWidth <= 768 ) {
      this.collapsed = false;
      this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
    }
  } */

  ngOnInit(): void {
      /* this.screenWidth = window.innerWidth; */
  }
/* 
  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  } */


  constructor(private sidenavService:SidenavService) {

    

  }

  
}

