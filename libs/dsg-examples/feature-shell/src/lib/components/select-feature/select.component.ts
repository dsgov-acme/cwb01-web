import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import {
  NuverialIconComponent,
  NuverialValidationErrorType,
  NuverialSelectComponent,
  INuverialSelectOption,
  NuverialSelectDropDownLabelsType,
} from '@dsg/shared/ui/nuverial';

const ALL_STATES: INuverialSelectOption[] = [
  {
    disabled: false,
    displayTextValue: 'Alabama',
    key: 'AL',
    selected: false,
  },
  {
    disabled: true,
    displayTextValue: 'Alaska',
    key: 'AK',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'American Samoa',
    key: 'AS',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Arizona',
    key: 'AZ',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Arkansas',
    key: 'AR',
    selected: false,
  },
  {
    disabled: false,
    displayChipValue: 'CA',
    displayTextValue: 'California',
    key: 'CA',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Colorado',
    key: 'CO',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Connecticut',
    key: 'CT',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Delaware',
    key: 'DE',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'District Of Columbia',
    key: 'DC',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Federated States Of Micronesia',
    key: 'FM',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Florida',
    key: 'FL',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Georgia',
    key: 'GA',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Guam',
    key: 'GU',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Hawaii',
    key: 'HI',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Idaho',
    key: 'ID',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Illinois',
    key: 'IL',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Indiana',
    key: 'IN',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Iowa',

    key: 'IA',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Kansas',
    key: 'KS',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Kentucky',
    key: 'KY',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Louisiana',
    key: 'LA',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Maine',
    key: 'ME',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Marshall Islands',
    key: 'MH',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Maryland',
    key: 'MD',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Massachusetts',
    key: 'MA',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Michigan',
    key: 'MI',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Minnesota',
    key: 'MN',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Mississippi',
    key: 'MS',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Missouri',
    key: 'MO',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Montana',
    key: 'MT',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Nebraska',
    key: 'NE',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Nevada',
    key: 'NV',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'New Hampshire',
    key: 'NH',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'New Jersey',
    key: 'NJ',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'New Mexico',
    key: 'NM',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'New York',
    key: 'NY',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'North Carolina',
    key: 'NC',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'North Dakota',
    key: 'ND',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Northern Mariana Islands',
    key: 'MP',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Ohio',
    key: 'OH',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Oklahoma',
    key: 'OK',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Oregon',
    key: 'OR',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Palau',
    key: 'PW',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Pennsylvania',
    key: 'PA',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Puerto Rico',
    key: 'PR',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Rhode Island',
    key: 'RI',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'South Carolina',
    key: 'SC',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'South Dakota',
    key: 'SD',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Tennessee',
    key: 'TN',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Texas',
    key: 'TX',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Utah',
    key: 'UT',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Vermont',
    key: 'VT',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Virgin Islands',
    key: 'VI',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Virginia',
    key: 'VA',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Washington',
    key: 'WA',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'West Virginia',
    key: 'WV',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Wisconsin',
    key: 'WI',
    selected: false,
  },
  {
    disabled: false,
    displayTextValue: 'Wyoming',
    key: 'WY',
    selected: false,
  },
];

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule, NuverialIconComponent, NuverialSelectComponent, MatSelectModule],
  selector: 'dsg-examples-select',
  standalone: true,
  styleUrls: ['./select.component.scss'],
  templateUrl: './select.component.html',
})
export class ExampleSelectComponent {
  public get allStates() {
    return ALL_STATES.map(a => ({ ...a }));
  }
  public get partialStates() {
    return ALL_STATES.slice(0, 9).map(a => ({ ...a }));
  }
  public inputTextValidationMessages = { required: 'State is required' };
  public inputTextModel = '';
  // public selectFormControl = new FormControl(
  //   { disabled: false, value: { disabled: false, displayChipValue: 'AS', displayTextValue: 'American Samoa', key: 'AS', selected: true } },
  //   [Validators.required],
  // );
  public selectFormControl = new FormControl({ disabled: false, value: null }, [Validators.required]);
  public selectSearchFormControl = new FormControl({ disabled: false, value: null }, [Validators.required]);
  public selectFormGroup = new FormGroup({
    testGroupControl1: new FormControl({ disabled: false, value: { displayTextValue: 'American Samoa' } }),
    testGroupControl2: new FormControl({ disabled: false, value: null }),
  });

  public dropDownArialLabels: NuverialSelectDropDownLabelsType = {
    cancel: 'cancel menu',
    close: 'close menu',
    open: 'open menu',
  };

  public onValidationErrors(_event: NuverialValidationErrorType[]) {
    // for debug purposes
  }
}
