import {
  ComponentInstance,
  ComponentOptions,
} from "ironpipe/lib/component/component";
import { ActionOptions, ActionInstance } from "ironpipe/lib/component/action";
import { ExtractPropTypes } from "ironpipe/lib/component/props";
import { AppInstance, AppOptions } from "./defineApp";

export function createApp<Comp extends AppOptions>(
  comp: Comp,
  props: Readonly<ExtractPropTypes<Comp["props"]>>
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
  props: Readonly<ExtractPropTypes<Comp["props"]>>
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

export function createAction<Comp extends ActionOptions>(
  comp: Comp,
  props: Readonly<ExtractPropTypes<Comp["props"]>>
): ActionInstance {
  return Object.create(
    Object.assign(
      {
        run: comp.run,
        name: comp.name,
        description: comp.description,
        type: comp.type,
        version: comp.version,
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
  ) as ActionInstance;
}
