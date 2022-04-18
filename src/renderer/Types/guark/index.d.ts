declare module 'guark' {
  export type EnvObject = { [Key: string]: string };

  export interface Guark {
    env(): Promise<EnvObject>;

    /** Invoke a hook. */
    hook(name: string): Promise<any>;

    /** Call exported Go functions. */
    call(funcName: string, args?: any): Promise<any>;

    /** Send desktop notification. */
    notify(message: string, args?: any): Promise<any>;

    /** Exit the app. */
    exit(): Promise<any>;
  };

  declare const Guark: Guark;
  export default Guark;
  export as namespace Guark;
};
