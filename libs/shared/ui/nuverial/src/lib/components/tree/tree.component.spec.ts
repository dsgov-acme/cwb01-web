import { ComponentFixture, TestBed } from '@angular/core/testing';
import { axe } from 'jest-axe';
import { NuverialTreeComponent } from './tree.component';

interface TreeNode {
  [key: string]: any;
  children: TreeNode[];
  disabled: boolean;
  icon?: string;
  key: string;
  label: string;
}

export const mockTree: TreeNode = {
  children: [
    {
      children: [
        {
          children: [],
          disabled: false,
          key: 'Child1a',
          label: 'Child1a',
        },
      ],
      disabled: false,
      key: 'Child1',
      label: 'Child1',
    },
    {
      children: [
        {
          children: [],
          disabled: false,
          key: 'OtherSchema',
          label: 'Other Schema',
        },
      ],
      disabled: false,
      key: 'OtherSchema',
      label: 'Other Schema',
    },
  ],
  disabled: false,
  key: 'Root',
  label: 'Root',
};

describe('NuverialTreeComponent', () => {
  let component: NuverialTreeComponent;
  let fixture: ComponentFixture<NuverialTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuverialTreeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NuverialTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const axeResults = await axe(fixture.nativeElement);
      expect(axeResults).toHaveNoViolations();
    });
  });

  describe('onSelect', () => {
    it('should emit the selected node', () => {
      component.root = mockTree;
      component.selectable = true;
      const spy = jest.spyOn(component.nodeSelected, 'emit');

      component.onSelect(component.root.children[0]);

      expect(spy).toHaveBeenCalledWith(component.root.children[0]);
    });

    it('should emit the key of the root node', () => {
      component.root = mockTree;
      component.selectable = true;
      const spy = jest.spyOn(component.nodeSelected, 'emit');

      component.onSelect(component.root);

      expect(spy).toHaveBeenCalledWith(component.root);
    });

    it('should return immediately if the tree is not selectable', () => {
      component.root = mockTree;
      component.selectable = false;
      const spy = jest.spyOn(component.nodeSelected, 'emit');

      component.onSelect(component.root);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('trackByFn', () => {
    it('should return the index', () => {
      expect(component.trackByFn(0)).toBe(0);
      expect(component.trackByFn(1)).toBe(1);
      expect(component.trackByFn(2)).toBe(2);
    });
  });
});
