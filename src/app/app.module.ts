import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgMaterialModule } from './ng-material/ng-material.module';
import { HttpClientModule } from '@angular/common/http';
import LocaleEs from "@angular/common/locales/es-HN";
import { registerLocaleData } from "@angular/common";

registerLocaleData(LocaleEs)

//Config WebSocket Cliente
import { environment } from 'src/environments/environment';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

//Mascara de los input
import { NgxMaskModule } from 'ngx-mask'
import localeEs from '@angular/common/locales/es';

const config: SocketIoConfig = { url: environment.socketURL, options: {} };

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgMaterialModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    NgxMaskModule.forRoot()
  ],
  providers: [{provide:LOCALE_ID, useValue: 'es-HN'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
