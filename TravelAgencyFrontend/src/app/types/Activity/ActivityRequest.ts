import {ActivityType} from "./ActivityType";
import {ActivityCostType} from "./ActivityCostType";

export interface ActivityRequest {
  id?: string;
  title: string;
  destination: string;
  imagesFile: File[];
  shortDescription: string;
  longDescription: string;
  activityGuideId: string;
  activityType: ActivityType;
  activityCostType: ActivityCostType;
  activityAdditionalPrice?: number; // Optional field
}
