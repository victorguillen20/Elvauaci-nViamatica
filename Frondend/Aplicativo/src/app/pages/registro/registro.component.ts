import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AccesoService } from '../../services/acceso.service';
import { Usersinsert } from '../../models/Usersinsert';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  private accesoService = inject(AccesoService);
  private router = inject(Router);
  public formBuild = inject(FormBuilder);

  public formRegistro: FormGroup = this.formBuild.group({
    username:['',Validators.required],
	  password:['',Validators.required],
	  nombres:['',Validators.required],
	  apellidos:['',Validators.required],
    identificacion:['',Validators.required],
    fechanacimiento:['',Validators.required]
  })

  registrarPersona(){
    if(this.formRegistro.invalid)return;

    const objeto:Usersinsert = {
      username: this.formRegistro.value.username,
      password: this.formRegistro.value.password,
      nombres: this.formRegistro.value.nombres,
      apellidos: this.formRegistro.value.apellidos,
      identificacion: this.formRegistro.value.identificacion,
      fechanacimiento: this.formRegistro.value.fechanacimiento
    }
    this.accesoService.registrarse(objeto).subscribe({
      next: (data) => {
          if(data.registrodeusuario == true){
            alert("Registro exitoso");
            this.router.navigate(['']);
          }else{
            alert(data.registrodeusuario);
          }
      },
      error: (error) => {
        console.log(error.message);
      }

    })
  }

  volver(){
    this.router.navigate([''])
  }
}
