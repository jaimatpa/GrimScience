import { symbolCircle, symbolCross, symbolDiamond, symbolSquare, symbolStar, symbolTriangle, symbolWye } from 'd3-shape';

var SymbolType;
(function (SymbolType) {
    SymbolType["Circle"] = "circle";
    SymbolType["Cross"] = "cross";
    SymbolType["Diamond"] = "diamond";
    SymbolType["Square"] = "square";
    SymbolType["Star"] = "star";
    SymbolType["Triangle"] = "triangle";
    SymbolType["Wye"] = "wye";
})(SymbolType || (SymbolType = {}));
const Symbol = {
    [SymbolType.Circle]: symbolCircle,
    [SymbolType.Cross]: symbolCross,
    [SymbolType.Diamond]: symbolDiamond,
    [SymbolType.Square]: symbolSquare,
    [SymbolType.Star]: symbolStar,
    [SymbolType.Triangle]: symbolTriangle,
    [SymbolType.Wye]: symbolWye,
};

export { Symbol, SymbolType };
//# sourceMappingURL=symbol.js.map
