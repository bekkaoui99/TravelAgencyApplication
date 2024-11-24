import {User} from "../User/User";
import {TravelResponse} from "../Travel/TravelResponse";
import {UserResponse} from "../User/UserResponse";

export interface GuideResponse extends UserResponse{
  guideTravels: TravelResponse[];
}
