import { Component } from '@angular/core';
import {Hotel} from "../../types/Hotel/Hotel";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HotelService} from "../../services/hotel.service";
import {GuideResponse} from "../../types/Guide/GuideResponse";
import {GuideService} from "../../services/guide.service";
import Swal from "sweetalert2";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.css']
})
export class GuideComponent {

  guideTableCols: any[] = [];
  selectedImageUrl!: String | undefined  ;
  selectedFile: File | null = null;
  rows: GuideResponse[] = [];
  selectedRows: GuideResponse[] = [];
  guides: GuideResponse[] = [];
  displayType = 'list';
  pagedHotels: GuideResponse[] = [];
  search = '';
  displayDialog = false;
  updateForm: FormGroup;
  selectedGuide: GuideResponse | null = null;

  itemsPerPage: number = 8; // Number of items per page
  totalRecords: number = 0; // Total number of items
  currentPage: number = 1; // Current page number
  showPasswordFields: boolean = false;

  constructor(
    private guideService: GuideService,
    private fb: FormBuilder,
    private translateService: TranslateService
  ) {
    this.updateForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      country: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      cin: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }


  ngOnInit(): void {

    this.setGuideTableColumns();
    this.fetchGuideData();

    // Update column titles when the language changes
    this.translateService.onLangChange.subscribe(() => {
      this.updateGuideColumnTitles();
    });

  }


  fetchGuideData():void{
    this.guideService.getAll().subscribe({
      next: (data) => {
        this.guides = data;
        this.rows = [...this.guides];
      },
      error: (err) => {
        console.error('Error fetching guides data', err);
      }
    });
  }


  setGuideTableColumns() {
    this.translateService.get([
      'guideComponent.table.columns.firstName',
      'guideComponent.table.columns.lastName',
      'guideComponent.table.columns.cin',
      'guideComponent.table.columns.country',
      'guideComponent.table.columns.actions'
    ]).subscribe(translations => {
      this.guideTableCols = [
        { field: 'firstName', title: translations['guideComponent.table.columns.firstName'], filter: true },
        { field: 'lastName', title: translations['guideComponent.table.columns.lastName'], filter: true },
        { field: 'cin', title: translations['guideComponent.table.columns.cin'], filter: true },
        { field: 'country', title: translations['guideComponent.table.columns.country'], filter: true },
        { field: 'actions', title: translations['guideComponent.table.columns.actions'], filter: false }
      ];
    });

  }

  updateGuideColumnTitles() {
    this.guideTableCols.forEach(col => {
      col.title = this.translateService.instant(`clientComponent.table.columns.${col.field}`);
    });
  }


  onChangePasswordClick() {
    this.showPasswordFields = !this.showPasswordFields;
    if (this.showPasswordFields) {
      this.updateForm.addControl('password', new FormControl('', [Validators.required, Validators.minLength(6)]));
      this.updateForm.addControl('confirmationPassword', new FormControl('', [Validators.required, Validators.minLength(6)]));
    } else {
      this.updateForm.removeControl('password');
      this.updateForm.removeControl('confirmationPassword');
    }
  }

  onRowSelect(event: any) {
    this.selectedRows = event;
    console.log(this.selectedRows)
  }

  removeGuide(selectedGuide: Hotel) {
    if (!selectedGuide) {
      console.error('guide data is undefined in removeGuide method.');
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this Guide?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Removing hotel:', selectedGuide);
        if (selectedGuide.id != null) {
          this.guideService.delete(selectedGuide.id).subscribe({
            next:()=>{
              this.rows = this.rows.filter(hotel => hotel.id != selectedGuide.id );
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

  updateGuide(guide: GuideResponse) {
    this.selectedGuide = guide;
    this.updateForm.patchValue(guide);
    this.selectedImageUrl = guide.imageUrl
    this.displayDialog = true;
  }

  onSave() {
    if (this.updateForm.valid) {
      const updatedGuideData = new FormData();
      Object.keys(this.updateForm.controls).forEach(key => {
        updatedGuideData.append(key, this.updateForm.get(key)?.value);
      });
      if (this.selectedFile != null) {
        updatedGuideData.append('imageFile', this.selectedFile);
      }
      if (this.selectedGuide != null) {
        if (this.selectedGuide.id != null) {
          this.guideService.update(updatedGuideData, this.selectedGuide.id).subscribe({
            next: (updatedGuideData) => {
              this.updateForm.reset()
              this.displayDialog = false;
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Item updated successfully!'
              });
              const index = this.rows.findIndex(guide => guide.id === updatedGuideData.id);
              if (index !== -1) {
                this.rows[index] = updatedGuideData;
                this.rows = [...this.rows];
              }
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
