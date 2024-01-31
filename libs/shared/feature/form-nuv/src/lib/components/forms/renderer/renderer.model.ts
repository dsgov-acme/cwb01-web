import { FormlyFormOptions } from '@ngx-formly/core';

export enum FormStateMode {
  Edit = 'edit',
  Review = 'review',
}

export enum FormStateStepperMode {
  Edit = 'edit',
  Review = 'review',
}

export enum FormStateWorkflow {
  AdminBuilder = 'admin-builder',
  PublicPortal = 'public-portal',
  AgencyDetails = 'agency-details',
}

export interface NuvalenceFormRendererOptions extends FormlyFormOptions {
  formState: {
    mode: FormStateMode;
    stepperMode: FormStateStepperMode;
    workflow: FormStateWorkflow;
  };
}
export const AdminBuilderIntakeRendererOptions: NuvalenceFormRendererOptions = {
  formState: {
    mode: FormStateMode.Edit,
    stepperMode: FormStateStepperMode.Edit,
    workflow: FormStateWorkflow.AdminBuilder,
  },
};

export const AdminBuilderReviewRendererOptions: NuvalenceFormRendererOptions = {
  formState: {
    mode: FormStateMode.Review,
    stepperMode: FormStateStepperMode.Review,
    workflow: FormStateWorkflow.AdminBuilder,
  },
};

export const PublicPortalIntakeRendererOptions: NuvalenceFormRendererOptions = {
  formState: {
    mode: FormStateMode.Edit,
    stepperMode: FormStateStepperMode.Edit,
    workflow: FormStateWorkflow.PublicPortal,
  },
};

export const PublicPortalReviewRendererOptions: NuvalenceFormRendererOptions = {
  formState: {
    mode: FormStateMode.Review,
    stepperMode: FormStateStepperMode.Review,
    workflow: FormStateWorkflow.PublicPortal,
  },
};

export const AgencyDetailsIntakeRendererOptions: NuvalenceFormRendererOptions = {
  formState: {
    mode: FormStateMode.Review,
    stepperMode: FormStateStepperMode.Review,
    workflow: FormStateWorkflow.AgencyDetails,
  },
};

export const AgencyDetailsReviewRendererOptions: NuvalenceFormRendererOptions = {
  formState: {
    mode: FormStateMode.Review,
    stepperMode: FormStateStepperMode.Review,
    workflow: FormStateWorkflow.AgencyDetails,
  },
};
