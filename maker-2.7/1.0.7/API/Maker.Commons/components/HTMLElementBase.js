document.write("<script type=\"text/javascript\" language=\"JavaScript1.2\" src=\"wfr_masks.js\"></script>");

/**
 * HTMLElementBase
 **/
function HTMLElementBase(sys, formID, code, posX, posY, width, height, description, value) {
  this.create(sys, formID, code, posX, posY, width, height, description, value);
}

HTMLElementBase.inherits(HTMLObject);

HTMLElementBase.prototype.name    = 'HTMLElementBase';
HTMLElementBase.prototype.tabKeys = [9, 10, 13];
HTMLElementBase.prototype.tabable = true;
HTMLElementBase.prototype.zindex  = 1;
HTMLElementBase.prototype.tagName = 'input';
HTMLElementBase.prototype.canSelectOnFocus = true;
HTMLElementBase.prototype.canCheckRegularExpression = false;

HTMLElementBase.prototype.create = function(sys, formID, code, posX, posY, width, height, description, value) {
  // MEx change: Importando as bibliotecas necessárias
  // Após isso, todo componente funciona com JQuery e JQuery UI
  this.mkxImportCss("apimakerextreme/commons/jquery-ui/css/jquery-ui.min.css");
  this.mkxImportCss("apimakerextreme/commons/jquery-ui/css/jquery-ui-components.min.css");
  this.mkxImportJs("apimakerextreme/commons/jquery/jquery.min.js");
  this.mkxImportJs("apimakerextreme/commons/jquery-ui/js/jquery-ui.min.js");
  
  // MEx change: Resolve problema de conflito do Webrun com o JQuery
  $MEx = jQuery.noConflict();
  
  this.loadScripts();
  this.sys    = sys;
  this.formID = formID;
  this.code   = code;
  this.posX   = parseFloat(posX);
  this.posY   = parseFloat(posY);
  this.width  = parseFloat(width);
  this.height = parseFloat(height);
  this.value  = normalizeRuleParam(value, true);
  this.font   = null;
  this.size   = null;

  this.description  = description;

  this.enabled      = true;
  this.visible      = true;
  this.readonly     = false;
  this.required     = false;

  this.focuzed      = false;
  this.dependent    = false;
  this.tabindex     = 0;

  this.maskSuport    = false;
  this.componentDependences = new Array();
  
  this.decorationChanged = false;
  this.remainNotDBAwareValue = true;
}

HTMLElementBase.prototype.beforeSubmit = function() {
  
}

HTMLElementBase.prototype.afterSubmit = function() {
  
}

HTMLElementBase.prototype.setX = function(posX) {
  this.posX = parseInt(posX);
  this.div.style.left = this.posX;
}

HTMLElementBase.prototype.setY = function(posY) {
  this.posY = parseInt(posY);
  this.div.style.top = this.posY;
}

HTMLElementBase.prototype.setWidth = function(width) {
  this.width = parseInt(width);
  this.div.style.width = this.width;
  if (this.div != this.context) this.context.style.width = this.width;
  if (this.input)
    this.input.style.width = this.width;
}

HTMLElementBase.prototype.setHeight = function(height) {
  this.height = parseInt(height);
  this.div.style.height = this.height;
  if (this.div != this.context) this.context.style.height = this.height;
  if (this.input)
    this.input.style.height = this.height;
}

HTMLElementBase.prototype.setValue = function(value, checkDependences) {
	value = normalizeRuleParam(value, true);
  var temp = this.getValue();
  this.value = value;

  if (this.input) this.input.value = value;
  if (trim(this.value) != trim(temp))
    this.changeAction(null, this, !checkDependences);
}

HTMLElementBase.prototype.setDescription = function(description) { this.description = description;}

HTMLElementBase.prototype.setColor = function(color) {
  this.color= color;
  if (this.input) this.input.style.color = color;
}

HTMLElementBase.prototype.setBGColor = function(color) {
  this.bgColor= color;
  if (this.input) this.input.style.backgroundColor = color;
}

HTMLElementBase.prototype.setEnabled = function(v) {
  this.enabled = v;
  if (this.input) this.input.disabled = !v;
}

HTMLElementBase.prototype.setVisible = function(v) {
  this.visible = v;
  visibleDiv(this.div, v);
}

HTMLElementBase.prototype.setReadOnly = function(v) {
  this.readonly = v;
  if (this.input) {
    if (v) {
      this.input.setAttribute('readOnly', 'readonly');
    } else {
      this.input.removeAttribute('readOnly', 0);
    }
    if (!this.bgColor) {
      if (v) {
        this.input.style.backgroundColor = '#FFFFE1';
      } else {
        this.input.style.backgroundColor = '#FFF';
      }
    }
  }
}

HTMLElementBase.prototype.focus = function() {
  var r = this.tabable && this.enabled && this.visible && !this.readonly && !this.resizable && !this.draggable;
  if (this.doc) r = r && isVisibleDiv(this.doc);
  if (r && this.input) {
    this.input.focus();
    this.focuzed = true;
  }
  return r;
}

HTMLElementBase.prototype.getTabName = function() {
  return this.doc.tabName;
}

HTMLElementBase.prototype.getFocus = function(fromKeyBoard) {
	try {
	  if (this.tabable && this.enabled && this.visible && !this.readonly && !this.resizable && !this.draggable) {
	    if (this.doc && this.doc.focus)
	      if (this.doc.canFocus != null && !this.doc.canFocus.call(this)) {
	        return false;
	      }
	    this.fromKeyBoard = fromKeyBoard;
	    try {
  	      if (!this.doc.focus.isHTMLAction)
	        this.doc.focus();
	      else
	        this.doc.focus.call(this);
	    } catch(e) {
	    	//
	    }    
	    return this.focus();
	  } else
	    return false;
	} catch (e) {
		return false;
	}    
}


HTMLElementBase.prototype.blur = function() {
  var r = this.enabled && this.visible && !this.readonly;
  if (r && this.input) {
    this.input.blur();
    this.focuzed = false;
  }
  return r;
}

HTMLElementBase.prototype.setFont = function(f) {
  if (this.input)
    this.input.style.fontFamily = f;
}

HTMLElementBase.prototype.setSize = function(s) {
  if (this.input)
    this.input.style.fontSize = s;
}

HTMLElementBase.prototype.setWeight = function(w) {
  if (this.input) {
    if (w) this.input.style.fontWeight = "bold";
    else this.input.style.fontWeight = "normal";
   }
}

HTMLElementBase.prototype.setItalic = function(w) {
  if (this.input) {
    if (w) this.input.style.fontStyle = "italic";
    else this.input.style.fontStyle = "normal";
   }
}

HTMLElementBase.prototype.setUnderline = function(u) {
  if (this.input) {
    if (u) this.input.style.textDecoration = "underline";
    else this.input.style.textDecoration = "none";
  }
}

HTMLElementBase.prototype.setStrikeout = function(st) {
  if (this.input) {
    if (st) this.input.style.textDecoration = "line-through";
    else this.input.style.textDecoration = "none";
  }
}

HTMLElementBase.prototype.setTextDecoration = function() {
  if (this.input) {
    var textDecoration = "";
    if (this.underline || this.strikeout) {
      if (this.underline) {
        textDecoration += "underline";
      }
      if (this.strikeout) {
        textDecoration += " line-through";
      }
    } else {
      textDecoration = "none";
    }
    this.input.style.textDecoration = textDecoration;
  }
}

HTMLElementBase.prototype.hasEmptyValue = function() {
  return (this.getValue() == '');
}

// font, fontSize, fontWeight, italic, underline, strikeout, setBGColor, setColor
HTMLElementBase.prototype.setDecoration = function(f, s, w, i, u, st, bc, c) {
  this.decorationChanged = true;
  
  this.font = f;
  this.size = s;
  this.weight = w;
  this.italic = i;
  this.underline = u;
  this.strikeout = st;
  this.bgColor = bc;
  this.color = c;
}

HTMLElementBase.prototype.getHint = function() {
  return this.hint;
}

HTMLElementBase.prototype.setHint = function(hint) {
  this.hint = hint;
  if (this.input) {
    this.input.hint = hint;
    this.input.alt = hint;
    this.input.title = hint;
  }
}

HTMLElementBase.prototype.getSystem = function() { return this.sys; }
HTMLElementBase.prototype.getForm = function() { return this.formID; }
HTMLElementBase.prototype.getCode   = function() { return this.code; }
HTMLElementBase.prototype.getX = function() { return this.posX; }
HTMLElementBase.prototype.getY = function() { return this.posY; }
HTMLElementBase.prototype.getWidth = function() { return this.width; }
HTMLElementBase.prototype.getHeight = function() { return this.height; }
HTMLElementBase.prototype.getValue = function() { return this.value; }
HTMLElementBase.prototype.getShowValue = function() { return this.getValue(); }
HTMLElementBase.prototype.getGridShowValue = function(element, row, index, oldValue, dataArray) { return dataArray[index]; }
HTMLElementBase.prototype.getDescription = function() { return this.description; }
HTMLElementBase.prototype.getColor = function() { if (this.color) return this.color; else return ''; }
HTMLElementBase.prototype.getBGColor = function() { return this.bgColor; }
HTMLElementBase.prototype.getStyle = function() { return this.input.style; }
HTMLElementBase.prototype.getFont = function() { if (this.font) return this.font; else return ''; }
HTMLElementBase.prototype.getSize = function() { return this.size; }
HTMLElementBase.prototype.isRequired = function() { return this.required; }
HTMLElementBase.prototype.getVisible = function() { return this.visible; }
HTMLElementBase.prototype.getEnabled = function() { return this.enabled; }
HTMLElementBase.prototype.getReadOnly = function() { return this.readonly; }
HTMLElementBase.prototype.canRemainNotDBAwareValue = function() { return !this.isDBAware() && this.remainNotDBAwareValue; }

HTMLElementBase.prototype.ensureVisibility = function() {
  if (!this.getVisible()) {
    this.setVisible(true);
    this.setVisible(false);
  }
}

HTMLElementBase.prototype.toString = function() {
  if (this.description && this.description.length > 0)
    return '[object '+this.name+': '+this.description+']';
  else
    return '[object '+this.name+']';
}

HTMLElementBase.prototype.decorateRequired = function(text, required) {
  if (required)
    return '<strong>'+text+'</strong><strong style="color: #FF0000">&nbsp;*</strong>';
  else
    return text;
}

HTMLElementBase.prototype.getDiv = function(id, x, y, w, h, zindex, visibility) {
  return getDiv(id, x, y, w, h, zindex, visibility);
}

HTMLElementBase.prototype.setReadOnlyDiv = function(v) {
  if (!this.readOnlyDiv) {	
    this.readOnlyDiv = this.getDiv('ReadOnlyDiv'+this.code, 0, 0, this.width, this.height, 100005, true);
    this.readOnlyDiv.innerHTML = '<table width=100% height=100%><tr><td>&nbsp;</td></tr></table>';
  }
  if (!v) {
    if (containsNode(this.div, this.readOnlyDiv)) {
      this.div.removeChild(this.readOnlyDiv);
    }
  } else {
    if (!containsNode(this.div, this.readOnlyDiv)) {
      this.div.appendChild(this.readOnlyDiv);
    }
  }
}

HTMLElementBase.prototype.design = function(doc, tabControl) {
  this.doc = doc;
  this.div = this.getDiv('WFRComponent'+this.code, this.posX, this.posY, this.width, this.height, this.zindex, true);
  this.context = this.div;
  this.designComponent(doc, tabControl);
  doc.appendChild(this.div);
  this.init(tabControl);
}

HTMLElementBase.prototype.getPermissionDescription = function() {
  var componentDescription;
  if (!isNullable(this.description)) {
    componentDescription = this.description;
  } else {      
    componentDescription = (this.code + " - " + this.id);
  }
  return componentDescription;
}

HTMLElementBase.prototype.toPermissionMode = function() {
  this.divPermission = this.getDiv('WFRComponentPerm'+this.code, this.posX, this.posY, this.width, this.height, 100004, true);
  this.divPermission.style.cursor = "pointer";
  this.divPermission.innerHTML = '<table width=100% height=100%><tr><td>&nbsp;</td></tr></table>';
  this.divPermission.parent = this;
  //this.divPermission.style.backgroundColor = "#000000";

  if (this.hasRestrictions)
    this.setBGColor("#DDFFDD");

  var divHint = this.getDiv('ACCESS_HINT'+this.code, this.posX, this.posY, 300, 20, 100003, false);
  this.divPermission.divHint = divHint;
  this.divPermission.divHint.style.position = "absolute";
  this.divHint = divHint;

  var divLay = MM_findObj("lay");
  this.doc.appendChild(this.divPermission);
  divLay.appendChild(divHint);

  this.divPermission.onmouseover = function() {
    var desc = (getLocaleMessage("LABEL.COMPONENT") + ': ' + this.parent.getPermissionDescription());

    this.divHint.style.display = "block";
    this.divHint.style.top = mY;
    this.divHint.style.left = mX + 15;
    this.divHint.innerHTML = '<table border=0 cellpadding=2 cellspacing=1 bgcolor=#000000><tr><td bgcolor=#FFFF99>'+unescape(desc)+'</td></tr></table>';
  }
  this.divPermission.onmousemove = function() {
    this.divHint.style.top = mY;
    this.divHint.style.left = mX + 15;
  }
  this.divPermission.onmouseout = function() {
    this.divHint.style.display = "none";
  }
  this.attachEvent(this.divPermission, 'click', this.permissionClick);
}

HTMLElementBase.prototype.permissionClick = function(doc) {
  this.divHint.style.display = "none";
  openComAccess(this.sys, this.formID, this.code, document.title, this.getPermissionDescription());
}

HTMLElementBase.prototype.designComponent = function(doc) {
  this.context.innerHTML = this.value;
}

HTMLElementBase.prototype.reDesign = function() {
  this.free(true);
  this.div.innerHTML = '';
  this.designComponent(this.doc);
}

HTMLElementBase.prototype.freeComponent = function() {
  //Cada componente implementa o seu
}

HTMLElementBase.prototype.free = function(dontRemoveFromDoc, dontCallEvents) {
  controller.remove(this);

  if (!dontCallEvents && this.ondelete) {
    this.ondelete.call(this, null);
  }

  this.freeComponent();

  if (!dontRemoveFromDoc && this.doc && this.div) {
    this.doc.removeChild(this.div);
    this.div = null;
  }

  if (this.divDragComponent) {
    this.doc.removeChild(this.divDragComponent);
    this.divDragComponent = null;
  }

  return this;
}

HTMLElementBase.prototype.setEvent = function(evt, func) {
  this[evt.replace('on', '')] = func;
}

HTMLElementBase.prototype.init = function(tabControl) {
  if (this.bgColor) this.setBGColor(this.bgColor);
  if (this.color) this.setColor(this.color);
  if (this.font) this.setFont(this.font);
  if (this.size) this.setSize(this.size);
  if (this.weight) this.setWeight(this.weight);
  if (this.italic) this.setItalic(this.italic);
  
  //if (this.underline) this.setUnderline(this.underline);
  //if (this.strikeout) this.setStrikeout(this.strikeout);
  this.setTextDecoration();

  if (!this.enabled) this.setEnabled(this.enabled, true);
  if (this.readonly) this.setReadOnly(this.readonly, true);
  if (!this.visible) this.setVisible(this.visible, true);

  if (this.designDragComponent && (this.draggable || this.resizable)) {
    this.designDragComponent(this.doc);
  }

  if (this.input) {
    this.attachEvent(this.input, 'focus', this.focusAction);
    this.attachEvent(this.input, 'blur', this.blurAction);
    this.attachEvent(this.input, 'keydown', this.keydownAction);
    this.attachEvent(this.input, 'click', this.clickAction);
    this.attachEvent(this.input, 'change', this.changeAction);
    this.attachEvent(this.input, 'keypress', this.keypressAction);
    this.attachEvent(this.input, 'keyup', this.keyupAction);
  }

  if (tabControl)
    controller.addTabable(this);
  else
    controller.addNotTabable(this);

  this.designMask();

  if (this.permissionMode)
    this.toPermissionMode();

  this.afterInit();
}

HTMLElementBase.prototype.afterInit = function() {
}

HTMLElementBase.prototype.clickAction = function(e, o) {
  if (this.enabled && this.visible) {
    controller.activeElement = this;
    if (this.onclick)
      this.onclick.call(this, e);
  }
}


HTMLElementBase.prototype.keydownAction = function(e) {
  if (this.enabled && this.visible && !this.readonly) {
    var r = true;
    
    r = checkKey(e, this, this.tabKeys);

    if (this.onkeydown)
      r = this.onkeydown(e);
    return r;
  } else
    return true;
}

HTMLElementBase.prototype.keyupAction = function(e) {
  if (this.enabled && this.visible && !this.readonly) {
    var r = true;
    if (this.mask)
      r = this.mask.getKeyPress(e, this.input, null, this);
    if (this.onkeyup)
      r = this.onkeyup(e);
    return r;
  } else
    return true;
}

HTMLElementBase.prototype.keypressAction = function(e) {
  if (this.enabled && this.visible && !this.readonly) {
    var keyCode  = e.keyCode || e.which;
    var r = true;
    
    if (this.mask && !IE && !isChrome)
      r = this.mask.isAllowKeyPress(e, this.input);
      
    if (this.onkeypress) {
      var altKey   = false;
      var ctrlKey  = false;
      var shiftKey = false;
      var target   = e.target || e.srcElement;
      var targtype = target.type;
      var chr      = String.fromCharCode(keyCode);
  
      if (w3c) {
        if (document.layers) {
          altKey = ((e.modifiers & Event.ALT_MASK) > 0);
          ctrlKey = ((e.modifiers & Event.CONTROL_MASK) > 0);
          shiftKey = ((e.modifiers & Event.SHIFT_MASK) > 0);
        } else {
          altKey = e.altKey;
          ctrlKey = e.ctrlKey;
          shiftKey = e.shiftKey;
        }
      } else {
        altKey = e.altKey;
        ctrlKey = e.ctrlKey;
        shiftKey = e.shiftKey;
      }
      
      // Caso Chrome, não avalia as teclas F*
      var checkSpecialKey = true;
      if (navigator.userAgent != null && navigator.userAgent.indexOf("Chrome") != -1) {
        checkSpecialKey = false;
      }
      // Verifica se alguma tecla F* foi pressionada para um tratamento diferenciado
      if (checkSpecialKey && Browser.SpecialKeys[e.keyCode]) {
        chr = Browser.SpecialKeys[e.keyCode].toUpperCase();
      }
      
      r = this.onkeypress(altKey, ctrlKey, shiftKey, keyCode, chr);
      
      if (!isNullable(r) && r.toString && r.toString() == "CANCELEVENT") {
        if (e.preventDefault) {
          e.preventDefault();
          e.stopPropagation();
        } else {
          window.onhelp = function() { e.returnValue = false; }
          try {
            e.keyCode = 0;
          } catch (e) {
            // do nothing
          }
          e.returnValue = false;
          e.cancelBubble = true;
        }
        return false;
      }
    } else {
      if (!ctrlKey && !altKey && arrayIndexOf(this.tabKeys, keyCode) != -1) {
        r = false;
      }
    }
    
    return r;
  } else {
    return true;
  }
}

HTMLElementBase.prototype.focusAction = function(e) {
  if (this.enabled && this.visible && !this.readonly) {
    controller.activeElement = this;
    markField(this.input, this.tagName, this.canSelectOnFocus);
    e.fromKeyBoard = this.fromKeyBoard;
    if (this.onfocus)
      this.onfocus.call(this, e);
    this.fromKeyBoard = null;
  } 
}

HTMLElementBase.prototype.getValidDescription = function() {
    var description = this.getDescription();
    if (!description)
      description = '';
    if (description.length == 0 && this._description)
      return this._description;
    else
      return description;
}

HTMLElementBase.prototype.validateDataType = function(focus) {

  //Valida Data
  if (this.typeName == 'datetime' && !isDateTime(this.getValue())) {
    interactionError(getLocaleMessage("ERROR.INVALID_FIELD_DATE_FORMAT", this.getValidDescription()), focus?(function(e){e.getFocus(true);}):null,focus?[this]:null);
    return false;
  }

  //Valida Hora
  else if (this.typeName == 'time' && !isTime(this.getValue())) {
    interactionError(getLocaleMessage("ERROR.INVALID_FIELD_HOUR_FORMAT", this.getValidDescription()), focus?(function(e){e.getFocus(true);}):null,focus?[this]:null);
    return false;
  }

  return true;
}

HTMLElementBase.prototype.blurAction = function(e) {
  if (this.enabled && this.visible && !this.readonly) {
    this.focuzed = false;
    unmarkField(this.input, this.tagName, this.canSelectOnFocus);
    if (this.mask && this.input) {
      this.mask.getOnblur(e, this.input, this);
      if (trim(this.value) != trim(this.getValue()))
        this.changeAction(e, this);
    }

    if (this.onblur)
      this.onblur(e);
  }
}

HTMLElementBase.prototype.changeAction = function(e, o, dontCheckDependences) {
  //if (this.enabled && !this.readonly) {
  this.value = this.getValue();
  if (this.validateDataType(true)) {
    if (this.dependent && !dontCheckDependences)
      this.getDependeces();
    if (this.onchange)
      this.onchange.call(this, e);
    this.refreshComponentDependeces();
  }
  //}
}

HTMLElementBase.prototype.designMask = function() {
  if (this.maskSuport && this.input) {
    if (this.textMask) {
     this.mask = new Mask(this.textMask);
    } else if (this.dateMask) {
     this.mask = new Mask(this.dateMask, 'date');
    } else if (this.numberMask) {
     this.mask = new Mask(this.numberMask, 'number');
    } else if (this.canCheckRegularExpression && !isNullable(this.regularExpression)) {
      this.mask = new Mask("");
      this.mask.regularExpression = this.regularExpression;
    }
  }
}

HTMLElementBase.prototype.designEnableControl = function(v) {
  this.setEnabled(v);
  this.ec = new HTMLCheckbox(this.sys, this.formID, this.code, 0, this.height+3, this.width, 20, getLocaleMessage("LABEL.ALL"), !v?'true':'false', 'true', 'false');
  this.ec.inputname = 'WFRInput'+this.code+'EnableControl';
  this.ec.onchange = this.getAction(this.clickEnableControlAction);
  this.ec.design(this.context);
}

HTMLElementBase.prototype.clickEnableControlAction = function(e) {
  this.setEnabled(!this.ec.getChecked());
}

HTMLElementBase.prototype.actionOnFocus = function(e, src) {
  document.write(src);
}

HTMLElementBase.prototype.setOnClick = function(evt) {
  try {
  	this.input.onclick = evt;
  } catch(e) {
  	// Abafa erro quando tem um botão oculto em uma grid
  } 	
}

HTMLElementBase.prototype.setOnKeyPress = function(evt) {
  this.input.onkeypress = evt;
}

HTMLElementBase.prototype.refresh = function() {
  var url ="refresh.do?sys="+this.sys+"&formID="+this.formID +"&comID=" + this.code + "&action=refresh&goto="+formrow+"&value="+URLEncode(this.getValue())+'&toGrid='+(this.toGrid?'true':'false');
  
  if (d.t && d.t.dependences) {
    var components = d.t.dependences[this.code];
    if (components && components.length > 0) {
      for (var code in components) {
        if (isNumeric(code)) {
          var component = eval("$mainform().d.c_" + components[code]);
          if (component) {
            url += ("&WFRInput" + component.getCode() + "=" + URLEncode(component.getValue()));
          }
        }
      }
    }
  }
  
  eval(getContent(url));
}

HTMLElementBase.prototype.getDependeces = function(refreshSource) {
  // refreshSource tem que ser true para uso do setValue do lookup que atualiza ele mesmo.
  refreshSource = true;
  
  var gt = -1;
  try {
  	gt = formrow;
  } catch(e) {
    //	
  }
  
  var url ="GetDependences?componentName=WFRInput" + this.code + "&componentValue=" + URLEncode(this.getValue()) + "&sys="+this.sys+"&formID="+this.formID +"&codFormComp=" + this.formID + ("&refreshSource="+(refreshSource?"true":"false") + "&goto=" + gt )+'&toGrid='+(this.toGrid?'true':'false');
  
  if (d.t && d.t.dependences) {
    var components = d.t.dependences[this.code];
    if (components && components.length > 0) {
      for (var code in components) {
        if (isNumeric(code)) {
          var component = eval("$mainform().d.c_" + components[code]);
          if (component) {
            url += ("&WFRInput" + component.getCode() + "=" + URLEncode(component.getValue()));
          }
        }
      }
    }
  }
  
  this.timeout(function() {
    eval(getContent(url));
  }, 0);
}

HTMLElementBase.prototype.refreshComponentDependeces = function() {
  if (this.componentDependences && this.componentDependences.length > 0) {
    for (var index in this.componentDependences) {
      if (isNumeric(index)) {
        var component = this.componentDependences[index];
        if (component) {
          component.refresh();
        }
      }
    }
  }
}

HTMLElementBase.prototype.setDraggable = function(draggable) {
  this.draggable = draggable;


  if (this.draggable) {
    this.designDragComponent(this.doc);
  } else {
    this.doc.removeChild(this.divDragComponent);
  }
}

HTMLElementBase.prototype.setResizable = function(resizable) {
  this.resizable = resizable;

  if (this.resizable) {
    if (!this.divDragComponent || !this.divDragComponent.draggable) {
      this.designDragComponent(this.doc);
    }

    this.divDragComponent.resizeComponentsCreated = false;
  }
}

HTMLElementBase.prototype.designDragComponent = function(doc) {
  this.blur();
  var componentId = this.sys + "_DragComponent_" + this.code;

  this.divDragComponent = this.getDiv(componentId, this.posX, this.posY, this.width, this.height, 100001, true);
  this.divDragComponent.style.cursor = "move";
  this.divDragComponent.draggable = true;
  this.divDragComponent.dragActivated = false;
  //this.divDragComponent.innerHTML = '<table width=100% height=100%><tr><td>&nbsp;</td></tr></table>';
  doc.appendChild(this.divDragComponent);

  this.attachEvent(this.divDragComponent, 'mousedown', this.dragInitComponent);
}

HTMLElementBase.prototype.removeResizeDivs = function(e, divClicked) {
  if (!controller.hasSelectedComponent()) {
    controller.onComponentSelectionChangeAction(null, this);
    controller.setSelectedComponent(this);
  } else {
    var lastSelectedComponent = controller.getSelectedComponent();
    var lastDivDragComponent = lastSelectedComponent.divDragComponent;
    var clickedObject = window.event ? event.srcElement : e.target;

    var dragComponentRegExp = /^.+_DragComponent_.+$/;
    var isDragComponent = dragComponentRegExp.test(clickedObject.name);

    var resizeComponentRegExp = /^.+_ResizeComponent_.+$/;
    var isResizeComponent = resizeComponentRegExp.test(clickedObject.name);

    // Se o elemento selecionado for diferente do que estava selecionado ou se foi clicado fora de algum objeto da tela,
    // então remove-se as DIV's de redimensionamento do objeto que estava clicado.
    if (lastDivDragComponent && lastDivDragComponent.resizeComponentsCreated) {
      if ( (this != lastSelectedComponent && isDragComponent) || (!isResizeComponent && !isDragComponent) ) {
        // Remove as DIV's do objeto que estava selecionado
        if (lastSelectedComponent.divNWResize) lastDivDragComponent.removeChild(lastSelectedComponent.divNWResize);
        if (lastSelectedComponent.divSWResize) lastDivDragComponent.removeChild(lastSelectedComponent.divSWResize);
        if (lastSelectedComponent.divNEResize) lastDivDragComponent.removeChild(lastSelectedComponent.divNEResize);
        if (lastSelectedComponent.divSEResize) lastDivDragComponent.removeChild(lastSelectedComponent.divSEResize);
        if (lastSelectedComponent.divNResize) lastDivDragComponent.removeChild(lastSelectedComponent.divNResize);
        if (lastSelectedComponent.divSResize) lastDivDragComponent.removeChild(lastSelectedComponent.divSResize);
        if (lastSelectedComponent.divEResize) lastDivDragComponent.removeChild(lastSelectedComponent.divEResize);
        if (lastSelectedComponent.divWResize) lastDivDragComponent.removeChild(lastSelectedComponent.divWResize);

        // DIV's para redimensionamento do componente foram removidas. Por isso a necessidade de atualizar a variável de controle abaixo
        lastDivDragComponent.resizeComponentsCreated = false;

        if (isDragComponent) {
          // Evento chamado ao modificar o componente selecionado
          controller.onComponentSelectionChangeAction(lastSelectedComponent, this);

          // Seta o novo componente selecionado
          controller.setSelectedComponent(this);
        }
      }

      // Caso clique fora de algum objeto, então seta o componente selecionado para null
      if (!isResizeComponent && !isDragComponent) {
        controller.onComponentSelectionChangeAction(lastSelectedComponent, null);

        this.removeEvent(document, 'mousedown');
        controller.setSelectedComponent(null);
      }
    // Caso não seja resizable, mas seja draggable e foi o último selecionado, então o evento abaixo
    // deve ser invocado
    } else if (isDragComponent) {
      controller.onComponentSelectionChangeAction(lastSelectedComponent, this);

      this.removeEvent(document, 'mousedown');
      controller.setSelectedComponent(this);
    }
  }
}

HTMLElementBase.prototype.dragKeyDownComponent = function(e) {
  var TAB = 9, ENTER = 13, DEL = 46;
  var code = e.keyCode || e.which;

  switch(code) {
    case DEL: {
      if (this.deletekeydown) {
        return this.deletekeydown(e, this);
      }
    }
  }

  return true;
}

HTMLElementBase.prototype.dragInitComponent = function(e) {
  var evt = window.event ? window.event : e;
  
  var divDragComponent = this.divDragComponent;

  if (divDragComponent && divDragComponent.draggable && !divDragComponent.dragActivated) {
    this.mouseDiffX = 0;
    this.mouseDiffY = 0;

    divDragComponent.dragMouseMoved = false;
    divDragComponent.dragApproved = true;
    divDragComponent.dragActivated = true;

    if (isNaN(parseInt(divDragComponent.style.left))) {
      divDragComponent.style.left = 0;
    }

    if (isNaN(parseInt(divDragComponent.style.top))) {
      divDragComponent.style.top = 0;
    }

    divDragComponent.dragOffsetX = parseInt(divDragComponent.style.left);
    divDragComponent.dragOffsetY = parseInt(divDragComponent.style.top);

    if (this.designResizeComponent && this.resizable) {
      if (!divDragComponent.resizeComponentsCreated) {
        this.designResizeComponent(this.doc);
      }
    }
      
    this.removeEvent(document, 'mousedown');
    this.attachEvent(document, 'mousedown', this.removeResizeDivs, null, this.divDragComponent);

    this.removeEvent(document, 'keydown');
    this.attachEvent(document, 'keydown', this.dragKeyDownComponent);

    divDragComponent.dragPosX = evt.clientX;
    divDragComponent.dragPosY = evt.clientY;

    if (evt.preventDefault) {
      evt.preventDefault();
    }

    this.attachEvent(this.doc, 'mousemove', this.dragMoveComponent);
    this.attachEvent(this.doc, 'mouseup', this.dragLeaveComponent);

    this.onDragInitComponent(e);
    
    /* TODO Botão direito do mouse
    if (evt.button == 2) {
      controller.onRightClickAction(e, this);
    }*/
  }
}

HTMLElementBase.prototype.dragMoveComponent = function(e) {
  var divDragComponent = this.divDragComponent;

  if (divDragComponent && divDragComponent.draggable && divDragComponent.dragApproved && divDragComponent.dragActivated) {
    divDragComponent.dragMouseMoved = true;

    var evt = window.event ? window.event : e;

    this.mouseDiffX = evt.clientX - divDragComponent.dragPosX;
    this.mouseDiffY = evt.clientY - divDragComponent.dragPosY;

    var left = divDragComponent.dragOffsetX + this.mouseDiffX;
    var top = divDragComponent.dragOffsetY + this.mouseDiffY;
    var oldLeft = this.getX();
    var oldTop = this.getY();

    if (top > 0) {
      divDragComponent.style.top = top + "px";
      this.setY(top);
    }

    if (left > 0) {
      divDragComponent.style.left = left + "px";
      this.setX(left);
    }

    this.onDragMoveComponent(e, oldLeft, oldTop, this.mouseDiffX, this.mouseDiffY);

    return true;
  } else {
    return false;
  }
}

HTMLElementBase.prototype.dragLeaveComponent = function(e) {
  var divDragComponent = this.divDragComponent;

  if (divDragComponent && divDragComponent.draggable && divDragComponent.dragApproved) {
    divDragComponent.dragApproved = false;
    divDragComponent.dragActivated = false;

    if (divDragComponent.dragMouseMoved) {
      divDragComponent.dragMouseMoved = false;
    }

    this.removeEvent(this.doc, 'mousemove');
    this.removeEvent(this.doc, 'mouseup');
  }

  this.onDragLeaveComponent(e);
}

/**
 * Evento lançado ao clicar em um objeto para movimentá-lo.<br/>
 * Executa a função ondragini do objeto, caso exista, passando como parâmetros, nesta ordem:<br/>
 *
 * @1 = o próprio componente<br/>
 * @2 = objeto responsável pela movimentação do objeto<br/>
 *
 * @param e evento
 */
HTMLElementBase.prototype.onDragInitComponent = function(e) {
  if (this.ondragini) {
    this.ondragini(this, this.divDragComponent);
  }
}

/**
 * Evento lançado ao movimentar um objeto.<br/>
 * Executa a função ondragdrop do objeto, caso exista, passando como parâmetros, nesta ordem:<br/>
 *
 * @1 = posição X do componente<br/>
 * @2 = posição Y do componente<br/>
 * @3 = antiga posição X do componente<br/>
 * @4 = antiga posição Y do componente<br/>
 * @5 = o próprio objeto<br/>
 * @6 = quanto andou o mouse na posição X<br/>
 * @7 = quanto andou o mouse na posição Y<br/>
 * @8 = objeto responsável pela movimentação do objeto<br/>
 *
 * @param e evento
 * @param oldX antiga posição X do componente
 * @param oldY antiga posição Y do componente
 * @param mouseDiffX quanto andou o mouse na posição X
 * @param mouseDiffY quanto andou o mouse na posição Y
 */
HTMLElementBase.prototype.onDragMoveComponent = function(e, oldX, oldY, mouseDiffX, mouseDiffY) {
  if (this.ondragdrop) {
    this.ondragdrop(this.getX(), this.getY(), oldX, oldY, this, mouseDiffX, mouseDiffY, this.divDragComponent);
  }
}

/**
 * Evento lançado ao liberar o clique em um objeto após movimentá-lo.<br/>
 * Executa a função ondragend do objeto, caso exista, passando como parâmetros, nesta ordem:
 *
 * @1 = o próprio componente<br/>
 * @2 = objeto responsável pela movimentação do objeto<br/>
 *
 * @param e evento
 */
HTMLElementBase.prototype.onDragLeaveComponent = function(e) {
  if (this.ondragend) {
    this.ondragend(this, this.divDragComponent);
  }
}

HTMLElementBase.prototype.resizeWidth = 5;
HTMLElementBase.prototype.resizeHeight = 5;
HTMLElementBase.prototype.cursorMove = "move";
HTMLElementBase.prototype.cursorNWResize = "nw-resize";
HTMLElementBase.prototype.cursorSWResize = "sw-resize";
HTMLElementBase.prototype.cursorNEResize = "ne-resize";
HTMLElementBase.prototype.cursorSEResize = "se-resize";
HTMLElementBase.prototype.cursorNResize = "n-resize";
HTMLElementBase.prototype.cursorSResize = "s-resize";
HTMLElementBase.prototype.cursorEResize = "e-resize";
HTMLElementBase.prototype.cursorWResize = "w-resize";

HTMLElementBase.prototype.designResizeComponent = function(doc) {

  function setResizeDivDefaultProperties(divResize) {
    divResize.style.backgroundColor = "orange";
    divResize.style.overflow = "hidden";
    divResize.resizable = true;
    divResize.resizeActivated = false;

    return divResize;
  }

  var divDragComponent = this.divDragComponent;
  divDragComponent.resizeComponentsCreated = true;

  // ########## Designs NW Div
  var nwResizeId = this.sys + "_NW_ResizeComponent_" + this.code;

  this.divNWResize = this.getDiv(nwResizeId, 0, 0, this.resizeWidth, this.resizeHeight, 1, true);
  this.divNWResize.style.cursor = this.cursorNWResize;
  setResizeDivDefaultProperties(this.divNWResize);

  divDragComponent.appendChild(this.divNWResize);

  // Adiciona o evento onmousedown à div NW passando o mesmo como parâmetro para a chamada da função
  this.attachEvent(this.divNWResize, 'mousedown', this.resizeInit, null, [this.divNWResize, this.cursorNWResize]);

  // ########## Designs SW Div
  var swResizeId = this.sys + "_SW_ResizeComponent_" + this.code;
  // Altura do componente subtraído da altura da DIV criada
  var swPosY = this.getHeight() - this.resizeHeight;

  this.divSWResize = this.getDiv(swResizeId, 0, swPosY, this.resizeWidth, this.resizeHeight, 1, true);
  this.divSWResize.style.cursor = this.cursorSWResize;
  setResizeDivDefaultProperties(this.divSWResize);

  divDragComponent.appendChild(this.divSWResize);

  // Adiciona o evento onmousedown à div SW passando o mesmo como parâmetro para a chamada da função
  this.attachEvent(this.divSWResize, 'mousedown', this.resizeInit, null, [this.divSWResize, this.cursorSWResize]);

  // ########## Designs NE Div
  var neResizeId = this.sys + "_NE_ResizeComponent_" + this.code;
  // Largura do componente subtraído da largura da DIV criada
  var nePosX = this.getWidth() - this.resizeWidth;

  this.divNEResize = this.getDiv(neResizeId, nePosX, 0, this.resizeWidth, this.resizeHeight, 1, true);
  this.divNEResize.style.cursor = this.cursorNEResize;
  setResizeDivDefaultProperties(this.divNEResize);

  divDragComponent.appendChild(this.divNEResize);

  // Adiciona o evento onmousedown à div NE passando o mesmo como parâmetro para a chamada da função
  this.attachEvent(this.divNEResize, 'mousedown', this.resizeInit, null, [this.divNEResize, this.cursorNEResize]);

  // ########## Designs SE Div
  var seResizeId = this.sys + "_SE_ResizeComponent_" + this.code;
  // Largura do componente subtraído da largura da DIV criada
  var sePosX = this.getWidth() - this.resizeWidth;
  // Altura do componente subtraído da altura da DIV criada
  var sePosY = this.getHeight() - this.resizeHeight;

  this.divSEResize = this.getDiv(seResizeId, sePosX, sePosY, this.resizeWidth, this.resizeHeight, 1, true);
  this.divSEResize.style.cursor = this.cursorSEResize;
  setResizeDivDefaultProperties(this.divSEResize);

  divDragComponent.appendChild(this.divSEResize);

  // Adiciona o evento onmousedown à div SE passando o mesmo como parâmetro para a chamada da função
  this.attachEvent(this.divSEResize, 'mousedown', this.resizeInit, null, [this.divSEResize, this.cursorSEResize]);

if (!this.resizeProportional) {
  // ########## Designs N Div
  var nResizeId = this.sys + "_N_ResizeComponent_" + this.code;

  var nPosX = (this.getWidth() / 2) - (this.resizeWidth / 2);

  this.divNResize = this.getDiv(nResizeId, nPosX, 0, this.resizeHeight, this.resizeWidth, 1, true);
  this.divNResize.style.cursor = this.cursorNResize;
  setResizeDivDefaultProperties(this.divNResize);

  divDragComponent.appendChild(this.divNResize);

  // Adiciona o evento onmousedown à div S passando o mesmo como parâmetro para a chamada da função
  this.attachEvent(this.divNResize, 'mousedown', this.resizeInit, null, [this.divNResize, this.cursorNResize]);

  // ########## Designs S Div
  var sResizeId = this.sys + "_S_ResizeComponent_" + this.code;

  var sPosX = (this.getWidth() / 2) - (this.resizeWidth / 2);
  var sPosY = this.getHeight() - this.resizeHeight;

  this.divSResize = this.getDiv(sResizeId, sPosX, sPosY, this.resizeWidth, this.resizeHeight, 1, true);
  this.divSResize.style.cursor = this.cursorSResize;
  setResizeDivDefaultProperties(this.divSResize);

  divDragComponent.appendChild(this.divSResize);

  // Adiciona o evento onmousedown à div S passando o mesmo como parâmetro para a chamada da função
  this.attachEvent(this.divSResize, 'mousedown', this.resizeInit, null, [this.divSResize, this.cursorSResize]);

  // ########## Designs E Div
  var eResizeId = this.sys + "_E_ResizeComponent_" + this.code;

  var ePosX = this.getWidth() - this.resizeWidth;
  var ePosY = (this.getHeight() / 2) - (this.resizeHeight / 2);

  this.divEResize = this.getDiv(eResizeId, ePosX, ePosY, this.resizeWidth, this.resizeHeight, 1, true);
  this.divEResize.style.cursor = this.cursorEResize;
  setResizeDivDefaultProperties(this.divEResize);

  divDragComponent.appendChild(this.divEResize);

  // Adiciona o evento onmousedown à div E passando o mesmo como parâmetro para a chamada da função
  this.attachEvent(this.divEResize, 'mousedown', this.resizeInit, null, [this.divEResize, this.cursorEResize]);

  // ########## Designs W Div
  var wResizeId = this.sys + "_W_ResizeComponent_" + this.code;

  var wPosY = (this.getHeight() / 2) - (this.resizeHeight / 2);

  this.divWResize = this.getDiv(wResizeId, 0, wPosY, this.resizeWidth, this.resizeHeight, 1, true);
  this.divWResize.style.cursor = this.cursorWResize;
  setResizeDivDefaultProperties(this.divWResize);

  divDragComponent.appendChild(this.divWResize);

  // Adiciona o evento onmousedown à div W passando o mesmo como parâmetro para a chamada da função
  this.attachEvent(this.divWResize, 'mousedown', this.resizeInit, null, [this.divWResize, this.cursorWResize]);
}
}

HTMLElementBase.prototype.setResizeProportional = function(resizeProportional) {
  this.resizeProportional = resizeProportional;
}

HTMLElementBase.prototype.resizeInit = function(e, divResize, cursorType) {
  if (divResize.resizable && !divResize.resizeActivated) {
    // Componente não pode ser movido, enquanto estiver em modo de redimensionamento
    this.divDragComponent.draggable = false;
    // É alterado o cursor para não aparecer o cursor de movimento - move - durante o redimenasionamento
    this.divDragComponent.style.cursor = cursorType;

    // Inicia as variáveis de controle para o componente poder ser redimensionado
    divResize.resizeMouseMoved = false;
    divResize.resizeApproved = true;
    divResize.resizeActivated = true;

    if (isNaN(parseInt(divResize.style.left))) {
      divResize.style.left = 0;
    }

    if (isNaN(parseInt(divResize.style.top))) {
      divResize.style.top = 0;
    }

    divResize.resizeOffsetX = parseInt(divResize.style.left);
    divResize.resizeOffsetY = parseInt(divResize.style.top);

    var evt = window.event ? window.event : e;

    // É atribuida à variável - divResize.resizePosX - a posição X do mouse
    divResize.resizePosX = evt.clientX;

    // É atribuida à variável - divResize.resizePosY - a posição Y do mouse
    divResize.resizePosY = evt.clientY;

    if (evt.preventDefault) {
      evt.preventDefault();
    }

    // Adiciona os eventos onmousemove e onmouseup ao doc
    this.attachEvent(this.doc, 'mousemove', this.resizeMove, null, [divResize]);
    this.attachEvent(this.doc, 'mouseup', this.resizeLeave, null, [divResize]);

    this.onResizeInit(e, divResize);
  }
}

HTMLElementBase.prototype.resizeMove = function(e, divResize) {
  if (divResize && divResize.resizable && divResize.resizeApproved && divResize.resizeActivated) {
    divResize.resizeMouseMoved = true;

    var evt = window.event ? window.event : e;

    var left, top, width, height;

    // ######## Comentário Geral para os if's abaixo
    // evt.clientX = posição X corrente do mouse
    // divResize.resizePosX = posição X antiga do mouse
    // (evt.clientX - divResize.resizePosX) = diferença do movimento horizontal

    var horizontalMouseDiff = evt.clientX - divResize.resizePosX;
    var verticalMouseDiff = evt.clientY - divResize.resizePosY;

    // Pode alterar as posições X e Y, e a largura e altura
    var northRexExp = /_N.?_/;
    if (northRexExp.test(divResize.name) && verticalMouseDiff != 0) {
      top = this.getY() + verticalMouseDiff;
      height = this.getHeight() - verticalMouseDiff;
    }

    var southRexExp = /_S.?_/;
    if (southRexExp.test(divResize.name) && verticalMouseDiff != 0) {
      height = this.getHeight() + verticalMouseDiff;
    }

    var eastRexExp = /_.?E_/;
    if (eastRexExp.test(divResize.name) && horizontalMouseDiff != 0) {
      width = this.getWidth() + horizontalMouseDiff;
    }

    var westRexExp = /_.?W_/;
    if (westRexExp.test(divResize.name) && horizontalMouseDiff != 0) {
      left = this.getX() + horizontalMouseDiff;
      width = this.getWidth() - horizontalMouseDiff;
    }

    var oldX = this.getX();
    var oldY = this.getY();
    var oldWidth = this.getWidth();
    var oldHeight = this.getHeight();

    var minHeight;
    if (this.minHeight) {
      minHeight = this.minHeight;
    } else {
      minHeight = 4 * this.resizeHeight;
    }

    var minWidth;
    if (this.minWidth) {
      minWidth = this.minWidth;
    } else {
      minWidth = 4 * this.resizeWidth;
    }

    height = height || this.getHeight();
    width = width || this.getWidth()

    if (height) {
      if (height < minHeight) {
        height = minHeight;
      }
      // Altera a altura do componente
      this.setHeight(height);

      // Altera a altura da DIV responsável pelo redimensionamento
      this.divDragComponent.style.height = height;
    }

    if (width) {
      if (this.resizeProportional) {
          var temp = (height-oldHeight)/oldHeight;
          width = oldWidth + temp*oldWidth;
      }

      if (width < minWidth) {
        width = minWidth;
      }
      // Altera a largura do componente
      this.setWidth(width);

      // Altera a largura da DIV responsável pelo redimensionamento
      this.divDragComponent.style.width = width;
    }

    if (left) {
      if (this.getWidth() > minWidth) {
        // Altera a posição X do componente
        this.setX(left);

        // Altera a posição X da DIV responsável pelo redimensionamento
        this.divDragComponent.style.left = left;
      }
    }

    if (top) {
      if (this.getHeight() > minHeight) {
        // Altera a posição Y do componente
        this.setY(top);

        // Altera a posição Y da DIV responsável pelo redimensionamento
        this.divDragComponent.style.top = top;
      }
    }

    // Atribui a nova posição X do mouse à variável - divResize.resizePosX
    divResize.resizePosX = evt.clientX;

    // Atribui a nova posição Y do mouse à variável - divResize.resizePosY
    divResize.resizePosY = evt.clientY;

    this.setDivsNewPosition();

    this.onResizeMove(e, oldX, oldY, horizontalMouseDiff, verticalMouseDiff, divResize);

    return true;
  } else {
    return false;
  }
}

HTMLElementBase.prototype.resizeLeave = function(e, divResize) {
  if (divResize && divResize.resizable && divResize.resizeApproved) {
    // Reinicia as variáveis de controle do redimensionamento
    divResize.resizeApproved = false;
    divResize.resizeActivated = false;

    if (divResize.resizeMouseMoved) {
      divResize.resizeMouseMoved = false;
    }

    // Remove os eventos onmousemove e onmouseup ao doc
    this.removeEvent(this.doc, 'mousemove');
    this.removeEvent(this.doc, 'mouseup');

    // Faz o componente voltar a ser alterado de posição
    this.divDragComponent.draggable = true;

    // Muda o cursor para "move" no componente responsável pela alteração de posição
    this.divDragComponent.style.cursor = this.cursorMove;

    this.onResizeLeave(e);
  }
}

HTMLElementBase.prototype.setDivsNewPosition = function(e) {
  var east = this.getWidth() - this.resizeWidth;
  var south = this.getHeight() - this.resizeHeight;
  var middleWidth = (this.getWidth() / 2) - (this.resizeWidth / 2);
  var middleHeight = (this.getHeight() / 2) - (this.resizeHeight / 2);

  if (this.divNWResize) {
    this.divNWResize.style.left = 0;
    this.divNWResize.style.top = 0;
  }

  if (this.divNEResize) {
    this.divNEResize.style.left = east;
    this.divNEResize.style.top = 0;
  }

  if (this.divSWResize) {
    this.divSWResize.style.left = 0;
    this.divSWResize.style.top = south;
  }

  if (this.divSEResize) {
    this.divSEResize.style.left = east;
    this.divSEResize.style.top = south;
  }

  if (this.divNResize) {
    this.divNResize.style.left = middleWidth;
    this.divNResize.style.top = 0;
  }

  if (this.divSResize) {
    this.divSResize.style.left = middleWidth;
    this.divSResize.style.top = south;
  }

  if (this.divEResize) {
    this.divEResize.style.left = east;
    this.divEResize.style.top = middleHeight;
  }

  if (this.divWResize) {
    this.divWResize.style.left = 0;
    this.divWResize.style.top = middleHeight;
  }
}

/**
 * Evento lançado ao clicar em um objeto para redimensioná-lo.<br/>
 * Executa a função onresizeini do objeto, caso exista, passando como parâmetros, nesta ordem:<br/>
 *
 * @1 = o próprio componente<br/>
 * @2 = o objeto clicado para o redimensionamento<br/>
 *
 * @param e evento
 * @param divResize objeto clicado para o redimensionamento.
 */
HTMLElementBase.prototype.onResizeInit = function(e, divResize) {
  if (this.onresizeini) {
    this.onresizeini(this, divResize);
  }
}

/**
 * Evento lançado ao movimentar um objeto.<br/>
 * Executa a função onresize do objeto, caso exista, passando como parâmetros, nesta ordem:<br/>
 *
 * @1 = posição X do componente<br/>
 * @2 = posição Y do componente<br/>
 * @3 = antiga posição X do componente<br/>
 * @4 = antiga posição Y do componente<br/>
 * @5 = o próprio objeto<br/>
 * @6 = quanto andou o mouse na posição X<br/>
 * @7 = quanto andou o mouse na posição Y<br/>
 * @8 = objeto clicado para o redimensionamento<br/>
 * @9 = objeto responsável pela movimentação do objeto<br/>
 *
 * @param e evento
 * @param x posição X do componente
 * @param y posição Y do componente
 * @param oldX antiga posição X do componente
 * @param oldY posição X do componente
 * @param mouseDiffX quanto andou o mouse na posição X
 * @param mouseDiffY quanto andou o mouse na posição Y
 */
HTMLElementBase.prototype.onResizeMove = function(e, oldX, oldY, mouseDiffX, mouseDiffY, divResize) {
  if (this.onresize) {
    this.onresize(this.getX(), this.getY(), oldX, oldY, this, mouseDiffX, mouseDiffY, divResize, this.divDragComponent);
  }
}

/**
 * Evento lançado ao liberar o clique em um objeto após redimensioná-lo.<br/>
 * Executa a função onresizeend do objeto, caso exista, passando como parâmetros, nesta ordem:<br/>
 *
 * @1 = o próprio componente<br/>
 * @2 = o objeto clicado para o redimensionamento<br/>
 *
 * @param e evento
 * @param divResize objeto clicado para o redimensionamento.
 */
HTMLElementBase.prototype.onResizeLeave = function(e, divResize) {
  if (this.onresizeend) {
    this.onresizeend(this, divResize);
  }
}

/**
 * Atualiza a altura do componente e caso seja um componente draggable ou resizable, então reposiciona-se estes.
 *
 * @param height nova altura do componente
 */
HTMLElementBase.prototype.updateHeight = function(height) {
  this.setHeight(height);
  if (this.divDragComponent) {
    this.divDragComponent.style.height = height;
    this.setDivsNewPosition();
  }
}

/**
 * Atualiza a largura do componente e caso seja um componente draggable ou resizable, então reposiciona-se estes.
 *
 * @param width nova largura do componente
 */
HTMLElementBase.prototype.updateWidth = function(width) {
  this.setWidth(width);
  if (this.divDragComponent) {
    this.divDragComponent.style.width = width;
    this.setDivsNewPosition();
  }
}

/**
 * Atualiza a posição X do componente e caso seja um componente draggable ou resizable, então reposiciona-se estes.
 *
 * @param x nova posição X do componente
 */
HTMLElementBase.prototype.updateX = function(x) {
  this.setX(x);
  if (this.divDragComponent) {
    this.divDragComponent.style.left = x;
    this.setDivsNewPosition();
  }
}

/**
 * Atualiza a posição Y do componente e caso seja um componente draggable ou resizable, então reposiciona-se estes.
 *
 * @param x nova posição Y do componente
 */
HTMLElementBase.prototype.updateY = function(y) {
  this.setY(y);
  if (this.divDragComponent) {
    this.divDragComponent.style.top = y;
    this.setDivsNewPosition();
  }
}

/**
 * Atualiza informações do componente como: posição x, posição y, largura, altura e descrição
 * Apenas serão setadas as propriedades que tiverem valor
 *
 * @param obj objeto contendo os seguintes atributos: x, y, width, height, description
 */
HTMLElementBase.prototype.updateComponent = function(obj) {
  if (obj.x) {
    this.updateX(obj.x);
  }

  if (obj.y) {
    this.updateY(obj.y);
  }

  if (obj.width) {
    this.updateWidth(obj.width);
  }

  if (obj.height) {
    this.updateHeight(obj.height);
  }

  if (obj.description) {
    this.setDescription(obj.description);
  }
}

HTMLElementBase.prototype.noClickAreaSize = 5;

HTMLElementBase.prototype.isIn = function(x, y, x1, y1, x2, y2) {
  x1--;
  x2++;
  y1--;
  y2++;
  return x >= x1 && x <= x2 && y >= y1 && y <= y2;
}


HTMLElementBase.prototype.showNoClickArea = function(e) {
  this.timeout(this.showNoClickAreaTO, 0);
}

HTMLElementBase.prototype.showNoClickAreaTO = function(e) {
  if (!this.divNoClick) {

    var mouseX = mX;
    var mouseY = mY;

    var dx = findPosX(this.div);
    var dy = findPosY(this.div);
    var size = this.noClickAreaSize;
    var sX = size;
    var sY = size;

    var a1 = this.isIn(mouseX, mouseY, dx, dy, dx+sX, dy+this.height);
    var a2 = this.isIn(mouseX, mouseY, dx, dy, dx+this.width, dy+sY);
    var a3 = this.isIn(mouseX, mouseY, dx+this.width-sX, dy, dx+this.width, dy+this.height);
    var a4 = this.isIn(mouseX, mouseY, dx, dy+this.height-sY, dx+this.width, dy+this.height);

    if (!a1 && !a2 && !a3 && !a4) {
      if (mX <= dx+(this.width/2))
        a3 = true;
      else
        a1 = true;
    }

    var x = this.width-size;
    var y = 0;
    var w = size;
    var h = this.height;

    if (a1) {
      x = this.width-size;
      y = 0;
      w = size;
      h = this.height;
    }
    else
    if (a3) {
      x = 0;
      y = 0;
      w = size;
      h = this.height;
    }
    else
    if (a2) {
      x = 0;
      y = this.height-size;
      w = this.width;
      h = size;
    }
    else
    if (a4) {
      x = 0;
      y = 0;
      w = this.width;
      h = size;
    }

    this.divNoClick = this.getDiv('', x, y, w, h, 1000, true);
    this.divNoClick.style.backgroundColor = 'orange';
    this.attachEvent(this.divNoClick, 'mouseover', this.onMouseOverNoClickArea);
    this.attachEvent(this.divNoClick, 'mouseout', this.onMouseOutNoClickArea);
    this.div.appendChild(this.divNoClick);
  }
}

HTMLElementBase.prototype.removeNoClickArea = function() {
  this.timeout(this.removeNoClickAreaTO, 0);
}

HTMLElementBase.prototype.removeNoClickAreaTO = function() {
  if (this.divNoClick) {
    var x = findPosX(this.divNoClick);
    var y = findPosY(this.divNoClick);

    if (!this.isIn(mX, mY, x, y, x+this.divNoClick.offsetWidth, y+this.divNoClick.offsetHeight)) {
      this.div.removeChild(this.divNoClick);
      this.divNoClick = null;
    }
  }
}

HTMLElementBase.prototype.onMouseOverNoClickArea = function() {
  if (this.divNoClick) {
    if (this.click)
      this.click();
  }
}

HTMLElementBase.prototype.onMouseOutNoClickArea = function() {
  if (this.divNoClick) {
    this.div.removeChild(this.divNoClick);
    this.divNoClick = null;
  }
}

HTMLElementBase.prototype.addComponentDependence = function(component) {
  if (component) {
    this.componentDependences.push(component);
  }
}

HTMLElementBase.prototype.isDBAware = function() {
  return !isNullable(this.field);
}

HTMLElementBase.prototype.setGridValue = function(value) {
  this.value = value;
}

HTMLElementBase.prototype.flush = function() {
  this.divWResize = null;
  this.divEResize = null;
  this.divSResize = null;
  this.divNResize = null;
  this.divSEResize = null;
  this.divNEResize = null;
  this.divSWResize = null;
  this.divNWResize = null;
  this.divDragComponent = null;
  this.divHint = null;
  this.divPermission = null;
  this.input = null;
  this.componentDependences = null;
  this.context = null;
}

// MEx change: Adicionada função de importar biblioteca
HTMLElementBase.prototype.mkxImportJs = function(library) { 
        // Importa as bibliotecas Javascript   
		if(!document.importLibrary)
           document.importLibrary = new Array();
	var listaBibliotecas = document.importLibrary;   
	var flag = true;
	// Ler a variavel global verificando se já foi importada
	for(var i = 0; i < listaBibliotecas.length; i++){
		if(listaBibliotecas[i]==library){
			flag = false;
                        break;
		}            
	}
	//Verifica se já ta importado e importa a biblioteca
	if(flag){
		try {           
            webrun.include(library);
        } catch(e) {
            var script = document.createElement("script");
            script.src = library;
            script.type = "text/javascript";
            document.getElementsByTagName("head")[0].appendChild(script);
		}
		document.importLibrary.push(library);
	}
}

// MEx change: Adicionada função de importar css
HTMLElementBase.prototype.mkxImportCss = function(css) {
	// Importa as folhas de estilo
    if(!document.importCss)
	  document.importCss = new Array();
	var listaCss = document.importCss;   
	var flag = true;
	// Ler a variavel global verificando se já foi importada
	for(var i = 0; i < listaCss.length; i++){
		if(listaCss[i]==css){
			flag = false;
                        break;
		}            
	}
	//Verifica se já ta importado e importa a biblioteca
	if(flag){
		var lnk = document.createElement('link');
        lnk.setAttribute('type', "text/css" );
        lnk.setAttribute('rel', "stylesheet" );
        lnk.setAttribute('href', css );
        document.getElementsByTagName("head").item(0).appendChild(lnk);
  
		document.importCss.push(css);
	}
}

document.importCss = new Array();