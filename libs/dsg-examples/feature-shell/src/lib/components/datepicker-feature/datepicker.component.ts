import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { NuverialDatePickerComponent, NuverialDateRangePickerComponent, DateRangePickerControl } from '@dsg/shared/ui/nuverial';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule, NuverialDatePickerComponent, NuverialDateRangePickerComponent],
  selector: 'dsg-examples-datepicker',
  standalone: true,
  styleUrls: ['./datepicker.component.scss'],
  templateUrl: './datepicker.component.html',
})
export class ExampleDatePickerComponent implements OnInit {
  public formControl = new FormControl(new Date());
  public dateRangeControl = new FormControl<DateRangePickerControl>({ endDate: null, startDate: null });
  public datePickerModel = '';
  public minDate!: Date;
  public maxDate!: Date;

  public ngOnInit() {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear, 3, 1);
    this.maxDate = new Date(currentYear, 9, 31);
    this.formControl.setValue(new Date(currentYear, 1, 1));
  }
}
