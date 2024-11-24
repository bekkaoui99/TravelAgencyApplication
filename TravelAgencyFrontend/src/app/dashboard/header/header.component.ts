import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../../services/language.service";
import {Router} from "@angular/router";
import {TokenService} from "../../services/token.service";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  @Input() sidebarVisible = true;
  @Output() toggleSidebar = new EventEmitter<void>();
  isArabic: boolean = false;

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  userName:string | null = "UserName";



  selectedLanguage = 'en'; // Default language
  languageDropdownVisible = false; // Dropdown initially hidden
  adminSectionDropdownVisible = false; // Dropdown initially hidden


  ngOnInit(): void {
    this.userName = this.tokenService.getUserName()
  }

  constructor(
    private languageService: LanguageService,
    private router: Router,
    private tokenService: TokenService,
    private authenticationService: AuthenticationService
  ) {
    this.selectedLanguage = this.languageService.currentLanguage; // Set default on load
  }


  onLanguageChange(language: string): void {
    this.selectedLanguage = language;
    this.languageService.switchLanguage(language);
    this.languageDropdownVisible = false; // Hide dropdown after selection
  }



  toggleLanguageDropdown() {
    this.languageDropdownVisible = !this.languageDropdownVisible;
  }

  toggleAdminSectionDropdown(){
    this.adminSectionDropdownVisible = !this.adminSectionDropdownVisible;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigateByUrl('/');
    this.adminSectionDropdownVisible = false;
  }

  goToLandingPage() {
    // Add your navigation logic here, e.g., using Angular's Router
    this.router.navigateByUrl('/');
    this.adminSectionDropdownVisible = false;
  }


}
