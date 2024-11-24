import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TravelService} from "../../../services/travel.service";
import {EnumService} from "../../../services/enum.service";
import {Pack} from "../../../types/Pack/Pack";
import {Hotel} from "../../../types/Hotel/Hotel";
import {TravelResponse} from "../../../types/Travel/TravelResponse";
import {HotelService} from "../../../services/hotel.service";
import Swal from "sweetalert2";
import {ReservationService} from "../../../services/reservation.service";
import {Router} from "@angular/router";
import {ClientService} from "../../../services/client.service";
import {ClientResponse} from "../../../types/Client/ClientResponse";
import {CompanionResponse} from "../../../types/Companion/CompanionResponse";
import {CompanionService} from "../../../services/companion.service";

@Component({
  selector: 'app-add-reservation',
  templateUrl: './add-reservation.component.html',
  styleUrls: ['./add-reservation.component.css']
})
export class AddReservationComponent implements OnInit{

  reservationForm: FormGroup;
  travels!: TravelResponse[];
  companions!: CompanionResponse[];
  clients!: ClientResponse[];
  hotels!: Hotel[];
  reservationPaymentType: string[] = [];
  companionType: string[] = [];
  reservationPaymentStatus: string[] = [];
  travelPacks: Pack[] = []; // Packs for the selected travel
  isLoading: boolean = false;
  discount: boolean = false;

  constructor(
    private fb: FormBuilder,
    private enumService: EnumService,
    private router: Router,
    private reservationService: ReservationService,
    private clientService: ClientService,
    private companionService: CompanionService,
    private hotelService: HotelService,
    private travelService: TravelService
  ) {
    this.reservationForm = this.fb.group({
      paymentStatus: ['', Validators.required],
      paymentType: ['', Validators.required],
      travelId: ['', Validators.required],
      hotelId: ['', Validators.required],
      hosting: ['', Validators.required],
      clientId: ['', Validators.required],
      packName: ['', Validators.required],
      discount: [{ value: '', disabled: true }],
      companions: this.fb.array([])
    });
  }

  get companionsFormArray() {
    return this.reservationForm.get('companions') as FormArray;
  }


  addCompanion() {
    const companionGroup = this.fb.group({
      companionId: ['', Validators.required] // Companion ID field
    });
    this.companionsFormArray.push(companionGroup);
  }

  removeCompanion(index: number) {
    this.companionsFormArray.removeAt(index);
  }


  ngOnInit(): void {
    this.fetchReservationPaymentType();
    this.fetchReservationPaymentStatus();
    this.fetchTravels();
    this.fetchHotels();
    this.fetchClients();
    this.fetchCompanionType();

    // Listen for travel selection changes
    this.reservationForm.get('travelId')?.valueChanges.subscribe(travelId => {
      this.updatePacksForSelectedTravel(travelId);
    });

    // Listen for client selection changes
    this.reservationForm.get('clientId')?.valueChanges.subscribe(clientId => {
      this.fetchCompanionsData(clientId);
    });
  }

  fetchCompanionType(): void {
    this.companionType = this.enumService.getCompanionType()
  }

  fetchCompanionsData(clientId: string): void {
    this.companionService.getAll().subscribe({
      next: (data) => {
        this.companions = data.filter(companion => companion.client.id === clientId);
      }
    })
  }


  fetchTravels(): void {
    this.travelService.getAll().subscribe({
      next: (travelResponse) => {
        this.travels = travelResponse;
      }
    });
  }

  fetchClients(): void {
    this.clientService.getAll().subscribe({
      next: (clientResponse) => {
        this.clients = clientResponse;
      }
    });
  }

  fetchHotels(): void {
    this.hotelService.getAll().subscribe({
      next: (hotelResponse) => {
        this.hotels = hotelResponse;
      }
    });
  }

  fetchReservationPaymentType(): void {
    this.reservationPaymentType = this.enumService.getReservationPaymentType();
  }

  fetchReservationPaymentStatus(): void {
    this.reservationPaymentStatus = this.enumService.getReservationPaymentStatus();
  }


  updatePacksForSelectedTravel(travelId: string): void {
    // Find the selected travel by its ID
    const selectedTravel = this.travels.find(travel => travel.id === travelId);

    // If a travel is found, update the travelPacks array with its packs
    if (selectedTravel) {
      this.travelPacks = selectedTravel.packs;
    } else {
      this.travelPacks = []; // Clear the packs if no travel is selected
    }
  }

  createReservation() {
    if(this.reservationForm.invalid){
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all fields!'
      });
      return
    }
    if(this.reservationForm.valid) {
      this.isLoading = true;
      const reservationRequest  = this.reservationForm.value;
      // Map the companions array to extract only companionId
      const companionsId = reservationRequest.companions.map((companion: any) => companion.companionId);

      // Prepare the payload for submission
      const preparedReservationRequest = {
        ...reservationRequest,  // include other form fields
        companionsId   // replace the companions array with the array of companion IDs
      };
      this.reservationService.create(preparedReservationRequest).subscribe({
        next: (reservationResponse) => {
          this.isLoading = false;
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Reservation created successfully!'
          });
          this.onCancel();
          this.router.navigateByUrl("/dashboard/reservation")

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
    this.reservationForm.reset();

  }


  openNewClientModal() {
    this.router.navigate(['/dashboard/companion/add'],
      { queryParams: { returnUrl: '/dashboard/reservation/add' }}
    );
  }

  addDiscount(): void {
    this.discount = true;
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Enable Discount field successfully!'
    });
    this.reservationForm.get('discount')?.enable(); // Enable the field
  }

  removeDiscount(): void {
    this.discount = false;
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Discount field disabled successfully!'
    });
    this.reservationForm.get('discount')?.reset();
    this.reservationForm.get('discount')?.disable(); // Corrected to disable the field
  }

}
