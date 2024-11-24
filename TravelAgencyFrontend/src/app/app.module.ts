import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {API_URL_TOKEN} from "./services/app.tokens";
import {environment} from "../environments/environment.development";
import {TableModule} from "primeng/table";
import {InputTextModule} from "primeng/inputtext";
import { DataTableModule } from '@bhplugin/ng-datatable';
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    TableModule,
    InputTextModule,
    DataTableModule,
    SweetAlert2Module.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    { provide: API_URL_TOKEN, useValue: environment.REST_API_URL }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
