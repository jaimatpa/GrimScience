var Position;
(function (Position) {
    Position["Top"] = "top";
    Position["Bottom"] = "bottom";
    Position["Left"] = "left";
    Position["Right"] = "right";
    Position["Center"] = "center";
    Position["Auto"] = "auto";
})(Position || (Position = {}));
var PositionStrategy;
(function (PositionStrategy) {
    PositionStrategy["Absolute"] = "absolute";
    PositionStrategy["Fixed"] = "fixed";
})(PositionStrategy || (PositionStrategy = {}));
var Arrangement;
(function (Arrangement) {
    Arrangement["Inside"] = "inside";
    Arrangement["Outside"] = "outside";
})(Arrangement || (Arrangement = {}));
var Orientation;
(function (Orientation) {
    Orientation["Horizontal"] = "horizontal";
    Orientation["Vertical"] = "vertical";
})(Orientation || (Orientation = {}));

export { Arrangement, Orientation, Position, PositionStrategy };
//# sourceMappingURL=position.js.map
