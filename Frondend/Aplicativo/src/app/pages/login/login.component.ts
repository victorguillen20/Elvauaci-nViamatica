import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AccesoService } from '../../services/acceso.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Login } from '../../models/Login';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private accesoService = inject(AccesoService);
  private router = inject(Router);
  public formBuild = inject(FormBuilder);

  public formlogin: FormGroup = this.formBuild.group({
    username: ['',Validators.required],
    password: ['',Validators.required]
  })

  inicioSesion(){
    if(this.formlogin.invalid)return;

    const objeto:Login = {
      username: this.formlogin.value.username,
      password: this.formlogin.value.password
    }

    this.accesoService.loguearse(objeto).subscribe({
      next:(data) => {
        if(data.login = true){
          if (data.rol = 'Administrador') {
            this.router.navigate(['administrador']);
          }
          this.router.navigate(['inicio'])
        }else{
          alert("Credenciales incorrectas");
        }
      },
      error:(error) => {
        console.log(error.message);
      }
    })
  }

  registrarse(){
    this.router.navigate(['registro'])
  }
}
