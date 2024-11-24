import { Injectable } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  isArabic: boolean = false;
  public selectedLanguageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("en");

  constructor(private translate: TranslateService) {
    // Set default language
    this.translate.setDefaultLang('en');
  }

  switchLanguage(language: string) {
    this.translate.use(language);
    this.selectedLanguageSubject.next(language);
    // Change layout direction based on language
    if (language === 'ar') {
      this.isArabic = true;
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.classList.add('rtl');
      document.documentElement.classList.remove('ltr');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.classList.add('ltr');
      document.documentElement.classList.remove('rtl');
    }
  }

  get currentLanguage() {
    return this.translate.currentLang;
  }

}
