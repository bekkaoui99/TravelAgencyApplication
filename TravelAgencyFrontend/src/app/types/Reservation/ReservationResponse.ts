import {PaymentStatus} from "./PaymentStatus";
import {PaymentType} from "./PaymentType";
import {TravelResponse} from "../Travel/TravelResponse";
import {Pack} from "../Pack/Pack";
import {Hotel} from "../Hotel/Hotel";
import {ClientResponse} from "../Client/ClientResponse";
import {CompanionResponse} from "../Companion/CompanionResponse";

export interface ReservationResponse {
  id?: string;
  paymentStatus: PaymentStatus;
  paymentType: PaymentType;
  travel: TravelResponse;
  pack: Pack;
  discount?: number;
  companions: CompanionResponse[];
  hotel: Hotel;
  hosting?: string;
  client: ClientResponse;
  travelPrice: number;
}
