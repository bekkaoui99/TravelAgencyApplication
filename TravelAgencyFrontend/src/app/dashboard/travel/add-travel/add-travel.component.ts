import { Component } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GuideResponse} from "../../../types/Guide/GuideResponse";
import {GuideService} from "../../../services/guide.service";
import {DayTripService} from "../../../services/day-trip.service";
import Swal from "sweetalert2";
import {DayTripResponse} from "../../../types/DayTrip/DayTripResponse";
import {TravelService} from "../../../services/travel.service";
import {EnumService} from "../../../services/enum.service";
import {TravelRequest} from "../../../types/Travel/TravelRequest";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-travel',
  templateUrl: './add-travel.component.html',
  styleUrls: ['./add-travel.component.css']
})
export class AddTravelComponent {

  currentStep: number = 1;
  travelTransportTypes: string[] = [];
  travelStates: string[] = [];
  travelForm: FormGroup;
  guides: GuideResponse[] = [];
  dayTripList: DayTripResponse[] = [];
  imagePreviews: string[] = [];
  isLoading: boolean = false;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private guideService: GuideService,
    private travelService: TravelService,
    private dayTripService: DayTripService,
    private enumService: EnumService
  ) {
    this.travelForm = this.fb.group({
      travelDetails: this.fb.group({
        title: ['', Validators.required],
        destination: ['', Validators.required],
        travelState: ['', Validators.required],
        imagesFile: this.fb.array([]),
        imagesUrl: this.fb.array([]),
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        transportType: ['', Validators.required],
        transportCompany: ['', Validators.required],
        travelGuideId: ['', Validators.required],
        maxSeat: ['', Validators.required],
        basedPrice: ['', Validators.required],
        shortDescription: ['', [Validators.required, Validators.minLength(10)]],
        longDescription: ['', [Validators.required, Validators.minLength(20)]],
        packs: this.fb.array([]), // No initial pack
      }),
      travelDayTripsDetails: this.fb.group({
        dayTrips: this.fb.array([
          this.fb.group({
            dayTripDate: ['', Validators.required],
            dayTripId: ['', Validators.required],
          })
        ])
      })
    });

  }

  ngOnInit(): void {
    this.fetchGuides();
    this.fetchDayTrips();
    this.fetchTravelTransportTypes();
    this.fetchTravelState();
  }

  generateDayTrips(): void {
    const startDate = this.travelForm.get('travelDetails.startDate')?.value;
    const endDate = this.travelForm.get('travelDetails.endDate')?.value;

    if (startDate && endDate) {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();

      // Calculate the number of days between startDate and endDate
      const dayCount = (end - start) / (1000 * 3600 * 24) + 1; // Add 1 to include the start date itself

      // Clear existing day trips
      this.dayTripsFormArray.clear();

      // Add day trips for each day
      for (let i = 0; i < dayCount; i++) {
        const dayTripDate = new Date(startDate);
        dayTripDate.setDate(dayTripDate.getDate() + i); // Move the date forward by 'i' days

        const dayTripForm = this.fb.group({
          dayTripId: ['', Validators.required],
          dayTripDate: [dayTripDate.toISOString().split('T')[0], Validators.required], // Set the date for each day trip
        });
        this.dayTripsFormArray.push(dayTripForm);
      }
    }
  }


  fetchTravelTransportTypes(): void {
    this.travelTransportTypes = this.enumService.getTravelTransportTypes();
  }

  fetchTravelState(): void {
    this.travelStates = this.enumService.getTravelState();
  }


  fetchGuides(): void {
    this.guideService.getAll().subscribe({
      next:(data)=>{
        this.guides = data;
      }
    });
  }

  fetchDayTrips(): void {
    this.dayTripService.getAll().subscribe({
      next:(data)=>{
        this.dayTripList = data;
      }
    });
  }

  setStep(step: number) {
    if(step == 2 && !this.travelForm.get("travelDetails")?.valid){
      this.currentStep = 1
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all Travel Information fields!'
      });
      return
    }
    if(step == 2 && this.travelForm.get("travelDetails")?.valid){
      this.generateDayTrips();
    }
    this.currentStep = step;

  }

  get packsFormArray() {
    return this.travelForm.get('travelDetails.packs') as FormArray;
  }

  get imagesFormArray() {
    return this.travelForm.get('travelDetails.imagesFile') as FormArray;
  }

  get dayTripsFormArray() {
    return this.travelForm.get('travelDayTripsDetails.dayTrips') as FormArray;
  }

  addPack(): void {
    const packForm = this.fb.group({
      name: ['', Validators.required],
      additionalPrice: ['', Validators.required]
    });

    this.packsFormArray.push(packForm);
  }

  removePack(index: number): void {
    this.packsFormArray.removeAt(index);
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

  addDayTrip(): void {
    this.dayTripsFormArray.push(this.fb.group({
      dayTripDate: [''],
      dayTripsId: [''],
    }));
  }

  removeDayTrip(index: number): void {
    this.dayTripsFormArray.removeAt(index);
  }

  createDayTrip(): void {
    if(this.travelForm.invalid){
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all fields!'
      });
      return
    }
    if(this.travelForm.valid) {
      this.isLoading = true;
      const travelDetails = this.travelForm.get('travelDetails')?.value;
      const travelDayTrips = this.travelForm.get('travelDayTripsDetails.dayTrips')?.value;
      const imageFiles = this.travelForm.get('travelDetails.imagesFile')?.value as File[];

      // Build the TravelRequest object
      const travelRequest: TravelRequest = {
        title: travelDetails.title,
        destination: travelDetails.destination,
        startDate: travelDetails.startDate,
        endDate: travelDetails.endDate,
        transportType: travelDetails.transportType,
        transportCompany: travelDetails.transportCompany,
        travelState: travelDetails.travelState,
        travelGuideId: travelDetails.travelGuideId,
        packs: travelDetails.packs,
        travelDayTripRequests: travelDayTrips,
        maxSeat: travelDetails.maxSeat,
        basedPrice: travelDetails.basedPrice,
        shortDescription: travelDetails.shortDescription,
        longDescription: travelDetails.longDescription
      };

      this.travelService.create(travelRequest).subscribe({
        next: (dayTripResponse) => {
          this.isLoading = false;
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Day trip created successfully!'
          });
          if(dayTripResponse.id != null){
            this.travelService.uploadTravelImages(dayTripResponse.id , imageFiles).subscribe({
              next:(data) =>{
              }
            })
          }
          this.router.navigateByUrl("/dashboard/travel")
          this.travelForm.reset();
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
    this.travelForm.reset();
  }

}
