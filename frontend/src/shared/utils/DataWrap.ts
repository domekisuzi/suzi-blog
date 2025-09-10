import { v4 as uuid } from 'uuid'
 
// An advanced function to build a  data, the grammar T & { [K in typeof key]:string } is used for build an obj with extra pros K,
export function withUUID<T extends object>(original:T,key:string='id',deep:boolean=false ):T & { [K in typeof key]:string } {
    const source = deep? structuredClone(original): original
    return {
        ...source,
        [key]:uuid(),
    }
}


export function withUUIDList<T extends object> (list:T[],key:string = 'id',deep:boolean){
    return list.map( (obj)=> {withUUID(obj,key,deep) } )
}


