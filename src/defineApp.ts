/* eslint-disable @typescript-eslint/ban-types */

import {
  ExtractPropTypes,
  InstancePropsOptions,
} from "ironpipe/lib/component/props";
import { MethodOptions } from "ironpipe/lib/component/methods";
import { InstanceThis } from "ironpipe/lib/component/options";
import { string2 } from "ironpipe/lib/types";

export interface AppInstance {
  name: string;
  type: "app";
  version: string;
  description?: string;
  dedupe?: "unique" | "greatest" | "last" | string2;
  hooks?: {
    activate: Function;
    deactivate: Function;
    deploy: Function;
    [key: string]: Function;
  };
}

export type AppOptions<
  PropsOptions = InstancePropsOptions,
  Methods extends MethodOptions = Record<string, Function>,
  Props = Readonly<ExtractPropTypes<PropsOptions>>
> = AppInstance & {
  props: PropsOptions;
  methods?: Methods;
} & InstanceThis<Props, Methods>;

export function defineApp<
  PropsOptions extends Readonly<InstancePropsOptions>,
  Methods extends MethodOptions = Record<string, Function>
>(
  options: AppOptions<PropsOptions, Methods>
): AppOptions<PropsOptions, Methods> {
  return options;
}
