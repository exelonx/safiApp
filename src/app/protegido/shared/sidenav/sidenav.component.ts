import { Component, OnInit } from '@angular/core';
import { sidenavbarData } from './sinav-data';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  collapsed: boolean = false;
  sidenavData = sidenavbarData;

  constructor() {

    

  }

  ngOnInit(): void {
  }

}

