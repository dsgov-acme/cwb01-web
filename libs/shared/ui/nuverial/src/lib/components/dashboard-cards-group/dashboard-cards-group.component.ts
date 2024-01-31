import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The Dashboard Card Group is a container component to group and display the Dashboard Cards
 * in a grid layout
 *
 * Usage
 *
 *	<nuverial-dashboard-cards-group>
 *		<ng-container *ngFor="let card of cards | async; trackBy: trackByFn">
 *			<nuverial-dashboard-card
 *				[description]="card.description"[icon]="card.icon"
 *				[name]="card.name"
 *				[route]="card.route"[tooltip]="card.name"
 *			></nuverial-dashboard-card>
 *		</ng-container>
 *	</nuverial-dashboard-cards-group>
 */

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  selector: 'nuverial-dashboard-cards-group',
  standalone: true,
  styleUrls: ['./dashboard-cards-group.component.scss'],
  templateUrl: './dashboard-cards-group.component.html',
})
export class NuverialDashboardCardsGroupComponent {}
