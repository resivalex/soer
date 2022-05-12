import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SrDTOModule } from '@soer/sr-dto';
import { ByRoutePathResolver } from '../api/by-route-path.resolver';
import { StreamService } from '../api/streams/stream.service';
import { TasksResolver } from '../api/tasks/tasks.resolver';
import { WorkshopsService } from '../api/workshops/workshops.service';

import { FilesListComponent } from './components/files-list/files-list.component';
import { AbstracteRoutingModule } from './modules/abstracte/abstracte-routing.module';
import { WORKBOOKS_ID, WORKBOOK_ID } from './modules/abstracte/abstracte.const';
import { CertificateComponent } from './modules/certificate/certificate/certificate.component';
import { ComposeVideoPlayerComponent } from './modules/compose-video-player/compose-video-player.component';
import { OverviewComponent } from './modules/overview/overview.component';
import { PayFormComponent } from './modules/payment/pay-form/pay-form.component';
import { QUESTIONS_ALL_ID, QUESTIONS_ID, QUESTION_ID } from './modules/questions/questions.const';
import { QuestionsRoutingModule } from './modules/questions/questions.routing.module';
import { RoadmapComponent } from './modules/roadmap/roadmap.component';
import { StreamsComponent } from './modules/streams/streams.component';
import { TargetsRoutingModule } from './modules/targets/targets-routing.module';

const routes: Routes = [
      { path: '', redirectTo: 'overview' },
      {
        path: 'certificate',
        data: { header: {title: 'Подарочный сертификат', subtitle: 'использовать сертификат'}},
        component: CertificateComponent
      },
      {
        path: 'pay',
        data: { header: {title: 'Выбор тарифа', subtitle: 'определите уровень платного доступа'}},
        component: PayFormComponent
      },
      {
        path: 'overview',
        component: OverviewComponent,
        data: { header: {title: 'Брифинг', subtitle: 'кратко о возможностях и достижениях'}},
        resolve: {
          brif: ByRoutePathResolver,
          workbooks: 'workbooksEmitter',
          targets: 'targetsEmitter',
          questions: 'questionsEmitter',
          streams: StreamService,
          workshops: WorkshopsService
        },
      },
      {
        path: 'streams',
        component: StreamsComponent,
        data: { header: {title: 'Архитектурные стримы', subtitle: 'грамотно строим работу над приложением'}},
        resolve: {streams: StreamService},
        children: [
          {
            path: ':videoSource/:videoId',
            component: ComposeVideoPlayerComponent,
            data: { header: {title: 'Смотрим стрим...'}}
          }
        ]
      },
      {
        path: 'workshops',
        component: StreamsComponent,
        data: { header: {title: 'Мастерклассы', subtitle: 'создаем приложение по шагам'}},
        resolve: {streams: WorkshopsService},
        children: [
          {
            path: ':videoSource/:videoId',
            component: ComposeVideoPlayerComponent,
            data: { header: {title: 'Смотрим воркшоп...'}}
          }
        ]
      },
      {
        path: 'book',
        component: RoadmapComponent,
        data: { header: {title: 'Главы книги', subtitle: 'быстрый старт в карьере'}},
        resolve: {
          target: ByRoutePathResolver
        },
      },
      {
        path: 'sources',
        component: FilesListComponent,
        data: { header: {title: 'Исходники проектов', subtitle: ''}},
        resolve: {
          webfiles: ByRoutePathResolver
        },
      }

];

@NgModule({
  imports: [
    RouterModule.forChild(routes),

    SrDTOModule.forChild({
      namespace: 'workbook',
      schema: WORKBOOK_ID.schema,
      keys: {
        workbook: {wid: '?'},
        workbooks: {wid: ''},
      }
    }),

    SrDTOModule.forChild({
      namespace: 'qa',
      schema: QUESTION_ID.schema,
      keys: {
        questionsAll: {qid: 'all'},
        questions: {qid: ''},
        question: {qid: '?'}
      }
    }),
    SrDTOModule.forChild({
      namespace: 'targets',
      schema: {create: 'json/targets', read: 'json/targets/:tid', update: 'json/targets', delete: 'json/targets/:tid'},
      keys: {
        targets: {tid: ''},
        target: {tid: '?'}
      }
    }),
    SrDTOModule.forChild({
      namespace: 'templates',
      schema: {create: 'json/templates', read: 'json/:access/templates/:tid', update: 'json/templates', delete: 'json/templates/:tid'},
      keys: {
        templates: {tid: '', access: ''},
        publicTemplates: {tid: '', access: 'public'},
        template: {tid: '?', access: ''}
      }
    }),
    QuestionsRoutingModule,
    TargetsRoutingModule,
    AbstracteRoutingModule
  ],
  providers: [
    TasksResolver,
    StreamService,
    WorkshopsService,
    ByRoutePathResolver
  ],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
