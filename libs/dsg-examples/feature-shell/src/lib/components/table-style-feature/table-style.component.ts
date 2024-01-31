import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';

export interface ClaimsData {
  claim: string;
  claimStatus: string;
  date: string;
  email: string;
  name: string;
  phone: string;
}
const TABLE_DATA = [
  { claim: 'ACME-20210319-4', claimStatus: 'Submitted', date: '5/21/2021', email: 'firstlast@acme.com', name: 'First Last', phone: '766-813-6380' },
  {
    claim: 'ACME-20210256-8',
    claimStatus: 'Additional Info Requested',
    date: '5/20/2021',
    email: 'firstlast@acme.com',
    name: 'First Last',
    phone: '123-456-7890',
  },
  { claim: 'ACME-20210209-3', claimStatus: 'In Process', date: '5/16/2021', email: 'firstlast@acme.com', name: 'First Last', phone: '123-456-7890' },
  { claim: 'ACME-20210220-21', claimStatus: 'In Process', date: '5/15/202', email: 'firstlast@acme.com', name: 'First Last', phone: '123-456-7890' },
  { claim: 'ACME-20210220-4', claimStatus: 'Flagged for Review', date: '5/12/2021', email: 'firstlast@acme.com', name: 'First Last', phone: '123-456-7890' },
  { claim: 'ACME-20210222-12', claimStatus: 'In Process', date: '5/6/2021', email: 'firstlast@acme.com', name: 'First Last', phone: '123-456-7890' },
  {
    claim: 'ACME-20210320-1',
    claimStatus: 'In Process',
    date: '4/28/2021',
    email: 'firstlast@acme.com',
    name: 'First Last',
    phone: '123-456-7890',
  },
  { claim: 'ACME-20210319-5', claimStatus: 'In Process', date: '4/28/2021', email: 'firstlast@acme.com', name: 'First Last', phone: '123-456-7890' },
  { claim: 'ACME-20210316-12', claimStatus: 'Approved', date: '4/24/2021', email: 'firstlast@acme.com', name: 'First Last', phone: '123-456-7890' },
  {
    claim: 'ACME-20210459-8',
    claimStatus: 'Flagged for Review',
    date: '4/19/2021',
    email: 'firstlast@acme.com',
    name: 'First Last',
    phone: '123-456-78908',
  },
];

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatPaginatorModule, MatSortModule, MatTableModule],
  selector: 'dsg-examples-table-style',
  standalone: true,
  styleUrls: ['./table-style.component.scss'],
  templateUrl: './table-style.component.html',
})
export class ExampleTableStyleComponent implements AfterViewInit {
  public displayedColumns: string[] = ['claim', 'claimStatus', 'date', 'email', 'name', 'phone'];
  public dataSourceTable = new MatTableDataSource<ClaimsData>(TABLE_DATA);
  @ViewChild(MatSort) public tableSort!: MatSort;

  @ViewChild('tablePaginator') public tablePaginator!: MatPaginator;

  public ngAfterViewInit() {
    this.dataSourceTable.paginator = this.tablePaginator;
    this.dataSourceTable.sort = this.tableSort;
  }
}
