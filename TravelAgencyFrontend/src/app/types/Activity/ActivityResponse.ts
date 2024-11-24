import {ActivityType} from "./ActivityType";
import {ActivityCostType} from "./ActivityCostType";
import {GuideResponse} from "../Guide/GuideResponse";
import {Validators} from "@angular/forms";

export interface ActivityResponse {
  id?: string;
  title: string;
  destination: string;
  imagesUrl: string[];
  shortDescription: string;
  longDescription: string;
  activityGuide: GuideResponse;
  activityType: ActivityType;
  activityCostType: ActivityCostType;
  activityAdditionalPrice?: number; // Optional field
  startAt:string,
  endAt: string
}
