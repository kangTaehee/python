/*  Miya Validator 0.2 (2007-12-21)
 *  (c) 2007 Goonoo Kim
 *
 *  Miya Validator is under the terms of a GPL(General Public License).
 */

/**
 * constructor
 * @return void
 */
var MiyaValidator = function(form) {
    this.form = MiyaValidator.getFormElement(form);
    if (!this.form) return false;

    this.conditions = [];
    this.groupConditions = [];
    this.errorCondition = null;
    this.errorGroupCondition = null;
    this.errorType = null;
};
/**
 * format check map (point function name)
 */
MiyaValidator.FORMAT_MAP = {
    email      : "MiyaFormat.email",
    hangul     : "MiyaFormat.hangul",
    engonly    : "MiyaFormat.engonly",
    number     : "MiyaFormat.number",
    residentno : "MiyaFormat.residentno",
    jumin      : "MiyaFormat.jumin",
    foreignerno: "MiyaFormat.foreignerno",
    bizno      : "MiyaFormat.bizno",
    phone      : "MiyaFormat.phone",
    homephone  : "MiyaFormat.homephone",
    handphone  : "MiyaFormat.handphone",
    isdate     : "MiyaFormat.isdate",
    zip        : "MiyaFormat.zip",
    jurino     : "MiyaFormat.jurino"
};
/**
 * message pattern to replace with getErrorMessage method
 *  {label} - name of form control
 *  {message} - invalid message
 */
MiyaValidator.ERROR_MESSAGE_PATTERN = "[{label}] {message}";
//MiyaValidator.ERROR_MESSAGE_PATTERN = "{message}";
/**
 * message preset for MiyaValidator
 */
MiyaValidator.ERROR_MESSAGE = {
    /* for element */
    required   : "반드시 입력하셔야 하는 사항입니다.",
    requiredstring : "반드시 {required}(으)로 입력하셔야 하는 사항입니다.",
    match      : "입력된 내용이 일치하지 않습니다.",
    invalid    : "입력된 내용이 올바르지 않습니다.",
    min        : "{min} 이상의 값을 입력해주세요.",
    max        : "{max} 이하의 값을 입력해주세요.",
    minlength  : "입력된 내용이 {minlength}글자 이상이어야 합니다.",
    minbyte    : "입력된 내용의 길이가 {minbyte}Byte 이상이어야 합니다.",
    maxbyte    : "입력된 내용의 길이가 {maxbyte}Byte를 초과할 수 없습니다.",
    mincheck   : "{mincheck}개의 항목 이상으로 선택하세요.",
    maxcheck   : "{maxcheck}개의 항목 이하로 선택하세요.",
    minselect  : "{minselect}개의 항목 이상으로 선택하세요.",
    maxselect  : "{maxselect}개의 항목 이하로 선택하세요.",
    imageonly  : "이미지 파일만 첨부 할 수 있습니다.",
    fileonly   : "{fileonly} 형식의 파일만 첨부 할 수 있습니다.",

    /* for group */
    requiremin : "{requiremin}개 이상의 항목이 입력되어야 합니다.",
    requiremax : "{requiremax}개 이하의 항목이 입력되어야 합니다.",

    /* for format */
    email      : "이메일 형식이 올바르지 않습니다.",
    hangul     : "반드시 한글로 입력하셔야 합니다.",
    engonly    : "영문으로만 입력하셔야 합니다.",
    number     : "숫자로만 입력하셔야 합니다.",
    residentno : "주민등록번호 형식이 올바르지 않습니다.",
    jumin      : "주민등록번호 형식이 올바르지 않습니다.",
    foreignerno: "외국인등록번호 형식이 올바르지 않습니다.",
    bizno      : "사업자등록번호 형식이 올바르지 않습니다.",
    phone      : "전화번호 형식이 올바르지 않습니다.\n예)02-232-0989",
    homephone  : "유선 전화번호 형식이 올바르지 않습니다.\n예)02-232-0989",
/*    handphone  : "핸드폰번호 형식이 올바르지 않습니다.\n예)010-232-0989",*/
    handphone  : "휴대전화번호 형식이 올바르지 않습니다.\n예)010-232-0989",
    isdate     : "날짜 형식이 올바르지 않습니다.\n예)1980-12-30",
    zip        : "우편번호 형식이 올바르지 않습니다.",
    jurino     : "법인번호 형식이 올바르지 않습니다."
};
/**
 * form control types
 */
MiyaValidator.TEXT = 1;
MiyaValidator.SELECT = 2;
MiyaValidator.MULTI_SELECT = 3;
MiyaValidator.CHECK = 4;
MiyaValidator.RADIO = 5;
MiyaValidator.FILE = 6;
MiyaValidator.HIDDEN = 7;
/**
 * add new validate condtion (see MiyaCondition constructor)
 * @return number or false
 */
MiyaValidator.prototype.add = function(targetElement, targetOptions, targetLabel) {
    var condition = new MiyaCondition(targetElement, targetOptions, targetLabel, this.form);

    if (condition)
        var newIndex = this.addCondition(condition);

    return newIndex ? newIndex : false;
};
/**
 * add new validate condition with MiyaCondition Object (see MiyaCondition constructor)
 * @return number or false
 */
MiyaValidator.prototype.addCondition = function(condition) {
    var newIndex = this.conditions.length;

    if (condition) {
        this.conditions[newIndex] = condition;
        return newIndex;
    } else {
        return false;
    };
};
/**
 * add new validate condition group (see MiyaGroupCondition constructor)
 * @return number or false
 */
MiyaValidator.prototype.addGroup = function(targetConditions, targetOptions, targetLabel) {
    var groupCondition = new MiyaGroupCondition(targetConditions, targetOptions, targetLabel);

    if (groupCondition)
        var newIndex = this.addGroupCondition(groupCondition);

    return newIndex ? newIndex : false;
};
/**
 * add new validate group condition with MiyaGroupCondition Object (see MiyaGroupCondition constructor)
 * @return number or false
 */
MiyaValidator.prototype.addGroupCondition = function(groupCondition){
    var newIndex = this.groupConditions.length;

    if (groupCondition) {
        this.groupConditions[newIndex] = groupCondition;
        return newIndex;
    } else {
        return false;
    };
};
/**
 * do validation with added conditions
 * @return boolean - true on success
 */
MiyaValidator.prototype.validate = function() {
    var isFailed = false;

    // validate conditions
    for (var i=0, l=this.conditions.length; i < l; i++) {
        isFailed = !this.validateCondition(this.conditions[i]);
        if (isFailed) return false;
    };

    // validate group conditions
    for (var i=0, l=this.groupConditions.length; i < l; i++) {
        isFailed = !this.validateGroup(this.groupConditions[i]);
        if (isFailed) return false;
    };

    return true;
};
/**
 * do validation of group condition
 * @return boolean - true on success
 */
MiyaValidator.prototype.validateGroup = function(groupCondition) {
    var conditions = groupCondition.conditions;
    var optionsObj = groupCondition.optionsObj;

    var requiremin = optionsObj.requiremin ? parseInt(optionsObj.requiremin, 10) : 0;
    if (requiremin > 0) {
        var countValid = 0;
        var firstInvalidCondition = null;
        for (var i=0, l=conditions.length; i < l; i++) {
            if (this.validateCondition(conditions[i])) {
                countValid++;
                if (countValid >= requiremin)
                    break;
            } else {
                if (!firstInvalidCondition) {
                    firstInvalidCondition = conditions[i];
                };
                // if error type isn't `required`, raise Condition's Error
                if (this.errorType != "required") {
                    return false; // validationCondition method already raised Error.
                };
            };
        };
        if (countValid < requiremin)
            return this.raiseGroupError(groupCondition, firstInvalidCondition, "requiremin");
    };

    var requiremax = optionsObj.requiremax ? parseInt(optionsObj.requiremax, 10) : 0;
    if (requiremax > 0) {
        var countValid = 0;
        var firstInvalidCondition = null;
        for (var i=0, l=conditions.length; i < l; i++) {
            if (this.validateCondition(conditions[i])) {
                countValid++;
                if (countValid >= requiremax)
                    break;
            } else {
                if (!firstInvalidCondition) {
                    firstInvalidCondition = conditions[i];
                };
                // if error type isn't `required`, raise Condition's Error
                if (this.errorType != "required") {
                    return false; // validationCondition method already raised Error.
                };
            };
        };
        if (countValid < requiremax)
            return this.raiseGroupError(groupCondition, firstInvalidCondition, "requiremax");
    };

    return true;
};
/**
 * do validation of condition
 * @return boolean - true on success
 */
MiyaValidator.prototype.validateCondition = function(condition) {
    var element = condition.element;
    var optionsObj = condition.optionsObj;
    var value = MiyaValidator.getValue(element);

    if (!MiyaValidator.isActiveFormControl(element)) return true; // ignore

    var type = MiyaValidator.getElementType(element);
    if (!type) return true; // ignore

    var useifvalid = optionsObj.useifvalid || null;
    var useifinvalid = optionsObj.useifinvalid || null;
    if (useifvalid) {
        if (!this.validateCondition(useifvalid))
            return true; // regard as valid
    };
    if (useifinvalid) {
        if (this.validateCondition(useifvalid))
            return true; // regard as valid
    };

    var isEmpty = MiyaValidator.isEmptyElement(element, type);

    var trim = optionsObj.trim || null;
    if (trim) {
        if (type == MiyaValidator.TEXT || type == MiyaValidator.HIDDEN) {
            switch (trim) {
                case true: case "trim":
                    value = value.replace(/^\s+/, "").replace(/\s+$/, "");
                    break;
                case "compress":
                    value = value.replace(/\s+/g, "");
                    break;
                case "ltrim":
                    value = value.replace(/^\s+/, "");
                    break;
                case "rtrim":
                    value = value.replace(/\s+$/, "");
                    break;
            };
        };
        if (value == "" && !isEmpty) isEmpty = true;
    };

    var required = optionsObj.required || null;
    if (required && isEmpty) {
        return this.raiseError(condition, "required");
    } else if (typeof required == "string" && required != value) {
        return this.raiseError(condition, "requiredstring");
    };

    var min = parseInt(optionsObj.min, 10) || null;
    var max = parseInt(optionsObj.max, 10) || null;
    if ((min != null || max != null) && !isEmpty) {
        if (type == MiyaValidator.TEXT || type == MiyaValidator.HIDDEN) {
        	var isNumber = /^[0-9]$/.test(value);
            if (!isNumber)
                return this.raiseError(condition, "number");
            var intValue = parseInt(value, 10);
            if (min != null && intValue < min)
                return this.raiseError(condition, "min");
            if (max != null && intValue > max)
                return this.raiseError(condition, "max");
        };
    };

    var minlength = parseInt(optionsObj.minlength, 10) || null;
    if (minlength > 0 && !isEmpty) {
        if (type == MiyaValidator.TEXT || type == MiyaValidator.HIDDEN) {
            if (value.length < minlength)
                return this.raiseError(condition, "minlength");
        };
    };

    var minbyte = parseInt(optionsObj.minbyte, 10) || null;
    var maxbyte = parseInt(optionsObj.maxbyte, 10) || null;
    if ((minbyte > 0 || maxbyte > 0) && !isEmpty) {
        if (type == MiyaValidator.TEXT || type == MiyaValidator.HIDDEN) {
            var valueByte = value.length;
            for (i=0, l=value.length; i < l; i++) {
                if (value.charCodeAt(i) > 128)
                    valueByte++;
            };
            if (minbyte > 0 && valueByte < minbyte)
                return this.raiseError(condition, "minbyte");
            if (maxbyte > 0 && valueByte > maxbyte)
                return this.raiseError(condition, "maxbyte");
        };
    };

    var match = optionsObj.match || null;
    if (match) {
        if (type != MiyaValidator.FILE) {
            var matchElement = MiyaValidator.getElement(match, this.form);
            if (matchElement && value != MiyaValidator.getValue(matchElement))
                return this.raiseError(condition, "match");
        };
    };

    var option = optionsObj.option || null;
    if (option && !isEmpty) {
        if (type != MiyaValidator.FILE && MiyaValidator.FORMAT_MAP[option]) {
            var formatFunction = eval(MiyaValidator.FORMAT_MAP[option]);
            var formatResult;
            var span = parseInt(optionsObj.span, 10) || null;
            var glue = optionsObj.glue || "";

            var _options = option.split(/\s/);
            for (var i=0, l=_options.length; i < l; i++) {
                var format = MiyaValidator.FORMAT_MAP[_options[i]];

                if (span && typeof value != "object") {
                    var spanedValue = value;
                    var _elementForSpan = element;
                    for (var j = 1; j < span; j++) {
                        _elementForSpan = MiyaValidator.getNextElement(_elementForSpan);
                        if (_elementForSpan) {
                            if (typeof glue == "object" && glue.length + 1 == span) {
                                spanedValue += glue[j-1] + MiyaValidator.getValue(_elementForSpan);
                            } else {
                                spanedValue += glue + MiyaValidator.getValue(_elementForSpan);
                            }
                        };
                    };
                    formatResult = formatFunction(element, spanedValue);
                } else {
                    formatResult = formatFunction(element, value);
                };
                if (typeof formatResult == "string")
                    return this.raiseError(condition, formatResult);
            };
        };
    };

    var pattern = optionsObj.pattern || null;
    if (pattern && !isEmpty) {
        if (type != MiyaValidator.FILE) {
            patternRegExp = new RegExp(pattern);
            if (typeof value == "object") {
                for (var i=0; i<value.length; i++) {
                    if (!patternRegExp.test(value[i])) {
                        return this.raiseError(condition, "invalid");
                    };
                };
            } else if (!patternRegExp.test(value)) {
                return this.raiseError(condition, "invalid");
            };
        };
    };

    var mincheck = parseInt(optionsObj.mincheck, 10) || null;
    var maxcheck = parseInt(optionsObj.maxcheck, 10) || null;
    if (mincheck > 0 || maxcheck > 0) {
        if (type == MiyaValidator.CHECK) {
            if (mincheck > 0 && value.length < mincheck)
                return this.raiseError(condition, "mincheck");
            if (maxcheck > 0 && value.length > maxcheck)
                return this.raiseError(condition, "maxcheck");
        };
    };

    var minselect = parseInt(optionsObj.minselect, 10) || null;
    var maxselect = parseInt(optionsObj.maxselect, 10) || null;
    if (minselect > 0 || maxselect > 0) {
        if (type == MiyaValidator.MULTI_SELECT) {
            if (minselect > 0 && value.length < minselect)
                return this.raiseError(condition, "minselect");
            if (maxselect > 0 && value.length > maxselect)
                return this.raiseError(condition, "maxselect");
        };
    };

    var imageonly = optionsObj.imageonly || null;
    if (imageonly && !isEmpty) {
        if (type == MiyaValidator.FILE) {
            var dotIndex = value.lastIndexOf(".");
            var ext = value.substr(dotIndex + 1).toLowerCase();
            if(ext != "jpg" && ext != "jpeg" && ext != "gif" && ext != "png")
                return this.raiseError(condition, "imageonly");
        };
    };

    var fileonly = optionsObj.fileonly || null;
    if (fileonly && !isEmpty) {
        if (type == MiyaValidator.FILE) {
            var dotIndex = value.lastIndexOf(".");
            var ext = value.substr(dotIndex + 1).toLowerCase();

			var isValidFile = false;
			for (var i=0, l=fileonly.length; i < l; i++) {
				if (ext == fileonly[i].toLowerCase()) {
					isValidFile = true;
					break;
				};
			};

			if (!isValidFile) {
				return this.raiseError(condition, "fileonly");
			};
        };
    };

    return true;
};
/**
 * set information of invalid condition
 * @param MiyaCondition condition
 * @param string errorType - key of optionsObj (required, match, and so on...)
 * @return false
 */
MiyaValidator.prototype.raiseError = function(condition, errorType) {
    this.errorCondition = condition;
    this.errorType = errorType;

    return false;
};
/**
 * set information of invalid group condition
 * @param MiyaGroupCondition groupCondition
 * @param MiyaCondition firstInvalidCondition
 * @param string errorType - key of optionsObj (requiremin, requiremax, ...)
 * @return false
 */
MiyaValidator.prototype.raiseGroupError = function(groupCondition, firstInvalidCondition, errorType) {
    this.errorGroupCondition = groupCondition;
    this.errorCondition = firstInvalidCondition;
    this.errorType = errorType;

    return false;
};
/**
 * get first invalid element what MiyaValidator detected
 */
MiyaValidator.prototype.getErrorElement = function() {
    return this.errorCondition ? this.errorCondition.element : null;
};
/**
 * get error message with errorMessagePattern, when errorMessagePattern is null, default pattern is used.
 * @param string errorMessagePattern
 * @return string
 */
MiyaValidator.prototype.getErrorMessage = function(errorMessagePattern) {
    if (!this.errorCondition || !this.errorType)
        return null;

    if (this.errorGroupCondition) {
        var optionsObj = this.errorGroupCondition.optionsObj;
        var label = this.errorGroupCondition.label;
    } else {
        var optionsObj = this.errorCondition.optionsObj;
        var label = this.errorCondition.label;
    };
    var typeMessage = MiyaValidator.ERROR_MESSAGE[this.errorType] || this.errorType;
    var message = optionsObj.message || typeMessage;

    var dynamicPattern = /\{([a-z0-9_]+)\}/i;
    if (dynamicPattern.test(message) == true) {
        while (dynamicPattern.exec(message)) {
            if (RegExp.$1 && optionsObj[RegExp.$1]) {
                var optionTxt = optionsObj[RegExp.$1];
                if (optionTxt.constructor &&
                        optionTxt.constructor.toString().indexOf("Array") > -1) {
                    optionTxt = optionTxt.join(", ");
                };
                message = message.replace(dynamicPattern, optionTxt);
            } else {
                break;
            };
        };
    };

    var messagePattern = errorMessagePattern
                            ? errorMessagePattern
                            : MiyaValidator.ERROR_MESSAGE_PATTERN;
	if (optionsObj.message) {
		messagePattern = messagePattern.replace('[{label}]', '');
	}
    var errorMessage = messagePattern.replace(/{label}/, label);
    var errorMessage = errorMessage.replace(/{message}/, message);
    return errorMessage;
};
/**
 * check element is active form control
 * @param DOM Element element
 * @return boolean - true if element is active form control
 * @static
 */
MiyaValidator.isActiveFormControl = function(element) {
    return element.tagName
            && element.tagName.match(/^input|select|textarea$/i)
            && !element.disabled;
};
/**
 * check element's value is empty
 * @param DOM Element element
 * @return boolean - true if element is empty
 * @static
 */
MiyaValidator.isEmptyElement = function(element) {
    var value = MiyaValidator.getValue(element);
    return !value;
};
/**
 * get DOM Element of form
 * @param mixed form - can be DOM Element, id attribute or name attribute.
 * @return DOM Element or false
 */
MiyaValidator.getFormElement = function(form) {
    if (form.tagName)
        return form;
    else if (document.getElementById
            && document.getElementById(form))
        return document.getElementById(form);
    else if (document.forms
            && document.forms[form])
        return document.forms[form];
    else
        return false;
};
/**
 * get DOM Element of form control
 * @param mixed element - can be DOM Element, id attribute or name attribute.
                          if name attribute presented, elementForm is required.
 * @param DOM Element elementForm
 * @return DOM Element or false
 * @static
 */
MiyaValidator.getElement = function(element, elementForm) {
    if (element.tagName) {
        return element;
    } else if (elementForm && elementForm.elements && elementForm.elements[element]) {
        if (!elementForm.elements[element].tagName
                && elementForm.elements[element].length)
            return elementForm.elements[element][0];
        else
            return elementForm.elements[element];
    } else if (document.getElementById
            && document.getElementById(element)) {
        return document.getElementById(element);
    } else {
        return false;
    };
};
/**
 * get type of form control
 * @param DOM Element element
 * @return number or false
 */
MiyaValidator.getElementType = function(element) {
    if (!element.tagName) return false;

    var tagName = element.tagName.toLowerCase();
    var type = element.type;
    var multiple = element.multiple;

    if (tagName == "textarea" ||
            (tagName == "input" && (type == "text" || type == "password")))
        return MiyaValidator.TEXT;
    else if (tagName == "select" && multiple)
        return MiyaValidator.MULTI_SELECT;
    else if (tagName == "select")
        return MiyaValidator.SELECT;
    else if (tagName == "input" && type == "checkbox")
        return MiyaValidator.CHECK;
    else if (tagName == "input" && type == "radio")
        return MiyaValidator.RADIO;
    else if (tagName == "input" && type == "file")
        return MiyaValidator.FILE;
    else if (tagName == "input" && type == "hidden")
        return MiyaValidator.HIDDEN;
    else
        return false;
};
/**
 * get value of form control
 * @param DOM Element element
 * @return string
 */
MiyaValidator.getValue = function(element) {
    var type = MiyaValidator.getElementType(element);

    switch (type) {
        case MiyaValidator.TEXT:
        case MiyaValidator.HIDDEN:
        case MiyaValidator.FILE:
            return element.value;
            break;
        case MiyaValidator.SELECT:
            for (var i=0, l=element.options.length; i<l; i++) {
                if (element.options[i].selected) {
                    return element.options[i].value;
                };
            };
            break;
        case MiyaValidator.MULTI_SELECT:
            var values = [];
            for (var i=0, l=element.options.length; i<l; i++) {
                if (element.options[i].selected) {
                    values[values.length] = element.options[i].value;
                };
            };
            return values.length > 0 ? values : null;
            break;
        case MiyaValidator.CHECK:
            if (element.form && element.name) {
                var checkElements = element.form.elements[element.name];
                var values = [];
                if (checkElements.length) {
                    for (var i=0, l=checkElements.length; i<l; i++) {
                        if (checkElements[i].checked == true)
                            values[values.length] = checkElements[i].value;
                    };
                } else {
                    if (checkElements.checked == true)
                        values[values.length] = checkElements.value;
                };
                return values.length > 0 ? values : null;
            };
            break;
        case MiyaValidator.RADIO:
            if (element.form && element.name) {
                var checkElements = element.form.elements[element.name];
                if (checkElements.length) {
                    for (var i=0, l=checkElements.length; i<l; i++) {
                        if (checkElements[i].checked == true)
                            return checkElements[i].value;
                    };
                } else {
                    if (checkElements.checked == true)
                        return checkElements.value;
                };
            };
            break;
    };
    return null;
};
/**
 * get next form control of form control
 * @param DOM Element element
 * @return DOM Element or null
 */
MiyaValidator.getNextElement = function(element) {
    if (element.form) {
        var form = element.form;
        for (var i=0, l=form.elements.length; i<l; i++) {
            if (form.elements[i] == element) {
                var count = i;
                while (++count < form.elements.length
                        && MiyaValidator.isActiveFormControl(form.elements[count])) {
                    return form.elements[count];
                };
            };
        };
    } else if (element.nextSibling) {
        var _nextElement = element;
        while (_nextElement = element.nextSibling) {
            if (MiyaValidator.isActiveFormControl(_nextElement))
                return _nextElement;
        };
    };
    return null;
};

/**
 * constructor
 * @param mixed targetElement - can be DOM Element, id attribute or name attribute of form control.
                                if name attribute presented, targetForm is required.
 * @param Object targetOptions - validation options of form control
 * @param string targetLabel - label of form control. if not presented,
 *                             MiyaCondition try to find label from HTML Document
 * @param DOM Element targetForm
 * @return void
 */
var MiyaCondition = function(targetElement, targetOptions, targetLabel, targetForm) {
    var element = MiyaValidator.getElement(targetElement, targetForm);

    if (!MiyaValidator.isActiveFormControl(element)) return false;

    this.element = element;
    this.optionsObj = targetOptions || {};
    this.label = targetLabel || MiyaCondition.getHTMLLabel(element);
};
/**
 * add new option, overwrite if option exist.
 * @param string key
 * @param mixed val
 * @return void
 */
MiyaCondition.prototype.addOption = function(key, val) {
    this.optionsObj[key] = val;
};
/**
 * remove exist option.
 * @param string key
 * @return void
 */
MiyaCondition.prototype.removeOption = function(key) {
    this.optionsObj[key] = null;
};
/**
 * get option with key
 * @param string key
 * @return mixed(value of option) or null
 */
MiyaCondition.prototype.getOption = function(key) {
    return this.optionsObj[key] ? this.optionsObj[key] : null;
};
/**
 * detect label of form control from HTML Document. if no label find, return "noname"
 * @param DOM Element element
 * @return string
 * @static
 */
MiyaCondition.getHTMLLabel = function(element) {
    var currentLabel = "";
    if (document.getElementsByTagName) {
        var currentLabelElement;
        labelLoop:
        for (var i=0, l=document.getElementsByTagName("label").length; i<l; i++) {
            var labelElement = document.getElementsByTagName("label")[i];
            var labelChilds = labelElement.childNodes;

            if (labelElement.htmlFor && labelElement.htmlFor == element.id) {
                currentLabelElement = labelElement;
                break labelLoop;
            };
            for (var _i=0, _l=labelChilds.length; _i<_l; _i++) {
                if (labelChilds[_i] == element) {
                    currentLabelElement = labelElement;
                    break labelLoop;
                };
            };
        };
        if (currentLabelElement) {
            var labelChilds = currentLabelElement.childNodes;
            for (var i=0, l=labelChilds.length; i<l; i++) {
                if (!labelChilds[i].tagName) // check is text node
                    currentLabel += labelChilds[i].nodeValue.replace(/^\s+/, "").replace(/\s+$/, "");
            };
        };
    };
    if (!currentLabel) {
        if (element.title)
            currentLabel = element.title;
        else if (element.id)
            currentLabel = element.id;
        else if (element.name)
            currentLabel = element.name;
        else
            currentLabel = "noname";
    };
    return currentLabel;
};

/**
 * constructor
 * @param Array targetConditions - items of array must be MiyaCondition instance
 * @param Object targetOptions - validation options of group condition
 * @param string targetLabel - label for group condition. if not presented,
                               labels of targetConditions is used.
 * @return void
 */
var MiyaGroupCondition = function(targetConditions, targetOptions, targetLabel) {
    this.conditions = targetConditions || [];
    this.optionsObj = targetOptions || {};
    if (targetLabel) {
        this.label = targetLabel;
    } else {
        this.label = "";
        for (var i=0, l=this.conditions.length; i < l; i++) {
            this.label += this.label ? ", " : "";
            this.label += this.conditions[i].label;
        };
    };
};
/**
 * add new condition
 * @param {Object} condition
 * @return number - index of condition Array
 */
MiyaGroupCondition.prototype.addCondition = function(condition) {
    var index = this.conditions.length;
    this.conditions[index] = condition;
    return index;
};
/**
 * get condition
 * @param number index - index of condition Array
 * @return MiyaCondition or null
 */
MiyaGroupCondition.prototype.getCondition = function(index) {
    return this.conditions[index] ? this.conditions[index] : null;
};
/**
 * remove exist condition
 * @param number index - index of condition Array
 * @return void
 */
MiyaGroupCondition.prototype.removeCondition = function(index) {
    var len = this.conditions.length;
    if (this.conditions[index]) {
        var flag = false;
        for (var i=0; i<len; i++) {
            if (i == index)
                flag = true;

            if (flag == true && i+1 < len) {
                this.conditions[i] = this.conditions[i+1];
            };
        };
        this.conditions.length = len - 1;
    };
};

var MiyaFormat = {};
MiyaFormat.email = function(el,value) {
    var value = value ? value : el.value;
    var pattern = /^[_a-zA-Z0-9-\.]+@[\.a-zA-Z0-9-]+\.[a-zA-Z]+$/;
    return pattern.test(value) ? true : "email";
};
MiyaFormat.hangul = function(el,value) {
    var value = value ? value : el.value;
    var pattern = /^[가-힣]+$/;
    return pattern.test(value) ? true : "hangul";
};
MiyaFormat.engonly = function(el,value) {
    var value = value ? value : el.value;
    var pattern = /^[a-zA-Z]+$/;
    return pattern.test(value) ? true : "engonly";
};
MiyaFormat.number = function(el,value) {
    var value = value ? value : el.value;
    var pattern = /^[0-9]+$/;
    return pattern.test(value) ? true : "number";
};
MiyaFormat.residentno = function(el,value) {
    var pattern = /^(\d{6})-?(\d{5}(\d{1})\d{1})$/;
    var num = value ? value : el.value;
    if (!pattern.test(num)) return "invalid";
    num = RegExp.$1 + RegExp.$2;
    if (RegExp.$3 == 7 || RegExp.$3 == 8 || RegExp.$4 == 9)
        if ((num[7]*10 + num[8]) %2) return "residentno";

    var sum = 0;
    var last = num.charCodeAt(12) - 0x30;
    var bases = "234567892345";
    for (var i=0; i<12; i++) {
        if (isNaN(num.substring(i,i+1))) return "residentno";
        sum += (num.charCodeAt(i) - 0x30) * (bases.charCodeAt(i) - 0x30);
    };
    var mod = sum % 11;
    if(RegExp.$3 == 7 || RegExp.$3 == 8 || RegExp.$4 == 9)
        return (11 - mod + 2) % 10 == last ? true : "residentno";
    else
        return (11 - mod) % 10 == last ? true : "residentno";
};
MiyaFormat.jumin = function(el,value) {
    var pattern = /^([0-9]{6})-?([0-9]{7})$/;
    var num = value ? value : el.value;
    if (!pattern.test(num)) return "jumin";
    num = RegExp.$1 + RegExp.$2;

    var sum = 0;
    var last = num.charCodeAt(12) - 0x30;
    var bases = "234567892345";
    for (var i=0; i<12; i++) {
        if (isNaN(num.substring(i,i+1))) return "jumin";
        sum += (num.charCodeAt(i) - 0x30) * (bases.charCodeAt(i) - 0x30);
    };
    var mod = sum % 11;
    return (11 - mod) % 10 == last ? true : "jumin";
};
MiyaFormat.foreignerno = function(el,value) {
    var pattern = /^(\d{6})-?(\d{5}[7-9]\d{1})$/;
    var num = value ? value : el.value;
    if (!pattern.test(num)) return "foreignerno";
    num = RegExp.$1 + RegExp.$2;
    if ((num[7]*10 + num[8]) %2) return "foreignerno";

    var sum = 0;
    var last = num.charCodeAt(12) - 0x30;
    var bases = "234567892345";
    for (var i=0; i<12; i++) {
        if (isNaN(num.substring(i,i+1))) return "foreignerno";
        sum += (num.charCodeAt(i) - 0x30) * (bases.charCodeAt(i) - 0x30);
    };
    var mod = sum % 11;
    return (11 - mod + 2) % 10 == last ? true : "foreignerno";
};
MiyaFormat.bizno = function(el,value) {
    var pattern = /([0-9]{3})-?([0-9]{2})-?([0-9]{5})/;
    var num = value ? value : el.value;
    if (!pattern.test(num)) return "bizno";
    num = RegExp.$1 + RegExp.$2 + RegExp.$3;
    var cVal = 0;
    for (var i=0; i<8; i++) {
        var cKeyNum = parseInt(((_tmp = i % 3) == 0) ? 1 : ( _tmp  == 1 ) ? 3 : 7);
        cVal += (parseFloat(num.substring(i,i+1)) * cKeyNum) % 10;
    };
    var li_temp = parseFloat(num.substring(i,i+1)) * 5 + "0";
    cVal += parseFloat(li_temp.substring(0,1)) + parseFloat(li_temp.substring(1,2));
    return parseInt(num.substring(9,10)) == 10-(cVal % 10)%10 ? true : "bizno";
};
MiyaFormat.phone = function(el,value) {
    var pattern = /^(0[2-8][0-5]?|01[01346-9]|0[5-6]0[5-6]?)-([1-9]{1}[0-9]{2,3})-([0-9]{4})$/;
    var pattern15xx = /^(1544|1566|1577|1588|1644|1688)-([0-9]{4})$/;
    var num = value ? value : el.value;
    return pattern.test(num) || pattern15xx.test(num) ? true : "phone";
};
MiyaFormat.homephone = function(el,value) {
    var pattern = /^(0[2-8][0-5][0-6]?|0[5-6]0[5-6]?)-([1-9]{1}[0-9]{2,3})-([0-9]{4})$/;
    var pattern15xx = /^(1544|1566|1577|1588|1644|1688)-([0-9]{4})$/;
    var num = value ? value : el.value;
    return pattern.test(num) || pattern15xx.test(num) ? true : "homephone";
};
MiyaFormat.handphone = function(el,value) {
    var pattern = /^(01[01346-9])-([1-9]{1}[0-9]{2,3})-([0-9]{4})$/;
    var num = value ? value : el.value;
    return pattern.test(num) ? true : "handphone";
};
MiyaFormat.isdate = function(el,value) {
    var value = value ? value : el.value;
    var pattern = /^[12][0-9]{3}\-[01]?[0-9]\-[0-3]?[0-9]$/;
    return pattern.test(value) ? true : "isdate";
};
MiyaFormat.zip = function(el,value) {
    var value = value ? value : el.value;
    var pattern = /^[0-9]{3}\-[0-9]{3}$/;
    return pattern.test(value) ? true : "zip";
};
MiyaFormat.jurino = function(el,value) {
    var num = value ? value : el.value;
    var pattern = /^([0-9]{6})-?([0-9]{7})$/;
    if (!pattern.test(num)) return "jurino";
    num = RegExp.$1 + RegExp.$2;
    var sum = 0;
    var last = parseInt(num.charAt(12), 10);
	for (var i=0; i<12; i++) {
		if (i % 2 == 0) {  // * 1
			sum += parseInt(num.charAt(i), 10);
		} else {    // * 2
			sum += parseInt(num.charAt(i), 10) * 2;
		};
	};
    var mod = sum % 10;
    return (10 - mod) % 10 == last ? true : "jurino";
};
