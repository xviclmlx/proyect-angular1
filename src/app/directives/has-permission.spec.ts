import { HasPermissionDirective } from './has-permission.directive';
import { TemplateRef, ViewContainerRef } from '@angular/core';
import { PermissionsService } from '../services/permissions.service';
import { Router } from '@angular/router';

describe('HasPermissionDirective', () => {
  it('should create an instance', () => {
    const mockTemplate = {} as TemplateRef<any>;
    const mockViewContainer = {} as ViewContainerRef;
    const mockPermissions = {} as PermissionsService;
    const mockRouter = {} as Router;
    const injector = null as any;

    const directive = new HasPermissionDirective(
      mockTemplate,
      mockViewContainer,
      mockPermissions,
      injector,
      mockRouter,
    );
    expect(directive).toBeTruthy();
  });
});

