import { scaleLinear, scalePow, scaleSqrt, scaleLog, scaleSymlog, scaleIdentity, scaleTime, scaleUtc, scaleSequential, scaleDiverging, scaleQuantize, scaleQuantile, scaleThreshold, scaleOrdinal, scaleBand, scalePoint } from 'd3-scale';

const Scale = {
    scaleLinear,
    scalePow,
    scaleSqrt,
    scaleLog,
    scaleSymlog,
    scaleIdentity,
    scaleTime,
    scaleUtc,
    scaleSequential,
    scaleDiverging,
    scaleQuantize,
    scaleQuantile,
    scaleThreshold,
    scaleOrdinal,
    scaleBand,
    scalePoint,
};
var ScaleDimension;
(function (ScaleDimension) {
    ScaleDimension["X"] = "x";
    ScaleDimension["Y"] = "y";
})(ScaleDimension || (ScaleDimension = {}));

export { Scale, ScaleDimension };
//# sourceMappingURL=scale.js.map
