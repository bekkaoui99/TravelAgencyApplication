import {HotelRating} from "./HotelRating";

export interface Hotel{
  id?: string;
  name: string;
  rate: HotelRating;
  city: string;
  country: string;
}


