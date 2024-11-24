import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AuthenticationComponent } from './authentication.component';
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {ToastModule} from "primeng/toast";
import {MessageModule} from "primeng/message";
import {ReactiveFormsModule} from "@angular/forms";
import {MessageService} from "primeng/api";


@NgModule({
  declarations: [
    AuthenticationComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    ReactiveFormsModule,
    ToastModule,
    MessageModule
  ],
  providers:[
    MessageService
  ]
})
export class AuthenticationModule { }
