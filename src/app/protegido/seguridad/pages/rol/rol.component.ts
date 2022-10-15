import { Component, OnInit } from '@angular/core';
import { RolService } from './services/rol.service';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.css']
})
export class RolComponent implements OnInit {

  rolData = this.rolService.rolData;

  constructor(private rolService:RolService) { }

  ngOnInit(): void {
  }

}
