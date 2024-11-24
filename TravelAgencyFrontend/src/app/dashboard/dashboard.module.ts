import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import {HeaderComponent} from "./header/header.component";
import {SidebarComponent} from "./sidebar/sidebar.component";
import { TravelComponent } from './travel/travel.component';
import { ActivityComponent } from './activity/activity.component';
import { DayTripComponent } from './day-trip/day-trip.component';
import { HotelComponent } from './hotel/hotel.component';
import { StatisticComponent } from './statistic/statistic.component';
import { CardComponent } from './home/card/card.component';
import { AddHotelComponent } from './hotel/add-hotel/add-hotel.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { AddActivityComponent } from './activity/add-activity/add-activity.component';
import { AddTravelComponent } from './travel/add-travel/add-travel.component';
import { AddDayTripComponent } from './day-trip/add-day-trip/add-day-trip.component';
import { StatisticCardComponent } from './statistic/statistic-card/statistic-card.component';
import { ClientComponent } from './client/client.component';
import { GuideComponent } from './guide/guide.component';
import {TableModule} from "primeng/table";
import {DataTableModule} from "@bhplugin/ng-datatable";
import {NgxPaginationModule} from "ngx-pagination";
import {PaginatorModule} from "primeng/paginator";
import {DialogModule} from "primeng/dialog";
import { AddClientComponent } from './client/add-client/add-client.component';
import { AddGuideComponent } from './guide/add-guide/add-guide.component';
import { ActivityDetailsComponent } from './activity/activity-details/activity-details.component';
import { DayTripDetailsComponent } from './day-trip/day-trip-details/day-trip-details.component';
import { ReservationComponent } from './reservation/reservation.component';
import { AddReservationComponent } from './reservation/add-reservation/add-reservation.component';
import { TravelDetailsComponent } from './travel/travel-details/travel-details.component';
import { CompanionComponent } from './companion/companion.component';
import { AddCompanionComponent } from './companion/add-companion/add-companion.component';
import { LoadingComponent } from './loading/loading.component';
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
    declarations: [
        DashboardComponent,
        HomeComponent,
        HeaderComponent,
        SidebarComponent,
        TravelComponent,
        ActivityComponent,
        DayTripComponent,
        HotelComponent,
        StatisticComponent,
        CardComponent,
        AddHotelComponent,
        AddActivityComponent,
        AddTravelComponent,
        AddDayTripComponent,
        StatisticCardComponent,
        ClientComponent,
        GuideComponent,
        AddClientComponent,
        AddGuideComponent,
        ActivityDetailsComponent,
        DayTripDetailsComponent,
        ReservationComponent,
        AddReservationComponent,
        TravelDetailsComponent,
        CompanionComponent,
        AddCompanionComponent,
        LoadingComponent,
    ],
    exports: [
        HeaderComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DashboardRoutingModule,
        TableModule,
        DataTableModule,
        NgxPaginationModule,
        PaginatorModule,
        DialogModule,
        TranslateModule,
    ]
})
export class DashboardModule { }
