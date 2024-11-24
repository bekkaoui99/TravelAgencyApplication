import { Component } from '@angular/core';
import {ActivityResponse} from "../../../types/Activity/ActivityResponse";
import {ActivatedRoute} from "@angular/router";
import {ActivityService} from "../../../services/activity.service";
import {TravelResponse} from "../../../types/Travel/TravelResponse";
import {TravelService} from "../../../services/travel.service";
import {DayTripResponse} from "../../../types/DayTrip/DayTripResponse";
import Swal from "sweetalert2";
import {ClientResponse} from "../../../types/Client/ClientResponse";
import {ReservationService} from "../../../services/reservation.service";
import {ReservationResponse} from "../../../types/Reservation/ReservationResponse";
import {HotelRating} from "../../../types/Hotel/HotelRating";

@Component({
  selector: 'app-travel-details',
  templateUrl: './travel-details.component.html',
  styleUrls: ['./travel-details.component.css']
})
export class TravelDetailsComponent {

  travelId!: string;
  travel?: TravelResponse;
  selectedDayTrip: DayTripResponse | null = null;
  selectedDayIndex: number = 0;
  displayClientDetailsDialog: boolean = false;
  clientDetails!: ClientResponse;
  selectedImageUrl: string = "";
  reservationResponse!: ReservationResponse;



  constructor(
    private route: ActivatedRoute,
    private travelService: TravelService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    // Get the ID from the URL
    this.travelId = this.route.snapshot.paramMap.get('id') || '';
    this.getTravelById(this.travelId);
  }


  getTravelById(id: string): void {
    this.travelService.getById(id).subscribe((travelResponse) => {
      this.travel = travelResponse;

      // Sort dayTrips by date
      this.travel.dayTrips = this.travel.dayTrips.sort((a, b) => {
        const dayA = new Date(a.dayTripDate).getDate(); // Extract day (1-31)
        const dayB = new Date(b.dayTripDate).getDate();
        return dayA - dayB; // Sort ascending by day
      });

      // Set the first dayTrip as the default selected once the travel is fetched
      if (this.travel.dayTrips && this.travel.dayTrips.length > 0) {
        this.selectedDayTrip = this.travel.dayTrips[0];
        this.onDayClick(this.selectedDayTrip, 0); // Set the first day trip as selected
      }
    });
  }

  onDayClick(dayTrip: DayTripResponse, index: number) {
    this.selectedDayTrip = dayTrip;
    this.selectedDayIndex = index;
  }

  convertToDate(time: string): Date {
    const currentDate = new Date(); // Get today's date
    const [hours, minutes, seconds] = time.split(':'); // Split the time string into hours, minutes, seconds

    // Set the time to the date object
    currentDate.setHours(+hours, +minutes, +seconds || 0);
    return currentDate;
  }


  cancelReservation(travelId: string, clientId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to cancel this Reservation?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
          this.travelService.canceledReservation(travelId , clientId).subscribe({
            next:(travelResponse)=>{
              this.travel = travelResponse
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'reservation has been canceled successfully!'
              });
            }
          })
      }
    });

  }

  showClientDetails(travel: TravelResponse, client: ClientResponse) {
    this.displayClientDetailsDialog = true;
    this.reservationService.getClientReservation(travel.id , client.id).subscribe({
        next:(reservationResponse)=>{
          this.reservationResponse = reservationResponse;
          console.log( this.reservationResponse.companions)
        }
    })
    this.clientDetails = client;
  }



}
