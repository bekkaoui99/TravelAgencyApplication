import { Component } from '@angular/core';
import {ClientResponse} from "../../types/Client/ClientResponse";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ClientService} from "../../services/client.service";
import {Hotel} from "../../types/Hotel/Hotel";
import Swal from "sweetalert2";
import {CompanionResponse} from "../../types/Companion/CompanionResponse";
import {CompanionService} from "../../services/companion.service";
import {EnumService} from "../../services/enum.service";
import {CompanionRequest} from "../../types/Companion/CompanionRequest";

@Component({
  selector: 'app-companion',
  templateUrl: './companion.component.html',
  styleUrls: ['./companion.component.css']
})
export class CompanionComponent {


  selectedImageUrl!: String | undefined  ;
  selectedFile: File | null = null;
  rows: CompanionResponse[] = [];
  selectedRows: CompanionResponse[] = [];
  companions: CompanionResponse[] = [];
  displayType = 'list';
  search = '';
  displayDialog = false;
  companionForm: FormGroup;
  selectedCompanion: CompanionResponse | null = null;
  clients!: ClientResponse[];
  companionType: string[] = [];


  itemsPerPage: number = 8; // Number of items per page
  totalRecords: number = 0; // Total number of items
  currentPage: number = 1; // Current page number



  constructor(
    private companionService: CompanionService,
    private clientService: ClientService,
    private enumService: EnumService,
    private fb: FormBuilder
  ) {
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
      }),
      imageFile: [null]
    });
  }

  cols = [
    { field: 'client.userName', title: 'Client', filter: true },
    { field: 'companionType', title: 'Companion Type', filter: true },
    { field: 'firstName', title: 'FirstName', filter: true },
    { field: 'lastName', title: 'LastName', filter: true },
    { field: 'cin', title: 'CIN', filter: true },
    { field: 'country', title: 'Country', filter: true },
    { field: 'actions', title: 'Action', filter: false }
  ];


  ngOnInit(): void {
    this.fetchCompanionsData();
    this.fetchClientsData();
    this.fetchCompanionType();
  }


  fetchCompanionType(): void {
    this.companionType = this.enumService.getCompanionType()
  }


  fetchCompanionsData(){
    this.companionService.getAll().subscribe({
      next: (data) => {
        this.companions = data;
        this.rows = [...this.companions];
      },
      error: (err) => {
        console.error('Error fetching companions data', err);
      }
    });
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



  onRowSelect(event: any) {
    this.selectedRows = event;
    console.log(this.selectedRows)
  }

  removeCompanion(selectedCompanion: CompanionResponse) {
    if (!selectedCompanion) {
      console.error('Companion data is undefined in removeClient method.');
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this Companion?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        if (selectedCompanion.id != null) {
          this.companionService.delete(selectedCompanion.id).subscribe({
            next:()=>{
              this.rows = this.rows.filter(client => client.id != selectedCompanion.id );
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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImageUrl = e.target.result;  // Set the selected image to preview
        this.selectedFile = file;
      };
      reader.readAsDataURL(file);
    }
  }

  updateCompanion(companion: CompanionResponse) {

    this.selectedCompanion = companion;
    this.companionForm.patchValue({
      clientId: companion.client.id,
      companionType: companion.companionType,
      firstName: companion.firstName,
      lastName: companion.lastName,
      country: companion.country,
      phone: companion.phone,
      cin: companion.cin,
    });

    this.companionForm.get('passport')?.patchValue({
      passportNumber: companion.passport?.passportNumber || '', // Optional chaining in case it's null
      issueDate: companion.passport?.issueDate || '',
      expiryDate: companion.passport?.expiryDate || ''
    });

    this.selectedImageUrl = companion.imageUrl;
    this.displayDialog = true;

  }

  onSave() {
    if (this.companionForm.valid) {

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

      if (this.selectedCompanion != null) {
        if (this.selectedCompanion.id != null) {
          this.companionService.update(companionRequestAsFormData, this.selectedCompanion.id).subscribe({
            next: (updatedCompanionData) => {
              const index = this.rows.findIndex(companion => companion.id === updatedCompanionData.id);
              if (index !== -1) {
                this.rows[index] = updatedCompanionData;
                this.rows = [...this.rows];
              }
              this.companionForm.reset()
              this.displayDialog = false;
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Item updated successfully!'
              });
            }
          });
        }
      }
    }
  }


  onCancel() {
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


}
