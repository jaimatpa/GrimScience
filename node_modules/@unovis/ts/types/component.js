var ComponentType;
(function (ComponentType) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ComponentType[ComponentType["SVG"] = 0] = "SVG";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ComponentType[ComponentType["HTML"] = 1] = "HTML";
})(ComponentType || (ComponentType = {}));
var Sizing;
(function (Sizing) {
    Sizing["Fit"] = "fit";
    Sizing["Extend"] = "extend";
    Sizing["FitWidth"] = "fit_width";
})(Sizing || (Sizing = {}));

export { ComponentType, Sizing };
//# sourceMappingURL=component.js.map
