import { Component } from '@angular/core';
import {GuideResponse} from "../../types/Guide/GuideResponse";
import {DayTripResponse} from "../../types/DayTrip/DayTripResponse";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GuideService} from "../../services/guide.service";
import {DayTripService} from "../../services/day-trip.service";
import Swal from "sweetalert2";
import {TravelResponse} from "../../types/Travel/TravelResponse";
import {TravelService} from "../../services/travel.service";
import {EnumService} from "../../services/enum.service";
import {TravelRequest} from "../../types/Travel/TravelRequest";

@Component({
  selector: 'app-travel',
  templateUrl: './travel.component.html',
  styleUrls: ['./travel.component.css']
})
export class TravelComponent {

  travelTransportTypes: string[] = [];
  travelStates: string[] = [];
  guides!: GuideResponse[];
  guide!: GuideResponse;
  dayTripList!: DayTripResponse[];

  selectedImageUrl!: String | undefined  ;
  selectedFile: File | null = null;
  rows: TravelResponse[] = [];
  selectedRows: TravelResponse[] = [];
  travels: TravelResponse[] = [];
  displayType = 'list';
  search = '';
  displayDialog = false;
  updateTravelForm: FormGroup;
  selectedTravel: TravelResponse | null = null;

  itemsPerPage: number = 8; // Number of items per page
  totalRecords: number = 0; // Total number of items
  currentPage: number = 1; // Current page number
  imagePreviews: string[] = [];
  clone: boolean = false;
  uploadFiles: number = 0;




  constructor(
    private fb: FormBuilder,
    private guideService: GuideService,
    private travelService: TravelService,
    private dayTripService: DayTripService,
    private enumService: EnumService
  ) {
    this.updateTravelForm = this.fb.group({
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


  cols = [
    { field: 'title', title: 'Title', filter: true },
    { field: 'destination', title: 'Destination', filter: true },
    { field: 'startDate', title: 'StartDate', filter: true },
    { field: 'endDate', title: 'EndDate', filter: true },
    { field: 'transportType', title: 'Transport Type', filter: true },
    { field: 'travelState', title: 'Travel State', filter: true },
    { field: 'actions', title: 'Action', filter: false }
  ];

  ngOnInit(): void {
    this.fetchGuides();
    this.fetchDayTrips();
    this.fetchTravelTransportTypes();
    this.fetchTravelState();
    this.fetchTravels();
  }

  fetchTravelTransportTypes(): void {
    this.travelTransportTypes = this.enumService.getTravelTransportTypes();
  }

  fetchTravelState(): void {
    this.travelStates = this.enumService.getTravelState();
  }

  fetchTravels(): void {
    this.travelService.getAll().subscribe({
      next:(data)=>{
        this.travels = data;
        this.rows = [...this.travels];
      }
    });
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

  get packsFormArray() {
    return this.updateTravelForm.get('travelDetails.packs') as FormArray;
  }

  get imagesFormArray() {
    return this.updateTravelForm.get('travelDetails.imagesFile') as FormArray;
  }

  get dayTripsFormArray() {
    return this.updateTravelForm.get('travelDayTripsDetails.dayTrips') as FormArray;
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


  onRowSelect(event: any) {
    this.selectedRows = event;
    console.log(this.selectedRows)
  }

  removeTravel(selectedTravel: TravelResponse) {
    if (!selectedTravel) {
      console.error('selectedTravel data is undefined in removeTravel method.');
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this Travel?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        if (selectedTravel.id != null) {
          this.travelService.delete(selectedTravel.id).subscribe({
            next:()=>{
              this.rows = this.rows.filter(travel => travel.id != selectedTravel.id );
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

  addImage(): void {
    this.imagesFormArray.push(this.fb.control(null, Validators.required));
    this.imagePreviews.push(''); // Add an empty string to maintain index consistency
  }

  addDayTrip(): void {
    const dayTripForm = this.fb.group({
      dayTripDate: ['', Validators.required],
      dayTripId: ['', Validators.required],
    });
    this.dayTripsFormArray.push(dayTripForm);
  }

  removeImage(index: number): void {
    this.uploadFiles -= 1;
    this.imagesFormArray.removeAt(index);
    this.imagePreviews.splice(index, 1); // Remove the corresponding preview
    // Update the imagesUrl form array
    const imagesUrlControl = this.updateTravelForm.get('travelDetails.imagesUrl') as FormArray;
    imagesUrlControl.removeAt(index);
  }

  removeDayTrip(index: number): void {
    this.dayTripsFormArray.removeAt(index);
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


  updateTravel(travel: TravelResponse) {
    console.log(travel)
    this.updateTravelForm.reset(); // Reset the form
    this.dayTripsFormArray.clear(); // Clear previous day trips
    this.selectedTravel = travel;

    // Patch main travel details
    this.updateTravelForm.patchValue({
      travelDetails: {
        title: travel.title,
        destination: travel.destination,
        travelState: travel.travelState,
        startDate: travel.startDate,
        endDate: travel.endDate,
        transportType: travel.transportType,
        transportCompany: travel.transportCompany,
        travelGuideId: travel.travelGuide.id, // Assuming travelGuide has an 'id' field
        maxSeat: travel.maxSeat,
        basedPrice: travel.basedPrice,
        shortDescription: travel.shortDescription,
        longDescription: travel.longDescription
      }
    });

    // Load day trips into the form array, sorted by dayTripDate based on the day
    if (travel.dayTrips) {
      const sortedDayTrips = travel.dayTrips.sort((a, b) => {
        const dayA = new Date(a.dayTripDate).getDate(); // Extract day (1-31)
        const dayB = new Date(b.dayTripDate).getDate();
        return dayA - dayB; // Sort ascending by day
      });

      sortedDayTrips.forEach(selectedDayTrip => {
        console.log(selectedDayTrip.dayTripDate);
        const dayTripForm = this.fb.group({
          dayTripDate: [selectedDayTrip.dayTripDate, Validators.required],
          dayTripId: [selectedDayTrip.id, Validators.required],
        });
        this.dayTripsFormArray.push(dayTripForm);
      });
    }


    // Load image previews and prepare the form array for images
    this.imagePreviews = [];
    this.imagesFormArray.clear();

    if(travel.imagesUrl != null){
      travel.imagesUrl.forEach(imageUrl => {
        this.imagePreviews.push(imageUrl);
        this.imagesFormArray.push(this.fb.group({ file: null })); // Placeholder for new files
      });

      // Populate the imagesUrl form array with existing URLs
      const imagesUrlControl = this.updateTravelForm.get('travelDetails.imagesUrl') as FormArray;
      imagesUrlControl.clear(); // Clear any existing controls
      travel.imagesUrl.forEach(url => {
        imagesUrlControl.push(this.fb.control(url));
      });
    }


    // Populate packs if available
    const packsFormArray = this.updateTravelForm.get('travelDetails.packs') as FormArray;
    packsFormArray.clear();
    if (travel.packs && travel.packs.length > 0) {
      travel.packs.forEach(pack => {
        packsFormArray.push(this.fb.group({
          name: [pack.name, Validators.required],
          additionalPrice: [pack.additionalPrice, Validators.required]
        }));
      });
    }

    this.displayDialog = true; // Show the update dialog
  }





  onSave() {
    if (this.updateTravelForm.valid) {

      const travelDetails = this.updateTravelForm.get('travelDetails')?.value;
      const travelDayTrips = this.updateTravelForm.get('travelDayTripsDetails.dayTrips')?.value;
      const imageFiles = this.updateTravelForm.get('travelDetails.imagesFile')?.value as File[];

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
        imagesUrl:travelDetails.imagesUrl,
        packs: travelDetails.packs,
        travelDayTripRequests: travelDayTrips,
        maxSeat: travelDetails.maxSeat,
        basedPrice: travelDetails.basedPrice,
        shortDescription: travelDetails.shortDescription,
        longDescription: travelDetails.longDescription
      };


      if (this.selectedTravel != null) {
        if (this.selectedTravel.id != null && !this.clone) {
          console.log("selected id : " + this.selectedTravel.id)
          this.travelService.update(travelRequest , this.selectedTravel.id).subscribe({
            next: (updatedDayTripData) => {

              if (updatedDayTripData.id != null && this.uploadFiles > 0) {
                this.travelService.uploadTravelImages(updatedDayTripData.id, imageFiles).subscribe({
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

              this.updateTravelForm.reset()
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

          this.travelService.cloneWithTravelObject(travelRequest).subscribe({
            next: (clonedTravelResponse) => {
              if (clonedTravelResponse.id != null && this.uploadFiles > 0) {
                this.travelService.uploadTravelImages(clonedTravelResponse.id, imageFiles).subscribe({
                  next:(clonedTravelResponseWithUploadedImages)=>{
                    this.rows.push(clonedTravelResponseWithUploadedImages)
                    this.rows = [...this.rows];
                  }
                })
              }
              if(this.uploadFiles <= 0){
                this.rows.push(clonedTravelResponse)
                this.rows = [...this.rows];
              }
              this.onCancel();
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Travel has been cloned successfully!'
              });
            }
          })


        }
      }
    }
  }

  onCancel() {
    this.selectedTravel = null;
    this.updateTravelForm.reset();
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
    this.selectedTravel = null;
    this.updateTravelForm.reset();
    this.clone = false;
  }


  cloneTravel(travel: TravelResponse) {
    Swal.fire({
      title: 'Clone Travel',
      text: 'Do you want to create a copy without modifying the information or update the information?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Create Copy',
      cancelButtonText: 'Update Information'
    }).then((result) => {
      if (result.isConfirmed) {
        if (travel.id != null) {
          this.travelService.cloneWithTravelId(travel.id).subscribe({
            next:(travelResponse)=>{
              this.rows.push(travelResponse);
              this.rows = [...this.rows];
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Travel has been copied successfully!'
              });
            }
          })
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // User chose to update the information
        this.updateTravel(travel);
        this.clone = true;
      }
    });
  }


}
