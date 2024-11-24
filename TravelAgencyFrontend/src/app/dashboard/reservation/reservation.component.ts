import { Component } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import {ReservationResponse} from "../../types/Reservation/ReservationResponse";
import {ReservationService} from "../../services/reservation.service";
import {EnumService} from "../../services/enum.service";
import {ClientService} from "../../services/client.service";
import {HotelService} from "../../services/hotel.service";
import {TravelService} from "../../services/travel.service";
import {TravelResponse} from "../../types/Travel/TravelResponse";
import {ClientResponse} from "../../types/Client/ClientResponse";
import {Hotel} from "../../types/Hotel/Hotel";
import {Pack} from "../../types/Pack/Pack";
import {CompanionService} from "../../services/companion.service";
import {CompanionResponse} from "../../types/Companion/CompanionResponse";
import {Router} from "@angular/router";

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent {

  companions!: CompanionResponse[];
  companionType: string[] = [];
  reservationPaymentType: string[] = [];
  reservationPaymentStatus: string[] = [];
  travels!: TravelResponse[];
  clients!: ClientResponse[];
  hotels!: Hotel[];
  travelPacks: Pack[] = []; // Packs for the selected travel
  rows: ReservationResponse[] = [];
  selectedRows: ReservationResponse[] = [];
  reservations: ReservationResponse[] = [];
  search = '';
  displayDialog = false;
  updateReservationForm: FormGroup;
  selectedReservation!: ReservationResponse | null;

  itemsPerPage: number = 8; // Number of items per page
  totalRecords: number = 0; // Total number of items
  currentPage: number = 1; // Current page number
  clone: boolean = false;
  discount: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private reservationService: ReservationService,
    private enumService: EnumService,
    private clientService: ClientService,
    private companionService: CompanionService,
    private hotelService: HotelService,
    private travelService: TravelService
  ) {
    this.updateReservationForm = this.fb.group({
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

  cols = [
    { field: 'paymentStatus', title: 'Payment Status', filter: true },
    { field: 'paymentType', title: 'Payment Type', filter: true },
    { field: 'travel.title', title: 'Travel', filter: true },
    { field: 'client.lastName', title: 'Client', filter: true },
    { field: 'travelPrice', title: 'Travel Price', filter: true },
    { field: 'hotel.name', title: 'Hotel', filter: true },
    { field: 'actions', title: 'Action', filter: false }
  ];

  ngOnInit(): void {
    this.fetchReservationPaymentType();
    this.fetchReservationPaymentStatus();
    this.fetchTravels();
    this.fetchHotels();
    this.fetchClients();
    this.fetchReservations();
    this.fetchCompanionType();

    // Listen for travel selection changes
    this.updateReservationForm.get('travelId')?.valueChanges.subscribe(travelId => {
      this.updatePacksForSelectedTravel(travelId);
    });

    // Listen for client selection changes
    this.updateReservationForm.get('clientId')?.valueChanges.subscribe(clientId => {
      this.fetchCompanionsData(clientId);
    });

  }

  get companionsFormArray() {
    return this.updateReservationForm.get('companions') as FormArray;
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

  openNewClientModal() {
    this.router.navigate(['/dashboard/companion/add'],
      { queryParams: { returnUrl: '/dashboard/reservation/add' }}
    );
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


  fetchReservations(): void {
    this.reservationService.getAll().subscribe({
      next: (reservationResponse) => {
        this.reservations = reservationResponse.map(item => ({
          ...item,
          travelPrice: parseFloat(item.travelPrice.toFixed(3)), // Ensure two decimal places
        }));
        this.rows = [...this.reservations]; // Now rows will contain the updated prices
      },
      error: (err) => {
        console.error('Error fetching reservations:', err);
      }
    });
  }


  fetchReservationPaymentType(): void{
    this.reservationPaymentType = this.enumService.getReservationPaymentType()
  }

  fetchReservationPaymentStatus(): void{
    this.reservationPaymentStatus = this.enumService.getReservationPaymentStatus()
  }


  onRowSelect(event: any) {
    this.selectedRows = event;
    console.log(this.selectedRows)
  }

  updateReservation(reservation: ReservationResponse) {
    this.updateReservationForm.reset();
    this.selectedReservation = reservation;
    this.updateReservationForm.patchValue({
      paymentStatus: reservation.paymentStatus,
      paymentType: reservation.paymentType,
      travelId: reservation.travel.id,
      hotelId: reservation.hotel.id,
      hosting: reservation.hosting,
      clientId: reservation.client.id,
      packName: reservation.pack.name
    });
    reservation.companions.forEach(companion => {
      const companionGroup = this.fb.group({
        companionId: [companion.id, Validators.required] // Companion ID field
      });
      this.companionsFormArray.push(companionGroup);
    })

    if (reservation.discount != null && reservation.discount > 0) {
      this.discount = true;
      // Enable the 'discount' field
      this.updateReservationForm.get('discount')?.enable();

      // Set the value of the discount in the form
      this.updateReservationForm.get('discount')?.setValue(reservation.discount);
    } else {
      this.discount = false;
      // If no discount, disable the field and reset its value
      this.updateReservationForm.get('discount')?.reset();
      this.updateReservationForm.get('discount')?.disable();
    }

    this.displayDialog = true;
  }


  removeReservation(selectedReservation: ReservationResponse) {
    if (!selectedReservation) {
      console.error('selected Reservation data is undefined in removeReservation method.');
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this Reservation ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        if (selectedReservation.id != null) {
          this.reservationService.delete(selectedReservation.id).subscribe({
            next:()=>{
              this.rows = this.rows.filter(reservation => reservation.id != selectedReservation.id );
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Reservation deleted successfully!'
              });
            }
          })
        }

      }
    });
  }


  onSave() {
    const reservationRequest  = this.updateReservationForm.value;
    // Map the companions array to extract only companionId
    const companionsId = reservationRequest.companions.map((companion: any) => companion.companionId);

    // Prepare the payload for submission
    const preparedReservationRequest = {
      ...reservationRequest,  // include other form fields
      companionsId   // replace the companions array with the array of companion IDs
    };

    if (this.updateReservationForm.valid) {
      if (this.selectedReservation != null) {
        if (this.selectedReservation.id != null) {
          this.reservationService.update(preparedReservationRequest , this.selectedReservation.id).subscribe({
            next: (updatedReservation) => {
              this.updateReservationForm.reset()
              const updatedReservationIndex = this.rows.findIndex(reservation => reservation.id == updatedReservation.id);
              if(updatedReservationIndex != -1){
                this.rows[updatedReservationIndex] = updatedReservation;
                this.rows = [...this.rows];
              }
              this.displayDialog = false;
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Item updated successfully!'
              });
              this.updateReservationForm.reset();
            }
          });
        }

      }
    }

  }

  onCancel() {
    this.selectedReservation = null;
    this.updateReservationForm.reset();
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
    this.selectedReservation = null;
    this.updateReservationForm.reset();
    this.clone = false;
  }

  addDiscount(): void {
    this.discount = true;
    this.updateReservationForm.get('discount')?.enable(); // Enable the field
  }

  removeDiscount(): void {
    this.discount = false;
    this.updateReservationForm.get('discount')?.reset();
    this.updateReservationForm.get('discount')?.disable(); // Corrected to disable the field
  }


}
