import { Component } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Hotel} from "../../types/Hotel/Hotel";
import Swal from "sweetalert2";
import {ActivityResponse} from "../../types/Activity/ActivityResponse";
import {ActivityService} from "../../services/activity.service";
import {GuideResponse} from "../../types/Guide/GuideResponse";
import {ActivityCostType} from "../../types/Activity/ActivityCostType";
import {GuideService} from "../../services/guide.service";
import {EnumService} from "../../services/enum.service";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";


@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent {
  activityCols: any[] = [];
  clone: boolean = false
  activityTypes!: string[];
  activityCostTypes!: string[];
  guides!: GuideResponse[];
  guide!: GuideResponse;
  selectedImageUrl!: String | undefined  ;
  selectedFile: File | null = null;
  rows: ActivityResponse[] = [];
  selectedRows: ActivityResponse[] = [];
  activities: ActivityResponse[] = [];
  displayType = 'list';
  search = '';
  displayDialog = false;
  updateActivityForm: FormGroup;
  selectedActivity: ActivityResponse | null = null;

  itemsPerPage: number = 8; // Number of items per page
  totalRecords: number = 0; // Total number of items
  currentPage: number = 1; // Current page number
  imagePreviews: string[] = [];

  constructor(
    private activityService: ActivityService,
    private guideService: GuideService,
    private enumService: EnumService,
    private fb: FormBuilder,
    private translate: TranslateService
  ) {
    this.updateActivityForm = this.fb.group({
      title: ['', Validators.required],
      destination: ['', Validators.required],
      imagesFile: this.fb.array([]),
      imagesUrl: this.fb.array([]),
      shortDescription: ['', Validators.required],
      longDescription: ['', Validators.required],
      activityGuideId: ['', Validators.required],
      activityType: ['', Validators.required],
      activityCostType: ['', Validators.required],
    });
    // Listen for changes to activityCostType
    this.updateActivityForm.get('activityCostType')?.valueChanges.subscribe((costType: ActivityCostType) => {
      this.updateAdditionalPriceControl(costType);
    });
  }

  updateAdditionalPriceControl(value: string) {
    if (value === 'EXTRA_COST') {
      // Add 'activityAdditionalPrice' control if it doesn't exist
      if (!this.updateActivityForm.get('activityAdditionalPrice')) {
        this.updateActivityForm.addControl('activityAdditionalPrice', this.fb.control('', [Validators.required, Validators.min(0)]));
      }
    } else {
      // Remove 'activityAdditionalPrice' control if it exists
      if (this.updateActivityForm.get('activityAdditionalPrice')) {
        this.updateActivityForm.removeControl('activityAdditionalPrice');
      }
    }
  }



  ngOnInit(): void {
    this.fetchActivityData();
    this.setActivityColumns();

    // Update columns when the language changes
    this.translate.onLangChange.subscribe(() => {
      this.updateActivityColumnTitles();
    });
  }

  fetchActivityData():void{
    this.activityService.getAll().subscribe({
      next: (data) => {
        this.activities = data;
        this.rows = [...this.activities];
      },
      error: (err) => {
        console.error('Error fetching hotels', err);
      }
    });
  }

  setActivityColumns() {
    this.translate.get([
      'activityComponent.table.columns.title',
      'activityComponent.table.columns.destination',
      'activityComponent.table.columns.activityType',
      'activityComponent.table.columns.activityCostType',
      'activityComponent.table.columns.guide',
      'activityComponent.table.columns.actions'
    ]).subscribe(translations => {
      this.activityCols = [
        { field: 'title', title: translations['activityComponent.table.columns.title'], filter: true },
        { field: 'destination', title: translations['activityComponent.table.columns.destination'], filter: true },
        { field: 'activityType', title: translations['activityComponent.table.columns.activityType'], filter: true },
        { field: 'activityCostType', title: translations['activityComponent.table.columns.activityCostType'], filter: true },
        { field: 'activityGuide.lastName', title: translations['activityComponent.table.columns.guide'], filter: true },
        { field: 'actions', title: translations['activityComponent.table.columns.actions'], filter: false }
      ];
    });
  }

  updateActivityColumnTitles() {
    this.activityCols.forEach(col => {
      if (col.field === 'activityGuide.lastName') {
        col.title = this.translate.instant('activityComponent.table.columns.guide'); // Specifically handle guide
      } else {
        col.title = this.translate.instant(`activityComponent.table.columns.${col.field}`);
      }
    });
  }


  onRowSelect(event: any) {
    this.selectedRows = event;
  }

  removeActivity(selectedActivity: ActivityResponse) {
    if (!selectedActivity) {
      console.error('Hotel data is undefined in removeActivity method.');
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this Activity?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        if (selectedActivity.id != null) {
          this.activityService.delete(selectedActivity.id).subscribe({
            next:()=>{
              this.rows = this.rows.filter(client => client.id != selectedActivity.id );
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

  loadActivityTypes() {
    this.activityTypes = this.enumService.getActivityTypes();
  }
  loadActivityCostTypes() {
    this.activityCostTypes = this.enumService.getActivityCostTypes();
  }

  get imagesFormArray() {
    return this.updateActivityForm.get('imagesFile') as FormArray;
  }

  addImage(): void {
    this.imagesFormArray.push(this.fb.control(null, Validators.required));
    this.imagePreviews.push(''); // Add an empty string to maintain index consistency
  }

  removeImage(index: number): void {
    this.imagesFormArray.removeAt(index);
    this.imagePreviews.splice(index, 1); // Remove the corresponding preview
    // Update the imagesUrl form array
    const imagesUrlControl = this.updateActivityForm.get('imagesUrl') as FormArray;
    imagesUrlControl.removeAt(index);
  }

  onFileChange(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      // Set the file directly in the form array
      this.imagesFormArray.at(index).setValue(file);

      // Generate a preview URL for the image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviews[index] = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }



  updateActivity(activity: ActivityResponse) {
    this.updateActivityForm.reset();
    this.selectedActivity = activity;
    this.loadActivityCostTypes();
    this.loadActivityTypes();
    this.guideService.getAll().subscribe({
      next: (guides) => {
        this.guides = guides;
      }
    });

    this.updateActivityForm.patchValue({
      title: activity.title,
      destination: activity.destination,
      activityType: activity.activityType,
      activityCostType: activity.activityCostType,
      activityGuideId: activity.activityGuide.id,
      shortDescription: activity.shortDescription,
      longDescription: activity.longDescription
    });

    // Clear previous previews and files
    this.imagePreviews = [];
    this.imagesFormArray.clear();

    // Load activity images
    activity.imagesUrl.forEach(imageUrl => {
      this.imagePreviews.push(imageUrl);
      this.imagesFormArray.push(this.fb.group({ file: null }));
    });

    // Populate the imagesUrl form array with existing URLs
    const imagesUrlControl = this.updateActivityForm.get('imagesUrl') as FormArray;
    imagesUrlControl.clear(); // Clear any existing controls
    activity.imagesUrl.forEach(url => {
      imagesUrlControl.push(this.fb.control(url));
    });

    this.displayDialog = true;
  }




  onSave() {
    const updatedActivityData = new FormData();
    if (this.updateActivityForm.valid) {

      Object.keys(this.updateActivityForm.controls).forEach(key => {
        if (key !== 'imagesFile') {
          updatedActivityData.append(key, this.updateActivityForm.get(key)?.value);
        }
      });

      // Append new image files
      this.imagesFormArray.controls.forEach((control, index) => {
        const file = control.value as File;
        if (file instanceof File && file.size > 0) {
          updatedActivityData.append('imagesFile', file);
        }
      });

      if (this.selectedActivity != null) {
        if (this.selectedActivity.id != null && !this.clone) {
          this.activityService.update(updatedActivityData , this.selectedActivity.id).subscribe({
            next: (updatedActivityData) => {
              const index = this.rows.findIndex(activity => activity.id === updatedActivityData.id);
              if (index !== -1) {
                this.rows[index] = updatedActivityData;
                this.rows = [...this.rows];
              }
              this.onCancel()
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Item updated successfully!'
              });
            }
          });
        }
        if(this.clone){
          this.activityService.cloneWithActivityObject(updatedActivityData).subscribe({
            next: (updatedActivityData) => {
              this.rows.push(updatedActivityData)
              this.rows = [...this.rows];
              this.onCancel()
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Activity has been cloned successfully!'
              });
            }
          })

        }
      }


    }
  }

  cloneActivity(activity: ActivityResponse) {
    Swal.fire({
      title: 'Clone Activity',
      text: 'Do you want to create a copy without modifying the information or update the information?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Create Copy',
      cancelButtonText: 'Update Information'
    }).then((result) => {
      if (result.isConfirmed) {
        if (activity.id != null) {
          this.activityService.cloneWithActivityId(activity.id).subscribe({
            next:(activityResponse)=>{
              this.rows.push(activityResponse);
              this.rows = [...this.rows];
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Activity has been copied successfully!'
              });
            }
          })
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // User chose to update the information
        this.updateActivity(activity);
        this.clone = true;

      }
    });
  }

  onCancel() {
    this.selectedActivity = null;
    this.updateActivityForm.reset();
    this.displayDialog = false;
    this.clone = false
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
    this.selectedActivity = null;
    this.updateActivityForm.reset();
    this.clone = false;
  }

}
