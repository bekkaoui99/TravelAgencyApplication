import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GuideService} from "../../../services/guide.service";
import Swal from "sweetalert2";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-guide',
  templateUrl: './add-guide.component.html',
  styleUrls: ['./add-guide.component.css']
})
export class AddGuideComponent {

  guideForm: FormGroup;
  selectedImageUrl!: String | undefined;
  selectedFile: File | null = null;
  isLoading:boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private guideService: GuideService
  ) {
    this.guideForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      userName: [''],
      country: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      cin: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmationPassword: ['', [Validators.required, Validators.minLength(8)]],
      imageFile: [null]
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

  createGuide(): void {
    if(this.guideForm.invalid){
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all fields!'
      });
      return
    }
    if (this.guideForm.valid) {
      this.isLoading = true
      const formData = new FormData();
      Object.keys(this.guideForm.controls).forEach(key => {
          formData.append(key, this.guideForm.get(key)?.value);
      });
      if (this.selectedFile) {
        formData.append('imageFile', this.selectedFile);
      }
      setTimeout(()=> {} , 4000)

      this.guideService.create(formData).subscribe({
        next: (createdGuide) => {
          console.log('Guide created successfully:', createdGuide);
          this.onCancel();
          this.isLoading = false;
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Item created successfully!'
          });
          this.router.navigateByUrl("/dashboard/guide")
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
    this.guideForm.reset();
  }

}
