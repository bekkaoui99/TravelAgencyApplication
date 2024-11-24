import {CompanionType} from "./CompanionType";
import {Passport} from "../Client/Passport";

export interface CompanionRequest{

   companionType: CompanionType;
   firstName: string;
   lastName: string;
   userName: string;
   country: string;
   phone: string;
   cin: string;
   imageFile: File
   passport: Passport
   clientId: string;

}
