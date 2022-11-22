import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nuevo-cai',
  templateUrl: './nuevo-cai.component.html',
  styleUrls: ['./nuevo-cai.component.css']
})
export class NuevoCAIComponent implements OnInit {

  enEjecucion: boolean = false;

  constructor( ) { }

  ngOnInit(): void {
  }

}
