import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { HasPermissionDirective } from '../../directives/has-permission.directive';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ButtonModule, CardModule, HasPermissionDirective],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {}