import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import { UsersService } from '../../services/users.service';
import { Usuarios } from '../../models/Usuarios';

import * as XLSX from 'xlsx';
import { UsuariosInsertAdmin } from '../../models/UsuariosInsertAdmin';

@Component({
  selector: 'app-mantenimiento',
  standalone: true,
  imports: [MatCardModule, MatTableModule, CommonModule, DatePipe],
  templateUrl: './mantenimiento.component.html',
  styleUrl: './mantenimiento.component.css'
})
export default class MantenimientoComponent {
  private usersService = inject(UsersService);
  public listadeUsuarios:Usuarios[]=[];

  listadeusuariosRegistrar: UsuariosInsertAdmin[]=[];
  public displayedColumns:string[]=['IdUsuario', 'Username', 'Mail', 'Nombre', 'Apellido', 'Identificacion', 'Status', 'Nacimiento'];

  constructor(){
    this.usersService.getAllUsers().subscribe({
      next:(data)=> {
        if(data.value.length>0){
          this.listadeUsuarios=data.value;
          console.log('Entre al if');
          console.log(this.listadeUsuarios);
        }
      },
      error:(error)=>{
        console.log(error.message);
      }
    })
  }
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const binarystr: string = e.target.result;

      // Determinar el tipo de archivo (xlsx o csv)
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        this.processExcelFile(binarystr);
      } else if (file.name.endsWith('.csv')) {
        this.processCsvFile(binarystr);
      } else {
        alert('Formato de archivo no soportado. Por favor, seleccione un archivo Excel (.xlsx, .xls) o CSV (.csv).');
      }
    };

    reader.readAsBinaryString(file);
  }

  private processExcelFile(binarystr: string): void {
    const workbook: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });
    const sheetName: string = workbook.SheetNames[0]; // Suponiendo que la primera hoja es la que tiene los datos
    const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
    const excelData: any[] = XLSX.utils.sheet_to_json(worksheet, { raw: true });

    this.processData(excelData);
  }

  private processCsvFile(binarystr: string): void {
    const csvData: string = binarystr;
    const lines: string[] = csvData.split('\n');
    const headers: string[] = lines[0].trim().split(',');

    // Convertir CSV a objetos JavaScript
    const csvObjects: any[] = [];
    for (let i = 1; i < lines.length; i++) {
      const data: string[] = lines[i].trim().split(',');
      if (data.length === headers.length) {
        const obj: any = {};
        for (let j = 0; j < headers.length; j++) {
          obj[headers[j]] = data[j];
        }
        csvObjects.push(obj);
      }
    }

    this.processData(csvObjects);
  }

  private processData(data: any[]): void {
    // Mapear los datos al modelo UsuariosInsertAdmin
    const usuariosFromExcel: UsuariosInsertAdmin[] = data.map(item => ({
      username: item.username,
      password: item.password,
      nombres: item.nombres,
      apellidos: item.apellidos,
      identificacion: item.identificacion,
      status: item.status,
      fechanacimiento: item.fechanacimiento
    }));

    // Guardar los usuarios en tu lista o enviarlos al servicio para almacenarlos
    this.listadeusuariosRegistrar = usuariosFromExcel;

    // Aquí puedes enviar los datos al servicio si necesitas guardarlos en tu backend
    // Ejemplo: this.usersService.saveUsers(usuariosFromExcel).subscribe(...);
  }
}
