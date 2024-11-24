import {ActivityRequest} from "../Activity/ActivityRequest";
import {GuideResponse} from "../Guide/GuideResponse";
import {ActivityResponse} from "../Activity/ActivityResponse";

export interface DayTripResponse {
  id?: string;
  title: string;
  destination: string;
  status: string;
  imagesUrl: string[]; // Angular uses File instead of MultipartFile
  dayTripDate: string; // Use ISO string format for dates
  guide: GuideResponse;
  shortDescription: string;
  longDescription: string;
  activities: ActivityResponse[];
}

