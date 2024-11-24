import {Component, OnInit} from '@angular/core';
import {Statistic} from "../../types/Statistic/Statistic";
import {PrimeIcons} from "primeng/api";
import {ActivityService} from "../../services/activity.service";
import {StatisticService} from "../../services/statistic.service";

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css']
})
export class StatisticComponent implements OnInit{


  activityNumber:number = 0;

  cards = [
    {
      title: "clients",
      icon: PrimeIcons.USERS,
      count: 0
    },
    {
      title: "guides",
      icon: PrimeIcons.USER,
      count: 0
    },
    {
      title: "travels",
      icon: PrimeIcons.GLOBE,
      count: 0
    },
    {
      title: "activities",
      icon: PrimeIcons.CALENDAR,
      count: 0
    },
    {
      title: "hotels",
      icon: PrimeIcons.HOME,
      count: 0
    },
    {
      title: "reservations",
      icon: PrimeIcons.BOOKMARK,
      count: 0
    },
    {
      title: "canceledReservations",
      icon: PrimeIcons.BOOKMARK,
      count: 0
    },
    {
      title: "money",
      icon: PrimeIcons.MONEY_BILL,
      count: 0
    },
    {
      title: "companion",
      icon: PrimeIcons.USER,
      count: 0
    }
  ];

  constructor(
    private statisticsService:StatisticService
  ) {
  }

  ngOnInit(): void {
    this.fetchStatistics()
  }


  fetchStatistics(): void {
    this.statisticsService.getStatistics().subscribe({
      next: (data) => {
        this.cards.find(card => card.title === 'clients')!.count = data.clientNumber;
        this.cards.find(card => card.title === 'guides')!.count = data.guideNumber;
        this.cards.find(card => card.title === 'travels')!.count = data.travelNumber;
        this.cards.find(card => card.title === 'activities')!.count = data.activityNumber;
        this.cards.find(card => card.title === 'hotels')!.count = data.hotelNumber;
        this.cards.find(card => card.title === 'reservations')!.count = data.reservationNumber;
        this.cards.find(card => card.title === 'canceledReservations')!.count = data.canceledReservations;
        this.cards.find(card => card.title === 'companion')!.count = data.companion;
        this.cards.find(card => card.title === 'money')!.count = Number(data.money.toFixed(2));

      },
      error: (err) => {
        console.error('Error fetching statistics:', err);
      }
    });
  }


}
