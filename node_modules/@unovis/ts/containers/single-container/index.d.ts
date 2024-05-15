import "../../styles/index";
import { ContainerCore } from "../../core/container";
import { ComponentCore } from "../../core/component";
import { ComponentConfigInterface } from "../../core/component/config";
import { SingleContainerConfigInterface } from './config';
export declare class SingleContainer<Data> extends ContainerCore {
    protected _defaultConfig: SingleContainerConfigInterface<Data>;
    component: ComponentCore<Data>;
    config: SingleContainerConfigInterface<Data>;
    constructor(element: HTMLElement, config?: SingleContainerConfigInterface<Data>, data?: Data);
    setData(data: Data, preventRender?: boolean): void;
    updateContainer(containerConfig: SingleContainerConfigInterface<Data>, preventRender?: boolean): void;
    updateComponent(componentConfig: ComponentConfigInterface, preventRender?: boolean): void;
    update(containerConfig: SingleContainerConfigInterface<Data>, componentConfig?: ComponentConfigInterface, data?: Data): void;
    getFitWidthScale(): number;
    protected _preRender(): void;
    protected _render(duration?: number): void;
    render(duration?: number): void;
    protected _onResize(): void;
    destroy(): void;
}
