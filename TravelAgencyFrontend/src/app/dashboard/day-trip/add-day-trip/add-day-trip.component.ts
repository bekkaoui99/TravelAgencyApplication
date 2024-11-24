import { Component } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivityService} from "../../../services/activity.service";
import {GuideService} from "../../../services/guide.service";
import {ActivityResponse} from "../../../types/Activity/ActivityResponse";
import {GuideResponse} from "../../../types/Guide/GuideResponse";
import Swal from "sweetalert2";
import {DayTripService} from "../../../services/day-trip.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-add-day-trip',
  templateUrl: './add-day-trip.component.html',
  styleUrls: ['./add-day-trip.component.css']
})
export class AddDayTripComponent {

  dayTripForm: FormGroup;
  guides: GuideResponse[] = [];
  activitiesList: ActivityResponse[] = [];
  imagePreviews: string[] = [];
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private guideService: GuideService,
    private activityService: ActivityService,
    private dayTripService: DayTripService
  ) {
    this.dayTripForm = this.fb.group({
      title: ['', Validators.required],
      destination: ['', Validators.required],
      status: ['', Validators.required],
      imagesFile: this.fb.array([]),
      activityGuideId: ['', Validators.required],
      shortDescription: ['', [Validators.required, Validators.minLength(10)]],
      longDescription: ['', [Validators.required, Validators.minLength(20)]],
      activities: this.fb.array([
        this.fb.group({
          activityId: ['', Validators.required],
          startAt: ['', Validators.required],
          endAt: ['', Validators.required]
        })
      ])
    });

  }

  ngOnInit(): void {
    this.fetchGuides();
    this.fetchActivities();
  }

  fetchGuides(): void {
    this.guideService.getAll().subscribe({
      next:(data)=>{
        this.guides = data;
      }
    });
  }

  fetchActivities(): void {
    this.activityService.getAll().subscribe({
      next:(data)=>{
        this.activitiesList = data;
      }
    });
  }


  get imagesFormArray() {
    return this.dayTripForm.get('imagesFile') as FormArray;
  }

  get activityFormArray() {
    return this.dayTripForm.get('activities') as FormArray;
  }

  addImage(): void {
    this.imagesFormArray.push(this.fb.control(null, Validators.required));
    this.imagePreviews.push(''); // Add an empty string to maintain index consistency
  }

  removeImage(index: number): void {
    this.imagesFormArray.removeAt(index);
    this.imagePreviews.splice(index, 1); // Remove the corresponding preview
  }

  onFileChange(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      this.imagesFormArray.at(index).setValue(file);

      // Generate a preview URL for the image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviews[index] = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  addActivity(): void {
    this.activityFormArray.push(this.fb.group({
      activityId: [''],
      startAt: [''],
      endAt: ['']
    }));
  }

  removeActivity(index: number): void {
    this.activityFormArray.removeAt(index);
  }

  createDayTrip(): void {
    if(this.dayTripForm.invalid){
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all fields!'
      });
      return
    }
    if(this.dayTripForm.valid) {
      this.isLoading = true;
      // without imagesFile
      const { imagesFile, ...dayTripRequest } = this.dayTripForm.value;
      const imageFiles = this.dayTripForm.get('imagesFile')?.value as File[];
      this.dayTripService.createDayTrip(dayTripRequest).subscribe({
        next: (dayTripResponse) => {
          this.isLoading = false;
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Day trip has been created successfully!'
          });
          if(dayTripResponse.id != null){
            this.dayTripService.uploadDayTripImages(dayTripResponse.id , imageFiles).subscribe({
              next:(data) =>{

              }
            })
          }
          this.router.navigateByUrl("/dashboard/dayTrip")
          this.dayTripForm.reset();
        },
        error: (error) => {
          this.isLoading = false;
          let errorMessage = 'Something went wrong. Please try again later.'; // Default message
          // Check if error response has a message
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage
          });
        }
      });
    }

  }

  onCancel() {
    this.dayTripForm.reset();
  }
}
