import database from "quick-store";

export const subserverAccessOverrides = createDatabase<Array<{
  subserver: string;
  executive: string;
  timestamp: string;
}>>("subserverAccessOverrides");

interface JSON<Model> { [key: string]: Model; }
type AnyValue = string | number | JSON<AnyValue> | Array<AnyValue> | boolean | null;

type Database<Model> = {
  get(): Promise<JSON<Model>>;
  get(key: string): Promise<Model>;
  set(key: string, value: Model): Promise<JSON<Model>>;
  unset(key: string): Promise<JSON<Model>>;
  put(obj: JSON<Model>): Promise<JSON<Model>>;
}

export function createDatabase<Model = AnyValue>(name: string): Database<Model> {
  const db = database(`./storage/${name}.json`);
  return {
    get: (key?: string) => new Promise<Model | JSON<Model>>(resolve => key ?
      db.getItem(key, r => resolve(r as unknown as Model)) :
      db.get(r => resolve(r as unknown as JSON<Model>))
    ),
    set: (key, value) => new Promise(resolve => db.setItem(key, value as never, r => resolve(r as unknown as JSON<Model>))),
    unset: (key) => new Promise(resolve => db.removeItem(key, r => resolve(r as unknown as JSON<Model>))),
    put: (obj) => new Promise(resolve => db.put(obj as never, r => resolve(r as unknown as JSON<Model>))),
  } as Database<Model>;
}