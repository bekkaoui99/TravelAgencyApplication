import {Component, inject, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {AuthenticationService} from "../../../services/authentication.service";

export interface AlertMessage{
  state:string,
  message:string
}

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit{
  alertVisible = false;
  alertMessage: AlertMessage | undefined;
  singInForm!: FormGroup;
  messageService= inject(MessageService)
  constructor(
      private authService:AuthenticationService,
      private router:Router
      ) {
  }

  ngOnInit(): void {
    this.singInForm = new FormGroup({
      email: new FormControl<string>("" , [Validators.required , Validators.email]),
      password: new FormControl("" , [Validators.required , Validators.minLength(8)]),
    });
  }

  login() {
    this.alertVisible = false;
    this.alertMessage = {
      state:"",
      message:""
    };
    this.authService.login(this.singInForm.value).subscribe({
      next:(data)=>{
        this.authService.loadingData(data);
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Connected",
          styleClass : "right-8 fixed 2xs:w-[80%] sm:static"
        });
        if(this.authService.role == "CLIENT"){
          this.router.navigateByUrl("")
        }
        if(this.authService.role == "ADMIN"){
          this.router.navigateByUrl("/dashboard/home")
        }
        else{
          this.router.navigateByUrl("")
        }
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
  @Output() clickCreateAccount: EventEmitter<boolean> = new EventEmitter();
  authService: AuthenticationService = inject(AuthenticationService);
  form: FormGroup = new FormGroup({
    username: new FormControl<string>(""),
    password: new FormControl(""),
  });
  login() {
    const formValue = this.form.value;
    // @ts-ignore
    this.authService
      .login({
        usernameOrEmail: formValue.username,
        password: formValue.password,
      })
      .subscribe((userInfo) => {
        console.log(userInfo);
      });
  }
  createAccount() {
    this.clickCreateAccount.emit();
  }

   */



}
