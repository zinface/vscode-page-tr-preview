
// 泛型
// 类
export class Tuple<T1, T2, T3, T4, T5> {
    constructor(public key: T1, public html: T2, public isBeginOrEnd: T3,public isBeginST: T3,public isBeginSC: T3) {
    }
}

// 接口
export interface Pair<T> {
    key: T;
    html: T;
    isBeginOrEnd: boolean;
    isBeginST: boolean;
    isBeginSC: boolean;
}

// 以及函数
export function pairToTuple<T>(p: Pair<T>) {
    return new Tuple(p.key, p.html, p.isBeginOrEnd, p.isBeginST, p.isBeginSC);
}

// let tuple = pairToTuple({ key: 'hello', html: 'world'});

const TAGS_TO_REPLACE: {[k: string]: string} = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#x27;',
    '\/': '&#x2F;',
    '\\': '&#x5C;',
}

const TAGS_TO_REPLACE_REVERSE = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': '\'',
    '&#x27;': '\'',
    '&#x2F;': '\/',
    '&#x5C;': '\\',
}

const PAGE_TR_TO_REPLACE: {[key:string]:string} = {
    '\\\$\$': '$_$_$'
}
const PAGE_TR_TO_REPLACE_REVERSE: {[key:string]:string} = {
    '$_$_$': '\\\$\$'
}

export function escapePageTrString(params:string) {
    return params.replace(/\\\$\$/g, (tag)=>(PAGE_TR_TO_REPLACE[tag] || tag))
}

export function unescapePageTrString(params:string) {
    return params.replace(/(\$_\$_\$)/g, (whole)=>(PAGE_TR_TO_REPLACE_REVERSE[whole] || whole))
}

export function escapeString(str:string):string {
  return str.replace(/[&<>"'\/\\]/g, (tag)=>(TAGS_TO_REPLACE[tag as keyof typeof TAGS_TO_REPLACE] || tag))
}

export function unescapeString(str:string):string {
  return str.replace(/\&(amp|lt|gt|quot|apos|\#x27|\#x2F|\#x5C)\;/g, (whole)=> (TAGS_TO_REPLACE_REVERSE[whole as keyof typeof TAGS_TO_REPLACE_REVERSE] || whole))
}