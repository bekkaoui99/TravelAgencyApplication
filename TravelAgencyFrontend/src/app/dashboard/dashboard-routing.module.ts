import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import {HomeComponent} from "./home/home.component";
import {TravelComponent} from "./travel/travel.component";
import {ActivityComponent} from "./activity/activity.component";
import {DayTripComponent} from "./day-trip/day-trip.component";
import {HotelComponent} from "./hotel/hotel.component";
import {AddTravelComponent} from "./travel/add-travel/add-travel.component";
import {AddActivityComponent} from "./activity/add-activity/add-activity.component";
import {AddDayTripComponent} from "./day-trip/add-day-trip/add-day-trip.component";
import {AddHotelComponent} from "./hotel/add-hotel/add-hotel.component";
import {StatisticComponent} from "./statistic/statistic.component";
import {GuideComponent} from "./guide/guide.component";
import {ClientComponent} from "./client/client.component";
import {AddClientComponent} from "./client/add-client/add-client.component";
import {AddGuideComponent} from "./guide/add-guide/add-guide.component";
import {ActivityDetailsComponent} from "./activity/activity-details/activity-details.component";
import {DayTripDetailsComponent} from "./day-trip/day-trip-details/day-trip-details.component";
import {AddReservationComponent} from "./reservation/add-reservation/add-reservation.component";
import {ReservationComponent} from "./reservation/reservation.component";
import {TravelDetailsComponent} from "./travel/travel-details/travel-details.component";
import {CompanionComponent} from "./companion/companion.component";
import {AddCompanionComponent} from "./companion/add-companion/add-companion.component";
import {authenticationGuard} from "../services/guard/authentication.guard";


const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    canActivate:[authenticationGuard],
    children:[
      {
        path:"home",
        component:HomeComponent
      },
      {
        path:"guide",
        component:GuideComponent,
        children:[
        ]
      },
      {
        path:"guide/add",
        component:AddGuideComponent,
      },
      {
        path:"client",
        component:ClientComponent,
        children:[
        ]
      },
      {
        path:"client/add",
        component:AddClientComponent,
      },
      {
        path:"companion",
        component:CompanionComponent,
        children:[
        ]
      },
      {
        path:"companion/add",
        component:AddCompanionComponent,
      },
      {
        path:"reservation",
        component:ReservationComponent,
        children:[
        ]
      },
      {
        path:"reservation/add",
        component:AddReservationComponent,
      },
      {
        path:"travel",
        component:TravelComponent,
        children:[
        ]
      },
      {
        path:"travel/add",
        component:AddTravelComponent
      },
      {
        path: 'travel/details/:id',
        component: TravelDetailsComponent,
      },
      {
        path:"activity",
        component:ActivityComponent,
        children:[

        ]
      },
      {
        path:"activity/add",
        component:AddActivityComponent
      },
      {
        path: 'activity/details/:id', // Add this child route for ActivityDetailsComponent
        component: ActivityDetailsComponent,
      },
      {
        path:"dayTrip",
        component:DayTripComponent,
        children:[
        ]
      },
      {
        path:"dayTrip/add",
        component:AddDayTripComponent
      },
      {
        path: 'dayTrip/details/:id', // Add this child route for ActivityDetailsComponent
        component: DayTripDetailsComponent,
      },
      {
        path:"hotel",
        component:HotelComponent,
      },
      {
        path:"hotel/add",
        component:AddHotelComponent,
      },
      {
        path:"statistic",
        component:StatisticComponent
      }
    ]
  }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
