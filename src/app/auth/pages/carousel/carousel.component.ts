import { Component, Input, OnInit } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { Observable, Observer, of } from 'rxjs';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {

  enEjecucion!: Observer<boolean> 

  constructor( public loader: LoaderService ) { }

  ngOnInit(): void {

  }

  consol(){
    console.log(this.loader.enEjecucion)
  }

}
