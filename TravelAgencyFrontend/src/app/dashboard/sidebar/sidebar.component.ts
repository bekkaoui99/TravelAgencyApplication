import {Component, Input, OnInit} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NavigationEnd, NavigationStart, Router, RoutesRecognized } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],

})
export class SidebarComponent{
  activeLink!: string ;// Default active link

  constructor(private router: Router) {}

  ngOnInit() {
    this.activeLink = this.getLinkAfterDashboard(this.router.url);
    console.log("Initial activeLink: " + this.activeLink);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentRoute = event.urlAfterRedirects;
        this.activeLink = this.getLinkAfterDashboard(currentRoute);

      }
    });
  }

  getLinkAfterDashboard(url: string): string {
    // Split the URL by '/' and find the index of 'dashboard'
    const segments = url.split('/');
    const dashboardIndex = segments.indexOf('dashboard');

    // If 'dashboard' is found and there is a segment after it
    if (dashboardIndex !== -1 && segments.length > dashboardIndex + 1) {
      console.log("activeLink: " + segments[dashboardIndex + 1]);
      return segments[dashboardIndex + 1]; // Return the segment after 'dashboard'

    }
    return 'dashboard'; // Default if no specific segment found
  }

  setActiveLink(link: string): void {
    this.activeLink = link;
  }
}
