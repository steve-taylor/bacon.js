import { when_ } from "./when";
import { BufferingSource } from "./internal/source";
import { Desc } from "./describe";
import { EventStream, EventStreamOptions } from "./observable";
import _ from "./_"
import { Subscribe } from "./types";
import Observable from "./observable";
import { argumentsToObservables } from "./internal/argumentstoobservables";

/** @hidden */
export default function groupSimultaneous<V>(...streams: (Observable<V> | Observable<V>[])[]): EventStream<V[][]> {
  return groupSimultaneous_(argumentsToObservables(streams))
}


// TODO: type is not exactly correct, because different inputs may have different types.
// Result values are arrays where each element is the list from each input observable. Type this.
/** @hidden */
export function groupSimultaneous_<V>(streams: Observable<V>[], options?: EventStreamOptions): EventStream<V[][]> {
  let sources = _.map((stream: Observable<V>) => new BufferingSource<V>(stream), streams)

  let ctor = (desc: Desc, subscribe: Subscribe<V>) => new EventStream(desc, subscribe, undefined, options)
  return <any>when_(ctor, <any>[sources, (function (...xs: any[]) {
    return xs;
  })]).withDesc(new Desc("Bacon", "groupSimultaneous", streams));
}
