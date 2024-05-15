import { mean, min, max, bisector } from 'd3-array';
import { throttle as throttle$1 } from 'throttle-debounce';

const isNumber = (a) => typeof a === 'number';
// eslint-disable-next-line @typescript-eslint/ban-types
const isFunction = (a) => typeof a === 'function';
const isUndefined = (a) => a === undefined;
const isNil = (a) => a == null;
const isString = (a) => typeof a === 'string';
const isArray = (a) => Array.isArray(a);
const isObject = (a) => (a instanceof Object);
const isAClassInstance = (a) => a.constructor.name !== 'Function' && a.constructor.name !== 'Object';
const isPlainObject = (a) => isObject(a) && !isArray(a) && !isFunction(a) && !isAClassInstance(a);
const isEmpty = (obj) => {
    return [Object, Array].includes((obj || {}).constructor) &&
        !Object.entries((obj || {})).length;
};
// Based on https://github.com/maplibre/maplibre-gl-js/blob/e78ad7944ef768e67416daa4af86b0464bd0f617/src/style-spec/util/deep_equal.ts, 3-Clause BSD license
const isEqual = (a, b, visited = new Set()) => {
    if (Array.isArray(a)) {
        if (!Array.isArray(b) || a.length !== b.length)
            return false;
        if (visited.has(a))
            return true;
        else
            visited.add(a);
        for (let i = 0; i < a.length; i++) {
            if (!isEqual(a[i], b[i], visited))
                return false;
        }
        return true;
    }
    if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime();
    }
    if (typeof a === 'object' && a !== null && b !== null) {
        if (!(typeof b === 'object'))
            return false;
        if (a === b)
            return true;
        const keys = Object.keys(a);
        if (keys.length !== Object.keys(b).length)
            return false;
        if (visited.has(a))
            return true;
        else
            visited.add(a);
        for (const key in a) {
            if (!isEqual(a[key], b[key], visited))
                return false;
        }
        return true;
    }
    return a === b;
};
const without = (arr, ...args) => arr.filter(item => !args.includes(item));
const flatten = (arr) => arr.flat();
const cloneDeep = (obj, stack = new Map()) => {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    if (obj instanceof Array) {
        const clone = [];
        stack.set(obj, clone);
        for (const item of obj) {
            clone.push(stack.has(item) ? stack.get(item) : cloneDeep(item, stack));
        }
        return clone;
    }
    // Class instances will be copied without cloning
    if (isAClassInstance(obj)) {
        const clone = obj;
        return clone;
    }
    if (obj instanceof Object) {
        const clone = {};
        stack.set(obj, clone);
        const objAsRecord = obj;
        Object.keys(obj)
            .reduce((newObj, key) => {
            newObj[key] = stack.has(objAsRecord[key]) ? stack.get(objAsRecord[key]) : cloneDeep(objAsRecord[key], stack);
            return newObj;
        }, clone);
        return clone;
    }
    return obj;
};
const merge = (obj1, obj2, visited = new Map()) => {
    if (!obj1 || !obj2)
        return obj1;
    if (obj1 === obj2)
        return obj1;
    const newObj = (isAClassInstance(obj1) ? obj1 : cloneDeep(obj1));
    // Taking care of recursive structures
    if (visited.has(obj2))
        return visited.get(obj2);
    else
        visited.set(obj2, newObj);
    Object.keys(obj2).forEach(key => {
        // Preventing prototype pollution
        if (key === '__proto__' || key === 'constructor')
            return;
        if (isPlainObject(obj1[key]) && isPlainObject(obj2[key])) {
            newObj[key] = merge(obj1[key], obj2[key], visited);
        }
        else if (isAClassInstance(obj2)) {
            newObj[key] = obj2;
        }
        else {
            newObj[key] = cloneDeep(obj2[key]);
        }
    });
    return newObj;
};
const omit = (obj, props) => {
    obj = Object.assign({}, obj);
    props.forEach(prop => delete obj[prop]);
    return obj;
};
const groupBy = (arr, accessor) => {
    return arr.reduce((grouped, v, i, a, k = accessor(v)) => (((grouped[k] || (grouped[k] = [])).push(v), grouped)), {});
};
const sortBy = (arr, accessor) => {
    return arr.concat() // The native sort method modifies the array in place. We use `.concat()` to copy the array first
        .sort((a, b) => {
        return (accessor(a) > accessor(b)) ? 1 : ((accessor(b) > accessor(a)) ? -1 : 0);
    });
};
const throttle = (f, delay, options) => throttle$1(delay, f, options);
function getValue(d, accessor, index) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    if (isFunction(accessor))
        return accessor(d, index);
    else
        return accessor;
}
function getString(d, accessor, i) {
    return getValue(d, accessor, i);
}
function getNumber(d, accessor, i) {
    return getValue(d, accessor, i);
}
function getBoolean(d, accessor, i) {
    return getValue(d, accessor, i);
}
function clean(data) {
    return data.filter(d => d && !isNumber(d));
}
function clamp(d, min, max) {
    return Math.min(Math.max(d, min), max);
}
function unique(array) {
    return Array.from(new Set(array));
}
function countUnique(array, accessor = (d) => d) {
    return new Set(array.map(d => accessor(d))).size;
}
function arrayOfIndices(n) {
    return [...Array(n).keys()];
}
function shallowDiff(o1 = {}, o2 = {}) {
    return Object.keys(o2).reduce((diff, key) => {
        if (o1[key] === o2[key])
            return diff;
        return Object.assign(Object.assign({}, diff), { [key]: o2[key] });
    }, {});
}
function getStackedExtent(data, ...acs) {
    if (!data)
        return [undefined, undefined];
    if (isArray(acs)) {
        let minValue = 0;
        let maxValue = 0;
        data.forEach((d, i) => {
            let positiveStack = 0;
            let negativeStack = 0;
            for (const a of acs) {
                const value = getNumber(d, a, i) || 0;
                if (value >= 0)
                    positiveStack += value;
                else
                    negativeStack += value;
            }
            if (positiveStack > maxValue)
                maxValue = positiveStack;
            if (negativeStack < minValue)
                minValue = negativeStack;
        });
        return [minValue, maxValue];
    }
}
function getStackedValues(d, index, ...acs) {
    const values = [];
    let positiveStack = 0;
    let negativeStack = 0;
    for (const a of acs) {
        const value = getNumber(d, a, index) || 0;
        if (value >= 0) {
            values.push(positiveStack += value);
        }
        else {
            values.push(negativeStack += value);
        }
    }
    return values;
}
function getStackedData(data, baseline, acs, prevNegative // to help guessing the stack direction (positive/negative) when the values are 0 or null
) {
    const baselineValues = data.map((d, i) => getNumber(d, baseline, i) || 0);
    const isNegativeStack = acs.map((a, j) => {
        const average = mean(data, (d, i) => getNumber(d, a, i) || 0);
        return (average === 0 && Array.isArray(prevNegative)) ? prevNegative[j] : average < 0;
    });
    const stackedData = acs.map(() => []);
    data.forEach((d, i) => {
        let positiveStack = baselineValues[i];
        let negativeStack = baselineValues[i];
        acs.forEach((a, j) => {
            const value = getNumber(d, a, i) || 0;
            if (!isNegativeStack[j]) {
                stackedData[j].push([positiveStack, positiveStack += value]);
            }
            else {
                stackedData[j].push([negativeStack, negativeStack += value]);
            }
        });
    });
    // Fill in additional stack information
    stackedData.forEach((stack, i) => {
        stack.negative = isNegativeStack[i];
    });
    stackedData.filter(s => s.negative)
        .forEach((s, i, arr) => {
        s.ending = i === arr.length - 1;
    });
    stackedData.filter(s => !s.negative)
        .forEach((s, i, arr) => {
        s.ending = i === arr.length - 1;
    });
    return stackedData;
}
function getMin(data, ...acs) {
    if (!data)
        return undefined;
    const minValue = min(data, (d, i) => min(acs, a => getNumber(d, a, i)));
    return minValue;
}
function getMax(data, ...acs) {
    if (!data)
        return undefined;
    const maxValue = max(data, (d, i) => max(acs, a => getNumber(d, a, i)));
    return maxValue;
}
function getExtent(data, ...acs) {
    return [getMin(data, ...acs), getMax(data, ...acs)];
}
function getNearest(data, value, accessor) {
    if (data.length <= 1)
        return data[0];
    const values = data.map((d, i) => getNumber(d, accessor, i));
    values.sort((a, b) => a - b);
    const xBisector = bisector(d => d).left;
    const index = xBisector(values, value, 1, data.length - 1);
    return value - values[index - 1] > values[index] - value ? data[index] : data[index - 1];
}
function filterDataByRange(data, range, accessor) {
    const filteredData = data.filter((d, i) => {
        const value = getNumber(d, accessor, i);
        return (value >= range[0]) && (value <= range[1]);
    });
    return filteredData;
}
function isNumberWithinRange(value, range) {
    return (value >= range[0]) && (value <= range[1]);
}

export { arrayOfIndices, clamp, clean, cloneDeep, countUnique, filterDataByRange, flatten, getBoolean, getExtent, getMax, getMin, getNearest, getNumber, getStackedData, getStackedExtent, getStackedValues, getString, getValue, groupBy, isAClassInstance, isArray, isEmpty, isEqual, isFunction, isNil, isNumber, isNumberWithinRange, isObject, isPlainObject, isString, isUndefined, merge, omit, shallowDiff, sortBy, throttle, unique, without };
//# sourceMappingURL=data.js.map
