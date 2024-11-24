import { Component } from '@angular/core';
import {GuideResponse} from "../../types/Guide/GuideResponse";
import {ActivityResponse} from "../../types/Activity/ActivityResponse";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivityService} from "../../services/activity.service";
import {GuideService} from "../../services/guide.service";
import {EnumService} from "../../services/enum.service";
import {Hotel} from "../../types/Hotel/Hotel";
import Swal from "sweetalert2";
import {DayTripResponse} from "../../types/DayTrip/DayTripResponse";
import {DayTripService} from "../../services/day-trip.service";
import {ActivityRequest} from "../../types/Activity/ActivityRequest";

@Component({
  selector: 'app-day-trip',
  templateUrl: './day-trip.component.html',
  styleUrls: ['./day-trip.component.css']
})
export class DayTripComponent {

  activityTypes!: string[];
  activityCostTypes!: string[];
  guides!: GuideResponse[];
  guide!: GuideResponse;
  selectedImageUrl!: String | undefined  ;
  selectedFile: File | null = null;
  rows: DayTripResponse[] = [];
  selectedRows: DayTripResponse[] = [];
  activities: ActivityResponse[] = [];
  dayTrips: DayTripResponse[] = [];
  displayType = 'list';
  search = '';
  displayDialog = false;
  updateDayTripForm: FormGroup;
  selectedDayTrip: DayTripResponse | null = null;

  itemsPerPage: number = 8; // Number of items per page
  totalRecords: number = 0; // Total number of items
  currentPage: number = 1; // Current page number
  imagePreviews: string[] = [];
  clone: boolean = false;
  uploadFiles: number = 0;

  constructor(
    private fb: FormBuilder,
    private guideService: GuideService,
    private activityService: ActivityService,
    private dayTripService: DayTripService
  ) {
    this.updateDayTripForm = this.fb.group({
      title: ['', Validators.required],
      destination: ['', Validators.required],
      status: ['', Validators.required],
      imagesFile: this.fb.array([]),
      imagesUrl: this.fb.array([]),
      dayTripDate: ['', Validators.required],
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

  cols = [
    { field: 'title', title: 'Title', filter: true },
    { field: 'destination', title: 'Destination', filter: true },
    { field: 'dayTripDate', title: 'Date', filter: true },
    { field: 'status', title: 'Status', filter: true },
    { field: 'guide.lastName', title: 'Guide', filter: true },
    { field: 'actions', title: 'Action', filter: false }
  ];

  ngOnInit(): void {

    this.fetchDayTrips();
    this.fetchActivities();
    this.fetchGuides();

  }

  fetchGuides(): void {
    this.guideService.getAll().subscribe({
      next: (guides) => {
        this.guides = guides;
      }
    });
  }

  fetchDayTrips(): void {
    this.dayTripService.getAll().subscribe({
      next:(data)=>{
        this.dayTrips = data;
        this.rows = [...this.dayTrips];
      }
    });
  }

  fetchActivities(): void {
    this.activityService.getAll().subscribe({
      next:(data)=>{
        this.activities = data;
      }
    });
  }


  onRowSelect(event: any) {
    this.selectedRows = event;
    console.log(this.selectedRows)
  }

  removeDayTrip(selectDayTrip: DayTripResponse) {
    if (!selectDayTrip) {
      console.error('selectDayTrip data is undefined in removeDayTrip method.');
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this DayTrip?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        if (selectDayTrip.id != null) {
          this.dayTripService.delete(selectDayTrip.id).subscribe({
            next:()=>{
              this.rows = this.rows.filter(client => client.id != selectDayTrip.id );
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Item deleted successfully!'
              });
            }
          })
        }

      }
    });
  }

  get activityFormArray(): FormArray {
    return this.updateDayTripForm.get('activities') as FormArray;
  }

  get imagesFormArray() {
    return this.updateDayTripForm.get('imagesFile') as FormArray;
  }

  addImage(): void {
    this.imagesFormArray.push(this.fb.control(null, Validators.required));
    this.imagePreviews.push(''); // Add an empty string to maintain index consistency
  }

  addActivity(): void {
    const activityForm = this.fb.group({
      activityId: ['', Validators.required],
      startAt: ['', Validators.required],
      endAt: ['', Validators.required]
    });
    this.activityFormArray.push(activityForm);
  }

  removeImage(index: number): void {
    this.uploadFiles -= 1;
    this.imagesFormArray.removeAt(index);
    this.imagePreviews.splice(index, 1); // Remove the corresponding preview
    // Update the imagesUrl form array
    const imagesUrlControl = this.updateDayTripForm.get('imagesUrl') as FormArray;
    imagesUrlControl.removeAt(index);
  }

  removeActivity(index: number): void {
    this.activityFormArray.removeAt(index);
  }

  onFileChange(event: any, index: number): void {
    this.uploadFiles += 1;
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


  updateDayTrip(dayTrip: DayTripResponse) {
    this.updateDayTripForm.reset();
    this.activityFormArray.clear();
    this.selectedDayTrip = dayTrip;
    this.updateDayTripForm.patchValue(
      {
        title: dayTrip.title,
        destination: dayTrip.destination,
        status: dayTrip.status,
        dayTripDate: dayTrip.dayTripDate,
        activityGuideId: dayTrip.guide.id,
        shortDescription: dayTrip.shortDescription,
        longDescription: dayTrip.longDescription,
      }
    );

    // Load activities
    if (dayTrip.activities) {
      dayTrip.activities.forEach(activity => {
        const activityForm = this.fb.group({
          activityId: [activity.id, Validators.required],
          startAt: [activity.startAt, Validators.required],
          endAt: [activity.endAt, Validators.required]
        });
        this.activityFormArray.push(activityForm);
      });
    }
    // Clear previous previews and files
    this.imagePreviews = [];
    this.imagesFormArray.clear();

    // Load activity images
    dayTrip.imagesUrl.forEach(imageUrl => {
      this.imagePreviews.push(imageUrl);
      this.imagesFormArray.push(this.fb.group({ file: null }));
    });

    // Populate the imagesUrl form array with existing URLs
    const imagesUrlControl = this.updateDayTripForm.get('imagesUrl') as FormArray;
    imagesUrlControl.clear(); // Clear any existing controls
    dayTrip.imagesUrl.forEach(url => {
      imagesUrlControl.push(this.fb.control(url));
    });

    this.displayDialog = true;
  }




  onSave() {
    if (this.updateDayTripForm.invalid) {
      console.log(this.updateDayTripForm)
      console.log(this.updateDayTripForm.value)
    }
    if (this.updateDayTripForm.valid) {
      const { imagesFile, ...dayTripRequest } = this.updateDayTripForm.value;
      const imageFiles = this.updateDayTripForm.get('imagesFile')?.value as File[];
      if (this.selectedDayTrip != null) {
        if (this.selectedDayTrip.id != null && !this.clone) {
          this.dayTripService.update(dayTripRequest , this.selectedDayTrip.id).subscribe({
            next: (updatedDayTripData) => {

              if (updatedDayTripData.id != null && this.uploadFiles > 0) {
                this.dayTripService.uploadDayTripImages(updatedDayTripData.id, imageFiles).subscribe({
                  next:(DayTripResponseWithUploadedImages)=>{
                    const index = this.rows.findIndex(dayTrip => dayTrip.id === DayTripResponseWithUploadedImages.id);
                    if (index !== -1) {
                      this.rows[index] = DayTripResponseWithUploadedImages;
                      this.rows = [...this.rows];
                    }
                  }
                })
              }

              if(this.uploadFiles <= 0){
                const index = this.rows.findIndex(dayTrip => dayTrip.id === updatedDayTripData.id);
                if (index !== -1) {
                  this.rows[index] = updatedDayTripData;
                  this.rows = [...this.rows];
                }
              }

              this.updateDayTripForm.reset()
              this.displayDialog = false;
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Item updated successfully!'
              });
            }
          });
        }

        if(this.clone){
          this.dayTripService.cloneWithDayTripObject(dayTripRequest).subscribe({
            next: (updatedDayTripData) => {
              if (updatedDayTripData.id != null && this.uploadFiles > 0) {
                this.dayTripService.uploadDayTripImages(updatedDayTripData.id, imageFiles).subscribe({
                    next:(DayTripResponseWithUploadedImages)=>{
                      this.rows.push(DayTripResponseWithUploadedImages)
                      this.rows = [...this.rows];
                    }
                  })
              }
              if(this.uploadFiles <= 0){
                this.rows.push(updatedDayTripData)
                this.rows = [...this.rows];
              }
              this.onCancel();
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'DayTrip has been cloned successfully!'
              });
            }
          })

        }
      }
    }
  }

  onCancel() {
    this.selectedDayTrip = null;
    this.updateDayTripForm.reset();
    this.displayDialog = false;
  }

  formatDate(date: any) {
    if (date) {
      const dt = new Date(date);
      const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
      const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
      return day + '/' + month + '/' + dt.getFullYear();
    }
    return '';
  }


  onDialogHide() {
    this.selectedDayTrip = null;
    this.updateDayTripForm.reset();
    this.clone = false;
  }

  showMoreDetails(dayTripResponse: DayTripResponse) {

  }

  cloneActivity(dayTrip: DayTripResponse) {
    Swal.fire({
      title: 'Clone DayTrip',
      text: 'Do you want to create a copy without modifying the information or update the information?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Create Copy',
      cancelButtonText: 'Update Information'
    }).then((result) => {
      if (result.isConfirmed) {
        if (dayTrip.id != null) {
          this.dayTripService.cloneWithDayTripId(dayTrip.id).subscribe({
            next:(dayTripResponse)=>{
              this.rows.push(dayTripResponse);
              this.rows = [...this.rows];
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'DayTrip has been copied successfully!'
              });
            }
          })
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // User chose to update the information
        this.updateDayTrip(dayTrip);
        this.clone = true;
      }
    });
  }
}
