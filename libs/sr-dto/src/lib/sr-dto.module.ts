import { CommonModule } from "@angular/common";
import { Provider } from "@angular/compiler/src/core";
import { ModuleWithProviders } from "@angular/compiler/src/core";
import { NgModule } from "@angular/core";
import { BusEmitter, MixedBusService } from "@soer/mixed-bus";
import { isCRUDBusEmitter } from "./dto.helpers";
import { DtoLastItemPipe } from "./dto.pipes";
import { DataStoreService } from "./services/data-store.service";
import { HookService } from "./services/hook.service";
import { ResolveReadEmitterService } from "./services/resolve-read-emitter.service";
import { StoreCrudService } from "./services/store.crud.service";

export type CRUDMethods = { create: string, read: string, update: string, delete: string };
export interface CRUDBusEmitter extends BusEmitter {
  schema: CRUDMethods;
}
interface CrudOptions {
  namespace: string;
  crudEmitters: { [key: string]: CRUDBusEmitter | CRUDMethods};
}

@NgModule({
  declarations: [DtoLastItemPipe],
  imports: [
    CommonModule
  ],
  providers: [],
  exports: [DtoLastItemPipe]
})
export class SrDTOModule {

  static forChild(options: CrudOptions): ModuleWithProviders {
    return {
      ngModule: SrDTOModule,
      providers: createcrudEmitters(options)
    };
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SrDTOModule,
      providers: [StoreCrudService, DataStoreService]
    };
  }
}

function createcrudEmitters(options: CrudOptions): Provider[] {
  const result: Provider[] = [];
  const hooks: BusEmitter[] = [];
  Object.keys(options.crudEmitters).forEach(emitterName => {


    const createCRUDBusEmitterFrom = (schema: CRUDMethods | CRUDBusEmitter, name: string ): CRUDBusEmitter  => {
      if (isCRUDBusEmitter(schema)) {
        return schema;
      }
      return { sid: Symbol(name), schema };
    }

    const emitter: CRUDBusEmitter = createCRUDBusEmitterFrom(options.crudEmitters[emitterName], emitterName);
    hooks.push(emitter);

    result.push(
      createDataEmitter(emitterName, emitter),
      createCRUDSBusId(emitterName, emitter)
    );
  });
  result.push(createDomain(hooks, options.namespace));
  return result;
}

function createCRUDSBusId(providerName: string, emitter: CRUDBusEmitter): Provider {
  return {
    provide: `${providerName}`,
    useFactory: () => {
      return emitter;
    }
  }
}

function createDataEmitter(providerName: string, emitter: CRUDBusEmitter): Provider {
  return {
    provide: `${providerName}Emitter`,
    useFactory: (bus$: MixedBusService) => {
      return new ResolveReadEmitterService(bus$, emitter);
    },
    deps: [MixedBusService]
  }
}

function createDomain(hooks: BusEmitter[], domainName: string): Provider {
  return {
    provide: `HookDomain`,
    multi: true,
    useFactory: (bus$: MixedBusService) => {
      return new HookService(domainName, bus$, hooks);
    },
    deps: [MixedBusService]
  }
}
