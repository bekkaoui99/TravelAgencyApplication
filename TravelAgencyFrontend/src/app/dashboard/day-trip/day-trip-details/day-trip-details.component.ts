import { Component } from '@angular/core';
import {ActivityResponse} from "../../../types/Activity/ActivityResponse";
import {ActivatedRoute} from "@angular/router";
import {ActivityService} from "../../../services/activity.service";
import {DayTripResponse} from "../../../types/DayTrip/DayTripResponse";
import {DayTripService} from "../../../services/day-trip.service";

@Component({
  selector: 'app-day-trip-details',
  templateUrl: './day-trip-details.component.html',
  styleUrls: ['./day-trip-details.component.css']
})
export class DayTripDetailsComponent {
  dayTripId!: string;
  dayTrip!: DayTripResponse;
  selectedImage!: string;
  constructor(
    private route: ActivatedRoute,
    private dayTripService: DayTripService // Inject your service
  ) {}

  ngOnInit(): void {
    // Get the ID from the URL
    this.dayTripId = this.route.snapshot.paramMap.get('id') || '';
    this.getDayTripDetails(this.dayTripId);
    // Initialize `activityExpanded` and `selectedActivityImage` for each activity
    this.dayTrip?.activities.forEach((activity, index) => {
      this.activityExpanded[index] = false;
      this.selectedActivityImage[index] = activity.imagesUrl[0]; // Default to the first image
    });

  }
  activityExpanded: boolean[] = [];
  selectedActivityImage: string[] = [];
  // Toggle the expanded state of an activity
  toggleActivity(index: number): void {
    this.activityExpanded[index] = !this.activityExpanded[index];
  }

  // Handle thumbnail selection for day trip
  onSelectImage(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }

  // Handle thumbnail selection for activity images
  onSelectActivityImage(index: number, imageUrl: string): void {
    this.selectedActivityImage[index] = imageUrl;
  }

  getDayTripDetails(id: string): void {
    this.dayTripService.getDayTripById(id).subscribe((dayTripResponse: DayTripResponse) => {
      this.dayTrip = dayTripResponse;
      console.log(this.dayTrip)
      this.selectedImage = this.dayTrip.imagesUrl[0];
    });
  }


}
