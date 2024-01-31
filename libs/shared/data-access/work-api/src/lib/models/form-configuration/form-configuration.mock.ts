/* eslint-disable sort-keys */

import { IFormConfigurationSchema } from './form-configuration.model';

export const FormioConfigurationMock = [
  {
    key: 'personalInformation',
    type: 'panel',
    label: 'Page 1',
    props: {
      label: 'Personal Information',
    },
    title: 'Personal Information',
    components: [
      {
        key: 'personalInformation.firstName',
        type: 'nuverialTextInput',
        props: {
          type: 'text',
          label: 'First Name',
          required: true,
        },
        className: 'flex-half',
      },
      {
        key: 'personalInformation.middleName',
        type: 'nuverialTextInput',
        props: {
          type: 'text',
          label: 'Middle Name (optional)',
        },
        className: 'flex-half',
      },
      {
        key: 'personalInformation.lastName',
        type: 'nuverialTextInput',
        props: {
          type: 'text',
          label: 'Last Name',
          required: true,
        },
        className: 'flex-half',
      },
      {
        key: 'personalInformation.dateOfBirth',
        type: 'nuverialDatePicker',
        props: {
          label: 'Date of Birth',
          required: true,
          startView: 'month',
          colorTheme: 'primary',
        },
        className: 'flex-half',
      },
      {
        key: 'personalInformation.email',
        type: 'nuverialTextInput',
        props: {
          type: 'email',
          label: 'Email Address',
          required: true,
        },
        className: 'flex-half',
        validators: {
          validation: ['email'],
        },
      },
      {
        key: 'personalInformation.phone',
        type: 'nuverialTextInput',
        props: {
          mask: '(000) 000-0000',
          type: 'tel',
          label: 'Phone',
          required: true,
          maxLength: 10,
          minLength: 10,
        },
        className: 'flex-half',
      },
      {
        key: 'nuverialSectionHeader',
        type: 'nuverialSectionHeader',
        props: {
          label: 'Current Address',
        },
        className: 'flex-full',
      },
      {
        key: 'personalInformation.currentAddress.addressLine1',
        type: 'nuverialTextInput',
        props: {
          type: 'text',
          label: 'Address Line 1',
          required: true,
        },
        className: 'flex-half',
      },
      {
        key: 'personalInformation.currentAddress.addressLine2',
        type: 'nuverialTextInput',
        props: {
          type: 'text',
          label: 'Address Line 2 (optional)',
        },
        className: 'flex-half',
      },
      {
        key: 'personalInformation.currentAddress.city',
        type: 'nuverialTextInput',
        props: {
          type: 'text',
          label: 'City',
          required: true,
        },
        className: 'flex-half',
      },
      {
        key: 'personalInformation.currentAddress.stateCode',
        type: 'nuverialSelect',
        props: {
          label: 'State',
          required: true,
          colorTheme: 'primary',
          selectOptions: [
            {
              key: 'AL',
              displayTextValue: 'Alabama',
            },
            {
              key: 'AK',
              displayTextValue: 'Alaska',
            },
            {
              key: 'AS',
              displayTextValue: 'American Samoa',
            },
            {
              key: 'AZ',
              displayTextValue: 'Arizona',
            },
            {
              key: 'AR',
              displayTextValue: 'Arkansas',
            },
            {
              key: 'CA',
              displayTextValue: 'California',
            },
            {
              key: 'CO',
              displayTextValue: 'Colorado',
            },
            {
              key: 'CT',
              displayTextValue: 'Connecticut',
            },
            {
              key: 'DE',
              displayTextValue: 'Delaware',
            },
            {
              key: 'DC',
              displayTextValue: 'District Of Columbia',
            },
            {
              key: 'FM',
              displayTextValue: 'Federated States Of Micronesia',
            },
            {
              key: 'FL',
              displayTextValue: 'Florida',
            },
            {
              key: 'GA',
              displayTextValue: 'Georgia',
            },
            {
              key: 'GU',
              displayTextValue: 'Guam',
            },
            {
              key: 'HI',
              displayTextValue: 'Hawaii',
            },
            {
              key: 'ID',
              displayTextValue: 'Idaho',
            },
            {
              key: 'IL',
              displayTextValue: 'Illinois',
            },
            {
              key: 'IN',
              displayTextValue: 'Indiana',
            },
            {
              key: 'IA',
              displayTextValue: 'Iowa',
            },
            {
              key: 'KS',
              displayTextValue: 'Kansas',
            },
            {
              key: 'KY',
              displayTextValue: 'Kentucky',
            },
            {
              key: 'LA',
              displayTextValue: 'Louisiana',
            },
            {
              key: 'ME',
              displayTextValue: 'Maine',
            },
            {
              key: 'MH',
              displayTextValue: 'Marshall Islands',
            },
            {
              key: 'MD',
              displayTextValue: 'Maryland',
            },
            {
              key: 'MA',
              displayTextValue: 'Massachusetts',
            },
            {
              key: 'MI',
              displayTextValue: 'Michigan',
            },
            {
              key: 'MN',
              displayTextValue: 'Minnesota',
            },
            {
              key: 'MS',
              displayTextValue: 'Mississippi',
            },
            {
              key: 'MO',
              displayTextValue: 'Missouri',
            },
            {
              key: 'MT',
              displayTextValue: 'Montana',
            },
            {
              key: 'NE',
              displayTextValue: 'Nebraska',
            },
            {
              key: 'NV',
              displayTextValue: 'Nevada',
            },
            {
              key: 'NH',
              displayTextValue: 'New Hampshire',
            },
            {
              key: 'NJ',
              displayTextValue: 'New Jersey',
            },
            {
              key: 'NM',
              displayTextValue: 'New Mexico',
            },
            {
              key: 'NY',
              displayTextValue: 'New York',
            },
            {
              key: 'NC',
              displayTextValue: 'North Carolina',
            },
            {
              key: 'ND',
              displayTextValue: 'North Dakota',
            },
            {
              key: 'MP',
              displayTextValue: 'Northern Mariana Islands',
            },
            {
              key: 'OH',
              displayTextValue: 'Ohio',
            },
            {
              key: 'OK',
              displayTextValue: 'Oklahoma',
            },
            {
              key: 'OR',
              displayTextValue: 'Oregon',
            },
            {
              key: 'PW',
              displayTextValue: 'Palau',
            },
            {
              key: 'PA',
              displayTextValue: 'Pennsylvania',
            },
            {
              key: 'PR',
              displayTextValue: 'Puerto Rico',
            },
            {
              key: 'RI',
              displayTextValue: 'Rhode Island',
            },
            {
              key: 'SC',
              displayTextValue: 'South Carolina',
            },
            {
              key: 'SD',
              displayTextValue: 'South Dakota',
            },
            {
              key: 'TN',
              displayTextValue: 'Tennessee',
            },
            {
              key: 'TX',
              displayTextValue: 'Texas',
            },
            {
              key: 'UT',
              displayTextValue: 'Utah',
            },
            {
              key: 'VT',
              displayTextValue: 'Vermont',
            },
            {
              key: 'VI',
              displayTextValue: 'Virgin Islands',
            },
            {
              key: 'VA',
              displayTextValue: 'Virginia',
            },
            {
              key: 'WA',
              displayTextValue: 'Washington',
            },
            {
              key: 'WV',
              displayTextValue: 'West Virginia',
            },
            {
              key: 'WI',
              displayTextValue: 'Wisconsin',
            },
            {
              key: 'WY',
              displayTextValue: 'Wyoming',
            },
          ],
        },
        className: 'flex-half',
      },
      {
        key: 'personalInformation.currentAddress.postalCode',
        type: 'nuverialTextInput',
        props: {
          type: 'text',
          label: 'Zip Code',
          required: true,
        },
        className: 'flex-quarter',
      },
      {
        key: 'personalInformation.currentAddress.postalCodeExtension',
        type: 'nuverialTextInput',
        props: {
          type: 'text',
          label: 'Ext. (Optional)',
        },
        className: 'flex-quarter',
      },
      {
        key: 'personalInformation.currentAddress.countryCode',
        type: 'nuverialSelect',
        props: {
          label: 'Country',
          required: true,
          colorTheme: 'primary',
          selectOptions: [
            {
              key: 'US',
              displayTextValue: 'United States',
            },
            {
              key: 'CA',
              displayTextValue: 'Canada',
            },
            {
              key: 'ME',
              displayTextValue: 'Mexico',
            },
          ],
        },
        className: 'flex-half',
      },
      {
        key: 'personalInformation.currentAddress.isMailingAddressDifferent',
        type: 'nuverialCheckbox',
        props: {
          label: 'Mailing address is different than current address',
          colorTheme: 'primary',
          fieldLabelPosition: 'after',
        },
        className: 'flex-full',
      },
      {
        key: 'nuverialSectionHeader1',
        type: 'nuverialSectionHeader',
        props: {
          label: 'Mailing Address',
        },
        className: 'flex-full',
        expressions: {
          hide: '!model.personalInformation?.currentAddress?.isMailingAddressDifferent',
        },
      },
      {
        key: 'personalInformation.mailingAddress.addressLine1',
        type: 'nuverialTextInput',
        props: {
          type: 'text',
          label: 'Address Line 1',
          required: true,
        },
        className: 'flex-half',
        expressions: {
          hide: '!model.personalInformation?.currentAddress?.isMailingAddressDifferent',
        },
      },
      {
        key: 'personalInformation.mailingAddress.addressLine2',
        type: 'nuverialTextInput',
        props: {
          type: 'text',
          label: 'Address Line 2 (optional)',
        },
        className: 'flex-half',
        expressions: {
          hide: '!model.personalInformation?.currentAddress?.isMailingAddressDifferent',
        },
      },
      {
        key: 'personalInformation.mailingAddress.city',
        type: 'nuverialTextInput',
        props: {
          type: 'text',
          label: 'City',
          required: true,
        },
        className: 'flex-half',
        expressions: {
          hide: '!model.personalInformation?.currentAddress?.isMailingAddressDifferent',
        },
      },
      {
        key: 'personalInformation.mailingAddress.stateCode',
        type: 'nuverialSelect',
        props: {
          label: 'State',
          required: true,
          colorTheme: 'primary',
          selectOptions: [
            {
              key: 'AL',
              displayTextValue: 'Alabama',
            },
            {
              key: 'AK',
              displayTextValue: 'Alaska',
            },
            {
              key: 'AS',
              displayTextValue: 'American Samoa',
            },
            {
              key: 'AZ',
              displayTextValue: 'Arizona',
            },
            {
              key: 'AR',
              displayTextValue: 'Arkansas',
            },
            {
              key: 'CA',
              displayTextValue: 'California',
            },
            {
              key: 'CO',
              displayTextValue: 'Colorado',
            },
            {
              key: 'CT',
              displayTextValue: 'Connecticut',
            },
            {
              key: 'DE',
              displayTextValue: 'Delaware',
            },
            {
              key: 'DC',
              displayTextValue: 'District Of Columbia',
            },
            {
              key: 'FM',
              displayTextValue: 'Federated States Of Micronesia',
            },
            {
              key: 'FL',
              displayTextValue: 'Florida',
            },
            {
              key: 'GA',
              displayTextValue: 'Georgia',
            },
            {
              key: 'GU',
              displayTextValue: 'Guam',
            },
            {
              key: 'HI',
              displayTextValue: 'Hawaii',
            },
            {
              key: 'ID',
              displayTextValue: 'Idaho',
            },
            {
              key: 'IL',
              displayTextValue: 'Illinois',
            },
            {
              key: 'IN',
              displayTextValue: 'Indiana',
            },
            {
              key: 'IA',
              displayTextValue: 'Iowa',
            },
            {
              key: 'KS',
              displayTextValue: 'Kansas',
            },
            {
              key: 'KY',
              displayTextValue: 'Kentucky',
            },
            {
              key: 'LA',
              displayTextValue: 'Louisiana',
            },
            {
              key: 'ME',
              displayTextValue: 'Maine',
            },
            {
              key: 'MH',
              displayTextValue: 'Marshall Islands',
            },
            {
              key: 'MD',
              displayTextValue: 'Maryland',
            },
            {
              key: 'MA',
              displayTextValue: 'Massachusetts',
            },
            {
              key: 'MI',
              displayTextValue: 'Michigan',
            },
            {
              key: 'MN',
              displayTextValue: 'Minnesota',
            },
            {
              key: 'MS',
              displayTextValue: 'Mississippi',
            },
            {
              key: 'MO',
              displayTextValue: 'Missouri',
            },
            {
              key: 'MT',
              displayTextValue: 'Montana',
            },
            {
              key: 'NE',
              displayTextValue: 'Nebraska',
            },
            {
              key: 'NV',
              displayTextValue: 'Nevada',
            },
            {
              key: 'NH',
              displayTextValue: 'New Hampshire',
            },
            {
              key: 'NJ',
              displayTextValue: 'New Jersey',
            },
            {
              key: 'NM',
              displayTextValue: 'New Mexico',
            },
            {
              key: 'NY',
              displayTextValue: 'New York',
            },
            {
              key: 'NC',
              displayTextValue: 'North Carolina',
            },
            {
              key: 'ND',
              displayTextValue: 'North Dakota',
            },
            {
              key: 'MP',
              displayTextValue: 'Northern Mariana Islands',
            },
            {
              key: 'OH',
              displayTextValue: 'Ohio',
            },
            {
              key: 'OK',
              displayTextValue: 'Oklahoma',
            },
            {
              key: 'OR',
              displayTextValue: 'Oregon',
            },
            {
              key: 'PW',
              displayTextValue: 'Palau',
            },
            {
              key: 'PA',
              displayTextValue: 'Pennsylvania',
            },
            {
              key: 'PR',
              displayTextValue: 'Puerto Rico',
            },
            {
              key: 'RI',
              displayTextValue: 'Rhode Island',
            },
            {
              key: 'SC',
              displayTextValue: 'South Carolina',
            },
            {
              key: 'SD',
              displayTextValue: 'South Dakota',
            },
            {
              key: 'TN',
              displayTextValue: 'Tennessee',
            },
            {
              key: 'TX',
              displayTextValue: 'Texas',
            },
            {
              key: 'UT',
              displayTextValue: 'Utah',
            },
            {
              key: 'VT',
              displayTextValue: 'Vermont',
            },
            {
              key: 'VI',
              displayTextValue: 'Virgin Islands',
            },
            {
              key: 'VA',
              displayTextValue: 'Virginia',
            },
            {
              key: 'WA',
              displayTextValue: 'Washington',
            },
            {
              key: 'WV',
              displayTextValue: 'West Virginia',
            },
            {
              key: 'WI',
              displayTextValue: 'Wisconsin',
            },
            {
              key: 'WY',
              displayTextValue: 'Wyoming',
            },
          ],
        },
        className: 'flex-half',
        expressions: {
          hide: '!model.personalInformation?.currentAddress?.isMailingAddressDifferent',
        },
      },
      {
        key: 'personalInformation.mailingAddress.postalCode',
        type: 'nuverialTextInput',
        props: {
          type: 'text',
          label: 'Zip Code',
          required: true,
        },
        className: 'flex-quarter',
        expressions: {
          hide: '!model.personalInformation?.currentAddress?.isMailingAddressDifferent',
        },
      },
      {
        key: 'personalInformation.mailingAddress.postalCodeExtension',
        type: 'nuverialTextInput',
        props: {
          type: 'text',
          label: 'Ext. (Optional)',
        },
        className: 'flex-quarter',
        expressions: {
          hide: '!model.personalInformation?.currentAddress?.isMailingAddressDifferent',
        },
      },
      {
        key: 'personalInformation.mailingAddress.countryCode',
        type: 'nuverialSelect',
        props: {
          label: 'Country',
          required: true,
          colorTheme: 'primary',
          selectOptions: [
            {
              key: 'US',
              displayTextValue: 'United States',
            },
            {
              key: 'CA',
              displayTextValue: 'Canada',
            },
            {
              key: 'ME',
              displayTextValue: 'Mexico',
            },
          ],
        },
        className: 'flex-half',
        expressions: {
          hide: '!model.personalInformation?.currentAddress?.isMailingAddressDifferent',
        },
      },
    ],
  },
  {
    key: 'employmentInformation',
    type: 'panel',
    label: 'Page 2',
    props: {
      label: 'Employment Information',
    },
    title: 'Employment Information',
    components: [
      {
        key: 'employmentInformation.employmentStatus',
        type: 'nuverialSelect',
        props: {
          label: 'Employment Status',
          required: true,
          colorTheme: 'primary',
          selectOptions: [
            {
              key: 'employed',
              displayTextValue: 'Employed',
            },
            {
              key: 'selfEmployed',
              displayTextValue: 'Self-Employed',
            },
            {
              key: 'unemployed',
              displayTextValue: 'Unemployed',
            },
            {
              key: 'retired',
              displayTextValue: 'Retired',
            },
          ],
        },
        className: 'flex-half',
      },
      {
        key: 'nuverialSectionHeader2',
        type: 'nuverialSectionHeader',
        props: {
          label: 'Current Employer',
        },
        className: 'flex-full',
        expressions: {
          hide: "model.employmentInformation?.employmentStatus !== 'employed' && model.employmentInformation?.employmentStatus !== 'selfEmployed'",
        },
      },
      {
        key: 'nuverialSectionHeader3',
        type: 'nuverialSectionHeader',
        props: {
          label: 'Last Employer',
        },
        className: 'flex-full',
        expressions: {
          hide: "model.employmentInformation?.employmentStatus !== 'unemployed' && model.employmentInformation?.employmentStatus !== 'retired'",
        },
      },
      {
        key: 'employmentInformation.industry',
        type: 'nuverialSelect',
        props: {
          label: 'Industry of Employment',
          required: true,
          colorTheme: 'primary',
          selectOptions: [
            {
              key: 'accounting',
              displayTextValue: 'Accounting',
            },
            {
              key: 'administrationOfficeSupport',
              displayTextValue: 'Administration & Office Support',
            },
            {
              key: 'advertisingArtsMedia',
              displayTextValue: 'Advertising, Arts & Media',
            },
            {
              key: 'bankingFinancialServices',
              displayTextValue: 'Banking & Financial Services',
            },
            {
              key: 'callCenterCustomerService',
              displayTextValue: 'Call Center & Customer Service',
            },
            {
              key: 'communityServicesDevelopment',
              displayTextValue: 'Community Services & Development',
            },
            {
              key: 'construction',
              displayTextValue: 'Construction',
            },
            {
              key: 'consultingStrategy',
              displayTextValue: 'Consulting & Strategy',
            },
            {
              key: 'designArchitecture',
              displayTextValue: 'Design & Architecture',
            },
            {
              key: 'educationTraining',
              displayTextValue: 'Education & Training',
            },
            {
              key: 'engineering',
              displayTextValue: 'Engineering',
            },
            {
              key: 'farmingAnimalsConservation',
              displayTextValue: 'Farming, Animals & Conservation',
            },
            {
              key: 'governmentDefense',
              displayTextValue: 'Government & Defense',
            },
            {
              key: 'healthcareMedical',
              displayTextValue: 'Healthcare & Medical',
            },
            {
              key: 'hospitalityTourism',
              displayTextValue: 'Hospitality & Tourism',
            },
            {
              key: 'humanResourcesRecruitment',
              displayTextValue: 'Human Resources & Recruitment',
            },
            {
              key: 'informationCommunicationTechnology',
              displayTextValue: 'Information & Communication Technology',
            },
            {
              key: 'insuranceSuperannuation',
              displayTextValue: 'Insurance & Superannuation',
            },
            {
              key: 'legal',
              displayTextValue: 'Legal',
            },
            {
              key: 'manufacturingTransportLogistics',
              displayTextValue: 'Manufacturing, Transport & Logistics',
            },
            {
              key: 'marketingCommunications',
              displayTextValue: 'Marketing & Communications',
            },
            {
              key: 'miningResourcesEnergy',
              displayTextValue: 'Mining, Resources & Energy',
            },
            {
              key: 'realEstateProperty',
              displayTextValue: 'Real Estate & Property',
            },
            {
              key: 'retailConsumerProducts',
              displayTextValue: 'Retail & Consumer Products',
            },
            {
              key: 'sales',
              displayTextValue: 'Sales',
            },
            {
              key: 'scienceTechnology',
              displayTextValue: 'Science & Technology',
            },
            {
              key: 'sportsRecreation',
              displayTextValue: 'Sports & Recreation',
            },
            {
              key: 'tradesServices',
              displayTextValue: 'Trades & Services',
            },
            {
              key: 'other',
              displayTextValue: 'Other',
            },
          ],
        },
        className: 'flex-half',
        expressions: {
          hide: '!model.employmentInformation?.employmentStatus',
        },
      },
      {
        key: 'employmentInformation.jobTitle',
        type: 'nuverialTextInput',
        props: {
          type: 'text',
          label: 'Job Title',
          required: true,
        },
        className: 'flex-half',
        expressions: {
          hide: '!model.employmentInformation?.employmentStatus',
        },
      },
      {
        key: 'employmentInformation.employerName',
        type: 'nuverialTextInput',
        props: {
          type: 'text',
          label: 'Employer Name',
          required: true,
        },
        className: 'flex-half',
        expressions: {
          hide: '!model.employmentInformation?.employmentStatus',
        },
      },
      {
        key: 'employmentInformation.phoneNumber',
        type: 'nuverialTextInput',
        props: {
          mask: '(000) 000-0000',
          type: 'tel',
          label: 'Employer Phone Number',
          maxLength: 10,
          minLength: 10,
        },
        className: 'flex-half',
        expressions: {
          hide: '!model.employmentInformation?.employmentStatus',
        },
      },
    ],
  },
  {
    key: 'documents',
    type: 'panel',
    label: 'Page 4',
    props: {
      label: 'Documents',
    },
    title: 'Documents',
    components: [
      {
        key: 'proofOfIncome',
        type: 'nuverialFileUpload',
        props: {
          label: 'Proof of Income/Tax',
        },
        components: [
          {
            key: 'documents.proofOfIncome',
          },
        ],
      },
    ],
  },
];

export const FormioConfigurationMockDocuments = [
  {
    key: 'documents',
    type: 'panel',
    input: true,
    label: 'Page 3',
    props: {
      label: 'Documents',
    },
    title: 'Documents',
    components: [
      {
        key: 'photoId',
        type: 'nuverialFileUpload',
        input: true,
        props: {
          label: 'Photo ID',
          content:
            '<p>Acceptable documents: US Passport, foreign passport, NYS driver license, marriage certificate from State, divorce Decree from State, and US birth certificate.</p><p>Make sure the image is not blurry.</p>',
        },
        className: 'flex-full',
        components: [
          {
            key: 'documents.idFront',
            input: true,
            props: {
              label: 'Front of ID',
            },
            document: true,
          },
          {
            key: 'documents.idBack',
            input: true,
            props: {
              label: 'Back of ID',
            },
            document: true,
          },
        ],
      },
      {
        key: 'proofOfResidency',
        type: 'nuverialFileUpload',
        input: true,
        props: {
          label: 'Proof of Residency',
          content:
            '<p>Acceptable documents: drivers license, utility bill, letter from government, tax letter confirming address, and mortgage, lease, or rental agreement.</p><p>Make sure the image is not blurry.</p>',
        },
        className: 'flex-full',
        components: [
          {
            key: 'documents.proofOfResidency',
            input: true,
            document: true,
          },
        ],
      },
      {
        key: 'proofOfIncome',
        type: 'nuverialFileUpload',
        input: true,
        props: {
          label: 'Proof of Income/Tax',
          content: '<p>Acceptable documents: tax return, employment letter, pay stubs, W-2 form.</p><p>Make sure the image is not blurry.</p>',
        },
        className: 'flex-full',
        components: [
          {
            key: 'documents.proofOfIncome',
            input: true,
            document: true,
          },
        ],
      },
    ],
  },
];

export const FormioConfigurationTestMock = [
  {
    key: 'personalInformation',
    type: 'panel',
    input: true,
    label: 'Page 1',
    props: {
      label: 'Personal Information',
    },
    title: 'Personal Information',
    components: [
      {
        key: 'personalInformation.firstName',
        type: 'nuverialTextInput',
        input: true,
        props: {
          type: 'text',
          label: 'First Name',
          required: true,
          autocomplete: 'given-name',
        },
        className: 'flex-half',
      },
      {
        key: 'personalInformation.middleName',
        type: 'nuverialTextInput',
        input: true,
        props: {
          type: 'text',
          autocomplete: 'additional-name',
        },
        className: 'flex-half',
      },
      {
        key: 'personalInformation.lastName',
        type: 'nuverialTextInput',
        input: true,
        props: {
          type: 'text',
          label: 'Last Name',
          required: true,
          autocomplete: 'family-name',
        },
        className: 'flex-half',
      },
      {
        key: 'personalInformation.currentAddress',
        type: 'nuverialAddress',
        input: true,
        props: {
          label: 'Current Address',
        },
        className: 'flex-full',
        components: [
          {
            key: 'personalInformation.currentAddress.addressLine1',
            input: true,
            props: {
              label: 'Address Line 1',
              required: true,
            },
          },
          {
            key: 'personalInformation.currentAddress.addressLine2',
            input: true,
            props: {
              label: 'Address Line 2 (optional)',
            },
          },
          {
            key: 'personalInformation.currentAddress.city',
            input: true,
            props: {
              label: 'City',
              required: true,
            },
          },
          {
            key: 'personalInformation.currentAddress.stateCode',
            input: true,
            props: {
              label: 'State',
              required: true,
              selectOptions: [
                {
                  key: 'AL',
                  displayTextValue: 'Alabama',
                },
                {
                  key: 'AK',
                  displayTextValue: 'Alaska',
                },
                {
                  key: 'AS',
                  displayTextValue: 'American Samoa',
                },
              ],
            },
          },
          {
            key: 'personalInformation.currentAddress.postalCode',
            input: true,
            props: {
              label: 'Zip Code',
              required: true,
            },
          },
          {
            key: 'personalInformation.currentAddress.postalCodeExtension',
            input: true,
            props: {
              label: 'Ext. (Optional)',
            },
          },
          {
            key: 'personalInformation.currentAddress.countryCode',
            input: true,
            props: {
              label: 'Country',
              required: true,
              selectOptions: [
                {
                  key: 'US',
                  displayTextValue: 'United States',
                },
                {
                  key: 'CA',
                  displayTextValue: 'Canada',
                },
                {
                  key: 'MX',
                  displayTextValue: 'Mexico',
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    key: 'documents',
    type: 'panel',
    input: true,
    label: 'Page 3',
    props: {
      label: 'Documents',
    },
    title: 'Documents',
    components: [
      {
        key: 'photoId',
        type: 'nuverialFileUpload',
        input: true,
        props: {
          label: 'Photo ID',
          content:
            '<p>Acceptable documents: US Passport, foreign passport, NYS driver license, marriage certificate from State, divorce Decree from State, and US birth certificate.</p><p>Make sure the image is not blurry.</p>',
        },
        className: 'flex-full',
        components: [
          {
            key: 'documents.idFront',
            input: true,
            props: {
              label: 'Front of ID',
              required: true,
            },
            document: true,
          },
          {
            key: 'documents.idBack',
            input: true,
            props: {
              label: 'Back of ID',
              required: true,
            },
            document: true,
          },
        ],
      },
      {
        key: 'proofOfIncome',
        type: 'nuverialFileUpload',
        input: true,
        props: {
          label: 'Proof of Income/Tax',
          content: '<p>Acceptable documents: tax return, employment letter, pay stubs, W-2 form.</p><p>Make sure the image is not blurry.</p>',
        },
        className: 'flex-full',
        components: [
          {
            key: 'documents.proofOfIncome',
            input: true,
            props: {
              required: true,
            },
            document: true,
          },
        ],
      },
    ],
  },
];

export const FormlyConfigurationTestMock = [
  {
    fieldGroup: [
      {
        key: 'personalInformation.firstName',
        type: 'nuverialTextInput',
        input: true,
        props: {
          type: 'text',
          label: 'First Name',
          required: true,
          autocomplete: 'given-name',
        },
        className: 'flex-half',
      },
      {
        key: 'personalInformation.middleName',
        type: 'nuverialTextInput',
        input: true,
        props: {
          type: 'text',
          autocomplete: 'additional-name',
        },
        className: 'flex-half',
      },
      {
        key: 'personalInformation.lastName',
        type: 'nuverialTextInput',
        input: true,
        props: {
          type: 'text',
          label: 'Last Name',
          required: true,
          autocomplete: 'family-name',
        },
        className: 'flex-half',
      },
      {
        key: 'personalInformation.currentAddress',
        type: 'nuverialAddress',
        input: true,
        props: {
          label: 'Current Address',
        },
        className: 'flex-full',
        fieldGroup: [
          {
            key: 'personalInformation.currentAddress.addressLine1',
            input: true,
            props: {
              label: 'Address Line 1',
              required: true,
            },
          },
          {
            key: 'personalInformation.currentAddress.addressLine2',
            input: true,
            props: {
              label: 'Address Line 2 (optional)',
            },
          },
          {
            key: 'personalInformation.currentAddress.city',
            input: true,
            props: {
              label: 'City',
              required: true,
            },
          },
          {
            key: 'personalInformation.currentAddress.stateCode',
            input: true,
            props: {
              label: 'State',
              required: true,
              selectOptions: [
                {
                  key: 'AL',
                  displayTextValue: 'Alabama',
                },
                {
                  key: 'AK',
                  displayTextValue: 'Alaska',
                },
                {
                  key: 'AS',
                  displayTextValue: 'American Samoa',
                },
              ],
            },
          },
          {
            key: 'personalInformation.currentAddress.postalCode',
            input: true,
            props: {
              label: 'Zip Code',
              required: true,
            },
          },
          {
            key: 'personalInformation.currentAddress.postalCodeExtension',
            input: true,
            props: {
              label: 'Ext. (Optional)',
            },
          },
          {
            key: 'personalInformation.currentAddress.countryCode',
            input: true,
            props: {
              label: 'Country',
              required: true,
              selectOptions: [
                {
                  key: 'US',
                  displayTextValue: 'United States',
                },
                {
                  key: 'CA',
                  displayTextValue: 'Canada',
                },
                {
                  key: 'MX',
                  displayTextValue: 'Mexico',
                },
              ],
            },
          },
        ],
      },
    ],
    props: {
      label: 'Personal Information',
      stepKey: 'personalInformation',
    },
  },
  {
    fieldGroup: [
      {
        key: 'photoId',
        type: 'nuverialFileUpload',
        input: true,
        props: {
          label: 'Photo ID',
          content:
            '<p>Acceptable documents: US Passport, foreign passport, NYS driver license, marriage certificate from State, divorce Decree from State, and US birth certificate.</p><p>Make sure the image is not blurry.</p>',
        },
        className: 'flex-full',
        fieldGroup: [
          {
            key: 'documents.idFront',
            input: true,
            props: {
              label: 'Front of ID',
              required: true,
            },
            document: true,
          },
          {
            key: 'documents.idBack',
            input: true,
            props: {
              label: 'Back of ID',
              required: true,
            },
            document: true,
          },
        ],
      },
      {
        key: 'proofOfIncome',
        type: 'nuverialFileUpload',
        input: true,
        props: {
          label: 'Proof of Income/Tax',
          content: '<p>Acceptable documents: tax return, employment letter, pay stubs, W-2 form.</p><p>Make sure the image is not blurry.</p>',
        },
        className: 'flex-full',
        fieldGroup: [
          {
            key: 'documents.proofOfIncome',
            input: true,
            props: {
              required: true,
            },
            document: true,
          },
        ],
      },
    ],
    props: {
      label: 'Documents',
      stepKey: 'documents',
    },
  },
];

export const UglyFormioConfigurationTestMock = [
  {
    key: 'personalInformation',
    type: 'panel',
    input: true,
    label: 'Page 1',
    props: {
      label: 'Personal Information',
    },
    title: 'Personal Information',
    components: [
      {
        key: 'personalInformation.firstName',
        type: 'nuverialTextInput',
        input: true,
        props: {
          type: 'text',
          label: 'First Name',
          required: true,
          autocomplete: 'given-name',
        },
        className: 'flex-half',
        placeholder: '',
        prefix: '',
        customClass: '',
        suffix: '',
        multiple: false,
        defaultValue: null,
        protected: false,
        unique: false,
        persistent: true,
        hidden: false,
        clearOnHide: true,
        refreshOn: '',
        redrawOn: '',
        tableView: false,
        modalEdit: false,
        label: '',
        dataGridLabel: false,
        labelPosition: 'top',
        description: '',
        errorLabel: '',
        tooltip: '',
        hideLabel: false,
        tabindex: '',
        disabled: false,
        autofocus: false,
        dbIndex: false,
        customDefaultValue: '',
        calculateValue: '',
        calculateServer: false,
        widget: {
          type: 'input',
        },
        attributes: {},
        validateOn: 'change',
        validate: {
          required: false,
          custom: '',
          customPrivate: false,
          strictDateValidation: false,
          multiple: false,
          unique: false,
        },
        conditional: {
          show: null,
          when: null,
          eq: '',
        },
        overlay: {
          style: '',
          left: '',
          top: '',
          width: '',
          height: '',
        },
        allowCalculateOverride: false,
        encrypted: false,
        showCharCount: false,
        showWordCount: false,
        properties: {},
        allowMultipleMasks: false,
        addons: [],
        id: 'et9nyska',
      },
      {
        key: 'personalInformation.middleName',
        type: 'nuverialTextInput',
        input: true,
        props: {
          type: 'text',
          autocomplete: 'additional-name',
        },
        className: 'flex-half',
        tableView: false,
        label: '',
        placeholder: '',
        prefix: '',
        customClass: '',
        suffix: '',
        multiple: false,
        defaultValue: null,
        protected: false,
        unique: false,
        persistent: true,
        hidden: false,
        clearOnHide: true,
        refreshOn: '',
        redrawOn: '',
        modalEdit: false,
        dataGridLabel: false,
        labelPosition: 'top',
        description: '',
        errorLabel: '',
        tooltip: '',
        hideLabel: false,
        tabindex: '',
        disabled: false,
        autofocus: false,
        dbIndex: false,
        customDefaultValue: '',
        calculateValue: '',
        calculateServer: false,
        widget: {
          type: 'input',
        },
        attributes: {},
        validateOn: 'change',
        validate: {
          required: false,
          custom: '',
          customPrivate: false,
          strictDateValidation: false,
          multiple: false,
          unique: false,
        },
        conditional: {
          show: null,
          when: null,
          eq: '',
        },
        overlay: {
          style: '',
          left: '',
          top: '',
          width: '',
          height: '',
        },
        allowCalculateOverride: false,
        encrypted: false,
        showCharCount: false,
        showWordCount: false,
        properties: {},
        allowMultipleMasks: false,
        addons: [],
        id: 'e3gh67j',
      },
      {
        key: 'personalInformation.lastName',
        type: 'nuverialTextInput',
        input: true,
        props: {
          type: 'text',
          label: 'Last Name',
          required: true,
          autocomplete: 'family-name',
        },
        className: 'flex-half',
        placeholder: '',
        prefix: '',
        customClass: '',
        suffix: '',
        multiple: false,
        defaultValue: null,
        protected: false,
        unique: false,
        persistent: true,
        hidden: false,
        clearOnHide: true,
        refreshOn: '',
        redrawOn: '',
        tableView: false,
        modalEdit: false,
        label: '',
        dataGridLabel: false,
        labelPosition: 'top',
        description: '',
        errorLabel: '',
        tooltip: '',
        hideLabel: false,
        tabindex: '',
        disabled: false,
        autofocus: false,
        dbIndex: false,
        customDefaultValue: '',
        calculateValue: '',
        calculateServer: false,
        widget: {
          type: 'input',
        },
        attributes: {},
        validateOn: 'change',
        validate: {
          required: false,
          custom: '',
          customPrivate: false,
          strictDateValidation: false,
          multiple: false,
          unique: false,
        },
        conditional: {
          show: null,
          when: null,
          eq: '',
        },
        overlay: {
          style: '',
          left: '',
          top: '',
          width: '',
          height: '',
        },
        allowCalculateOverride: false,
        encrypted: false,
        showCharCount: false,
        showWordCount: false,
        properties: {},
        allowMultipleMasks: false,
        addons: [],
        id: 'evhgpk6',
      },
      {
        key: 'personalInformation.currentAddress',
        type: 'nuverialAddress',
        input: true,
        props: {
          label: 'Current Address',
        },
        className: 'flex-full',
        components: [
          {
            key: 'personalInformation.currentAddress.addressLine1',
            input: true,
            props: {
              label: 'Address Line 1',
              required: true,
            },
            initialValues: {
              key: 'addressLine1',
            },
          },
          {
            key: 'personalInformation.currentAddress.addressLine2',
            input: true,
            props: {
              label: 'Address Line 2 (optional)',
            },
            initialValues: {
              key: 'addressLine2',
            },
          },
          {
            key: 'personalInformation.currentAddress.city',
            input: true,
            props: {
              label: 'City',
              required: true,
            },
            initialValues: {
              key: 'city',
            },
          },
          {
            key: 'personalInformation.currentAddress.stateCode',
            input: true,
            props: {
              label: 'State',
              required: true,
              selectOptions: [
                {
                  key: 'AL',
                  displayTextValue: 'Alabama',
                  selected: false,
                },
                {
                  key: 'AK',
                  displayTextValue: 'Alaska',
                  selected: false,
                },
                {
                  key: 'AS',
                  displayTextValue: 'American Samoa',
                  selected: false,
                },
              ],
            },
            initialValues: {
              key: 'stateCode',
            },
          },
          {
            key: 'personalInformation.currentAddress.postalCode',
            input: true,
            props: {
              label: 'Zip Code',
              required: true,
            },
            initialValues: {
              key: 'postalCode',
            },
          },
          {
            key: 'personalInformation.currentAddress.postalCodeExtension',
            input: true,
            props: {
              label: 'Ext. (Optional)',
            },
            initialValues: {
              key: 'postalCodeExtension',
            },
          },
          {
            key: 'personalInformation.currentAddress.countryCode',
            input: true,
            props: {
              label: 'Country',
              required: true,
              selectOptions: [
                {
                  key: 'US',
                  displayTextValue: 'United States',
                  selected: false,
                },
                {
                  key: 'CA',
                  displayTextValue: 'Canada',
                  selected: false,
                },
                {
                  key: 'MX',
                  displayTextValue: 'Mexico',
                  selected: false,
                },
              ],
            },
            initialValues: {
              key: 'countryCode',
            },
          },
        ],
        placeholder: '',
        prefix: '',
        customClass: '',
        suffix: '',
        multiple: false,
        defaultValue: null,
        protected: false,
        unique: false,
        persistent: true,
        hidden: false,
        clearOnHide: true,
        refreshOn: '',
        redrawOn: '',
        tableView: false,
        modalEdit: false,
        label: '',
        dataGridLabel: false,
        labelPosition: 'top',
        description: '',
        errorLabel: '',
        tooltip: '',
        hideLabel: false,
        tabindex: '',
        disabled: false,
        autofocus: false,
        dbIndex: false,
        customDefaultValue: '',
        calculateValue: '',
        calculateServer: false,
        widget: {
          type: 'input',
        },
        attributes: {},
        validateOn: 'change',
        validate: {
          required: false,
          custom: '',
          customPrivate: false,
          strictDateValidation: false,
          multiple: false,
          unique: false,
        },
        conditional: {
          show: null,
          when: null,
          eq: '',
        },
        overlay: {
          style: '',
          left: '',
          top: '',
          width: '',
          height: '',
        },
        allowCalculateOverride: false,
        encrypted: false,
        showCharCount: false,
        showWordCount: false,
        properties: {},
        allowMultipleMasks: false,
        addons: [],
        id: 'e3rj9ar',
      },
    ],
    id: 'eld4n2g',
  },
  {
    key: 'documents',
    type: 'panel',
    input: true,
    label: 'Page 3',
    props: {
      label: 'Documents',
    },
    title: 'Documents',
    components: [
      {
        key: 'photoId',
        type: 'nuverialFileUpload',
        input: true,
        props: {
          label: 'Photo ID',
          content:
            '<p>Acceptable documents: US Passport, foreign passport, NYS driver license, marriage certificate from State, divorce Decree from State, and US birth certificate.</p><p>Make sure the image is not blurry.</p>',
        },
        className: 'flex-full',
        components: [
          {
            key: 'documents.idFront',
            input: true,
            props: {
              label: 'Front of ID',
              required: true,
            },
            document: true,
          },
          {
            key: 'documents.idBack',
            input: true,
            props: {
              label: 'Back of ID',
              required: true,
            },
            document: true,
          },
        ],
        placeholder: '',
        prefix: '',
        customClass: '',
        suffix: '',
        multiple: false,
        defaultValue: null,
        protected: false,
        unique: false,
        persistent: true,
        hidden: false,
        clearOnHide: true,
        refreshOn: '',
        redrawOn: '',
        tableView: false,
        modalEdit: false,
        label: '',
        dataGridLabel: false,
        labelPosition: 'top',
        description: '',
        errorLabel: '',
        tooltip: '',
        hideLabel: false,
        tabindex: '',
        disabled: false,
        autofocus: false,
        dbIndex: false,
        customDefaultValue: '',
        calculateValue: '',
        calculateServer: false,
        widget: {
          type: 'input',
        },
        attributes: {},
        validateOn: 'change',
        validate: {
          required: false,
          custom: '',
          customPrivate: false,
          strictDateValidation: false,
          multiple: false,
          unique: false,
        },
        conditional: {
          show: null,
          when: null,
          eq: '',
        },
        overlay: {
          style: '',
          left: '',
          top: '',
          width: '',
          height: '',
        },
        allowCalculateOverride: false,
        encrypted: false,
        showCharCount: false,
        showWordCount: false,
        properties: {},
        allowMultipleMasks: false,
        addons: [],
        id: 'ecyj8m',
      },
      {
        key: 'proofOfIncome',
        type: 'nuverialFileUpload',
        input: true,
        props: {
          label: 'Proof of Income/Tax',
          content: '<p>Acceptable documents: tax return, employment letter, pay stubs, W-2 form.</p><p>Make sure the image is not blurry.</p>',
        },
        className: 'flex-full',
        components: [
          {
            key: 'documents.proofOfIncome',
            input: true,
            props: {
              required: true,
            },
            document: true,
          },
        ],
        placeholder: '',
        prefix: '',
        customClass: '',
        suffix: '',
        multiple: false,
        defaultValue: null,
        protected: false,
        unique: false,
        persistent: true,
        hidden: false,
        clearOnHide: true,
        refreshOn: '',
        redrawOn: '',
        tableView: false,
        modalEdit: false,
        label: '',
        dataGridLabel: false,
        labelPosition: 'top',
        description: '',
        errorLabel: '',
        tooltip: '',
        hideLabel: false,
        tabindex: '',
        disabled: false,
        autofocus: false,
        dbIndex: false,
        customDefaultValue: '',
        calculateValue: '',
        calculateServer: false,
        widget: {
          type: 'input',
        },
        attributes: {},
        validateOn: 'change',
        validate: {
          required: false,
          custom: '',
          customPrivate: false,
          strictDateValidation: false,
          multiple: false,
          unique: false,
        },
        conditional: {
          show: null,
          when: null,
          eq: '',
        },
        overlay: {
          style: '',
          left: '',
          top: '',
          width: '',
          height: '',
        },
        allowCalculateOverride: false,
        encrypted: false,
        showCharCount: false,
        showWordCount: false,
        properties: {},
        allowMultipleMasks: false,
        addons: [],
        id: 'ecp8dieu',
      },
    ],
    id: 'emcb8d7',
  },
] as unknown as IFormConfigurationSchema[];

export const NestedFormListFormComponents: IFormConfigurationSchema[] = [
  {
    key: 'buildings',
    type: 'nuverialFormList',
    input: true,
    label: 'Complexes',
    props: {
      label: 'Complexes',
    },
    className: 'flex-full',
    components: [
      {
        key: 'building',
        type: 'nuverialTextInput',
        input: true,
        props: {
          type: 'text',
          label: 'Complex Name',
        },
        className: 'flex-half',
      },
      {
        props: {
          label: 'Addresses',
        },
        label: 'Addresses',
        className: 'flex-full',
        key: 'addressList',
        type: 'nuverialFormList',
        input: true,
        customClass: 'nested-component',
        keyContextProvider: true,
        components: [
          {
            props: {
              label: 'add1',
              type: 'text',
            },
            className: 'flex-half',
            key: 'addressLine1',
            input: true,
            type: 'nuverialTextInput',
          },
        ],
      },
    ],
    customClass: 'nested-component',
    keyContextProvider: true,
  },
];
