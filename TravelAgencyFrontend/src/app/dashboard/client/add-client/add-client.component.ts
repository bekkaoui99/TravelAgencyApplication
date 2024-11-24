import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ClientService} from "../../../services/client.service";
import {ClientRequest} from "../../../types/Client/ClientRequest";
import Swal from "sweetalert2";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css']
})
export class AddClientComponent {
  currentStep: number = 1;
  clientForm: FormGroup;
  selectedFile: File | null = null;
  selectedImageUrl: string | ArrayBuffer | null = null;
  isLoading: boolean = false;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImageUrl = reader.result;
        this.selectedFile = file;
      };
      reader.readAsDataURL(file);
    }
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private clientService: ClientService
  ) {
    this.clientForm = this.fb.group({
      clientInformation: this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        country: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        cin: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmationPassword: ['', [Validators.required, Validators.minLength(8)]],
      }),
      passport: this.fb.group({
        passportNumber: ['', Validators.required],
        issueDate: ['', Validators.required],
        expiryDate: ['', Validators.required],
      }),

    });
  }


  setStep(step: number) {

    if(step == 2 && this.clientForm.get("clientInformation")?.invalid){
      if(this.clientForm.invalid){
        Swal.fire({
          icon: 'error',
          title: 'Validation Error',
          text: 'Please fill in all fields!'
        });
        return
      }
    }

    this.currentStep = step;

  }


  createClient() {
    if(this.clientForm.invalid){
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all fields!'
      });
      return
    }
    if (this.clientForm.valid) {
      this.isLoading = true;
      const clientData: ClientRequest = {
        ...this.clientForm.value.clientInformation,
        passport: this.clientForm.value.passport
      };
      this.clientService.createClient(clientData, this.selectedFile).subscribe({
        next: (createdClient) => {
          this.onCancel();
          this.isLoading = false;
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Client created successfully!'
          });
          this.router.navigateByUrl("/dashboard/client")
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


  onCancel(): void {
    this.clientForm.reset();
  }

  removeImage() {
    this.selectedFile = null;
    this.selectedImageUrl = null;
    const fileInput = document.getElementById('imageFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // This will clear the file input
    }
  }

}
