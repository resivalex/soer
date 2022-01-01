import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

import { MixedBusService } from '@soer/mixed-bus';
import { ComposePage } from '../compose-page';
import { HookService } from '@soer/sr-dto';

@Component({
  selector: 'soer-compose-tab-page',
  templateUrl: './compose-tab-page.component.html',
  styleUrls: ['./compose-tab-page.component.scss']
})
export class ComposeTabPageComponent extends ComposePage implements OnInit, OnDestroy {

  public tabs: {title: string, path: string[]}[] = [];
  constructor( @Inject('HookDomain') domain: HookService[],
               bus$: MixedBusService,
               router: Router,
               route: ActivatedRoute,
               message: NzMessageService
  ) {
    super(domain, bus$, router, route, message);
  }

  ngOnInit(): void {
    this.composeInit();
    this.prepareTabs();
  }

  ngOnDestroy(): void {
      this.composeDestroy();
  }


  prepareTabs(): void {
      this.route.routeConfig?.children?.forEach( child => {
        if (child.data?.['header']) {
          const newPath = (child.path === undefined || child.path === '') ? '.' : child.path;
          this.tabs.push({
            title: child.data?.['header'].title,
            path: [newPath]
          });
        }

      });
  }

}
