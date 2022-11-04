import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor( public wsService: WebsocketService) { }

  ngOnInit(): void {
    // PROBANDO websockets TODO: BORRAR
    this.wsService.emit('mensaje', 'Dream Team Tests')
    this.wsService.listen('tester').subscribe( msg => {
      console.log( msg );
    } )
  }

}
