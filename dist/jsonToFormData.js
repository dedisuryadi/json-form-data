(function(root, factory) {
    if (!root) {
        root = {};
    }
    if (typeof define === "function" && define.amd) {
        define([], function() {
            return root.jsonToFormData = factory();
        });
    } else if (typeof module === "object" && module.exports) {
        module.exports = root.jsonToFormData = factory();
    } else {
        root.jsonToFormData = factory();
    }
})(this, function() {
    function mergeObjects(object1, object2) {
        return [ object1, object2 ].reduce(function(carry, objectToMerge) {
            Object.keys(objectToMerge).forEach(function(objectKey) {
                carry[objectKey] = objectToMerge[objectKey];
            });
            return carry;
        }, {});
    }
    function isArray(val) {
        return {}.toString.call(val) === "[object Array]";
    }
    function isJsonObject(val) {
        return !isArray(val) && typeof val === "object" && !!val && !(val instanceof Blob) && !(val instanceof Date);
    }
    function isAppendFunctionPresent(formData) {
        return typeof formData.append === "function";
    }
    function isGlobalFormDataPresent() {
        return typeof FormData === "function";
    }
    function getDefaultFormData() {
        if (isGlobalFormDataPresent()) {
            return new FormData();
        }
    }
    function isPrimitive(value) {
        return value === null || typeof value !== "object" && typeof value !== "function";
    }
    function isArrayOfPrimitives(arr) {
        return Array.isArray(arr) && arr.every(isPrimitive);
    }
    function convert(jsonObject, options) {
        if (options && options.initialFormData) {
            if (!isAppendFunctionPresent(options.initialFormData)) {
                throw "initialFormData must have an append function.";
            }
        } else if (!isGlobalFormDataPresent()) {
            throw "This environment does not have global form data. options.initialFormData must be specified.";
        }
        var defaultOptions = {
            initialFormData: getDefaultFormData(),
            showLeafArrayIndexes: true,
            includeNullValues: false,
            useDotSeparator: false,
            mapping: function(value) {
                if (typeof value === "boolean") {
                    return +value ? "1" : "0";
                }
                return value;
            }
        };
        var mergedOptions = mergeObjects(defaultOptions, options || {});
        return convertRecursively(jsonObject, mergedOptions, mergedOptions.initialFormData, isArrayOfPrimitives(jsonObject));
    }
    function convertRecursively(jsonObject, options, formData, isToplevelArrPrimitive, parentKey) {
        if (isToplevelArrPrimitive) {
            for (var key in jsonObject) formData.append("[" + key + "]", jsonObject[key]);
            return formData;
        }
        var index = 0;
        for (var key in jsonObject) {
            if (jsonObject.hasOwnProperty(key)) {
                var propName = parentKey || key;
                var value = options.mapping(jsonObject[key]);
                if (parentKey && isJsonObject(jsonObject)) {
                    if (options.useDotSeparator) {
                        propName = parentKey + "." + key;
                    } else {
                        propName = parentKey + "[" + key + "]";
                    }
                }
                if (parentKey && isArray(jsonObject)) {
                    if (isArray(value) || options.showLeafArrayIndexes) {
                        propName = parentKey + "[" + index + "]";
                    } else {
                        propName = parentKey + "[]";
                    }
                }
                if (isArray(value) || isJsonObject(value)) {
                    convertRecursively(value, options, formData, false, propName);
                } else if (value instanceof FileList) {
                    for (var j = 0; j < value.length; j++) {
                        formData.append(propName + "[" + j + "]", value.item(j));
                    }
                } else if (value instanceof Blob) {
                    formData.append(propName, value, value.name);
                } else if (value instanceof Date) {
                    formData.append(propName, value.toISOString());
                } else if ((value === null && options.includeNullValues || value !== null) && value !== undefined) {
                    formData.append(propName, value);
                }
            }
            index++;
        }
        return formData;
    }
    return convert;
});