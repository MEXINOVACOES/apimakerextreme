/**
 * Método construtor do HTMLButton. Responsável por criar o componente Button.
 * @param sys - Indica o código do sistema.
 * @param formID - Indica o código do formulário.
 * @param posX - Posição do componente na tela em relação ao eixo X.
 * @param posY - Posição do componente na tela em relação ao eixo Y.
 * @param width - Largura do componente.
 * @param heigth - ALtura do componente.
 * @param description - Descricao do componente. 
 * @param img - imagem do button.
 **/
function HTMLButton(sys, formID, code, posX, posY, width, height, description, img) {
  this.create(sys, formID, code, posX, posY, width, height, description, '');
  
  if (img) this.img = img; else this.img = '';
  this.hint = '';
  this.description = this.description.replace(/\&/g, '');
  this.remainNotDBAwareValue = false;
}

/**
 * Herança do objeto.
 **/
HTMLButton.inherits(HTMLElementBase);

/**
 * Setando propriedades do componente.
 **/
HTMLButton.prototype.name = 'HTMLButton';
HTMLButton.prototype.tabKeys = [9];
HTMLButton.prototype.tabable = true;
HTMLButton.prototype.zindex = 100000;
HTMLButton.prototype.isBinary = true;

/**
 * @deprecated 
 **/
HTMLButton.prototype.setSkin = function(s) {
  skin = s;
}

/**
 * Seta a descrição do componente button (objeto HTMLButton).
 * @param description - Descrição do componente. 
 **/
HTMLButton.prototype.setDescription = function(description) {
  this.button.find(".mexButtonText").html(description);
  this.description = description;
      
  this.setEnabled(this.enabled);  
  this.setReadOnly(this.readOnly);
}

/**
 * Seta a cor da fonte da descrição do componente.
 * @param color - cor da fonte. 
 **/
HTMLButton.prototype.setColor = function(color) { //MEx: Agora a cor é alterada no CSS 
  this.button.find(".mexButtonText").css("color", color);
}

/**
 * Seta a fonte da descricação do componente.
 * @param f - fonte. 
 **/
HTMLButton.prototype.setFont = function(f) { //MEx: Agora a fonte é alterada no CSS
  this.button.find(".mexButtonText").css("font-family", f);
}

/**
 * Seta o tamanho da fonte da descrição do componente.
 * @param s - size. 
 **/
HTMLButton.prototype.setSize = function(s) { //MEx: Agora o tamanho fonte é alterada no CSS
  this.button.find(".mexButtonText").css("font-size", s);
}

/**
 * Seta a largura do button.
 * @param width - largura. 
 **/
HTMLButton.prototype.setWidth = function(width) {
  // MEx: muda a largura do componente
  width = parseInt(width);
  $MEx(this.div).width(width);
}

/**
 * Seta a altura do button.
 * @param height - altura.
 **/
HTMLButton.prototype.setHeight = function(height) {
  // MEx: muda a altura do componente
  height = parseInt(height);
  $MEx(this.div).height(height);
}

/**
 * @deprecated 
 **/
HTMLButton.prototype.setImage = function(img) {
  // MEx: Muda a imagem do botão
  this.img = img; 

  if (this.img && this.img.length > 0) {
    this.button.find("mexButtonImage").attr("src",this.getInnerImage());
  }  else {
    this.image = null;
  }
}

/**
 * 
 **/
HTMLButton.prototype.getInnerImage = function() {
  var r = this.img;
   if (!this.enabled)
    if (this.img.indexOf('_des.gif') == -1)
       r = this.img.replace('.gif', '_des.gif');
  return r;
}

/**
 * Seta o evento onClick do componente.
 **/
HTMLButton.prototype.setOnClick = function(evt) {
  if(evt) {
    this.onclick = evt;
    this.button.unbind('click').click(this.onclick);
  }
  this.setEnabled(this.enabled);
}

/**
 * 
 **/
HTMLButton.prototype.updateEvent = function(evt) {
  if (evt == 'click') {
    this.setEnabled(this.enabled);
  }
}

/**
 * Seta a propriedade ReadOnly do componente.
 * @param v - TRUE indica que o componente é somente leitura. Também remove o ovento 'click', 'mouseover' do mesmo. 
 **/
HTMLButton.prototype.setReadOnly = function(v) {
  this.setEnabled(v);
}

/**
 * Seta a propriedade Enable do componente.
 * @param v - FALSE desabilita o botão e também remove os seus eventos 'click' e 'mouseouver'.
 **/
HTMLButton.prototype.setEnabled = function(v) {
  if(v) {
    this.button.button("enable");  
  } else {
    this.button.button("disable");
  }
}

/**
 * Responsável por desenhar o HTML do componente button. 
 * @param doc - documento onde o componente será inserido.
 **/
HTMLButton.prototype.designComponent = function(doc) {
  
  // Garantir texto para foco na tabulação
  if (!this.img && this.description.length == 0) {
    this.description = "&nbsp";
  }
  
  // Id para o botão
  this.div.id = this.id;
  
  // MEx: adiciona o botão na tela
  var button = document.createElement("button");
  button.setAttribute("type", "button");
  button.innerHTML = "<span class=\"mexButtonIcon\"></span><span class=\"mexButtonText\">"+ this.description + "</span>";
  $MEx(this.div).append(button);
  this.button = $MEx(button);
  this.button.button();
  this.button.css({ width: '100%', height: '100%'});
  
  // MEx: Imagem do botão
  if (this.img && this.img.length > 0) {
    if (this.description.length > 0) {
      var imagem = "<img src='"+this.getInnerImage()+"' class=\"mexButtonImage\" border='0'>";
    } else {
      var imagem = "<img class=\"mexButtonImage\" src='"+this.getInnerImage()+"' border='0'>";
	}
  }
  this.button.find(".mexButtonIcon").html(imagem);
  
  var _self = this;
  this.button.keydown(function(event) {
  if ( event.which == 9 ) {
    var shiftKey = event.shiftKey
    if (!shiftKey)
     controller.next(_self);
    else
     controller.next(_self, true);
   }
  });

  //MEx: click do botão
  if (this.onclick) {
    this.button.unbind('click').click(this.onclick);
  }

  this.setEnabled(this.enabled);
  
  // Decoração do botão
  if(this.font) this.textStyle();
}

HTMLButton.prototype.textStyle = function() {
  var buttonText = this.button.find(".mexButtonText");
  if(this.font)      this.setFont(this.font);
  if(this.size)      this.setSize(this.size);
  if(this.weight) {  buttonText.css("font-weight", "bold") } else { buttonText.css("font-weight", "normal"); }; 
  if(this.italic)    buttonText.css("font-style", "italic");
  if(this.underline) buttonText.css("text-decoration", "underline");
  if(this.strikeout) buttonText.css("text-decoration", "line-through");
  if(this.bgColor)   buttonText.css("background-color", this.bgColor);
  if(this.color)     this.setColor(this.color);
}

/**
 * Executa o evento onclick do componente.
 **/
HTMLButton.prototype.click = function() {
  if (this.onclick) this.button.trigger("click");
}

HTMLButton.prototype.finalizeAction = function(filename) {
  if (this.onfinalize)
    this.onfinalize.call(this, filename);
}

HTMLButton.prototype.refresh = function(arg, filename) {
  if (filename) {
    this.finalizeAction(filename);
  } else {
    this.callMethod(HTMLElementBase, 'refresh');
  }
}

HTMLButton.prototype.createUploadAction = function() {
  this.setOnClick(this.getAction(this.openUpload));
}

/**
 * Chama Upload.jsp para realizar Upload de arquivos.
 **/
HTMLButton.prototype.openUpload = function() {
  var w = 250;
  var h = 50;
  var left = (screen.width - w) / 2;
  var top = (screen.height - h) / 2;
  MM_openBrWindow('upload'+PAGES_EXTENSION+'?sys='+this.sys+'&formID='+this.formID+'&comID='+this.code+'&type=R','UPLOAD'+this.formID+this.code,'toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width='+w+',height='+h+',left='+left+',top='+top);
}

HTMLButton.prototype.getGridShowValue = function(grid, row, column, oldContent, newDataArray) {
  return newDataArray[column];
}

HTMLButton.prototype.clickAction = function(e, o) {
  this.focus();
  if (this.enabled && this.visible) {
    controller.activeElement = this;
    if (this.onclick)
      this.onclick.call(this, e);
  }
  return false;
}

/**
 * Seta a propriedade Hint do HTMLButton.  
 * @param hint - valor da propriedade 'Dica' do componente no MAKER.
 **/
HTMLButton.prototype.setHint = function(hint) {
	this.callMethod(HTMLElementBase, "setHint", [hint]);
	
	if(this.button) {
	  this.button.attr("title", hint);
	  this.button.attr("alt", hint);
	}
}

/**
 * Evento onfocus herdado.
 **/
HTMLButton.prototype.focus = function() {
  var r = this.enabled && this.visible && !this.readonly && !this.resizable && !this.draggable;
  if (this.doc) r = r && isVisibleDiv(this.doc);
  if (r) this.button.focus();
  return r;
}

/**
 * Evento onblur herdado.
 **/
HTMLButton.prototype.blur = function() {
  var r = this.enabled && this.visible && !this.readonly;
  if (r && this.clickArea) this.clickArea.blur();
  return r;
}