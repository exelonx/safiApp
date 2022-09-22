import { Component, OnInit } from '@angular/core';
import Swal from "sweetalert2";

@Component({
  selector: 'app-recuperar-por-correo',
  templateUrl: './recuperar-por-correo.component.html',
  styleUrls: ['./recuperar-por-correo.component.css']
})
export class RecuperarPorCorreoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onReset() {
    console.log("send email");
  }
}
