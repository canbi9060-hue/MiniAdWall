// get successful control from form and assemble into object
// http://www.w3.org/TR/html401/interact/forms.html#h-17.13.2

// types which indicate a submit action and are not successful controls
// these will be ignored
var k_r_submitter = /^(?:submit|button|image|reset|file)$/i;

// node names which could be successful controls
var k_r_success_contrls = /^(?:input|select|textarea|keygen)/i;

// Matches bracket notation.
var brackets = /(\[[^\[\]]*\])/g;

// serializes form fields
// @param form MUST be an HTMLForm element
// @param options is an optional argument to configure the serialization. Default output
// with no options specified is a url encoded string
//    - hash: [true | false] Configure the output type. If true, the output will
//    be a js object.
//    - serializer: [function] Optional serializer function to override the default one.
//    The function takes 3 arguments (result, key, value) and should return new result
//    hash and url encoded str serializers are provided with this module
//    - disabled: [true | false]. If true serialize disabled fields.
//    - empty: [true | false]. If true serialize empty fields
function serialize(form, options) {
    if (typeof options != 'object') {
        options = { hash: !!options };
    }
    else if (options.hash === undefined) {
        options.hash = true;
    }

    var result = (options.hash) ? {} : '';
    var serializer = options.serializer || ((options.hash) ? hash_serializer : str_serialize);

    var elements = form && form.elements ? form.elements : [];

    //Object store each radio and set if it's empty or not
    var radio_store = Object.create(null);

    for (var i=0 ; i<elements.length ; ++i) {
        var element = elements[i];

        // ingore disabled fields
        if ((!options.disabled && element.disabled) || !element.name) {
            continue;
        }
        // ignore anyhting that is not considered a success field
        if (!k_r_success_contrls.test(element.nodeName) ||
            k_r_submitter.test(element.type)) {
            continue;
        }

        var key = element.name;
        var value = null;

        switch (element.nodeName.toLowerCase()) {
            case 'input':
                switch (element.type.toLowerCase()) {
                    case 'checkbox':
                        value = (element.checked) ? element.value : null;
                        break;
                    case 'radio':
                        // overwrite previous value with current since only last matters
                        value = (element.checked) ? element.value : null;
                        break;
                    default:
                        value = element.value;
                        break;
                }
                break;
            case 'textarea':
                value = element.value;
                break;
            case 'select':
                if (element.type === 'select-one') {
                    value = element.value;
                } else {
                    value = [];
                    for (var j=0 ; j<element.options.length ; ++j) {
                        var option = element.options[j];
                        if (option.selected) {
                            value.push(option.value);
                        }
                    }
                }
                break;
        }

        // handle null value
        if (value === null) {
            if (!options.empty) {
                continue;
            }
            value = '';
        }

        // handle brackets in name e.g. foo[bar]
        var keys = key.match(brackets);
        if (keys) {
            keys.unshift(key.substring(0, key.indexOf('[')));
            for (var k=0 ; k<keys.length ; ++k) {
                keys[k] = keys[k].replace(/[\[\]]/g, '');
            }
            key = keys;
        }

        serializer(result, key, value);
    }

    return result;
}

function hash_serializer(result, key, value) {
    if (Array.isArray(key)) {
        var obj = result;
        for (var i=0 ; i<key.length-1 ; ++i) {
            if (!(key[i] in obj) || typeof obj[key[i]] !== 'object') {
                obj[key[i]] = {};
            }
            obj = obj[key[i]];
        }
        if (Array.isArray(obj[key[i]])) {
            obj[key[i]].push(value);
        } else if (key[i] in obj) {
            obj[key[i]] = [obj[key[i]], value];
        } else {
            obj[key[i]] = value;
        }
    } else {
        if (key in result) {
            if (Array.isArray(result[key])) {
                result[key].push(value);
            } else {
                result[key] = [result[key], value];
            }
        } else {
            result[key] = value;
        }
    }
}

function str_serialize(result, key, value) {
    if (Array.isArray(key)) {
        key = key.reduce(function(prev, curr, idx) {
            return prev + '[' + curr + ']';
        });
    }
    if (value != null && value.constructor == Array) {
        value = value.join(',');
    }
    if (value == null || value === '') {
        value = '';
    } else {
        value = String(value);
    }
    result += (result ? '&' : '') + encodeURIComponent(key) + '=' + encodeURIComponent(value);
}

export default serialize;

