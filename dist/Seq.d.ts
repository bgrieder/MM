import { Option } from './Option';
import { Collection } from './Collection';
export declare class Seq<A> extends Collection<A> {
    static from<A>(...vals: any[]): Seq<A>;
    collectFirst<B>(filter: (value: A) => boolean): (mapper: (value: A) => B) => Option<B>;
    find(p: (value: A) => boolean): Option<A>;
    readonly headOption: Option<A>;
    readonly lastOption: Option<A>;
}
export declare function seq<A>(...vals: any[]): Seq<A>;
