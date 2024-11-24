import {CompanionType} from "./CompanionType";
import {Passport} from "../Client/Passport";
import {ClientResponse} from "../Client/ClientResponse";

export interface CompanionResponse{
  id: string;
  companionType: CompanionType;
  firstName: string;
  lastName: string;
  userName: string;
  country: string;
  phone: string;
  cin: string;
  imageUrl: string
  passport: Passport
  client: ClientResponse;
}
