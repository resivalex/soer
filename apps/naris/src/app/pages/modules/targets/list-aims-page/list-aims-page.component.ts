import { ChangeDetectionStrategy, Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { NzNotificationComponent, NzNotificationData, NzNotificationDataOptions, NzNotificationRef, NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable } from 'rxjs';
import { convertToJsonDTO, parseJsonDTOPack } from '../../../../api/json.dto.helpers';
import { TargetModel } from '../../../../api/targets/target.interface';
import { CommandUpdate, DtoPack } from '@soer/sr-dto';
import { DataStoreService } from '@soer/sr-dto';
import { BusOwner } from '@soer/mixed-bus';
import { MixedBusService } from '@soer/mixed-bus';
import { DONE_PROGRESS, UNDONE_PROGRESS } from '../targets.const';
import { propagateProgress, updateProgress } from '../progress.helper';



@Component({
  selector: 'soer-list-aims-page',
  templateUrl: './list-aims-page.component.html',
  styleUrls: ['./list-aims-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListAimsPageComponent {

  checked = false;
  public targets$: Observable<DtoPack<TargetModel>>;
  public visibility: any = {
    targetHeader: {visibility: false}
  };

  public readonly doneProgress = DONE_PROGRESS;
  public readonly undoneProgress = UNDONE_PROGRESS;
  public readonly gradientColors = { '0%': '#ff0000', '50%': '#ff0000', '75%': '#ff9900', '100%': '#0f0' };
  public expanderCache: any = {};

  constructor(
      @Inject('targets') private targetsId: BusOwner,
      @Inject('target') private targetId: BusOwner,
      private bus$: MixedBusService,
      private store$: DataStoreService,
      private notification: NzNotificationService
  ) { this.targets$ = parseJsonDTOPack<TargetModel>(this.store$.of(this.targetsId), 'Targets'); }


  // eslint-disable-next-line @typescript-eslint/ban-types
  check(task: TargetModel, target: TargetModel, progress: number = DONE_PROGRESS, template: TemplateRef<{}> | null = null): void {
    propagateProgress(task, progress);
    updateProgress(target);
    this.bus$.publish(
      new CommandUpdate(
        this.targetId,
        { ...convertToJsonDTO(target, ['id']), id: target.id },
        {skipRoute: true}
      )
    );

    if (template) {
      this.notification.template(template, {nzData: {task, target}, nzPlacement: 'bottomRight'});
    }
  }

  undo(notify: NzNotificationComponent): void {
      const target = (notify.instance.options as NzNotificationDataOptions<{target: TargetModel}>).nzData?.target;
      const task = (notify.instance.options as NzNotificationDataOptions<{task: TargetModel}>).nzData?.task;
      if (task && target) {
        this.check(task, target, UNDONE_PROGRESS);
      }
      notify.close();

  }
}
