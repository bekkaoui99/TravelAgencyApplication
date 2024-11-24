import {Component, inject, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertMessage} from "../login/login.component";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {AuthenticationService} from "../../../services/authentication.service";

// Custom validator to check if password and confirmationPassword are the same


@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit{
  alertVisible: boolean = false;
  alertMessage: AlertMessage | undefined;
  registerForm!: FormGroup ;
  registered:Boolean = false;
  messageService = inject(MessageService);
  constructor(
      private authService:AuthenticationService,
      private route:Router
  ) {
  }
  public passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmationPassword = form.get('confirmationPassword')?.value;
    return password === confirmationPassword;
  }
  ngOnInit(): void {
    this.registerForm = new FormGroup({
      lastName: new FormControl<string>("" , Validators.required),
      firstName: new FormControl<string>("" , Validators.required),
      userName: new FormControl<string>("" , Validators.required),
      email: new FormControl<string>("" , [Validators.required , Validators.email]),
      password: new FormControl<string>("" , [Validators.required, Validators.minLength(8)]),
      confirmationPassword: new FormControl<string>("" , [Validators.required, Validators.minLength(8)]),
      phoneNumber: new FormControl<string>("" , [Validators.required , Validators.min(10)]),
    } );
  }

  singUp() {
    this.alertVisible= false;
    this.alertMessage = {
      state:"",
      message:""
    }
    this.authService.clientRegistration(this.registerForm.value).subscribe({
      next:(data)=> {
        this.registered = true;
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Utilisateur enregistré avec succès !",
          styleClass : "right-8 fixed 2xs:w-[80%] sm:static"
        });
        // Execute the redirection after 10 seconds
        setTimeout(() => {
          this.route.navigateByUrl("auth/login");
        }, 1600);

      },
      error:(err)=>{
        this.alertVisible= true;
        this.alertMessage = {
          state:"error",
          message:err.error.message
        }

      }
    })
  }
  /*
  authService: AuthenticationService = inject(AuthenticationService);
  form: FormGroup = new FormGroup({
    lastName: new FormControl<string>(""),
    firstName: new FormControl<string>(""),
    username: new FormControl<string>(""),
    email: new FormControl<string>(""),
    password: new FormControl<string>(""),
    numTel: new FormControl<string>(""),
  });
  login() {
    const formValue = this.form.value;
    // @ts-ignore
      // @ts-ignore
      this.authService
      .signUp({
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        username: formValue.username,
        password: formValue.password,
        email: formValue.email,
        numTel: formValue.numTel,
      })
      .subscribe((userInfo:any) => {
        console.log(userInfo);
      });
  }

   */


}
