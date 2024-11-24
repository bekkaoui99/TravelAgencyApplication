import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {LanguageService} from "../../services/language.service";
import {TranslateService} from "@ngx-translate/core";
import {Statistic} from "../../types/Statistic/Statistic";
import {MenuCard} from "../../types/Menu/MenuCard";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  cards: MenuCard[] = [];

  constructor(
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    // Re-load cards when language changes
    this.translate.onLangChange.subscribe(() => {
      this.loadCards();
    });
    this.loadCards();
  }

  navigateTo(navigateUrl: string) {
    this.router.navigateByUrl("/dashboard/" + navigateUrl);
  }

  loadCards() {
    this.translate.get([
      'menu.create_new_travel',
      'menu.create_new_day_trip',
      'menu.create_new_activity',
      'menu.create_new_client',
      'menu.create_new_guide',
      'menu.create_new_hotel',
      'menu.add_companion',
      'menu.add_reservation',
      'menu.statistics'
    ]).subscribe(translations => {
      this.cards = [
        {
          image: "./assets/icons/voyd.png",
          title: translations['menu.create_new_travel'],
          navigate: "travel"
        },
        {
          image: "./assets/icons/jourd.png",
          title: translations['menu.create_new_day_trip'],
          navigate: "dayTrip"
        },
        {
          image: "./assets/icons/actd.png",
          title: translations['menu.create_new_activity'],
          navigate: "activity"
        },
        {
          image: "./assets/icons/userd.png",
          title: translations['menu.create_new_client'],
          navigate: "client"
        },
        {
          image: "./assets/icons/guided.png",
          title: translations['menu.create_new_guide'],
          navigate: "guide"
        },
        {
          image: "./assets/icons/hotd.png",
          title: translations['menu.create_new_hotel'],
          navigate: "hotel"
        },
        {
          image: "./assets/icons/hotd.png",
          title: translations['menu.add_companion'],
          navigate: "companion"
        },
        {
          image: "./assets/icons/hotd.png",
          title: translations['menu.add_reservation'],
          navigate: "reservation"
        },
        {
          image: "./assets/icons/hotd.png",
          title: translations['menu.statistics'],
          navigate: "statistic"
        }
      ];
    });
  }


}
