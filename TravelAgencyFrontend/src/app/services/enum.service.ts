import { Injectable } from '@angular/core';
import {ActivityType} from "../types/Activity/ActivityType";
import {ActivityCostType} from "../types/Activity/ActivityCostType";
import {TransportType} from "../types/Travel/TransportType";
import {TravelState} from "../types/Travel/TravelState";
import {PaymentStatus} from "../types/Reservation/PaymentStatus";
import {PaymentType} from "../types/Reservation/PaymentType";
import {CompanionType} from "../types/Companion/CompanionType";

@Injectable({
  providedIn: 'root'
})
export class EnumService {

  constructor() { }

  getActivityTypes(): string[] {
    return Object.values(ActivityType);
  }

  getActivityCostTypes(): string[] {
    return Object.values(ActivityCostType);
  }

  getTravelTransportTypes(): string[]{
    return Object.values(TransportType);
  }

  getTravelState(): string[]{
    return Object.values(TravelState);
  }

  getReservationPaymentType(): string[]{
    return Object.values(PaymentType);
  }

  getReservationPaymentStatus(): string[]{
    return Object.values(PaymentStatus);
  }

  getCompanionType(): string[]{
    return Object.values(CompanionType);
  }

}
