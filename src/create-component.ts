import {
  ComponentInstance,
  ComponentOptions,
} from "ironpipe/lib/component/component";
import { AppInstance, AppOptions } from "./defineApp";

export function createApp<Comp extends AppOptions>(
  comp: Comp,
  props: Record<keyof Comp["props"], unknown>
): AppInstance {
  return Object.create(
    Object.assign(
      {
        name: comp.name,
        description: comp.description,
        type: comp.type,
        version: comp.version,
        dedupe: comp.dedupe,
        // hooks?: {
        //     activate: Function;
        //     deactivate: Function;
        //     deploy: Function;
        //     [key: string]: Function;
        // }
      },
      props,
      comp.methods
    )
  ) as AppInstance;
}

export function createComponent<Comp extends ComponentOptions>(
  comp: Comp,
  props: Record<keyof Comp["props"], unknown>
): ComponentInstance {
  return Object.create(
    Object.assign(
      {
        run: comp.run,
        name: comp.name,
        description: comp.description,
        type: comp.type,
        version: comp.version,
        dedupe: comp.dedupe,
        // hooks?: {
        //     activate: Function;
        //     deactivate: Function;
        //     deploy: Function;
        //     [key: string]: Function;
        // }
      },
      props,
      comp.methods
    )
  ) as ComponentInstance;
}
