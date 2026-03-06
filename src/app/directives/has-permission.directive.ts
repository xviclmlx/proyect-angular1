import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { PermissionsService } from '../services/permissions.service';

@Directive({
  selector: '[ifHasPermission]',
  standalone: true
})
export class HasPermissionDirective implements OnInit {
  @Input() ifHasPermission: string | string[] = [];

  constructor(
    private template: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissions: PermissionsService
  ) {}

  ngOnInit() {
    const permisos = Array.isArray(this.ifHasPermission)
      ? this.ifHasPermission
      : [this.ifHasPermission];

    if (this.permissions.hasAnyPermission(permisos)) {
      this.viewContainer.createEmbeddedView(this.template);
    } else {
      this.viewContainer.clear();
    }
  }
}