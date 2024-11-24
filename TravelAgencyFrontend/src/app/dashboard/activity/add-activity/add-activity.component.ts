import { Component } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivityService} from "../../../services/activity.service";
import {GuideService} from "../../../services/guide.service";
import {EnumService} from "../../../services/enum.service";
import {GuideResponse} from "../../../types/Guide/GuideResponse";
import Swal from "sweetalert2";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-activity',
  templateUrl: './add-activity.component.html',
  styleUrls: ['./add-activity.component.css']
})
export class AddActivityComponent {

  activityForm: FormGroup;
  activityTypes: string[] = [];
  activityCostTypes: string[] = [];
  guides: GuideResponse[] = [];
  imagePreviews: string[] = []; // Array to hold image preview URLs
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private enumService: EnumService,
    private router:Router,
    private activityService: ActivityService,
    private guideService: GuideService,
  ) {
    this.activityForm = this.fb.group({
      title: ['', Validators.required],
      destination: ['', Validators.required],
      imagesFile: this.fb.array([]),
      shortDescription: ['', Validators.required],
      longDescription: ['', Validators.required],
      activityGuideId: ['', Validators.required],
      activityType: ['', Validators.required],
      activityCostType: ['', Validators.required],
    });

    this.activityForm.get('activityCostType')?.valueChanges.subscribe(value => {
      this.updateAdditionalPriceControl(value);
    });
  }

  updateAdditionalPriceControl(value: string) {
    if (value === 'EXTRA_COST') {
      // Add 'activityAdditionalPrice' control if it doesn't exist
      if (!this.activityForm.get('activityAdditionalPrice')) {
        this.activityForm.addControl('activityAdditionalPrice', this.fb.control('', [Validators.required, Validators.min(0)]));
      }
    } else {
      // Remove 'activityAdditionalPrice' control if it exists
      if (this.activityForm.get('activityAdditionalPrice')) {
        this.activityForm.removeControl('activityAdditionalPrice');
      }
    }
  }

  ngOnInit(): void {
    this.activityTypes = this.enumService.getActivityTypes();
    this.activityCostTypes = this.enumService.getActivityCostTypes();

    // Load guides from your guide service
    this.guideService.getAll().subscribe({
      next: (data) => {
        this.guides = data;
      }
    });
  }

  get imagesFormArray() {
    return this.activityForm.get('imagesFile') as FormArray;
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

  createActivity(): void {
    if(this.activityForm.invalid){
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all fields!'
      });
      return
    }
    if(this.activityForm.valid) {
      this.isLoading = true;
      const formData = new FormData();
      // Append the non-file fields
      Object.keys(this.activityForm.controls).forEach(key => {
        if (key !== 'imagesFile') {
          formData.append(key, this.activityForm.get(key)?.value);
        }
      });

      // Append each image file
      this.imagesFormArray.controls.forEach((control, index) => {
        const file = control.value;
        if (file) {
          formData.append('imagesFile', file);
        }
      });

      this.activityService.create(formData).subscribe({
        next:(createdActivity)=>{
          this.onCancel();
          this.isLoading = false;
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Item created successfully!'
          });
          this.router.navigateByUrl("/dashboard/activity")
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
    this.activityForm.reset()
  }
}
