import {ActivityRequest} from "../Activity/ActivityRequest";
import {DayTripActivityRequest} from "../Activity/DayTripActivityRequest";

export interface DayTripRequest {
  title: string;
  destination: string;
  status: string;
  imagesFile: File[]; // Angular uses File instead of MultipartFile
  dayTripDate: string; // Use ISO string format for dates
  activityGuideId: string;
  shortDescription: string;
  longDescription: string;
  activities: DayTripActivityRequest[];
}
