import {Component, OnInit} from '@angular/core';
import {CompanionService} from "../../../services/companion.service";
import {ClientService} from "../../../services/client.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import Swal from "sweetalert2";
import {ClientRequest} from "../../../types/Client/ClientRequest";
import {ClientResponse} from "../../../types/Client/ClientResponse";
import {CompanionRequest} from "../../../types/Companion/CompanionRequest";
import {EnumService} from "../../../services/enum.service";

@Component({
  selector: 'app-add-companion',
  templateUrl: './add-companion.component.html',
  styleUrls: ['./add-companion.component.css']
})
export class AddCompanionComponent implements OnInit{
  returnUrl: string | null = null;  // Store the return URL if present
  companionForm: FormGroup;
  clients!: ClientResponse[];
  selectedFile: File | null = null;
  selectedImageUrl: string | ArrayBuffer | null = null;
  isLoading: boolean = false;
  companionType: string[] = [];


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private clientService: ClientService,
    private companionService: CompanionService,
    private enumService: EnumService,
  ) {
    // Get the return URL from the query params (if available)
    this.route.queryParams.subscribe(params => {
      if (params['returnUrl']) {
        this.returnUrl = params['returnUrl'];
      }
    });

    this.companionForm = this.fb.group({
      clientId: ['', [Validators.required]],
      companionType: ['', [Validators.required]],
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      country: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      cin: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
      passport: this.fb.group({
        passportNumber: ['', Validators.required],
        issueDate: ['', Validators.required],
        expiryDate: ['', Validators.required],
      })
    });
  }

  ngOnInit(): void {
    this.fetchClientsData();
    this.fetchCompanionType();
  }

  fetchClientsData(){
    this.clientService.getAll().subscribe({
      next: (data) => {
        this.clients = data;
      },
      error: (err) => {
        console.error('Error fetching clients data', err);
      }
    });
  }

  fetchCompanionType(): void {
    this.companionType = this.enumService.getCompanionType()
  }


  onProfileFileSelected(event: Event) {
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


  createCompanion() {
    if(this.companionForm.invalid){
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all fields!'
      });
      return
    }
    if (this.companionForm.valid) {
      this.isLoading = true; // Show loading icon
      const companionRequest: CompanionRequest = {
        ...this.companionForm.value,
        passport: this.companionForm.value.passport
      };

      const companionRequestAsFormData: FormData = new FormData();

      companionRequestAsFormData.append('clientId', companionRequest.clientId);
      companionRequestAsFormData.append('companionType', companionRequest.companionType);
      companionRequestAsFormData.append('firstName', companionRequest.firstName);
      companionRequestAsFormData.append('lastName', companionRequest.lastName);
      companionRequestAsFormData.append('userName', companionRequest.userName || '');
      companionRequestAsFormData.append('country', companionRequest.country);
      companionRequestAsFormData.append('phone', companionRequest.phone);
      companionRequestAsFormData.append('cin', companionRequest.cin);

      // Append passport data if it exists
      if (companionRequest.passport) {
        companionRequestAsFormData.append('passport.passportNumber', companionRequest.passport.passportNumber);
        companionRequestAsFormData.append('passport.issueDate', companionRequest.passport.issueDate);
        companionRequestAsFormData.append('passport.expiryDate', companionRequest.passport.expiryDate);
      }

      // Append the image file if it exists
      if (this.selectedFile) {
        companionRequestAsFormData.append('imageFile', this.selectedFile);
      }
      this.companionService.create(companionRequestAsFormData).subscribe({
        next: (createdClient) => {
          this.onCancel();
          this.isLoading = false; // hide loading icon
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'companion created successfully!'
          });
          if(this.returnUrl != null){
            this.router.navigate([this.returnUrl]);
          }else {
            this.router.navigateByUrl("/dashboard/companion")
          }

        },
        error: (error) => {
          this.isLoading = false; // hide loading icon
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
    this.companionForm.reset();
  }



}
