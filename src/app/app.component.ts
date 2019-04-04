import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PatientService } from './services/patient.service';
import { MatSort, MatTableDataSource } from '@angular/material';

export interface PeriodicElement {
  status: string;
  dateWritten: string;
  condition: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  private entries: Array<object> = [];
  patientInfo: object[];
  name = '';

  constructor(private patientService: PatientService) {}
  displayedColumns: string[] = ['condition', 'dateWritten', 'status'];
  dataSource = new MatTableDataSource(this.entries);

  @ViewChild(MatSort) sort: MatSort;
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  valueChange(value) {
    this.patientService
      .getPatientInfoById(value)
      .subscribe((data: Array<object>) => {
        this.patientInfo = data;
      });
  }
  valueChanges(value) {
    this.patientService.getPatientMedicationById(value).subscribe((data: Array<any>) => {
      const entriesMap: PeriodicElement[] = data.entry.map(a => {
        return {
          status: a.resource.status,
          dateWritten: a.resource.dateWritten.split('T')[0],
          condition: a.resource.medicationCodeableConcept.text
        };
      });
      this.dataSource = new MatTableDataSource(entriesMap);
    });
  }
  ngOnInit() {
    this.getPatientInfo();
    this.getEntries();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.dataSource.sort = this.sort;
    });
  }

  public getEntries() {
    this.patientService.getPatientMedicationById(undefined).subscribe((data: Array<any>) => {
      const entriesMap: PeriodicElement[] = data.entry.map(a => {
        return {
          status: a.resource.status,
          dateWritten: a.resource.dateWritten.split('T')[0],
          condition: a.resource.medicationCodeableConcept.text
        };
      });
      this.dataSource = new MatTableDataSource(entriesMap);
    });
  }
  public getPatientInfo() {
    this.patientService
      .getPatientInfoById(undefined)
      .subscribe((data: Array<object>) => {
        this.patientInfo = data;
      });
  }
}
