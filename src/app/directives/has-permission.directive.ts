import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit,
  OnDestroy,
  Injector,
  effect,
  runInInjectionContext,
} from '@angular/core';
import { PermissionsService } from '../services/permissions.service';

@Directive({
  selector: '[ifHasPermission]',
  standalone: true,
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  @Input() ifHasPermission: string | string[] = [];

  constructor(
    private template: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissions: PermissionsService,
    private injector: Injector,
  ) {}

  ngOnInit() {
    runInInjectionContext(this.injector, () => {
      effect(() => {
        const permisos = Array.isArray(this.ifHasPermission)
          ? this.ifHasPermission
          : [this.ifHasPermission];

        // Suscribe al signal — se ejecuta cada vez que cambian los permisos
        const tiene = this.permissions.hasAnyPermission(permisos);

        this.viewContainer.clear();
        if (tiene) {
          this.viewContainer.createEmbeddedView(this.template);
        }
      });
    });
  }

  ngOnDestroy() {}
}
