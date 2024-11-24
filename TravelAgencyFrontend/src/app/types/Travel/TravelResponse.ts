import {TransportType} from "./TransportType";
import {TravelState} from "./TravelState";
import {DayTripResponse} from "../DayTrip/DayTripResponse";
import {Pack} from "../Pack/Pack";
import {GuideResponse} from "../Guide/GuideResponse";
import {ClientResponse} from "../Client/ClientResponse";
import {CompanionResponse} from "../Companion/CompanionResponse";

export interface TravelResponse {
  id: string;
  title: string;
  destination: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  imagesUrl: string[]; // Array of image URLs
  transportType: TransportType;
  transportCompany: string;
  travelState: TravelState;
  travelGuide: GuideResponse;
  packs: Pack[];
  dayTrips: DayTripResponse[];
  clients: ClientResponse[];
  companions: CompanionResponse[];
  reservedSeat: number;
  maxSeat: number;
  basedPrice: number;
  shortDescription: string;
  longDescription: string;

}
