import {TransportType} from "./TransportType";
import {TravelState} from "./TravelState";
import {DayTripResponse} from "../DayTrip/DayTripResponse";
import {Pack} from "../Pack/Pack";
import {TravelDayTripRequest} from "./TravelDayTripRequest";

export interface TravelRequest {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  imagesUrl?: string[];
  transportType: TransportType;
  transportCompany: string;
  travelState: TravelState;
  travelGuideId: string;
  packs: Pack[];
  travelDayTripRequests: TravelDayTripRequest[];
  maxSeat: number;
  basedPrice: number;
  shortDescription: string;
  longDescription: string;
}
