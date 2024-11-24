import { Component } from '@angular/core';
import {Hotel} from "../../../types/Hotel/Hotel";
import {HotelRating} from "../../../types/Hotel/HotelRating";
import {HotelService} from "../../../services/hotel.service";
import Swal from "sweetalert2";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-hotel',
  templateUrl: './add-hotel.component.html',
  styleUrls: ['./add-hotel.component.css']
})
export class AddHotelComponent {

  hotelForm!: FormGroup;
  hotelRatings = Object.values(HotelRating);
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private hotelService:HotelService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.hotelForm = this.fb.group({
      name: ['', Validators.required],
      rate: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required]
    });
  }


  create() {
    if (this.hotelForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all fields!'
      });
      return;
    }

    if (this.hotelForm.valid) {
      this.isLoading = true; // Show loading icon

      // Delay for 2 seconds (2000ms) to simulate loading
      setTimeout(() => {
        this.hotelService.create(this.hotelForm.value).subscribe({
          next: (data) => {
            this.isLoading = false; // Hide loading icon
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Item created successfully!'
            });
            this.router.navigateByUrl("/dashboard/hotel");
          },
          error: (error) => {
            this.isLoading = false; // Hide loading icon
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
      }, 2000); // Simulate a 2-second delay
    }
  }



  onCancel() {
    this.hotelForm.reset()
  }
}
