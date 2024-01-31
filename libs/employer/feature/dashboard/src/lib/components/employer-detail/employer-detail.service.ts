import { Injectable } from '@angular/core';
import { UserModel } from '@dsg/shared/data-access/user-api';
import { EmployerDetailModel } from '@dsg/shared/data-access/work-api';
import { Observable, of } from 'rxjs';

// We are temporarily mocking the EmployerDetailModel and UserModel until the WM API is ready
export const ApiEmployerDetailMock: EmployerDetailModel = new EmployerDetailModel({
  accountId: '123456789',
  assignedTo: '4534546575675',
  displayName: 'Employer Display Name',
  email: 'employer@employer.com',
  preferences: { preferredCommunicationMethod: 'SMS, Email', preferredLanguage: 'English' },
});

export const ApiEmployerUserMock = new UserModel({
  assignedRoles: [],
  displayName: 'Chandler Muriel Bing',
  email: 'c.m.bing@aol.com',
  externalId: '345354567567567567',
  firstName: 'Chandler',
  id: '4534546575675',
  lastName: 'Bing',
  middleName: 'Muriel',
  phoneNumber: '555-776-3322',
  preferences: { preferredCommunicationMethod: 'Email', preferredLanguage: 'English' },
});

@Injectable({
  providedIn: 'root',
})
export class EmployerDetailService {
  public getEmployerDetails$(): Observable<EmployerDetailModel> {
    return of(ApiEmployerDetailMock);
  }

  public getEmployerAgents$(): Observable<UserModel[]> {
    return of([ApiEmployerUserMock]);
  }
}
