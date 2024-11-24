import {PaymentStatus} from "./PaymentStatus";
import {PaymentType} from "./PaymentType";
import {CompanionRequest} from "../Companion/CompanionRequest";


export interface ReservationRequest {
  id?: string;
  paymentStatus: PaymentStatus;
  paymentType: PaymentType;
  travelId: string;
  packName: string;
  discount?: number;
  companions?: CompanionRequest[];
  hotelId: string;
  hosting?: string;
  clientId: string;
}


