import { ContainerDefaultConfig } from '../../core/container/config.js';
import { Direction } from '../../types/direction.js';

const XYContainerDefaultConfig = Object.assign(Object.assign({}, ContainerDefaultConfig), { components: [], tooltip: undefined, crosshair: undefined, annotations: undefined, xAxis: undefined, yAxis: undefined, autoMargin: true, xScale: undefined, xDomain: undefined, xDomainMinConstraint: undefined, xDomainMaxConstraint: undefined, xRange: undefined, yScale: undefined, yDomain: undefined, yDomainMinConstraint: undefined, yDomainMaxConstraint: undefined, yRange: undefined, yDirection: Direction.North, preventEmptyDomain: null, scaleByDomain: false });

export { XYContainerDefaultConfig };
//# sourceMappingURL=config.js.map
