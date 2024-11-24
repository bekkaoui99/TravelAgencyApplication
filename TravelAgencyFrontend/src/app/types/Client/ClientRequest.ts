import {User} from "../User/User";
import {Passport} from "./Passport";
import {ReservationResponse} from "../Reservation/ReservationResponse";
import {UserResponse} from "../User/UserResponse";

export interface ClientRequest extends User{
  passport:Passport;
}
