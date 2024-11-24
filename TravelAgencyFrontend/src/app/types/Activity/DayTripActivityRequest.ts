import {ActivityType} from "./ActivityType";
import {ActivityCostType} from "./ActivityCostType";

export interface DayTripActivityRequest {
  activityId: string;
  startAt: string;
  endAt: string;
}
