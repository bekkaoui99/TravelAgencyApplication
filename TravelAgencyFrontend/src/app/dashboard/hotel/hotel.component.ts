import {Component, OnInit, ViewChild} from '@angular/core';
import {Hotel} from "../../types/Hotel/Hotel";
import {HotelService} from "../../services/hotel.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HotelRating} from "../../types/Hotel/HotelRating";
import Swal from "sweetalert2";
import {TranslateService} from "@ngx-translate/core";


@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.css']
})
export class HotelComponent implements OnInit{

  cols: any[] = [];
  clone: boolean = false
  rows: Hotel[] = [];
  selectedRows: Hotel[] = [];
  hotels: Hotel[] = [];
  displayType = 'list';
  pagedHotels: Hotel[] = [];
  search = '';
  displayDialog = false;
  updateForm: FormGroup;
  selectedHotel: Hotel | null = null;

  itemsPerPage: number = 8; // Number of items per page
  totalRecords: number = 0; // Total number of items
  currentPage: number = 1; // Current page number

  constructor(
    private hotelService: HotelService,
    private fb: FormBuilder,
    private translate: TranslateService
  ) {
    this.updateForm = this.fb.group({
      name: ['', Validators.required],
      rate: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
    });
  }





  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.updatePagedHotels();
  }

  ngOnInit(): void {
    this.fetchHotelData();

    this.setColumns();
    // Subscribe to language change events to update column titles
    this.translate.onLangChange.subscribe(() => {
      this.updateColumnTitles();
    });

  }

  updateColumnTitles() {
    this.cols.forEach(col => {
      col.title = this.translate.instant(`hotelComponent.table.columns.${col.field}`);
    });
  }

  setColumns() {
    this.translate.get([
      'hotelComponent.table.columns.name',
      'hotelComponent.table.columns.rate',
      'hotelComponent.table.columns.city',
      'hotelComponent.table.columns.country',
      'hotelComponent.table.columns.actions'
    ]).subscribe(translations => {
      this.cols = [
        { field: 'name',filter: true, title: translations['hotelComponent.table.columns.name'],  },
        { field: 'rate', title: translations['hotelComponent.table.columns.rate'], filter: true },
        { field: 'city', title: translations['hotelComponent.table.columns.city'], filter: true },
        { field: 'country', title: translations['hotelComponent.table.columns.country'], filter: true },
        { field: 'actions', title: translations['hotelComponent.table.columns.actions'], filter: false }
      ];
    });
  }


  fetchHotelData():void{
    this.hotelService.getAll().subscribe({
      next: (data) => {
        this.hotels = data;
        this.pagedHotels = data;
        this.rows = [...this.hotels];
        this.updatePagedHotels();
      },
      error: (err) => {
        console.error('Error fetching hotels', err);
      }
    });
  }

  rateOptions = [
    { label: 'One Star', value: 'ONE_STAR' },
    { label: 'Two Stars', value: 'TWO_STARS' },
    { label: 'Three Stars', value: 'THREE_STARS' },
    { label: 'Four Stars', value: 'FOUR_STARS' },
    { label: 'Five Stars', value: 'FIVE_STARS' }
  ];

  removeHotel(selectHotel: Hotel) {
    if (!selectHotel) {
      console.error('Hotel data is undefined in removeHotel method.');
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this hotel?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        if (selectHotel.id != null) {
          this.hotelService.delete(selectHotel.id).subscribe({
            next:()=>{
              this.rows = this.rows.filter(hotel => hotel.id != selectHotel.id );
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

  updateHotel(hotel: Hotel) {
    this.selectedHotel = hotel;
    this.updateForm.patchValue(hotel);
    this.displayDialog = true;
  }

  updatePagedHotels() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedHotels = this.hotels.slice(startIndex, endIndex);
  }


  onSave() {
    if (this.updateForm.valid) {
      const updatedHotel = {
        ...this.selectedHotel,
        ...this.updateForm.value
      };
      if (this.selectedHotel != null) {
        if (this.selectedHotel.id != null && !this.clone) {
          this.hotelService.update(updatedHotel, this.selectedHotel.id).subscribe({
            next: (updatedHotelData) => {
              const index = this.rows.findIndex(hotel => hotel.id === updatedHotel.id);
              if (index !== -1) {
                this.rows[index] = updatedHotelData;
                this.rows = [...this.rows];
                this.onCancel();
                Swal.fire({
                  icon: 'success',
                  title: 'Success',
                  text: 'Hotel has been copied successfully!'
                });
              }
            }
          });
        }
        if (this.clone) {
          this.hotelService.cloneWithHotelObject(updatedHotel).subscribe({
            next:(updatedHotelData)=>{
              this.rows.push(updatedHotelData);
              this.rows = [...this.rows];
              this.onCancel();
              Swal.fire({
                  icon: 'success',
                  title: 'Success',
                  text: 'Hotel has been copied successfully!'
              });
            }
          })
        }
      }
    }
  }

  cloneHotel(hotel: Hotel): void {
    Swal.fire({
      title: 'Clone Hotel',
      text: 'Do you want to create a copy without modifying the information or update the information?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Create Copy',
      cancelButtonText: 'Update Information'
    }).then((result) => {
      if (result.isConfirmed) {
        if (hotel.id != null) {
          this.hotelService.cloneWithHotelId(hotel.id).subscribe({
            next:(hotelResponse)=>{
              this.rows.push(hotelResponse);
              this.rows = [...this.rows];
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Hotel has been copied successfully!'
              });
            }
          })
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // User chose to update the information
        this.updateHotel(hotel);
        this.clone = true;
      }
    });
  }

  onCancel() {
    this.displayDialog = false;
    this.clone = false;
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


  onRowSelect(event: any) {
    this.selectedRows = event;
  }


  getStarArray(rating: HotelRating): number[] {
    switch (rating) {
      case HotelRating.ONE_STAR:
        return [1];
      case HotelRating.TWO_STARS:
        return [1, 2];
      case HotelRating.THREE_STARS:
        return [1, 2, 3];
      case HotelRating.FOUR_STARS:
        return [1, 2, 3, 4];
      case HotelRating.FIVE_STARS:
        return [1, 2, 3, 4, 5];
      default:
        return [];
    }
  }


  onDialogHide() {
    this.clone = false;
    this.onCancel();
  }
}




