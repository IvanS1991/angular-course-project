import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './_core/core.module';
import { HeaderModule } from './header/header.module';
import { FooterModule } from './footer/footer.module';

import { ToastModule, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { MyOptions } from './toaster.options';

import { AppComponent } from './app.component';



@NgModule({
  declarations: [
    AppComponent
],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    AppRoutingModule,
    HeaderModule,
    FooterModule,
    ToastModule.forRoot(),
    CoreModule // Contains global services
  ],
  providers: [
    { provide: ToastOptions, useClass: MyOptions }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
