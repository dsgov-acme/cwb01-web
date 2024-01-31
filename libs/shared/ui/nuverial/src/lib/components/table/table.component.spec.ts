import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { render } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { MockBuilder } from 'ng-mocks';
import { SplitCamelCasePipe } from '../../pipes';
import { NuverialButtonComponent } from '../button';
import { NuverialIconComponent } from '../icon';
import { NuverialSpinnerComponent } from '../spinner';
import { ITag, NuverialTagComponent } from '../tag';
import { NuverialTableComponent } from './table.component';
import { IDisplayedColumn, IPriorityColumn } from './table.model';

const dependencies = MockBuilder(NuverialTableComponent)
  .keep(MatPaginatorModule)
  .keep(NuverialSpinnerComponent)
  .keep(SplitCamelCasePipe)
  .keep(MatTableModule)
  .keep(MatSortModule)
  .mock(NuverialButtonComponent)
  .keep(NuverialIconComponent)
  .keep(NuverialTagComponent)
  .mock(Router)
  .mock(ActivatedRoute, {
    snapshot: {
      queryParams: convertToParamMap({
        pageNumber: 0,
        pageSize: 10,
        sortBy: 'priority',
        sortOrder: 'ASC',
      }),
      url: [{ path: 'tax-wage-requests' }],
    },
  } as any)
  .build();

const getFixture = async (props: Record<string, any>) => {
  const { fixture } = await render(NuverialTableComponent, {
    ...dependencies,
    componentInputs: { ...props },
  });

  return { fixture };
};

const MockDisplayedColumns: IDisplayedColumn[] = [
  { attributePath: 'priority', label: 'Priority', sortable: false, type: 'priority' },
  { attributePath: 'pill', label: 'Pill', sortable: false, type: 'pill' },
  { attributePath: 'icon', label: 'Icon', sortable: false, type: 'icon' },
  { attributePath: 'default', label: 'Default', sortable: false, type: 'default' },
];

const MockDataSource = new MatTableDataSource<{ priority: IPriorityColumn; pill: ITag; icon: string; default: string }>([
  {
    default: 'TestDefault',
    icon: 'chat',
    pill: {
      label: 'TestTag',
    },
    priority: {
      class: 'low',
      icon: 'remove',
      value: 'Low',
    },
  },
  {
    default: 'TestDefault',
    icon: 'chat',
    pill: {
      label: 'TestTag',
    },
    priority: {
      class: 'low',
      icon: 'remove',
      value: 'Low',
    },
  },
]);

describe('NuverialTableComponent', () => {
  it('should create empty', async () => {
    const { fixture } = await getFixture({});

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should create with data', async () => {
    const { fixture } = await getFixture({
      dataSourceTable: MockDataSource,
      displayedColumns: MockDisplayedColumns,
    });

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { fixture } = await getFixture({
        dataSourceTable: MockDataSource,
        displayedColumns: MockDisplayedColumns,
      });

      fixture.detectChanges();
      const axeResults = await axe(fixture.nativeElement);

      expect(axeResults).toHaveNoViolations();
    });
  });
});
