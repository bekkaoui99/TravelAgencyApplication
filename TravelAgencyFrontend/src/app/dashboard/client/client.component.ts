import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Hotel} from "../../types/Hotel/Hotel";
import Swal from "sweetalert2";
import {ClientResponse} from "../../types/Client/ClientResponse";
import {ClientService} from "../../services/client.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent {

  clientCols: any[] = []; // For client-specific columns
  selectedImageUrl!: String | undefined  ;
  selectedFile: File | null = null;
  rows: ClientResponse[] = [];
  selectedRows: ClientResponse[] = [];
  clients: ClientResponse[] = [];
  displayType = 'list';
  pagedClients: ClientResponse[] = [];
  search = '';
  displayDialog = false;
  clientForm: FormGroup;
  selectedClient: ClientResponse | null = null;

  itemsPerPage: number = 8; // Number of items per page
  totalRecords: number = 0; // Total number of items
  currentPage: number = 1; // Current page number
  showPasswordFields: boolean = false;


  constructor(
    private clientService: ClientService,
    private fb: FormBuilder,
    private translate: TranslateService
  ) {
    this.clientForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      country: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      cin: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      passport: this.fb.group({
        passportNumber: ['', Validators.required],
        issueDate: ['', Validators.required],
        expiryDate: ['', Validators.required],
      }),
      imageFile: [null]
    });
  }



  ngOnInit(): void {

    this.fetchClientData();
    this.setClientColumns();

    // Update column titles when the language changes
    this.translate.onLangChange.subscribe(() => {
      this.updateClientColumnTitles();
    });


  }

  fetchClientData():void{
    this.clientService.getAll().subscribe({
      next: (data) => {
        this.clients = data;
        this.rows = [...this.clients];
      },
      error: (err) => {
        console.error('Error fetching clients data', err);
      }
    });
  }

  setClientColumns() {
    this.translate.get([
      'clientComponent.table.columns.firstName',
      'clientComponent.table.columns.lastName',
      'clientComponent.table.columns.cin',
      'clientComponent.table.columns.country',
      'clientComponent.table.columns.actions'
    ]).subscribe(translations => {
      this.clientCols = [
        { field: 'firstName', title: translations['clientComponent.table.columns.firstName'], filter: true },
        { field: 'lastName', title: translations['clientComponent.table.columns.lastName'], filter: true },
        { field: 'cin', title: translations['clientComponent.table.columns.cin'], filter: true },
        { field: 'country', title: translations['clientComponent.table.columns.country'], filter: true },
        { field: 'actions', title: translations['clientComponent.table.columns.actions'], filter: false }
      ];
    });
  }


  updateClientColumnTitles() {
    this.clientCols.forEach(col => {
      col.title = this.translate.instant(`clientComponent.table.columns.${col.field}`);
    });
  }

  onChangePasswordClick() {
    this.showPasswordFields = !this.showPasswordFields;
    if (this.showPasswordFields) {
      this.clientForm.addControl('password', new FormControl('', [Validators.required, Validators.minLength(6)]));
      this.clientForm.addControl('confirmationPassword', new FormControl('', [Validators.required, Validators.minLength(6)]));
    } else {
      this.clientForm.removeControl('password');
      this.clientForm.removeControl('confirmationPassword');
    }
  }

  onRowSelect(event: any) {
    this.selectedRows = event;
    console.log(this.selectedRows)
  }

  removeClient(selectedClient: ClientResponse) {
    if (!selectedClient) {
      console.error('Client data is undefined in removeClient method.');
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this Client?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        if (selectedClient.id != null) {
          this.clientService.delete(selectedClient.id).subscribe({
            next:()=>{
              this.rows = this.rows.filter(client => client.id != selectedClient.id );
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

  updateClient(client: ClientResponse) {
    this.selectedClient = client;
    this.clientForm.patchValue(client);
    this.selectedImageUrl = client.imageUrl;
    this.displayDialog = true;
  }

  onSave() {
    if (this.clientForm.valid) {
      const updatedClient = {
        ...this.selectedClient,
        ...this.clientForm.value
      };
      if (this.selectedClient != null) {
        if (this.selectedClient.id != null) {
          this.clientService.updateClient(updatedClient, this.selectedFile , this.showPasswordFields).subscribe({
            next: (updatedClientData) => {
              const index = this.rows.findIndex(client => client.id === updatedClient.id);
              if (index !== -1) {
                this.rows[index] = updatedClientData;
                this.rows = [...this.rows];
              }
              this.clientForm.reset()
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


  removeImage() {

  }
}
