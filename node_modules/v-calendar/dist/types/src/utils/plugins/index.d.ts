import type { App as Application, Component } from 'vue';
import type { Defaults } from '../defaults';
export declare const registerComponent: (instance: Application, component: Component, defaults?: Defaults) => void;
export declare const registerComponentProgrammatic: (instance: Application, property: string, component: Component) => void;
