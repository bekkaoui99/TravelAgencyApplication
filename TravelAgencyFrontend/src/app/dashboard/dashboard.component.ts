import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import { trigger, state, style, transition, animate } from '@angular/animations';
import {LanguageService} from "../services/language.service";
import {data} from "autoprefixer";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [
    trigger('slideInOut', [
      state('in', style({ width: '20%' })),
      state('out', style({ width: '0', overflow: 'hidden' })),
      transition('in => out', [
        animate('300ms ease-in-out')
      ]),
      transition('out => in', [
        animate('300ms ease-in-out')
      ]),
    ])
  ]
})
export class DashboardComponent implements OnInit{

  sidebarVisible = true;
  selectedLanguage: string = "en";

  ngOnInit(): void {
   this.languageService.selectedLanguageSubject.subscribe({
      next:(data)=>{
      this.selectedLanguage = data;
    }
    });
    console.log("selectedLanguage " + this.selectedLanguage)
  }
  constructor(
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    // Set default language
    this.translate.setDefaultLang('en');
    console.log("selectedLanguage " + this.selectedLanguage)
    this.languageService.selectedLanguageSubject.subscribe({
      next:(data)=>{
        this.selectedLanguage = data;
      }
    });
    // You can change language dynamically like this:
    // this.translate.use('fr');
  }


  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }

}
