import { Component } from '@angular/core';
import {ActivityResponse} from "../../../types/Activity/ActivityResponse";
import {ActivityService} from "../../../services/activity.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-activity-details',
  templateUrl: './activity-details.component.html',
  styleUrls: ['./activity-details.component.css']
})
export class ActivityDetailsComponent {
  activityId!: string; // To store the ID from the URL
  activity?: ActivityResponse; // To store the fetched activity data
  selectedImage!: string;
  constructor(
    private route: ActivatedRoute,
    private activityService: ActivityService // Inject your service
  ) {}

  ngOnInit(): void {
    // Get the ID from the URL
    this.activityId = this.route.snapshot.paramMap.get('id') || '';
    this.getActivityDetails(this.activityId);
  }

  getActivityDetails(id: string): void {
    this.activityService.getActivityById(id).subscribe((activity: ActivityResponse) => {
      this.activity = activity;
      this.selectedImage = this.activity.imagesUrl[0];
    });
  }

  onSelectImage(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }
}
