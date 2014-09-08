/*! API Maker Extreme v1.0.3 - Versão Maker 3.0 | (c) 2013, 2014 MEX Inovações, LTDA. | mexinovacoes.com.br*/

// Conserta o problema com o Internet Explorer.
// Em que o webrun força o browser a renderizar em Quirks Mode
function fixIEPanelQuirksMode(ElementID, wantedWidth, wantedHeight) {
    if (jQuery.support.boxModel == false) {
      $MEx("#" + ElementID).each(function() {
         if(parseInt($MEx(this).css("height")) > 0) {
		    var oldHeight = parseInt($MEx(this).css("height"));
            qHeight=
               parseInt(wantedHeight) - (
               parseInt($MEx(this).css("padding-top")) +
               parseInt($MEx(this).css("padding-bottom")) +
               parseInt($MEx(this).css("border-top-width")) +
               parseInt($MEx(this).css("border-bottom-width")) - 20);
            $MEx(this).height(qHeight);
			
			// Ajusta a posição X
			var dialog = $MEx(this).closest(".ui-dialog");
			dialog.css("top", parseInt(dialog.css("top")) - ((qHeight - oldHeight)/2))
         }
         if(parseInt($MEx(this).css("width")) > 0) {
            $MEx(this).width(wantedWidth);
         }
      });
   }
}

/*
* Esta função cria uma aba e abre uma URL como conteúdo da aba criada.
*/
function __mkxCreateURLTab(formulario, componente, url, titulo, permiteFechar) {
        
   // Obtém o componente   
   var component = $c(componente, formulario);   

   // Caso o componente seja encontrado
   if(componente) {
     // Obtém a div onde o scroll deve ser adicionado     
     var div = component.div;     

     var found = false;
     var counter = 0;     

     var tabs = $MEx(div);     

     var tabsAnchors = $MEx( "#" + component.div.id + " .ui-tabs-anchor");  
        tabsAnchors.each(function() {
            if($MEx(this).html() == titulo) {            
                $MEx(component.div).tabs("option", {active : counter});                
                found = true;
            }            
            counter++;
     });     

     if(!found) {
       var id = "mexURLTab_" + Math.round((Math.random() * 10000000));     
  
       // Título     
       var tabTitulo = "<li><a href=\"#" + id + "\" id=\"" + id + "_tab\">" + titulo + "</a>";    
       // Adiciona o botão de fechar, se permitido   
       if(permiteFechar) {
         tabTitulo += "<span class='ui-icon ui-icon-close'>Remove Tab</span>";
       }     
       tabTitulo += "</li>";
  
       var tabContentHtml = "<iframe class=\"mexURLFrame\" frameborder=\"0\" src=\""+ url +"\" seamless=\"seamless\" marginheight=\"0\" marginwidth=\"0\" width=\"100%\"></iframe>";
        
       var tabs = $MEx(div);
       tabs.find( ".ui-tabs-nav" ).append( tabTitulo );
       tabs.append("<div id='"+ id + "'>" + tabContentHtml + "</div>");
   
       if(permiteFechar) {
          // Ação do click no botão         
          $MEx( "#" + id + "_tab").closest("li").find("span.ui-icon-close").bind( "click", function(evt) {             
              // dispara o evento associado ao fechar
              tabs.trigger("close", $MEx( this ).closest("li").find("a[class='ui-tabs-anchor']").html());             
              // remove a aba
              var panelId = $MEx( this ).closest( "li" ).remove().attr( "aria-controls" );
              $MEx( "#" + panelId ).remove();
              tabs.tabs( "refresh" );
              
                         
            // Dispara o evento ao fechar            
            var func = tabs.tabs("option","close")              
            var anchor = $MEx( this ).closest("li").find("a[class='ui-tabs-anchor']");
            if(func) func(evt,{tab : anchor[0]},anchor.html());                
          }); 
       }     
  
       // Calcula a altura do frame
       var frame = tabs.find("iframe[class='mexURLFrame']");         
       var parentHeight = frame.height(Math.floor(frame.closest(".mexTabs").height() - (5 + frame.closest(".mexTabs").find(".ui-tabs-nav").height())));
       tabs.tabs("refresh"); 

       // Ativa o painel adicionado
       $MEx(component.div).tabs("option", {active : ($MEx( "#" + component.div.id + " .ui-tabs-anchor").size() - 1)});     
     }
   }
}

/*
* Esta função cria uma aba e abre um formulário como conteúdo da aba criada.
*/
function __mkxCreateFormTab(formulario, componente, formularioDestino, titulo, permiteFechar, filtro, modo) {
        
   // Obtém o componente   
   var component = $c(componente, formulario);   

   // Caso o componente seja encontrado
   if(componente) {
     // Obtém a div onde o scroll deve ser adicionado     
     var div = component.div;     
     var tabs = $MEx(div);          

     var found = false;
     var counter = 0;     

     var tabsAnchors = $MEx( "#" + component.div.id + " .ui-tabs-anchor");  
     tabsAnchors.each(function() {
         if($MEx(this).html() == titulo) {            
             $MEx(component.div).tabs("option", {active : counter});                
              found = true;
          }            
          counter++;
     });

     if(!found) {
       var id = "mexFormTab_" + formularioDestino.replace("{","").replace("}","");     
 
       // Título     
       var tabTitulo = "<li><a href=\"#" + id + "\" id=\"" + id + "_tab\">" + titulo + "</a>";  
       // Adiciona o botão de fechar, se permitido   
       if(permiteFechar) {
         tabTitulo += "<span class='ui-icon ui-icon-close'>Remove Tab</span>";
       }     
       tabTitulo += "</li>";
  
			formURL = "form.jsp?sys=" + sysCode + "&action=openform&formID="+ formularioDestino +"&align=0&mode="+(modo?modo:-1)+"&goto=-1&filter="+(filtro?filtro:"")+"&scrolling=no";
	 //Alteração da correção da altura da moldura no IE 08/07/2013
	 var tabContentHtml = "<iframe class=\"mexFormFrame\" frameborder=\"0\" src=\""+ formURL +"\" seamless=\"seamless\" marginheight=\"0\" marginwidth=\"0\" width=\"100%\" height=\"100%\"></iframe>";
        
       tabs.find( ".ui-tabs-nav" ).append( tabTitulo );
       tabs.append("<div id='"+ id + "'>" + tabContentHtml + "</div>");
   
       if(permiteFechar) {     
          // Ação do click no botão
          $MEx( "#" + id + "_tab").closest("li").find("span.ui-icon-close").bind( "click", function(evt) {                     
                // remove a aba
                var panelId = $MEx( this ).closest( "li" ).remove().attr( "aria-controls" );
                $MEx( "#" + panelId ).remove();
                tabs.tabs( "refresh" );               
                
            // Dispara o evento ao fechar            
            var func = tabs.tabs("option","close")              
            var anchor = $MEx( this ).closest("li").find("a[class='ui-tabs-anchor']");
            if(func) func(evt,{tab : anchor[0]},anchor.html());                 
          }); 
       }
      
       // Calcula a altura do frame
       var frame = tabs.find("iframe[class='mexFormFrame']");         
 	//Alteração da correção da altura da moldura no IE 08/07/2013
	if(navigator.appName.indexOf('Microsoft')==-1){   
       var parentHeight = frame.height(Math.floor(frame.closest(".mexTabs").height() - (5 + frame.closest(".mexTabs").find(".ui-tabs-nav").height())));
	}
       tabs.tabs("refresh");                             

       // Ativa o painel adicionado
       $MEx(component.div).tabs("option", {active : ($MEx( "#" + component.div.id + " .ui-tabs-anchor").size() - 1)});              
     }
   }
}

/*
* Seleciona uma aba de acordo com o título ou com o índice.
*/
function __mkxSelectTab(formulario, componente, titulo) {

   // Obtém o componente   
   var component = $c(componente, formulario);      

   if(component) {
     // Testa se o titulo é um inteiro     
     if(!isNaN(titulo) && Math.floor(titulo) === titulo) {     
         $MEx(component.div).tabs("option", {active : titulo});
     } else {
        // Localiza o índice        
        var counter = 0;        
        var tabsAnchors = $MEx( "#" + component.div.id + " .ui-tabs-anchor");  
        tabsAnchors.each(function() {
            if($MEx(this).html() == titulo) {            
                $MEx(component.div).tabs("option", {active : counter});
            }            
            counter++;
         });         
     }      
   }
}

/*
* Habilita ou desabilita uma aba.
*/
function __mkxEnableTabItem(formulario, componente, titulo, habilitar) {

   // Obtém o componente   
   var component = $c(componente, formulario);      

   if(component) {
     // Testa se o titulo é um inteiro     
     if(!isNaN(titulo) && Math.floor(titulo) === titulo) {     
         $MEx(component.div).tabs( ((habilitar === "true") ? "enable" : "disable"), titulo );
     } else {
        // Localiza o índice        
        var counter = 0;        
        var tabsAnchors = $MEx( "#" + component.div.id + " .ui-tabs-anchor");  
        tabsAnchors.each(function() {
            if($MEx(this).html() == titulo) {            
                $MEx(component.div).tabs( ((habilitar === "true") ? "enable" : "disable"), counter );
            }            
            counter++;
         });         
     }      
   }
}

/*
* Exibe ou oculta uma aba de acordo com o título ou com o índice. 
*/
function __mkxShowTab(formulario, componente, titulo, mostrar) {

   // Obtém o componente   
   var component = $c(componente, formulario);      

   if(component) {
     var tabsAnchors = $MEx( "#" + component.div.id + " .ui-tabs-anchor");     

     // Testa se o titulo é um inteiro     
     if(!isNaN(titulo) && Math.floor(titulo) === titulo) {              
         var counter = 0;
         tabsAnchors.each(function() {
            if(counter == titulo) {            
              if(mostrar === "true") {
                var panelId = $MEx( this ).closest( "li" ).hide().attr( "aria-controls" );              
                $MEx( "#" + panelId ).hide();
              } else {
                var panelId = $MEx( this ).closest( "li" ).show().attr( "aria-controls" );              
                $MEx( "#" + panelId ).show();
              }
            }            
            counter++;
         });         
     } else {
         tabsAnchors.each(function() {
            if($MEx(this).html() == titulo) {            
              if(mostrar === "true") {
                var panelId = $MEx( this ).closest( "li" ).show().attr( "aria-controls" );              
                $MEx( "#" + panelId ).show();
              } else {
                var panelId = $MEx( this ).closest( "li" ).hide().attr( "aria-controls" );              
                $MEx( "#" + panelId ).hide();
              }
            }            
         });
     }      
   }
}

/*
* Esta função cria uma aba e adiciona um painel com conteúdo HTML.
*/
function __mkxCreateTabContent(formulario, componente, conteudo, titulo, permiteFechar) {
        
   // Obtém o componente   
   var component = $c(componente, formulario);   

   // Caso o componente seja encontrado
   if(componente) {
     // Obtém a div onde o scroll deve ser adicionado     
     var div = component.div;     
     var tabs = $MEx(div);
     var id = "mexHTMLTab_" + Math.round((Math.random() * 10000000));      

     // Título     
     var tabTitulo = "<li><a href=\"#" + id + "\" id=\"" + id + "_tab\">" + titulo + "</a>";  
     // Adiciona o botão de fechar, se permitido   
     if(permiteFechar) {
       tabTitulo += "<span class='ui-icon ui-icon-close'>Remove Tab</span>";
     }     
     tabTitulo += "</li>";
      
     tabs.find( ".ui-tabs-nav" ).append( tabTitulo );
     tabs.append("<div id='"+ id + "' class=\"mexAccordionContent\">" + conteudo + "</div>");
 
     if(permiteFechar) {
        // Ação do click no botão
        $MEx( "#" + id + "_tab").closest("li").find("span.ui-icon-close").bind( "click", function(evt) {        
            // dispara o evento associado ao fechar
            tabs.trigger("close", $MEx( this ).closest("li").find("a[class='ui-tabs-anchor']").html());             
            // remove a aba
            var panelId = $MEx( this ).closest( "li" ).remove().attr( "aria-controls" );
            $MEx( "#" + panelId ).remove();
            tabs.tabs( "refresh" );            

            // Dispara o evento ao fechar            
            var func = tabs.tabs("option","close")              
            var anchor = $MEx( this ).closest("li").find("a[class='ui-tabs-anchor']");
            if(func) func(evt,{tab : anchor[0]},anchor.html());             
        }); 
     }     

     tabs.tabs("refresh");

     // Ativa o painel adicionado
     $MEx(component.div).tabs("option", {active : ($MEx( "#" + component.div.id + " .ui-tabs-anchor").size() - 1)});             
   }
}

/*
* Esta função cria uma lista de propriedades para serem usadas na função "Abas - Criar abas na moldura MEx"
*/
function __mkxCreateTabProperties(evento, efeitoFechar, efeitoMostrar, efeitoPaginar) {
   // Retorna um JSON com as propriedades  
   var properties = new Array();     
   if(evento != null) properties["event"] = evento;   
   if(efeitoFechar != null) properties["hide"] = efeitoFechar;      
   if(efeitoMostrar != null) properties["show"] = efeitoMostrar;
   if(efeitoMostrar != null) properties["pagginEffect"] = efeitoPaginar;      

   properties["heightStyle"] = "auto";

   return properties;
}

/*
* Esta função cria um container de abas utilizando uma moldura.
*/
function __mkxRemoveTab(formulario, componente, titulo) {
    // Obtém o componente   
   var component = $c(componente, formulario);      

   if(component) {   
     var tabsAnchors = $MEx( "#" + component.div.id + " .ui-tabs-anchor");     

     // Testa se o titulo é um inteiro     
     if(!isNaN(titulo) && Math.floor(titulo) === titulo) {              
         var counter = 0;
         tabsAnchors.each(function() {         
            if(counter == titulo) {
                $MEx(component.div).trigger("close", $MEx( this ).html());            
                var panelId = $MEx( this ).closest( "li" ).remove().attr( "aria-controls" );              
                $MEx( "#" + panelId ).remove();
            }            
            counter++;
         });         
     } else {
         tabsAnchors.each(function() {
            if($MEx(this).html() == titulo) {
                $MEx(component.div).trigger("close", titulo);            
                var panelId = $MEx( this ).closest( "li" ).remove().attr( "aria-controls" );              
                $MEx( "#" + panelId ).remove();
            }            
         });
     } 
     
     $MEx(component.div).tabs( "refresh" );     
   }
}

/*
* Esta função cria um container de abas utilizando uma moldura.
*/
function __mkxCreateTab(formulario, componente, propriedades) {
   // Importa as folhas de estilo 
   mkxImportCss("apimakerextreme/commons/jquery-ui/css/jquery-ui.min.css");         
   mkxImportCss("apimakerextreme/commons/jquery-ui/css/jquery-ui-components.min.css");   
   mkxImportCss("apimakerextreme/plugins/ui-tabs-pagging/ui.tabs.paging.css");

   // Importa os scripts    
   mkxImportJs("apimakerextreme/commons/jquery/jquery.min.js");
   mkxImportJs("apimakerextreme/commons/jquery-ui/js/jquery-ui.min.js");    
   mkxImportJs("apimakerextreme/plugins/ui-tabs-pagging/ui.tabs.paging.js");
       
   // Obtém o componente   
   var component = $c(componente, formulario);   

   // Caso o componente seja encontrado
   if(componente) {
     // Obtém a div onde o scroll deve ser adicionado     
     var div = component.div;     
     div.id = "mexTab_" + componente;     
     div.className = "mexTabs";
     div.innerHTML = "<ul></ul>";     

     // Associa evento ao ativar a aba para chamar o ao navegar do formulário.     
     // Caso o conteúdo associado seja o formulário
     if(!propriedades) {     
       propriedades = {};
     }
     propriedades.activate = function(evt, ui) {  
       var tabPanelId = ui.newTab.find("a").attr("href"); 
       // Solução de contorno para o IE
       // as vezes o atributo href vem o a URL completa ex.:       
       // Então eu localizo o pathname e remmovo
       var pathname = window.location.href;       
       tabPanelId = tabPanelId.replace(pathname,"");       

       $MEx(tabPanelId + " iframe[class='mexFormFrame']").first().each(function() {
            var _self = this;
        
            if(_self.contentWindow && _self.contentWindow.mainform) {              
               _self.contentWindow.mainform.formOnNavigate();
            }
       });               
     }     
     

     // Cria Aba     
     var jqueryDiv = $MEx(div);
     jqueryDiv.tabs(propriedades); 
     
     // Cria a paginação   
     var paggingProperties = { cycle: true, follow: true};     
     if(propriedades && propriedades.pagginEffect)     
        paggingProperties.paggingEffect = propriedades.pagginEffect;                
     jqueryDiv.tabs('paging', paggingProperties);     

   }
}

/*
* Esta função associa eventos ao clicar em uma aba
*/
function __mkxAssociateTabEvent(formulario, componente, nomeEvento, fluxo, parametros) {
        
   // Obtém o componente   
   var component = $c(componente, formulario);   

   // Caso o componente seja encontrado
   if(componente) { 
     // Obtém a div onde o scroll deve ser adicionado     
     var div = component.div;
     
     $MEx(div).tabs("option", nomeEvento, function(event, ui) {
       var defaultParams = new Array();         
       defaultParams.push(ui.tab.innerHTML);  
       executeJSRuleNoField(sysCode, idForm, fluxo, defaultParams.concat(parametros));       
     });          
   }
}

/*
* Esta função cria um item do accordion e adiciona um painel com conteúdo HTML.
*/
function __mkxCreateAccordionContent(formulario, componente, conteudo, titulo) {
        
   // Obtém o componente   
   var component = $c(componente, formulario);   

   // Caso o componente seja encontrado
   if(componente) {
     // Obtém a div onde o scroll deve ser adicionado     
     var div = component.div;     
     var accordion = $MEx(div);
     var id = "mexHTMLTab_" + Math.round((Math.random() * 10000000));      

     // Título     
     var accordionTitulo = "<h3>" + titulo + "</h3>";  
     //Concatena Conteudo 
     accordion.append( accordionTitulo );
     accordion.append("<div id='"+ id + "' class=\"mexAccordionContent\">" + conteudo + "</div>");
     //Recria Accordion              
     accordion.accordion('destroy');
     accordion.accordion();       

     // Ajusta a altura dos conteúdos
       $MEx(".mexAccordionContent").each(function() {
         // get the title height  
         var me = $MEx(this);    
         var titleHeight = parseInt(me.prev().hiddenDimension("outerHeight")); 
         var parentHeight = parseInt(me.parent().hiddenDimension("height"));         
         var qtdTitle = me.closest(".mexAccordions").find("h3").size();
         me.css("height", parentHeight - (titleHeight * qtdTitle));      
       });
   }
}

/*
* Esta função cria um item do accordion e abre uma URL como conteúdo.
*/
function __mkxCreateURLAccordion(formulario, componente, url, titulo) {
        
   // Obtém o componente   
   var component = $c(componente, formulario);   

   // Caso o componente seja encontrado
   if(componente) {
     // Obtém a div onde o scroll deve ser adicionado     
     var div = component.div; 
     var accordion = $MEx(div);        

     var found = false;
     var counter = 0;     

     var tabs = $MEx(div);     

     var tabsAnchors = $MEx( "#" + component.div.id + " .ui-accordion-header");  
        tabsAnchors.each(function() {
            if($MEx(this).html().indexOf(titulo) != -1) {            
                $MEx(component.div).accordion("option", {active : counter});                
                found = true;
            }            
            counter++;
     });     

     if(!found) {
       var id = "mexURLTab_" + Math.round((Math.random() * 10000000));     
  
       // Título     
       var accordionTitulo = "<h3>" + titulo + "</h3>";    
      
       var tabContentHtml = "<iframe class=\"mexURLFrame\" frameborder=\"0\" src=\""+ url +"\" seamless=\"seamless\" marginheight=\"0\" marginwidth=\"0\" height=\"100%\" width=\"100%\"></iframe>";
        
       
       accordion.append( accordionTitulo );
       accordion.append("<div id='"+ id + "' class=\"mexAccordionContent\">" + tabContentHtml + "</div>");
       
       accordion.accordion('destroy');
       accordion.accordion();
        
        // Ajusta a altura dos conteúdos
       $MEx(".mexAccordionContent").each(function() {
         // get the title height     
         var me = $MEx(this);    
         var titleHeight = parseInt(me.prev().hiddenDimension("outerHeight")); 
         var parentHeight = parseInt(me.parent().hiddenDimension("height"));         
         var qtdTitle = me.closest(".mexAccordions").find("h3").size();
         me.css("height", parentHeight - (titleHeight * qtdTitle));      
       });
     }
   }
}

/*
* Seleciona um item do accordion de acordo com o título. 
*/
function __mkxSelectAccordion(formulario, componente, titulo) {

   // Obtém o componente   
   var component = $c(componente, formulario);      

   if(component) {
        // Localiza o índice        
        var counter = 0;        
        var accordionAnchors = $MEx( "#" + component.div.id + " h3");  
        accordionAnchors.each(function() {
            if($MEx(this).contents()[1].nodeValue == titulo) {            
                $MEx(component.div).accordion("option", {active : counter});
            }            
            counter++;
         });         
     }      
}

/*
* Esta função cria uma lista de propriedades para serem usadas na função "Accordion - Criar accordion na moldura MEx"
*/
function __mkxCreateAccordionProperties(evento, efeito, retraivel) {
   // Retorna um JSON com as propriedades  
   var properties = new Array();     
   if(evento != null) properties["event"] = evento;   
   if(efeitoFechar != null) properties["animate"] = efeito;      
   if(efeitoMostrar != null) properties["collapsible"] = retraivel;
    

   properties["heightStyle"] = "auto";

   return properties;
}

/*
* Esta função associa eventos a um item do accordion.
*/
function __mkxAssociateAccordionEvent(formulario, componente, nomeEvento, fluxo, parametros) {
        
   // Obtém o componente   
   var component = $c(componente, formulario);   

   // Caso o componente seja encontrado
   if(componente) { 
     // Obtém a div onde o scroll deve ser adicionado     
     var div = component.div;
     
     $MEx(div).accordion("option", nomeEvento, function(event, ui) {
       var defaultParams = new Array();         
       defaultParams.push(ui.newHeader.contents()[1].nodeValue);  
       executeJSRuleNoField(sysCode, idForm, fluxo, defaultParams.concat(parametros));       
     });          

   }
}

/*
* Remove um accordion de acordo com o título. Não podendo o item ser selecionado após a remoção.
*/
function __mkxRemoveAccordion(formulario, componente, titulo) {
    // Obtém o componente   
	var component = $c(componente, formulario);      
	var div = component.div;     
	var accordion = $MEx(div);
	if(component) {   
		var accordionAnchors = $MEx( "#" + component.div.id ); 
		//Busca elemento H3 para remover
        accordionAnchors.find('h3').each(function (){        
			var objetoAccordion =$MEx(this);
			if(objetoAccordion.contents()[1].nodeValue == titulo) {
				objetoAccordion.next().remove();                  
				objetoAccordion.remove();  
			}
		})
		
		//Recria Accordion
		accordion.accordion('destroy');
		accordion.accordion(); 	 
	}
}

/*
* Mostra um accordion de acordo com o título.
*/
function __mkxShowAccordion(formulario, componente, titulo, mostrar) {
// Obtém o componente   
	var component = $c(componente, formulario);      
	var div = component.div;     
	var accordion = $MEx(div);
	if(component) {   
		var accordionAnchors = $MEx( "#" + component.div.id ); 
		//Busca elemento H3 para remover
                accordionAnchors.find('h3').each(function (){        
			var objetoAccordion = $MEx(this);
			if(objetoAccordion.contents()[1].nodeValue == titulo) {
                                if(mostrar==='true'){
				objetoAccordion.next().show();                  
				objetoAccordion.show(); 
                                }else{                                
                                objetoAccordion.next().hide();                  
				objetoAccordion.hide(); 
                                } 
			}
		})
		
		//Recria Accordion
		accordion.accordion('destroy');
		accordion.accordion(); 	 
	}
 
}

/*
* Esta função cria um container de accordion utilizando uma moldura.
*/
function __mkxCreateAccordion(formulario, componente, propriedades) {
   // Importa as folhas de estilo   
   ebfCSSImportFile("apimakerextreme/commons/jquery-ui/css/jquery-ui.min.css");         
   ebfCSSImportFile("apimakerextreme/commons/jquery-ui/css/jquery-ui-components.min.css");   

   // Importa os scripts   
   webrun.include("apimakerextreme/commons/jquery/jquery.min.js");
   webrun.include("apimakerextreme/commons/jquery-ui/js/jquery-ui.min.js");    
   
   // Função que valida a restrição de domínio
   
	
   // Obtém o componente   
   var component = $c(componente, formulario);   

   // Caso o componente seja encontrado
   if(componente) {
     // Obtém a div onde o scroll deve ser adicionado     
     var div = component.div;     
     div.id = "mexAccordion_" + componente;     
     div.className = "mexAccordions";
     div.innerHTML = "";
      $MEx(div).css("height",$MEx(div).hiddenDimension("height"));

     // Cria o Accordion     
     var jqueryDiv = $MEx(div);
     jqueryDiv.accordion({ activate: function() {
       
     }});
   }
}

/*
* Esta função cria um accordion e abre um formulário dentro do accordion criado.
*/
function __mkxCreateFormAccordion(formulario, componente, formularioDestino, titulo, filtro, modo) {
   // Obtém o componente   
   var component = $c(componente, formulario);   

   // Caso o componente seja encontrado
   if(componente) {
     // Obtém a div onde o scroll deve ser adicionado     
     var div = component.div;     
     var accordion = $MEx(div);          
     
     var found = false;
     var counter = 0;     

     // Verifica se já existe o painel   
     var found = false;
     var tabsAnchors = $MEx( "#" + component.div.id + " .ui-accordion-header");  
        tabsAnchors.each(function() {
            if($MEx(this).html().indexOf(titulo) != -1) {            
                $MEx(component.div).accordion("option", {active : counter});                
                found = true;
            }            
            counter++;
     }); 

     if(!found) {
       var id = "mexFormAccordion_" + formularioDestino.replace("{","").replace("}","");     
 
       // Título     
       var tabTitulo = "<h3 id=\""+id+"_title\">"+ titulo + "</h3>";  
  
       var formURL = "form.jsp?sys=" + sysCode + "&action=openform&formID="+ formularioDestino +"&align=0&mode="+(modo?modo:-1)+"&goto=-1&filter="+(filtro?filtro:"")+"&scrolling=no";
       var tabContentHtml = "<iframe width=\"100%\" height=\"98%\" class=\"mexFormFrameAccordion\" frameborder=\"0\" src=\""+ formURL +"\" seamless=\"seamless\" marginheight=\"0\" marginwidth=\"0\" scrolling=\"auto\" width=\"100%\"></iframe>";
       //Adiciona HTML 
       accordion.append( tabTitulo );
       accordion.append("<div id='"+ id + "' class=\"mexAccordionContent\">" + tabContentHtml + "</div>");
   
       //Atualiza Accordion        
       accordion.accordion('destroy');
       accordion.accordion();        

       // Ajusta a altura dos conteúdos
       $MEx("#mexAccordion_"+componente+" .mexAccordionContent").each(function() {
         // get the title height     
         var me = $MEx(this);    
         var titleHeight = parseInt(me.prev().hiddenDimension('outerHeight')); 
         var parentHeight = parseInt(me.parent().hiddenDimension('height')); 		 
         var qtdTitle = parseInt(me.closest(".mexAccordions").find("h3").size());
         me.css("height", parentHeight - (titleHeight * qtdTitle));         
       });
                     
     }
   }
}

/*
* Esta função permite personalizar a funcionalidade da caixa de texto (do tipo data) MEx
*/
function __mkxSetDateProperties(formulario, componente, animacaoExibir, formatoData, ocultarIcone, qtdMeses, completarDias) {
   // Função que valida a restrição de domínio
    
	
   // Obtém o componente   
   var component = $c(componente, formulario);   

   // Caso o componente seja encontrado
   if(component) { 
     // Obtém a div onde o scroll deve ser adicionado     
     var datePicker = $MEx(component.input);
     
     // Animação ao exibir        
     if(animacaoExibir) datePicker.datepicker("option", "showAnim", animacaoExibir);
     // Formato da data          
     if(formatoData) datePicker.datepicker("option", "dateFormat", formatoData);
     // Ocultar Icone
     if(ocultarIcone == true) {
       datePicker.datepicker("option", "showOn", "focus");
       datePicker.datepicker("option", "buttonImage", null);
       datePicker.datepicker("option", "buttonImageOnly", false);                  
     }
     // Quantidade de meses para mostrar
     if(qtdMeses) datePicker.datepicker("option", "numberOfMonths", qtdMeses);
     
     // Completa o calendário com dias de outros meses            
     if(completarDias == true) {
       datePicker.datepicker("option", "showOtherMonths", true);
       datePicker.datepicker("option", "selectOtherMonths", true);                  
     }
   }
}

/*
* Esta função permite restringir um período a ser selecionado no componente caixa de texto (do tipo data) MEx
*/
function __mkxSetDateRange(formulario, componente, dataMinima, dataMaxima) {
   // Função que valida a restrição de domínio
    
	
   // Obtém o componente   
   var component = $c(componente, formulario);   

   // Caso o componente seja encontrado
   if(component) { 
     // Obtém a div onde o scroll deve ser adicionado     
     var datePicker = $MEx(component.input);
     // Restringe o período        
     datePicker.datepicker("option", "minDate", dataMinima);     
     datePicker.datepicker("option", "maxDate", dataMaxima);
   }
}

/*
* Esta função cria uma data fixa abaixo da moldura MEx
*/

function __mkxCreateDateFixed(formulario, componente, fluxo) {
   // Função que valida a restrição de domínio
    
	
   // Obtém o componente   
   var component = $c(componente, formulario);   

   // Caso o componente seja encontrado
   if(component) { 
     // Obtém a div onde o scroll deve ser adicionado     
     var datePicker = $MEx(component.div);
	 //limpa div
	 datePicker.innerHTML='';
	 //Cria propiedades
	 var dateProperties = {
			dateFormat: "dd/mm/yy",
			dayNamesMin: [ "D", "S", "T", "Q", "Q", "S", "S" ],
			changeMonth: true,
            changeYear: true,
			//Ranger de anos que aparece no Componente
			yearRange: '1900:2050',			
			monthNamesShort: [ "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro" ],
			//Alteração para abrir para cima no FF
			beforeShow: function(input, inst){				
				if(navigator.userAgent.indexOf('Firefox')!=-1){
					
					if($MEx(input).offset().top>220){
						inst.dpDiv.css({marginTop: -(input.offsetHeight+200) + 'px', marginLeft:'0px'});
					}else{
						inst.dpDiv.css({marginTop:'2px', marginLeft:'0px'});
					}
				}
			},				
			onSelect:function(dateText){if(fluxo){executeJSRuleNoField(sysCode, idForm, fluxo, [dateText])}}
		}
	// Associa o evento
		datePicker.datepicker(dateProperties); 
   }
}

/*
* Esta função cobtem o valor da data fixa MEx
*/
function __mkxGetDateFixed(formulario, componente) {
   // Função que valida a restrição de domínio
    
	
   // Obtém o componente   
   var component = $c(componente, formulario);   

   // Caso o componente seja encontrado
   if(component) { 
     // Obtém a div onde o scroll deve ser adicionado     
     var datePicker = $MEx(component.div);          
     return datePicker.datepicker("getDate");
   }
}



/*
* Esta função transforma a dica padrão de um componente para em uma caixa de texto personalizavel
*/
function __mkxConvertComponentsTooltip(posicao) {
	//importar css
	mkxImportCss("apimakerextreme/commons/jquery-ui/css/jquery-ui.min.css");         
	mkxImportCss("apimakerextreme/commons/jquery-ui/css/jquery-ui-components.min.css");
	
	//importar jquery
	mkxImportJs("apimakerextreme/commons/jquery/jquery.min.js");
	mkxImportJs("apimakerextreme/commons/jquery-ui/js/jquery-ui.min.js"); 
	
	// Função que valida a restrição de domínio
    
	
	//Define Propriedades
        var properties = new Array();     
        if(posicao != null) properties["position"] = posicao;           

	var listaElementos = $MEx(".tabArea").find("*");
	for(var i = 0; i < listaElementos.length; i++){
		var elemento = listaElementos[i];
		if(elemento.div){
		var divElemento = $MEx(elemento.div);
		divElemento.find('*').each(function(){
			if($MEx(this).attr('title')){
			  	divElemento.attr('title',$MEx(this).attr('title'));
				$MEx(this).removeAttr('title').removeAttr('alt');
			}
		})
		}
	}
	$MEx(document).tooltip(properties);
}

/*
* Esta função transforma a dica padrão de um componente para em uma caixa de texto personalizavel
*/
function __mkxComponenteTooltip(formulario, componente, html, title, posicao, seguirMouse) {
	//importar css
	mkxImportCss("apimakerextreme/commons/jquery-ui/css/jquery-ui.min.css");         
	mkxImportCss("apimakerextreme/commons/jquery-ui/css/jquery-ui-components.min.css");
	
	//importar jquery
	mkxImportJs("apimakerextreme/commons/jquery/jquery.min.js");
	mkxImportJs("apimakerextreme/commons/jquery-ui/js/jquery-ui.min.js"); 
	
	// Função que valida a restrição de domínio
    
	
	//Define Propriedades
	var properties = new Array();     
	if(posicao == 'left') properties["position"] = { my: "right-10 center", at: "left center", collision: "flipfit" };
        if(posicao == 'right') properties["position"] = { my: "left+10 center", at: "right center", collision: "flipfit" };
        if(posicao == 'top') properties["position"] = {my: "right botton", at: "right top-20", collision: "flipfit"}; 
        if(posicao == 'botton') properties["position"] = {my: "right top+5", at: "right botton+10", collision: "flipfit" };
	if(seguirMouse != null) properties["track"] = seguirMouse;        
	
	// Obtém o componente   
	var component = $c(componente, formulario);   
	var htmlContent = html;
	// Caso o componente seja encontrado
	if(component) { 

 	var divElemento = $MEx(component.div);
		divElemento.find('*').each(function(){
			if($MEx(this).attr('title')){
			  	divElemento.attr('title',$MEx(this).attr('title'));
				$MEx(this).removeAttr('title').removeAttr('alt');
			}
		})

		$MEx(component.div).attr('alt',title)
		$MEx(component.div).attr('title',title)                 
		if(htmlContent){
			$MEx(component.div).tooltip({
				content: function() {
					return htmlContent;
				}
			});
			}else{  
			$MEx(component.div).tooltip(properties);
		}
		
	}
}

/*
* Esta função retorna as linhas selecionadas da grade do Maker Extreme
*/
function __mkxGetGridSelectedRows(formulario, componente) {

  // Obtém o componente  
   var grid;   

   try {   
     grid = $c(componente, formulario);
   } catch(ex) {}  

   // Caso o componente não seja encontrado
   if(!grid) { 
     grid = $MEx("#" + componente + "_table");     
     if(grid.size() == 0) {
       throw "MEx error: Container não encontrado";
     }   

   } else {   
     grid = $MEx("#" + grid.id + "_table");     
   }
   
      
   // Obtém as linhas selecionadas   
   var selecteds;   

   if(grid.jqGrid('getGridParam','multiselect')) {
     selecteds = grid.jqGrid('getGridParam','selarrrow');
   } else {
     selecteds = grid.jqGrid('getGridParam','selrow');
   }
   
   return selecteds;  
}

/*
* Esta função obtém o valor de uma célula da grade
*/
function __mkxGetGridValue(formulario, componente, id, coluna) {

  // Obtém o componente  
   var grid;   

   try {   
     grid = $c(componente, formulario);
   } catch(ex) {}  

   // Caso o componente não seja encontrado
   if(!grid) { 
     grid = $MEx("#" + componente + "_table");     
     if(grid.size() == 0) {
       throw "MEx error: Container não encontrado";
     }   

   } else {   
     grid = $MEx("#" + grid.id + "_table");     
   }
 
   // Seleciona a linha da grade   
   var columName = reduceVariable(coluna);   
   if(id) {
     var ret = grid.jqGrid('getRowData',id);
     return ret[columName];
   }            

   return null;    
}

/*
* Esta função altera o valor de uma célula da grade
*/
function __mkxSetGridValue(formulario, componente, id, coluna, valor) {

  // Obtém o componente  
   var grid;   

   try {   
     grid = $c(componente, formulario);
   } catch(ex) {}  

   // Caso o componente não seja encontrado
   if(!grid) { 
     grid = $MEx("#" + componente + "_table");     
     if(grid.size() == 0) {
       throw "MEx error: Container não encontrado";
     }   

   } else {   
     grid = $MEx("#" + grid.id + "_table");     
   }
 
   // Seleciona a linha da grade   
   var columName = reduceVariable(coluna);   
   if(id) {
     var ret = grid.jqGrid('getRowData',id);
     ret[columName] = valor;     
     grid.jqGrid('setRowData',id,ret);
   }                
}

/*
* Esta função atualiza os dados de uma grade
*/
function __mkxUpdateGridData(formulario, componente, listaDados) {

  // Obtém o componente  
   var grid;   

   try {   
     var component = $c(componente, formulario);
   } catch(ex) {}  

   // Caso o componente não seja encontrado
   if(!component) { 
     grid = $MEx("#" + componente + "_table");     
     if(grid.size() == 0) {
       throw "MEx error: Container não encontrado";
     }   

   } else {   
     grid = $MEx("#" + component.id + "_table");     
   }
 
__mkxCreateSimpleGrid(formulario, componente, component.div.savedData["titulo"], component.div.savedData["listaColunas"], listaDados, component.div.savedData["multiSelect"], component.div.savedData["paging"]);
}

/*
* Esta cria uma grade em uma Moldura ou em um Container (DIV)
*/
function __mkxCreateSimpleGrid(formulario, componente, titulo, listaColunas, listaDados, multiSelect, paging) {
  //importar css                                                                       
  mkxImportCss("apimakerextreme/commons/jquery-ui/css/jquery-ui.min.css");         
  mkxImportCss("apimakerextreme/commons/jquery-ui/css/jquery-ui-components.min.css");
  mkxImportCss("apimakerextreme/plugins/jq-grid/css/ui.jqgrid.css");   

  //importar javascript
  mkxImportJs("apimakerextreme/commons/jquery/jquery.min.js");
  mkxImportJs("apimakerextreme/commons/jquery-ui/js/jquery-ui.min.js");
  mkxImportJs("apimakerextreme/plugins/jq-grid/js/grid.locale-pt-br.js");
  mkxImportJs("apimakerextreme/plugins/jq-grid/js/jquery.jqGrid.min.js");       
  
  // Função que valida a restrição de domínio
  
   
  // Obtém o componente  
   var component;   

   try {   
     component = $c(componente, formulario);
   } catch(ex) {}  
   
   // Caso o componente não seja encontrado
   var gridComp;
   if(!component) { 
     gridComp = $MEx("#" + componente);     
     if(gridComp.size() == 0) {
       throw "MEx error: Container não encontrado";
     }
     gridComp.attr("class","mexGrid");     
     gridComp.html("<table id=\""+ gridComp.attr("id") +"_table\" class=\"mexGridTable\"></table>");     

   } else {
     var id = component.id;   
     gridComp = $MEx(component.div);
     gridComp.attr("class","mexGrid");
     gridComp.attr("id",id);                       
     gridComp.html("<table id=\""+ id +"_table\" class=\"mexGridTable\"></table><div id=\""+ id +"_pager\"></div>");     
   }
   
   component.div.savedData = new Array();
   component.div.savedData["titulo"] = titulo;
   component.div.savedData["listaColunas"] = listaColunas;
   component.div.savedData["multiSelect"] = multiSelect;
   component.div.savedData["paging"] = paging;
   
   if(!listaColunas) throw "MEx error: A definição de colunas não foi informada";
   if(!listaDados) throw "MEx error: A fonte de dados não foi informada";   

   // Prepara as listas de colunas   
   var columnNames = new Array();   
   var columnModel = new Array();
   for(var i = 0; i < listaColunas.length; i++) {
     // Quebra a linha em uma lista   
     var currentDef = listaColunas[i].split(";");     
     // Adiciona o nome na lista de nomes
     columnNames.push(currentDef[0]);
     // Adiciona a lista de definições
	 var columnModelObj = { 
	
        key: (i == 0) ? true : false,
        name: reduceVariable(currentDef[0]),
        width: (currentDef[1]) ? currentDef[1] : 150, 
        align: (currentDef[2]) ? currentDef[2] : "left", 
        sortable: (currentDef[3]) ? (currentDef[3] === "true") : false,
		sorttype: (currentDef[4]) ? currentDef[4] : "text"
     };
	 
	if(currentDef[4]=="date"){
		columnModelObj.formatter='date';
		//columnModelObj.formatoptions= {newformat:'d/m/Y'};
		columnModelObj.datefmt= 'Y-M-D';
	}
    columnModel.push(columnModelObj);
	
   };   
   
   // Prepara a lista de dados   
   var dados = new Array();   
   for(var i = 0; i < listaDados.length; i++) {
     dados[i] = {};
     dados[i]["mexKey"] = listaDados[i][0]; 
     for(var j = 0; j < listaDados[i].length; j++) {
         dados[i][reduceVariable(columnNames[j]).toString()] = listaDados[i][j];
     }
   }
         
   // Cria a grade              
   var grid = $MEx("#" + gridComp.attr("id")).find(":first-child").first();
   grid.jqGrid({        
	datatype: "local",
   	colNames: columnNames,
   	colModel: columnModel,
	forceFit: false,
	shrinkToFit: false,
	hidegrid: false,
   	rowNum: (paging == true) ? 100 : dados.length,
   	rowList:[100,500,1000,5000],
   	pager: (paging == true) ? "#" + id +"_pager" : null,   
    scroll: (paging == false) ? true : false,
   	sortname: 'id',   
    gridview: true,
	width: gridComp.closest(".mexGrid").width(),
	height: (parseInt(gridComp.hiddenDimension("height") - 50)),
    viewrecords: true,
    sortorder: "desc",
	caption: titulo,
    multiselect: (multiSelect == true || multiSelect === "true")
   });   

  
      
   // Adiciona os dados   
   grid.jqGrid('setGridParam', {data: dados});
   // Recarrega a grade
   grid.trigger("reloadGrid");	
}

/*
* Esta função associa um fluxo a um evento da grade
*/
function __mkxAssociateGridEvent(formulario, componente, evento, fluxo, parametros) {
   // Obtém o componente  
   var grid;   

   try {   
     grid = $c(componente, formulario);
   } catch(ex) {}  

   // Caso o componente não seja encontrado
   if(!grid) { 
     grid = $MEx("#" + componente + "_table");     
     if(grid.size() == 0) {
       throw "MEx error: Container não encontrado";
     }   

   } else {   
     grid = $MEx("#" + grid.id + "_table");     
   }                

   if(evento != "ondblClickRow") {
     var gridEvent = {};
     gridEvent[evento] = function(obj) {
         var defaultParams = new Array();
         
         // Parâmetros com o id da linha
         if(evento == "beforeSelectRow" || evento == "onSelectRow" || evento == "onRightClickRow") {         
           defaultParams.push(obj);         
         }   
         
         return executeJSRuleNoField(sysCode, idForm, fluxo, defaultParams.concat(parametros));  
     } 

     // Adiciona novos dados   
     grid.jqGrid('setGridParam', gridEvent);      

   } else {
     grid.dblclick(function(e) {
       var td = e.target;
       var ptr = $MEx(td).closest("tr.jqgrow").attr("id");       
       var defaultParams = new Array();       
       defaultParams.push(ptr);
       return executeJSRuleNoField(sysCode, idForm, fluxo, defaultParams.concat(parametros));  
     });
   }
}

/*
* Esta função seleciona uma linha da grade
*/
function __mkxSelectGridRow(formulario, componente, id) {       

  // Obtém o componente  
   var grid;   

   try {   
     grid = $c(componente, formulario);
   } catch(ex) {}  

   // Caso o componente não seja encontrado
   if(!grid) { 
     grid = $MEx("#" + componente + "_table");     
     if(grid.size() == 0) {
       throw "MEx error: Container não encontrado";
     }   

   } else {   
     grid = $MEx("#" + grid.id + "_table");     
   }
 
   // Seleciona a linha da grade
   if(id != null && id != "" && id != "undefined") {
     grid.jqGrid('setSelection', id);
   } else {
     grid.jqGrid('resetSelection');
   } 
   

}

/*
* Esta função retorna uma lista com os IDs de todas as linhas de uma grade Maker Extreme API
*/
function __mkxGetAllGridRows(formulario, componente) {     

  // Obtém o componente  
   var grid;   

   try {   
     grid = $c(componente, formulario);
   } catch(ex) {}  

   // Caso o componente não seja encontrado
   if(!grid) { 
     grid = $MEx("#" + componente + "_table");     
     if(grid.size() == 0) {
       throw "MEx error: Container não encontrado";
     }   

   } else {   
     grid = $MEx("#" + grid.id + "_table");     
   }
   
      
   // Obtém as linhas selecionadas   
   return grid.jqGrid('getDataIDs');
  
}

/*
* Esta função define o estilo visual de uma linha
*/
function __mkxSetGridLineStyle(formulario, componente, id, estilo) {

  // Obtém o componente  
   var grid;   

   try {   
     grid = $c(componente, formulario);
   } catch(ex) {}  

   // Caso o componente não seja encontrado
   if(!grid) { 
     grid = $MEx("#" + componente + "_table");     
     if(grid.size() == 0) {
       throw "MEx error: Container não encontrado";
     }   

   } else {   
     grid = $MEx("#" + grid.id + "_table");     
   }
      
   //obtém a linha   
   var linha = grid.find("#" + id + " td");

    // Diferencia entre textoCSS e classeCSS
    if (estilo) {    
      if (estilo.indexOf(":") == -1) {
        linha.addClass(estilo);    
      } else {
        var listaStyle = estilo.split(";");
        for(var i = 0; i < listaStyle.length; i++) {        
          if(listaStyle[i] && listaStyle[i].length > 0) {          
            var map = $MEx.trim(listaStyle[i]).split(":");            
            linha.css(map[0], map[1]);
          }
          
        }      
         
      }  
    }
}

/*
* Esta função adiciona um botão na grade, que, quando clicado, executa um fluxo.
*/
function __mkxAddGridImage(formulario, componente, id, coluna, url, fluxo, parametros) {

  // Obtém o componente  
   var grid;   
   var componentID;
   try {   
     grid = $c(componente, formulario);
   } catch(ex) {}  

   // Caso o componente não seja encontrado
   if(!grid) { 
     componentID = "#" + componente + "_table";
     grid = $MEx(componentID);
          
     if(grid.size() == 0) {
       throw "MEx error: Container não encontrado";
     }   

   } else {
     componentID = "#" + grid.id + "_table";   
     grid = $MEx(componentID);     
   }
    
 
   // Formata o nome da coluna
   var columName = reduceVariable(coluna);   

   var data = {};     
      
   // Adiciona o ID da linha como parâmetro padrão
   var defaultParams = new Array();         
   defaultParams.push(id);
   
   // Guarda o evento onclick do botão dentro da própria grade
   var _fluxo = fluxo;   
   var _param = parametros;   
   grid.find("#" + id).find("td[aria-describedby='"+ componente +"_table_" + coluna + "']")[0].clickGridButton = function() {
     if(_fluxo) executeJSRuleNoField(sysCode,idForm,_fluxo,defaultParams.concat(_param));  
   }

   data[columName] = "<img class='"+ ((_fluxo) ? "mexGridImageLink" : "mexGridImage") +"' id='"+ id + "_" + columName +"_img' "+ ((_fluxo) ? "onclick=\"$MEx(this).closest('td')[0].clickGridButton(); return false;\"" : "") +" src=\""+ url +"\" />";     
   grid.jqGrid('setRowData',id,data);                
}

/*
* Esta função adiciona um botão na grade, que, quando clicado, executa um fluxo.
*/
function __mkxAddGridButton(formulario, componente, id, coluna, texto, fluxo, parametros) {

  // Obtém o componente  
   var grid;   
   var componentID;
   try {   
     grid = $c(componente, formulario);
   } catch(ex) {}  

   // Caso o componente não seja encontrado
   if(!grid) { 
     componentID = "#" + componente + "_table";
     grid = $MEx(componentID);
          
     if(grid.size() == 0) {
       throw "MEx error: Container não encontrado";
     }   

   } else {
     componentID = "#" + grid.id + "_table";   
     grid = $MEx(componentID);     
   }
    
 
   // Formata o nome da coluna
   var columName = reduceVariable(coluna);   

   var data = {};     
      
   // Adiciona o ID da linha como parâmetro padrão
   var defaultParams = new Array();         
   defaultParams.push(id);
   
   // Guarda o evento onclick do botão dentro da própria grade
   var _fluxo = fluxo;   
   var _param = parametros;
   grid.find("#" + id).find("td[aria-describedby='"+ componente +"_table_" + coluna + "']")[0].clickGridButton = function() {   
      executeJSRuleNoField(sysCode,idForm,_fluxo,defaultParams.concat(_param));  
   }

     data[columName] = "<input type='button' class='mexGridButton ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only' id='"+ id + "_" + columName +"_btn' onclick=\"$MEx(this).closest('td')[0].clickGridButton(); return false;\" value=\""+ texto +"\" />";     
     grid.jqGrid('setRowData',id,data);
}

/*
* Esta função cria uma lista de propriedades para serem usadas nas funções de "Painel" da API MakerExtreme
*/
function __mkxCreatePanelProperties(autoAbrir, fecharESC, classeCSS, arrastavel, larguraMaxima, alturaMaxima, larguraMinima, alturaMinima, redimensionavel, efeitoMostrar) {
   // Retorna um JSON com as propriedades  
   var properties = new Array();     
   if(autoAbrir != null) properties["autoOpen"] = autoAbrir;   
   if(fecharESC != null) properties["closeOnEscape"] = fecharESC;      
   if(classeCSS != null) properties["dialogClass"] = classeCSS;
   if(arrastavel != null) properties["draggable"] = arrastavel;
   if(larguraMaxima != null) properties["maxWidth"] = larguraMaxima;
   if(alturaMaxima != null) properties["maxHeight"] = alturaMaxima;              
   if(larguraMinima != null) properties["minWidth"] = larguraMinima;   
   if(alturaMinima != null) properties["minHeight"] = alturaMinima;   
   if(redimensionavel != null) properties["resizable"] = redimensionavel;   
   if(efeitoMostrar != null) properties["show"] = efeitoMostrar;     

   return properties;
}

/*
* Esta função abre um formulário dentro de um painel flutuante (semelhante a uma janela)
*/
function __mkxOpenFormPanel(titulo, formulario, largura, altura, modal, filtro, modo,rolagem, propriedades) {
   // Importa as folhas de estilo 
   mkxImportCss("apimakerextreme/commons/jquery-ui/css/jquery-ui.min.css");         
   mkxImportCss("apimakerextreme/commons/jquery-ui/css/jquery-ui-components.min.css");   

   // Importa os scripts          
   mkxImportJs("apimakerextreme/commons/jquery/jquery.min.js");
   mkxImportJs("apimakerextreme/commons/jquery-ui/js/jquery-ui.min.js");   
      
   // Função que valida a restrição de domínio
   
      
    // Verifica se já existe o painel   
   var found = false;
   $MEx(".mexPanel").each(function() {
        if($MEx(this).attr("id") == ("mexPanel_" + reduceVariable(titulo))) {
          $MEx(this).dialog("open");          
          found = true;
        }
   });

   if(found) return;
      
   // Cria a div onde o Painel deve ser adicionado     
   var div = document.createElement("DIV");     
   div.id = "mexPanel_" + reduceVariable(titulo);     
   div.className = "mexPanel";
   div.title = titulo;   
   //Alteração da barra de rolagem 19-06-2013
   if(rolagem){rolagem='yes';}else{rolagem='no';}
   
   var formURL = "form.jsp?sys=" + sysCode + "&action=openform&formID="+ formulario +"&align=0&mode="+ (modo?modo:-1) +"&goto=-1&filter="+ (filtro?filtro:"") +"&scrolling="+ rolagem;
   var tabContentHtml = "<iframe class=\"mexPanelFrame\" frameborder=\"0\" src=\""+ formURL +"\" seamless=\"seamless\" marginheight=\"0\" marginwidth=\"0\" width=\"100%\" height=\"98%\"></iframe>";   

   div.innerHTML = tabContentHtml;

   $MEx("#lay").append(div);   

   var panel = $MEx(div);   

   if(!propriedades) {    
     // Inicializa as propriedades
     propriedades = {};                
     // Define os valores padrões
     propriedades.autoOpen = true;     
     propriedades.resizable = false; 
   }
      
   propriedades.width = largura;   
   propriedades.height = altura;   
   propriedades.modal = modal;   

   // Chama o evento ao navegar
   propriedades.open = function(evt,ui) {
    var tabPanelId = $MEx(this).attr("id");
     $MEx("#" + tabPanelId + " iframe[class='mexPanelFrame']").first().each(function() {     
          if(this.contentWindow && this.contentWindow.mainform) {              
              this.contentWindow.mainform.formOnLoadAction();
          }
     });     
  }   

   // Chama o evento ao fechar o formulário
   propriedades.beforeClose = function(evt,ui) {
     var tabPanelId = $MEx(this).attr("id");
     $MEx("#" + tabPanelId + " iframe[class='mexPanelFrame']").first().each(function() {     
          if(this.contentWindow && this.contentWindow.mainform) {  	  
              this.contentWindow.formOnUnLoadAction();
          }
     });     
   }

   // Chama o evento após fechar o formulário
   propriedades.close = function(evt,ui) {
     panel.dialog("destroy");
     panel.remove();	 
   }   
      
   panel.dialog(propriedades);
   
   // Corrige o problema do Quirks Mode no IE   
   var _largura = largura;   
   var _altura = altura;
   div.fixIEQuirksMode = function() {
        fixIEPanelQuirksMode(div.id, largura, altura);
   }     
   div.fixIEQuirksMode();   
   $MEx(div).dialog("option", "open", function(event, eventPanel) {
         div.fixIEQuirksMode();
         var resizeHandler = $MEx(this).closest(".ui-dialog").find(".ui-resizable-handle");         
         resizeHandler.css("bottom", "3px");
   });   
}

/*
* Esta função oculta ou exibe um painel
*/
function __mkxShowPanel(titulo, mostrar) {
        
   // Obtém o componente   
   var painel = $MEx("#mexPanel_" + reduceVariable(titulo));   

   // Caso o componente seja encontrado
   if(painel.size() > 0) { 
       if(mostrar === "true") {
         painel.dialog("open");
       } else {
         painel.dialog("close");
       }     
          
   } else {
       throw "MEx Error: Painel não encontrado!";
   }
}

/*
* Esta função remove completamente um painel e toda a sua funcionalidade
*/
function __mkxRemovePanel(titulo) {
        
   // Obtém o componente   
   var painel = $MEx("#mexPanel_" + reduceVariable(titulo));   
   
   // Se o painel não foi encontrado tenta fechar localizar o próprio mainel
   if(painel.length <= 0) {   
     if(parent.parent.$MEx) {
       painel = parent.parent.$MEx("#mexPanel_" + reduceVariable(titulo));
     }     
   }
   
   // Caso o componente seja encontrado
   if(painel.size() > 0) {     
      painel.dialog("destroy");      
      painel.remove();
   } else {
       throw "MEx Error: Painel não encontrado!";
   }
}

/*
* Esta função muda a posição de um painel criado
*/
function __mkxMovePanel(titulo, posicaoX, posicaoY, velocidade) {
        
   // Obtém o componente   
   var painel = $MEx("#mexPanel_" + reduceVariable(titulo));   

   // Caso o componente seja encontrado
   if(painel.size() > 0) {
      if(posicaoX.indexOf("px") == -1) posicaoX = posicaoX + "px";
      if(posicaoX.indexOf("px") == -1) posicaoY = posicaoY + "px";
        
		if(velocidade) {
           painel.dialog("widget").animate({
             left: posicaoX,          
             top: posicaoY
           }, velocidade);
        } else {
		  painel.dialog("widget").css({ top: posicaoX, left: posicaoY});
		}		 
   } else {
       throw "MEx Error: Painel não encontrado!";
   }
}

/*
* Esta função associa um fluxo a um evento do painel
*/
function __mkxAssociatePanelEvent(titulo, nomeEvento, fluxo, parametros) {
        
   // Obtém o componente   
   var painel = $MEx("#mexPanel_" + reduceVariable(titulo));   

   // Caso o componente seja encontrado
   if(painel.size() > 0) { 
     
     painel.dialog("option", nomeEvento, function(event, eventPanel) {
       executeJSRuleNoField(sysCode, idForm, fluxo, parametros);
       
       // FIX Ie quirks Mode
       if(nomeEvento == "open") {
         painel.get(0).fixIEQuirksMode();
       }      
     });           
   } else {
       throw "MEx Error: Painel não encontrado!";
   }
}

/*
* Esta função adiciona botões a um painel. Ao clicar neste botão, um fluxo é executado.
*/
function __mkxAddPanelButton(titulo, textoBotao, fluxo, parametros) {
        
   // Obtém o componente   
   var painel = $MEx("#mexPanel_" + reduceVariable(titulo));   

   // Caso o componente seja encontrado
   if(painel.size() > 0) {
      // Obtém os botões atuais      
      var buttons = painel.dialog("option", "buttons");

      // adiciona o novo botão      
      buttons[textoBotao] = function() {      
         executeJSRuleNoField(sysCode, idForm, fluxo, parametros);
      };      

      painel.dialog("option", "buttons", buttons);
   
   } else {
       throw "MEx Error: Painel não encontrado!";
   }
}

/*
* Esta função abre um painel flutuante (semelhante a uma janela)
*/
function __mkxOpenHTMLPanel(titulo, conteudo, largura, altura, modal, propriedades) {
   // Importa as folhas de estilo 
   mkxImportCss("apimakerextreme/commons/jquery-ui/css/jquery-ui.min.css");         
   mkxImportCss("apimakerextreme/commons/jquery-ui/css/jquery-ui-components.min.css");   

   // Importa os scripts          
   mkxImportJs("apimakerextreme/commons/jquery/jquery.min.js");
   mkxImportJs("apimakerextreme/commons/jquery-ui/js/jquery-ui.min.js");   
      
   // Função que valida a restrição de domínio
   
      
   // Verifica se já existe o painel   
   var found = false;
   $MEx(".mexPanel").each(function() {
        if($MEx(this).attr("id") == ("mexPanel_" + reduceVariable(titulo))) {
          $MEx(this).dialog("open");          
          found = true;
        }
   });

   if(found) return;
      
   // Cria a div onde o Painel deve ser adicionado     
   var div = document.createElement("DIV");     
   div.id = "mexPanel_" + reduceVariable(titulo);     
   div.className = "mexPanel";
   div.title = titulo;      

   div.innerHTML = conteudo;

   $MEx("#lay").append(div);   

   if(!propriedades) {    
     // Inicializa as propriedades
     propriedades = {};                
     // Define os valores padrões
     propriedades.autoOpen = true;     
     propriedades.resizable = false; 
   }
      
   propriedades.width = largura;   
   propriedades.height = altura;   
   propriedades.modal = (modal == true) ? true : false;
  
   $MEx(div).dialog(propriedades);
                       
   // Corrige o problema do Quirks Mode no IE   
   var _largura = largura;   
   var _altura = altura;
   div.fixIEQuirksMode = function() {
        fixIEPanelQuirksMode(div.id, largura, altura);
   }     
   div.fixIEQuirksMode();   
   $MEx(div).dialog("option", "open", function(event, eventPanel) {
         div.fixIEQuirksMode();
         var resizeHandler = $MEx(this).closest(".ui-dialog").find(".ui-resizable-handle");         
         resizeHandler.css("bottom", "3px");
                 
   });          
          
}

/*
* Esta função modifica a barra de padrão do navegador, em Tabelas HTML, por uma nova barra de rolagem cross-browser e totalmente customizável
*/
function __mkxChangeTableScrollBar(formulario, componente, propriedades) {
   // Importa as folhas de estilo   
   ebfCSSImportFile("apimakerextreme/plugins/scrollpane/jquery.jscrollpane.css");   
   ebfCSSImportFile("apimakerextreme/plugins/scrollpane/jqScrollPaneCustom.css");   

   // Importa os scripts   
   webrun.include("apimakerextreme/commons/jquery/jquery.min.js");
   webrun.include("apimakerextreme/plugins/scrollpane/jquery.jscrollpane.min.js");   
   webrun.include("apimakerextreme/plugins/scrollpane/jquery.mousewheel.js");
   
   // Função que valida a restrição de domínio    
          

   // Obtém o componente   
   var component = $c(componente, formulario);   

   // Caso o componente seja encontrado
   if(componente) {
     // Obtém a div onde o scroll deve ser adicionado     
     var div = component.div.firstChild;     

     // Cria o ScrollPanel
     $MEx(div).jScrollPane({
       horizontalGutter:5,
       verticalGutter:5,
       'showArrows': false
     });

     $MEx('.jspDrag').hide();
     $MEx('.jspScrollable').mouseenter(function(){
       $MEx(this).find('.jspDrag').stop(true, true).fadeIn('slow');
     });
     $MEx('.jspScrollable').mouseleave(function(){
       $MEx(this).find('.jspDrag').stop(true, true).fadeOut('slow');
     });
   }
}

function __mkxOpenFormSameWindow(form, filtro, modo) {
    parent.document.location.href = "form.jsp?sys="+sysCode+"&action=openform&formID="+form+"&align=0&mode="+((modo)? modo : -1)+"&goto=-1&filter="+ filtro +"&scrolling=no"
}

function __mkxSetAutocomplete(form, component, dados, propriedades) {
   // Importa as folhas de estilo 
   mkxImportCss("apimakerextreme/commons/jquery-ui/css/jquery-ui.min.css");         
   mkxImportCss("apimakerextreme/commons/jquery-ui/css/jquery-ui-components.min.css");   

   // Importa os scripts          
   mkxImportJs("apimakerextreme/commons/jquery/jquery.min.js");
   mkxImportJs("apimakerextreme/commons/jquery-ui/js/jquery-ui.min.js");   
   
   // Função que valida a restrição de domínio    
          

   // Obtém o componente   
   var component = $c(component, form);
   
   if(component) { 
   
     // Prepara os dados
	 var data;
	 if(propriedades && propriedades.fluxo) {
	   // Adiciona o termo buscado como primeiro parâmetro     
           var data = function(request, response) {
             var defaultParams = new Array();         
             defaultParams.push(request.term);  
	     var ret = executeJSRuleNoField(sysCode, idForm, propriedades.fluxo, defaultParams.concat(propriedades.parametros)); 
             
             response( $MEx.map( ret, function( item ) {
               var campoChave;
	       var campoLista;
	       if(typeof(item) == "string") {
	         // Se o retorno for string o campo chave é igual ao campo lista
                 campoChave = item;
                 campoLista = item;
	       }       
               if(typeof(item) == "object") {
                 // Se for um array
		 if(item.length >= 2) {
		   campoChave = item[0];
		   campoLista = item[1];
		 } else {
		   campoChave = item[0];   
                   campoLista = item[0];
		 }
               }
		   // Retorno
	       return {
                 label: campoLista,
                 value: campoChave
               }
             }));     
	   } 
         }
	 if(dados && dados.length > 0) {
	     if(typeof(dados[0]) == "object") {
		   // se for array transforma o array de dados
		   data = new Array();
		   for(var i = 0; i < dados.length; i++) {     
		     // Monta os dados de retorno     
                     if(dados[i].length >= 2) {                     
                       data.push({ label: dados[i][0], value: dados[i][1] });
                     } else {
                       data.push(dados[i][0]);
                     }                     
		   }
	 
                 }
		 if(typeof(dados[0]) == "string") {
		   // se for string, o array já está pronto
		   data = dados;
		 }
	 }
	 
	 if(!propriedades) {
	   propriedades = {};
	   propriedades.source = data;
	 }
	 propriedades.source = data;
	 
     // Obtém o input     
     var input = component.input;

     $MEx(input).autocomplete(propriedades);
   }     
}

/*
* Esta função cria uma lista de propriedades para serem usadas nas funções de "Painel" da API MakerExtreme
*/
function __mkxCreateAutocompleteProperties(focarPrimeiro, fluxo, parametros, delay, tamanhoMinimo) {
   // Retorna um JSON com as propriedades  
   var properties = new Array();     
   if(focarPrimeiro != null) properties["autoFocus"] = focarPrimeiro;   
   if(fluxo != null) properties["fluxo"] = fluxo;      
   if(parametros != null) properties["parametros"] = parametros;
   if(delay != null) properties["delay"] = delay;
   if(tamanhoMinimo != null) properties["minLength"] = tamanhoMinimo;

   return properties;
}

function __mkxShowGridColumn(formulario, componente, coluna, mostrar) {
   // Obtém o componente  
   var grid;   

   try {   
     grid = $c(componente, formulario);
   } catch(ex) {}  

   // Caso o componente não seja encontrado
   if(!grid) { 
     grid = $MEx("#" + componente + "_table");     
     if(grid.size() == 0) {
       throw "MEx error: Container não encontrado";
     }   

   } else {   
     grid = $MEx("#" + grid.id + "_table");     
   }
 
   // Formata o nome da coluna
   var columName; 
   if(typeof(coluna) == "string") {
     columName = reduceVariable(coluna);     
   } else {
     // Se for um array formata todos os nomes da lista 
     columName = new Array();    
     for(var i = 0; i < coluna.length; i++) {
        columName[i] = reduceVariable(coluna[i]);
     }
   }  
      
   
   if(mostrar === "true") {   
     grid.jqGrid('showCol', columName);  
   } else {
     grid.jqGrid('hideCol', columName);   
   }
}

function __mkxFindForm(formCode) {
    
	// Função que valida a restrição de domínio    
     
	
	// Retorna todos os elementos HTMLDocument encontrados
	var getAllWindows = function() {
		documents = [top];
		childDocuments = getAllChildWindows(documents);
		return documents.concat(childDocuments);
	}
	
	var toArray = function (obj) {
	    if(!obj) return null;
		var array = [];
		// iterate backwards ensuring that length is an UInt32
		for (var i = obj.length >>> 0; i--;) { 
			array[i] = obj[i];
		}
		return array;
	}
	
	// Função recursiva que sai em busca de todos os elementos associados a IFRAME ou FRAME
	// docs: Array do tipo HTMLDocument
	var getAllChildWindows = function(docs) {
		childDocuments = []
		
		var docsLength = docs.length;
		for (var docIndex = 0; docIndex < docsLength; docIndex++) {
		    var iframes = new Array();
			iframes = iframes.concat(toArray(docs[docIndex].document.getElementsByTagName("iframe")));
			iframes = iframes.concat(toArray(docs[docIndex].document.getElementsByTagName("frame")));
			var iframesLength = iframes.length;
			if (iframesLength > 0) {
				for (var iframeIndex = 0; iframeIndex < iframesLength; iframeIndex++) {
					var iframeDocument = iframes[iframeIndex].contentWindow;
					if (iframeDocument) {
						childDocuments.push(iframeDocument);
		
						var frames = iframeDocument.document.getElementsByTagName("frame");
						var framesLength = frames.length;
						if (framesLength > 0) {
							for (frameIndex = 0; frameIndex < framesLength; frameIndex++) {
								var frameDocument = frames[frameIndex].contentWindow;
								if(frameDocument) {
									childDocuments.push(frameDocument);
								}
							}
						}
					}
				}
			}
		}
 
		if(childDocuments.length > 0) {
			return childDocuments.concat(getAllChildWindows(childDocuments));
		}
 
		return childDocuments;
	}
	
	// obtém todos os documentos encontrados na página
	var foundDocs = getAllWindows();
	var currentWin;
	for(var i = 0; i < foundDocs.length; i++) {
		currentWin = foundDocs[i];
		if(currentWin.location.href.indexOf("form.jsp") != -1) {
		  if(currentWin.mainform && currentWin.mainform.formGUID) {
		    if(currentWin.mainform.formGUID == formCode || currentWin.mainform.idForm == formCode) {
			  return currentWin;
			}
		  }
		}
	}
	
	return null;
}

function __mkxCreateAreaChart(formulario, componente, titulo, series, dados, propriedades) {
  // Valida a URL
  
  
  mkxImportJs("https://www.google.com/jsapi?callback=__mkxSetChartsAPILoaded");
  var loadCheck = 0; 
  var _drawChart = function() {  
     if(!__mkxIsChartsAPILoaded()) {
       if(loadCheck < 5) {       
         setTimeout(_drawChart, 500);
       } else {
         throw "MEx Error: Erro carregando biblioteca do Google";
       }
       return;
     } 

         
      var __drawChart = function() {
        // Obtém o componente   
        var component = $c(componente, formulario);   
    
        // Caso o componente seja encontrado
        if(component) {
          // Obtém a div onde o scroll deve ser adicionado     
          var div = component.div;
          div.innerHTML = '';  
             
          // Prepara a lista de títulos
          var listaSeries = series.split(";");
         
          // concatena com a lista de dados
          var dadosFinais = new Array();
          dadosFinais.push(listaSeries);           
          dadosFinais = dadosFinais.concat(dados); 
  
          var data = google.visualization.arrayToDataTable(dadosFinais);
          component.dataTable = data;          

          var options = {
             title: titulo,
			 width: component.getWidth(),
			 height: component.getHeight()
          };
          
          if(propriedades) {		  
            var objProp = eval("[{" + ebfReplaceAll(propriedades,"\n"," ") + "}]")[0];
			options = __mkxMergeJSON(options,objProp)
          }
                    
          component.chartOptions = options;
 
          component.chart = new google.visualization.AreaChart(div);           

          google.visualization.events.addListener(component.chart, 'ready', function() {
            if(component.registeredEvents) {
              for(var i = 0; i < component.registeredEvents.length; i++) {
                 google.visualization.events.addListener(component.chart, component.registeredEvents[i][0],component.registeredEvents[i][1]);
              }
            }
          });          

          component.chart.draw(data, component.chartOptions);         
        } else {
          throw "MEx Error: Componente não encontrado";
        }
     };     

     if(!document.googleLoaded) document.googleLoaded = new Array(); 
     if(!document.googleLoaded["corechart"]) {
       google.load('visualization', '1', {'callback':__drawChart, 'packages':['corechart']})       
       document.googleLoaded["corechart"] = true;
     } else {
       __drawChart();
     }
     
   }    

   _drawChart();
       
}

function __mkxIsChartsAPILoaded() {
   if(document.mkxSetChartsLoaded) {
     return true;
   } else {
     return false;
   } 
}

function __mkxSetChartsAPILoaded() {
  document.mkxSetChartsLoaded = true;
}

function __mkxCreateBarChart(formulario, componente, titulo, series, dados, propriedades) {
  // Valida a URL
  
  
  mkxImportJs("https://www.google.com/jsapi?callback=__mkxSetChartsAPILoaded");
  var loadCheck = 0;  
  var _drawChart = function() {  
     if(!__mkxIsChartsAPILoaded()) {
       if(loadCheck < 5) {       
         setTimeout(_drawChart, 500);
       } else {
         throw "MEx Error: Erro carregando biblioteca do Google";
       }
       return;
     } 

         
      var __drawChart = function() {
        // Obtém o componente   
        var component = $c(componente, formulario);   
    
        // Caso o componente seja encontrado
        if(component) {
          // Obtém a div onde o scroll deve ser adicionado     
          var div = component.div;
          div.innerHTML = '';  
             
          // Prepara a lista de títulos
          var listaSeries = series.split(";");
         
          // concatena com a lista de dados
          var dadosFinais = new Array();
          dadosFinais.push(listaSeries);           
          dadosFinais = dadosFinais.concat(dados); 
  
          var data = google.visualization.arrayToDataTable(dadosFinais);          
          component.dataTable = data;
  
          var options = {
             title: titulo,
			 width: component.getWidth(),
			 height: component.getHeight()
          };          

          if(propriedades) {		  
            var objProp = eval("[{" + ebfReplaceAll(propriedades,"\n"," ") + "}]")[0];
			options = __mkxMergeJSON(options,objProp)
          }            
          component.chartOptions = options;
 
          component.chart = new google.visualization.BarChart(div);          

          google.visualization.events.addListener(component.chart, 'ready', function() {
            if(component.registeredEvents) {
              for(var i = 0; i < component.registeredEvents.length; i++) {
                 google.visualization.events.addListener(component.chart, component.registeredEvents[i][0],component.registeredEvents[i][1]);
              }
            }
          });          

          component.chart.draw(data, component.chartOptions);         
        } else {
          throw "MEx Error: Componente não encontrado";
        }
     };     

     if(!document.googleLoaded) document.googleLoaded = new Array(); 
     if(!document.googleLoaded["corechart"]) {
	 alert('teste'+__drawChart);
       google.load('visualization', '1', {'callback':__drawChart, 'packages':['corechart']})       
       document.googleLoaded["corechart"] = true;
     } else {
       __drawChart();
     }
     
   }    

   _drawChart();
       
}

function __mkxCreateColumnChart(formulario, componente, titulo, series, dados, propriedades) {
  // Valida a URL
  
  
  mkxImportJs("https://www.google.com/jsapi?callback=__mkxSetChartsAPILoaded");
  var loadCheck = 0;  
  var _drawChart = function() {  
     if(!__mkxIsChartsAPILoaded()) {
       if(loadCheck < 5) {       
         setTimeout(_drawChart, 100);
       } else {
         throw "MEx Error: Erro carregando biblioteca do Google";
       }
       return;
     } 

         
      var __drawChart = function() {
        // Obtém o componente   
        var component = $c(componente, formulario);   
    
        // Caso o componente seja encontrado
        if(component) {
          // Obtém a div onde o scroll deve ser adicionado     
          var div = component.div;
          div.innerHTML = '';  
             
          // Prepara a lista de títulos
          var listaSeries = series.split(";");
         
          // concatena com a lista de dados
          var dadosFinais = new Array();
          dadosFinais.push(listaSeries);           
          dadosFinais = dadosFinais.concat(dados); 
  
          var data = google.visualization.arrayToDataTable(dadosFinais);          
          component.dataTable = data;
  
          var options = {
             title: titulo,
			 width: component.getWidth(),
			 height: component.getHeight()
          };           

          if(propriedades) {		  
            var objProp = eval("[{" + ebfReplaceAll(propriedades,"\n"," ") + "}]")[0];
			options = __mkxMergeJSON(options,objProp)
          }
          component.chartOptions = options;  
 
          component.chart = new google.visualization.ColumnChart(div);
          
          google.visualization.events.addListener(component.chart, 'ready', function() {
            if(component.registeredEvents) {
              for(var i = 0; i < component.registeredEvents.length; i++) {
                 google.visualization.events.addListener(component.chart, component.registeredEvents[i][0],component.registeredEvents[i][1]);
              }
            }
          });
          
          component.chart.draw(data, component.chartOptions);        
        } else {
          throw "MEx Error: Componente não encontrado";
        }
     };     

     if(!document.googleLoaded) document.googleLoaded = new Array(); 
     if(!document.googleLoaded["corechart"]) {
	 	 alert('teste'+__drawChart);
	 google.load('visualization', '1', {'callback':__drawChart, 'packages':['corechart']})       
       document.googleLoaded["corechart"] = true;
     } else {
       __drawChart();
     }
     
   }    

   _drawChart();
       
}

function __mkxCreateGaugeChart(formulario, componente, titulo, series, dados, propriedades) {
  // Valida a URL
  
  
  mkxImportJs("https://www.google.com/jsapi?callback=__mkxSetChartsAPILoaded");
  var loadCheck = 0;  
  var _drawChart = function() {  
     if(!__mkxIsChartsAPILoaded()) {
       if(loadCheck < 5) {       
         setTimeout(_drawChart, 500);
       } else {
         throw "MEx Error: Erro carregando biblioteca do Google";
       }
       return;
     } 

         
      var __drawChart = function() {
        // Obtém o componente   
        var component = $c(componente, formulario);   
    
        // Caso o componente seja encontrado
        if(component) {
          // Obtém a div onde o scroll deve ser adicionado     
          var div = component.div;
          div.innerHTML = '';  
             
          // Prepara a lista de títulos
          var listaSeries = series.split(";");
         
          // concatena com a lista de dados
          var dadosFinais = new Array();
          dadosFinais.push(listaSeries);           
          dadosFinais = dadosFinais.concat(dados); 
  
          var data = google.visualization.arrayToDataTable(dadosFinais);          
          component.dataTable = data;
  
          var options = {
             title: titulo,
			 width: component.getWidth(),
			 height: component.getHeight()
          };          

          if(propriedades) {		  
            var objProp = eval("[{" + ebfReplaceAll(propriedades,"\n"," ") + "}]")[0];
			options = __mkxMergeJSON(options,objProp)
          }
          component.chartOptions = options;  
 
          component.chart = new google.visualization.Gauge(div);          

          google.visualization.events.addListener(component.chart, 'ready', function() {
            if(component.registeredEvents) {
              for(var i = 0; i < component.registeredEvents.length; i++) {
                 google.visualization.events.addListener(component.chart, component.registeredEvents[i][0],component.registeredEvents[i][1]);
              }
            }
          });          

          component.chart.draw(data, component.chartOptions);         
        } else {
          throw "MEx Error: Componente não encontrado";
        }
     };     

     if(!document.googleLoaded) document.googleLoaded = new Array(); 
     if(!document.googleLoaded["gauge"]) {
       google.load('visualization', '1', {'callback':__drawChart, 'packages':['gauge']})       
       document.googleLoaded["gauge"] = true;
     } else {
       __drawChart();
     }
     
   }    

   _drawChart();
       
}

function __mkxCreateGeoChart(formulario, componente, titulo, series, dados, propriedades) {
  // Valida a URL
  
  
  mkxImportJs("https://www.google.com/jsapi?callback=__mkxSetChartsAPILoaded");
  var loadCheck = 0;  
  var _drawChart = function() {  
     if(!__mkxIsChartsAPILoaded()) {
       if(loadCheck < 5) {       
         setTimeout(_drawChart, 500);
       } else {
         throw "MEx Error: Erro carregando biblioteca do Google";
       }
       return;
     } 

         
      var __drawChart = function() {
        // Obtém o componente   
        var component = $c(componente, formulario);   
    
        // Caso o componente seja encontrado
        if(component) {
          // Obtém a div onde o scroll deve ser adicionado     
          var div = component.div;
          div.innerHTML = '';  
             
          // Prepara a lista de títulos
          var listaSeries = series.split(";");
         
          // concatena com a lista de dados
          var dadosFinais = new Array();
          dadosFinais.push(listaSeries);           
          dadosFinais = dadosFinais.concat(dados); 
  
          var data = google.visualization.arrayToDataTable(dadosFinais);          
          component.dataTable = data;
  
          var options = {
             title: titulo,
			 width: component.getWidth(),
			 height: component.getHeight()
          };           

          if(propriedades) {		  
            var objProp = eval("[{" + ebfReplaceAll(propriedades,"\n"," ") + "}]")[0];
			options = __mkxMergeJSON(options,objProp)
          }
          component.chartOptions = options;  
 
          component.chart = new google.visualization.GeoChart(div);          

          google.visualization.events.addListener(component.chart, 'ready', function() {
            if(component.registeredEvents) {
              for(var i = 0; i < component.registeredEvents.length; i++) {
                 google.visualization.events.addListener(component.chart, component.registeredEvents[i][0],component.registeredEvents[i][1]);
              }
            }
          });          

          component.chart.draw(data, component.chartOptions);         
        } else {
          throw "MEx Error: Componente não encontrado";
        }
     };     

     if(!document.googleLoaded) document.googleLoaded = new Array(); 
     if(!document.googleLoaded["geochart"]) {
       google.load('visualization', '1', {'callback':__drawChart, 'packages':['geochart']})       
       document.googleLoaded["geochart"] = true;
     } else {
       __drawChart();
     }
     
   }    

   _drawChart();
       
}

function __mkxCreateGeoCityChart(formulario, componente, titulo, regiao, series, dados, propriedades) {
  // Valida a URL
  
  
  mkxImportJs("https://www.google.com/jsapi?callback=__mkxSetChartsAPILoaded");
  var loadCheck = 0;  
  var _drawChart = function() {  
     if(!__mkxIsChartsAPILoaded()) {
       if(loadCheck < 5) {       
         setTimeout(_drawChart, 500);
       } else {
         throw "MEx Error: Erro carregando biblioteca do Google";
       }
       return;
     } 

         
      var __drawChart = function() {
        // Obtém o componente   
        var component = $c(componente, formulario);   
    
        // Caso o componente seja encontrado
        if(component) {
          // Obtém a div onde o scroll deve ser adicionado     
          var div = component.div;
          div.innerHTML = '';  
             
          // Prepara a lista de títulos
          var listaSeries = series.split(";");
         
          // concatena com a lista de dados
          var dadosFinais = new Array();
          dadosFinais.push(listaSeries);           
          dadosFinais = dadosFinais.concat(dados); 
  
          var data = google.visualization.arrayToDataTable(dadosFinais);          
          component.dataTable = data;
  
		  var options = {
             title: titulo,             
             region: regiao,             
             displayMode: 'markers',
			 width: component.getWidth(),
			 height: component.getHeight()
          };          

          if(propriedades) {		  
            var objProp = eval("[{" + ebfReplaceAll(propriedades,"\n"," ") + "}]")[0];
			options = __mkxMergeJSON(options,objProp)
          }
          component.chartOptions = options;  
 
          component.chart = new google.visualization.GeoChart(div);          

          google.visualization.events.addListener(component.chart, 'ready', function() {
            if(component.registeredEvents) {
              for(var i = 0; i < component.registeredEvents.length; i++) {
                 google.visualization.events.addListener(component.chart, component.registeredEvents[i][0],component.registeredEvents[i][1]);
              }
            }
          });          

          component.chart.draw(data, component.chartOptions);         
        } else {
          throw "MEx Error: Componente não encontrado";
        }
     };     
     if(!document.googleLoaded) document.googleLoaded = new Array(); 
     if(!document.googleLoaded["corechart"]) {
       google.load('visualization', '1', {'callback':__drawChart, 'packages':['geochart']});
     } else {
       __drawChart();
     }       
     
   }    

   _drawChart();
       
}

function __mkxCreateLineChart(formulario, componente, titulo, series, dados, propriedades) {
  // Valida a URL
  
  
  mkxImportJs("https://www.google.com/jsapi?callback=__mkxSetChartsAPILoaded");
  var loadCheck = 0;  
  var _drawChart = function() {  
     if(!__mkxIsChartsAPILoaded()) {
       if(loadCheck < 5) {       
         setTimeout(_drawChart, 500);
       } else {
         throw "MEx Error: Erro carregando biblioteca do Google";
       }
       return;
     } 

         
      var __drawChart = function() {
        // Obtém o componente   
        var component = $c(componente, formulario);   
    
        // Caso o componente seja encontrado
        if(component) {
          // Obtém a div onde o scroll deve ser adicionado     
          var div = component.div;
          div.innerHTML = '';  
             
          // Prepara a lista de títulos
          var listaSeries = series.split(";");
         
          // concatena com a lista de dados
          var dadosFinais = new Array();
          dadosFinais.push(listaSeries);           
          dadosFinais = dadosFinais.concat(dados); 
  
          var data = google.visualization.arrayToDataTable(dadosFinais);          
          component.dataTable = data;
  
          var options = {
             title: titulo,
			 width: component.getWidth(),
			 height: component.getHeight()
          };           

          if(propriedades) {		  
            var objProp = eval("[{" + ebfReplaceAll(propriedades,"\n"," ") + "}]")[0];
			options = __mkxMergeJSON(options,objProp)
          }
          component.chartOptions = options;  
 
          component.chart = new google.visualization.LineChart(div);          

          google.visualization.events.addListener(component.chart, 'ready', function() {
            if(component.registeredEvents) {
              for(var i = 0; i < component.registeredEvents.length; i++) {
                 google.visualization.events.addListener(component.chart, component.registeredEvents[i][0],component.registeredEvents[i][1]);
              }
            }
          });          

          component.chart.draw(data, component.chartOptions);         
        } else {
          throw "MEx Error: Componente não encontrado";
        }
     };     

     if(!document.googleLoaded) document.googleLoaded = new Array(); 
     if(!document.googleLoaded["corechart"]) {
       google.load('visualization', '1', {'callback':__drawChart, 'packages':['corechart']})       
       document.googleLoaded["corechart"] = true;
     } else {
       __drawChart();
     }
     
   }    

   _drawChart();
       
}

function __mkxCreatePieChart(formulario, componente, titulo, series, dados, propriedades) {
  // Valida a URL
  
   
  mkxImportJs("https://www.google.com/jsapi?callback=__mkxSetChartsAPILoaded");
  var loadCheck = 0;  
  var _drawChart = function() {  
     if(!__mkxIsChartsAPILoaded()) {
       if(loadCheck < 5) {       
         setTimeout(_drawChart, 500);
       } else {
         throw "MEx Error: Erro carregando biblioteca do Google";
       }
       return;
     } 

         
      var __drawChart = function() {
        // Obtém o componente   
        var component = $c(componente, formulario);   
    
        // Caso o componente seja encontrado
        if(component) {
          // Obtém a div onde o scroll deve ser adicionado     
          var div = component.div;
          div.innerHTML = '';  
             
          // Prepara a lista de títulos
          var listaSeries = series.split(";");
         
          // concatena com a lista de dados
          var dadosFinais = new Array();
          dadosFinais.push(listaSeries);           
          dadosFinais = dadosFinais.concat(dados); 
  
          var data = google.visualization.arrayToDataTable(dadosFinais);          
          component.dataTable = data;
  
          var options = {
             title: titulo,
			 width: component.getWidth(),
			 height: component.getHeight()
          };          

          if(propriedades) {		  
            var objProp = eval("[{" + ebfReplaceAll(propriedades,"\n"," ") + "}]")[0];
			options = __mkxMergeJSON(options,objProp)
          }
          component.chartOptions = options;  
 
          component.chart = new google.visualization.PieChart(div);          

          google.visualization.events.addListener(component.chart, 'ready', function() {
            if(component.registeredEvents) {
              for(var i = 0; i < component.registeredEvents.length; i++) {
                 google.visualization.events.addListener(component.chart, component.registeredEvents[i][0],component.registeredEvents[i][1]);
              }
            }
          });          

          component.chart.draw(data, component.chartOptions);         
        } else {
          throw "MEx Error: Componente não encontrado";
        }
     };     

     if(!document.googleLoaded) document.googleLoaded = new Array(); 
     if(!document.googleLoaded["corechart"]) {
       google.load('visualization', '1', {'callback':__drawChart, 'packages':['corechart']})       
       document.googleLoaded["corechart"] = true;
     } else {
       __drawChart();
     }
     
   }    

   _drawChart();
       
}

function __mkxCreateSteppedAreaChart(formulario, componente, titulo, series, dados, propriedades) {
  // Valida a URL
   
   
  mkxImportJs("https://www.google.com/jsapi?callback=__mkxSetChartsAPILoaded");
  var loadCheck = 0;  
  var _drawChart = function() {  
     if(!__mkxIsChartsAPILoaded()) {
       if(loadCheck < 5) {       
         setTimeout(_drawChart, 500);
       } else {
         throw "MEx Error: Erro carregando biblioteca do Google";
       }
       return;
     } 

         
      var __drawChart = function() {
        // Obtém o componente   
        var component = $c(componente, formulario);   
    
        // Caso o componente seja encontrado
        if(component) {
          // Obtém a div onde o scroll deve ser adicionado     
          var div = component.div;
          div.innerHTML = '';  
             
          // Prepara a lista de títulos
          var listaSeries = series.split(";");
         
          // concatena com a lista de dados
          var dadosFinais = new Array();
          dadosFinais.push(listaSeries);           
          dadosFinais = dadosFinais.concat(dados); 
  
          var data = google.visualization.arrayToDataTable(dadosFinais);          
          component.dataTable = data;
  
          var options = {
             title: titulo,
			 width: component.getWidth(),
			 height: component.getHeight()
          };             

          if(propriedades) {		  
            var objProp = eval("[{" + ebfReplaceAll(propriedades,"\n"," ") + "}]")[0];
			options = __mkxMergeJSON(options,objProp)
          }
          component.chartOptions = options;  
 
          component.chart = new google.visualization.SteppedAreaChart(div);          

          google.visualization.events.addListener(component.chart, 'ready', function() {
            if(component.registeredEvents) {
              for(var i = 0; i < component.registeredEvents.length; i++) {
                 google.visualization.events.addListener(component.chart, component.registeredEvents[i][0],component.registeredEvents[i][1]);
              }
            }
          });          

          component.chart.draw(data, component.chartOptions);         
        } else {
          throw "MEx Error: Componente não encontrado";
        }
     };     

     if(!document.googleLoaded) document.googleLoaded = new Array(); 
     if(!document.googleLoaded["corechart"]) {
       google.load('visualization', '1', {'callback':__drawChart, 'packages':['corechart']})       
       document.googleLoaded["corechart"] = true;
     } else {
       __drawChart();
     }
     
   }    

   _drawChart();
       
}

function __mkxAssociateChartEvent(formulario, componente, evento, fluxo, parametros) {
   
   var _associate = function() {
   var loadCheck = 0;
   if(!__mkxIsChartsAPILoaded()) {
     if(loadCheck < 5) {       
       setTimeout(_associate, 100);
     } else {
       throw "MEx Error: Erro carregando biblioteca do Google";
     }
     return;
   }        

   // Obtém o componente   
   var component = $c(componente, formulario);
   
   var executeFlow = function(e) {
     if(!e && component.chart.getSelection()) e = component.chart.getSelection()[0];
     var paramList = new Array();
           if(e) {
		     testRow = (e["row"] != null) && (e["row"] != "undefined") && (e["row"] != "");
			 testCol = (e["column"] != null) && (e["column"] != "undefined") && (e["column"] != "");
             if(!testRow && testCol) {
               // Serie             
               paramList.push(component.dataTable.getColumnLabel(e["column"])); 
               // Grupo
               paramList.push(null);                   
               // Valor
               paramList.push(null);
             }
             
             if(testRow && !testCol) {
               // Serie             
               paramList.push(null); 
               // Grupo
               paramList.push(component.dataTable.getValue(e["row"], 0));               
               // Valor
               paramList.push(null);
             } 
              
             if(e["row"] && testCol) {
               // Serie             
               paramList.push(component.dataTable.getColumnLabel(e["column"]));
               // Grupo
               paramList.push(component.dataTable.getValue(e["row"], 0));               
               // Valor
               paramList.push(component.dataTable.getValue(e["row"], e["column"]));
             }             
                              
           }           
           if(parametros) {
             parametros = paramList.concat(parametros);             
           }
           mkxFlowExecute(fluxo, paramList);
   }     

   // Caso o componente seja encontrado
   if(component && component.chart) {
       // Obtém o gráfico
       var grafico = component.chart;        

       // Associa os eventos
       google.visualization.events.addListener(grafico, evento, executeFlow); 

   } else {
     // Guarda o evento para ser associado quando o gráfico estiver pronto   
     if(component && !component.chart) {
       if(!component.registeredEvents) component.registeredEvents = new Array();       
         component.registeredEvents.push([evento,executeFlow]);
     } else {
         throw "Gráfico não localizado!";
     }
   } 
  }  

  _associate();        
}

function mkxFlowExecute(ruleName, params) {
  var reducedName = reduceVariable(ruleName);  
  var sysCode = ($mainform().d.WFRForm ? $mainform().d.WFRForm.sys.value : $mainform().sysCode);
  var formCode = ($mainform().d.WFRForm ? $mainform().d.WFRForm.formID.value : null);
  var isJava = false;
  var ruleFunction;
  try {
    ruleFunction = window.eval(reducedName);
  } catch (ex) {
    isJava = true;
  }
  var value = null;
  if (isJava) {
    if (params && params instanceof Array && params.length > 0) {
      value = executeSyncJavaRule(sysCode, formCode, ruleName, params);
    } else {
      value = executeSyncJavaRule(sysCode, formCode, ruleName);
    }
  } else {
    var ruleInstance = new ruleFunction(null, sysCode, formCode);
    if (ruleInstance && ruleInstance.run) { // é JS
      value = executeJSRuleNoField(sysCode, formCode, ruleName, params, true);
    }
  } 
  return value;
}

function __mkxAddChartData(formulario, componente, valores) {       
	
   // Obtém o componente   
   var component = $c(componente, formulario);

   // Caso o componente seja encontrado
   if(component && component.chart) {
       // Obtém o gráfico
       var grafico = component.chart;        

       // Adiciona a linha
       component.dataTable.addRow(valores); 

       // Redesenha o gráfico
      grafico.draw(component.dataTable, component.chartOptions);
   } else {
     throw "Gráfico não localizado!";
   } 
        
}

function __mkxResizeWindowToMax() {
  window.moveTo(0,0);

  if (document.all) {
    top.window.resizeTo(screen.availWidth,screen.availHeight);
  } else if (document.layers||document.getElementById) {
    top.window.resizeTo(screen.width,screen.height);
  }
}

/*
* Cria o CKEditor numa moldura
*/
function __mkxCreateCKE(formulario, moldura, isReadOnly, tools){

  // Importa a biblioteca
  webrun.include('apimakerextreme/plugins/ckeditor/ckeditor.js');
 
  // Valida a restrição de domínio
  
   
  // Cria os containers
  var CKEditorDiv = document.createElement("div");      
  var CKEditor = document.createElement("textarea"); 
 
  // Obtém a div do componente
  var molduraDiv = $c(moldura, formulario).div;               
  var altura;         
 
  CKEditor.setAttribute("id",moldura); 
  CKEditor.setAttribute("name",moldura);           
  CKEditorDiv.appendChild(CKEditor);
 
  // Ajusta o zIndex 
  CKEditorDiv.style.zIndex = 999999999;        
 
  // Limpa o conteúdo da moldura
  molduraDiv.innerHTML = "";
 
  // adiciona o CKEditor na moldura
  molduraDiv.appendChild(CKEditorDiv);             
  altura = (parseInt($MEx(molduraDiv).hiddenDimension("height")-124))            
              
  if(!isNullOrEmpty(tools)){
   // configurações iniciais do CKEditor
   CKEDITOR.config.scayt_autoStartup = true;
   CKEDITOR.config.disableNativeSpellChecker = false;
   // se o CKEditor ja existir, remove ele e cria novamente
   if (CKEDITOR.instances[moldura]) {
     CKEDITOR.remove(CKEDITOR.instances[moldura]);
   }
   
    CKEDITOR.replace(moldura,{height: altura, skin:'kama',uiColor:'#e6edf3', readOnly: isReadOnly, toolbar:tools});
  }else{
    if (CKEDITOR.instances[moldura]) {
      CKEDITOR.remove(CKEDITOR.instances[moldura]);
    } else {
      CKEDITOR.replace( moldura , {height: altura, skin:'kama',uiColor:'#e6edf3',readOnly: isReadOnly}  );
    }
  } 
  molduraDiv.style.zIndex = 999999999;
}

/*
* Obtém o valor de um componente CKEditor
*/
function __mkxGetDataCKE(formulario, idCKEditor) {         
  return CKEDITOR.instances[idCKEditor].getData();
}

/*
* Altera o valor de um componente CKEditor
*/
function __mkxSetDataCKE(formulario, idCKEditor,texto) { 
  // Verifica se o CKEditor ainda não está pronto
  if(!CKEDITOR || !CKEDITOR.instances || CKEDITOR.instances.length == 0) {
       // Associa um evento para que o CKEditor seja alterado quando estiver pronto
       CKEDITOR.on( 'instanceReady', function( ev )
       {                          
         CKEDITOR.instances[idCKEditor].setData(texto);      
       });
  } else {
     // Altera o CKEditor imediatamente caso ele já esteja pronto
     CKEDITOR.instances[idCKEditor].setData(texto);
  }         
}

/*
* Cria uma grade em forma de árvore
*/
function __mkxCreateTreeGrid(formulario, componente, titulo, listaColunas, listaDados, multiSelect, paging) {
  //importar css                                                                        
  mkxImportCss("apimakerextreme/commons/jquery-ui/css/jquery-ui.min.css");         
  mkxImportCss("apimakerextreme/commons/jquery-ui/css/jquery-ui-components.min.css");
  mkxImportCss("apimakerextreme/plugins/jq-grid/css/ui.jqgrid.css");   

  //importar javascript
  mkxImportJs("apimakerextreme/commons/jquery/jquery.min.js");
  mkxImportJs("apimakerextreme/commons/jquery-ui/js/jquery-ui.min.js");
  mkxImportJs("apimakerextreme/plugins/jq-grid/js/grid.locale-pt-br.js");
  mkxImportJs("apimakerextreme/plugins/jq-grid/js/jquery.jqGrid.min.js");
  
  // Valida a restrição de domínio
    
    
  // Obtém o componente  
   var component;   

   try {   
     component = $c(componente, formulario);
   } catch(ex) {}  
   
   // Caso o componente não seja encontrado
   var gridComp;
   if(!component) { 
     gridComp = $MEx("#" + componente);     
     if(gridComp.size() == 0) {
       throw "MEx error: Container não encontrado";
     }
     gridComp.attr("class","mexGrid");     
     gridComp.html("<table id=\""+ gridComp.attr("id") +"_table\" class=\"mexGridTable\"></table>");     

   } else {
     var id = component.id;   
     gridComp = $MEx(component.div);
     gridComp.attr("class","mexGrid");
     gridComp.attr("id",id);                       
     gridComp.html("<table id=\""+ id +"_table\" class=\"mexGridTable\"></table><div id=\""+ id +"_pager\"></div>");     
   }
   
   component.div.savedData = new Array();
   component.div.savedData["titulo"] = titulo;
   component.div.savedData["listaColunas"] = listaColunas;
   component.div.savedData["multiSelect"] = multiSelect;
   component.div.savedData["paging"] = paging;
   
   if(!listaColunas) throw "MEx error: A definição de colunas não foi informada";
   if(!listaDados) throw "MEx error: A fonte de dados não foi informada";   

   // Prepara as listas de colunas   
   var columnNames = new Array();   
   var columnModel = new Array();    
      
   // Adiciona o ID   
   // Adiciona a lista de definições   
   columnNames.push("ID");
   columnModel.push({     
     key: true,
     name: "id",
     width: 50, 
     align: "center", 
     sortable: "true",
     sorttype: "integer",     
     hidden: true
   });     

   for(var i = 0; i < listaColunas.length; i++) {
     // Quebra a linha em uma lista   
     var currentDef = listaColunas[i].split(";");     
     // Adiciona o nome na lista de nomes
     columnNames.push(currentDef[0]);
     // Adiciona a lista de definições
     columnModel.push({     
        key: false,
        name: reduceVariable(currentDef[0]),
        width: (currentDef[1]) ? currentDef[1] : 150, 
        align: (currentDef[2]) ? currentDef[2] : "left", 
        sortable: (currentDef[3]) ? (currentDef[3] === "true") : false,
        sorttype: (currentDef[4]) ? currentDef[4] : "text"
     }) 
   };    

   //ORDENA A LISTA
   /* Ordena a lista a ajusta os níveis */	
   function organizeTreeList(listObj) {                  
     var DadosFinal=[];
     if(listObj == null) return null;            

     // Função recursiva que organiza a lista
     var _organizeChildrenList = function(listObj, objPai, nivel) {
       // Varre os elementos da lista de origem        
       for(var i = 0; i < listObj.length; i++) {            
         // Verifica se o id do pai é o que está sendo procurado             
         if(listObj[i][1] == objPai[0]) {               
           // Obtém o objeto atual
           var currentLine = listObj[i];           
           // Ajusta o nível                
           currentLine = __mkxSetElementAtList(currentLine,nivel,3);           

           // Define o elemento atual como folha
           currentLine.push(true);
           // Define que o elemento pai não é folha           
           objPai[objPai.length - 1] = false;
                           
           // Adiciona o elemento atual na lista final
           DadosFinal.push(currentLine);                                 
           // Procura recursivamente por filhos do elemento atual
           _organizeChildrenList(listObj,currentLine, (nivel + 1));
         }
       }
     }                                           
   
     // Inicia a busca pelos elementos sem pai com nível zero
     _organizeChildrenList(listObj,["",true],0);
     return DadosFinal;                          
   }
                
   var listaDados = organizeTreeList(listaDados);    

   // Prepara a lista de dados   
   var dados = new Array();   
   for(var i = 0; i < listaDados.length; i++) {
     dados[i] = {};
     dados[i]["id"] = listaDados[i][0];
     dados[i]["parent"] = (isNullOrEmpty(listaDados[i][1])) ? "null": listaDados[i][1];
     dados[i]["level"] = listaDados[i][2];
     dados[i]["isLeaf"] = listaDados[i][listaDados[i].length - 1];
     dados[i]["expanded"] = false;     
     dados[i]["loaded"] = true;
     // A posição de 0 a 3 são dados de configuração da grade
     // o restante são as colunas definidas por usuário (da posição 4 para frente)    
     for(var j = 3; j < listaDados[i].length - 1; j++) {
         dados[i][reduceVariable(columnNames[j - 2]).toString()] = listaDados[i][j];
     }
   }  
         
   // Cria a grade              
   var grid = $MEx("#" + gridComp.attr("id")).find(":first-child").first();
   grid.jqGrid({        
	datatype: "jsonstring",
    datastr: dados,
   	colNames: columnNames,
   	colModel: columnModel,
	forceFit: false,
	shrinkToFit: false,
	hidegrid: false,
   	rowNum: 100000,
   	rowList:[100,500,1000,5000],
   	pager: (paging == true) ? "#" + id +"_pager" : null,   
   	sortname: 'id',   
    gridview: true,
	width: gridComp.closest(".mexGrid").width(),
	height: (parseInt(gridComp.hiddenDimension("height") - 50)),
    viewrecords: true,
    sortorder: "desc",
	caption: titulo,
    multiselect: (multiSelect == true || multiSelect === "true"),       
    treeGrid: true,
	treeGridModel: 'adjacency',
    ExpandColumn: reduceVariable(columnNames[1]),
    jsonReader: {
        repeatitems: false,
        root: function (obj) { return obj; },
        page: function () { return 1; },
        total: function () { return 1; },
        records: function (obj) { return obj.length; }
     }      
   });   
	
}

/*
* Função que adiciona um objeto na liste (modificada para corrigir um BUG do Maker)
*/
function __mkxSetElementAtList() {
  var value = null;
  if (existArgs(arguments)) {
    var list = arguments[0];
    var element = arguments[1];
    var position = arguments[2];
    if (position) {
      position--;
      position = Math.max(0, position);
      position = Math.min(position, list.length);
      if (position == 0) {
        list.unshift(element);
      } else if (position == (list.length)) {
        list.push(element);
      } else {
        var arr1 = list.slice(0, (position));
        arr1.push(element);
        var arr2 = list.slice(position);
        value = new Array();
        value = value.concat(arr1);
        value = value.concat(arr2);
      }
    } else {
      list.push(element);
    }
    //value = list;
  }
  return value;
}

/*
* Faz o merge entre 2 objetos JSON
*/
function __mkxMergeJSON(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}

/*
* Cria uma janela de alerta simples
*/
function __mkxSimpleAlert(titulo, mensagem) { 

  //importar css                                                                        
  mkxImportCss("apimakerextreme/plugins/jq-alerts/jquery.alerts.css");   

  //importar javascript
  mkxImportJs("apimakerextreme/plugins/jq-alerts/jquery.alerts.js");

//Chama o alerta
   jAlert(mensagem, (isNullOrEmpty(titulo)) ? "Alerta":titulo);
   
}


/*
* Cria uma janela de alerta con confirmação
*/
function __mkxConfirmAlert(titulo, mensagem, fluxo) { 

  //importar css                                                                        
  mkxImportCss("apimakerextreme/plugins/jq-alerts/jquery.alerts.css");   

  //importar javascript
  mkxImportJs("apimakerextreme/plugins/jq-alerts/jquery.alerts.js");

//Chama o alerta
   jConfirm(mensagem, (isNullOrEmpty(titulo)) ? "Confirmação":titulo, function(r){executeJSRuleNoField(sysCode, idForm, fluxo,[r]);});
   
}

/*
* Cria uma janela de alerta com prompt
*/
function __mkxPromptAlert(titulo, mensagem, fluxo) { 

  //importar css                                                                        
  mkxImportCss("apimakerextreme/plugins/jq-alerts/jquery.alerts.css");   

  //importar javascript
  mkxImportJs("apimakerextreme/plugins/jq-alerts/jquery.alerts.js");

//Chama o alerta
   jPrompt(mensagem, null, (isNullOrEmpty(titulo)) ? "Confirmação":titulo, function(r){executeJSRuleNoField(sysCode, idForm, fluxo,[r]);});
   
}

/*
* Abre um formulário como Spin
*/
function __mkxCreateFormSpin(formularioDestino, modo, filtro, tamanho) { 

	if(!$MEx('#spinDiv_'+formularioDestino.replace("{","").replace("}","")).length){
		//Criar a url do form
		var formURL = "form.jsp?sys=" + sysCode + "&action=openform&formID="+ formularioDestino +"&align=0&mode="+(modo?modo:-1)+"&goto=-1&filter="+(filtro?filtro:"")+"&scrolling=no";
		//Concatena iframe do spin	
		var tabContentHtml = "<iframe class=\"mexFormFrame\" frameborder=\"0\" src=\""+ formURL +"\" seamless=\"seamless\" marginheight=\"0\" marginwidth=\"0\" width=\"100%\" height=\"100%\"></iframe>";
		//Cria contexto do spin
		var SpinDiv = $MEx(document.createElement("div"));      
		SpinDiv.attr('id','spinDiv_'+formularioDestino.replace("{","").replace("}",""));
		SpinDiv.append(tabContentHtml);
		$MEx('#lay').parent().append(SpinDiv);
		//Trata Tamanho
		if(!tamanho){
			tamanho=200;
		}
		$MEx('#lay').css({"border-left": "1px solid #898989"});	
		//Faz o efeito
		$MEx('#lay').animate({"left":tamanho+"px"});
		$MEx('#spinDiv').animate({"width":tamanho+"px"});  
	}	
}

/*
* Remove formulário do Spin
*/
function __mkxRemoveFormSpin(formularioDestino) { 
	//Remove formulário
	$MEx('#lay').animate({"left":"0px"},function(){  $MEx('#spinDiv_'+formularioDestino.replace("{","").replace("}","")).remove()});

}


/*
* Função que cria o DashBoard
*/
function __mkxCreateDashboard(formulario, componente) {
   mkxImportCss("apimakerextreme/commons/jquery-ui/css/jquery-ui.min.css");         
   mkxImportCss("apimakerextreme/commons/jquery-ui/css/jquery-ui-components.min.css");   

   // Importa os scripts    
   mkxImportJs("apimakerextreme/commons/jquery/jquery.min.js");
   mkxImportJs("apimakerextreme/commons/jquery-ui/js/jquery-ui.min.js");  
   
   ebfCSSImportContent(".portletFrame{border:0px};div.portlet{display: inline-block;margin:3px;padding:1px;float:left;height:100px}.portlet{vertical-align: top; border-radius: 0px !important;float:left; margin-right: 10px; margin-top: 10px;; overflow:hidden !important;};.portlet-minimized{height:auto!important};.portlet-header{margin:.3em;padding-bottom:4px;padding-left:.2em}.portlet-header .ui-icon{float:right}.portlet-content{padding:.4em}.portlet-minimized .portlet-content{display:none!important}.ui-sortable-placeholder{border:1px dotted black;visibility:visible!important;height:50px!important}.ui-sortable-placeholder *{visibility:hidden}")
   
   // Função que valida a restrição de domínio
   
      
   var component = $c(componente, formulario);    
   component.div.innerHTML = "";      
   component.dashboardColumn = new Array();   

   // Cria as divs das molduras
   var column = document.createElement("DIV");
   column.className = "column";
   column.id = component.id + "_column";     

   component.div.appendChild(column);     
   component.dashboardColumn = column;
}

function __mkxAddDashboardForm(formulario, componente, targetForm, filter, mode, altura, largura, rolagem) {
      
   var component = $c(componente, formulario);  
   if(rolagem){rolagem='yes';}else{rolagem='no';} 
   
   var properties = 'scroll:\''+rolagem+'\',width:\''+(largura?largura:100)+'px\',height:\''+(altura?altura:100)+'px\'';
   
   if(properties) properties = eval("[{"+ properties +"}]")[0]      

   var url = 'form.jsp?sys='+sysCode+'&formID='+targetForm+'&goto=-1&filter='+(filter?filter:'')+'&scrolling='+properties.scroll;
   var iframe = "<iframe class=\"portletFrame\" width=\"100%\" height=\"100%\" src=\""+ url +"\"></iframe>"    
   var portlet  = "<div id=\""+ formulario +"_portlet\" class=\"portlet\" style=\"width:"+properties.width+";height:"+properties.height+";\">" ;
       portlet += ((properties.title) ? "<div class=\"portlet-header\">"+properties.title+"</div>" : "");
       portlet += "<div class=\"portlet-content\">"+ iframe +"</div>";
       portlet += "</div>";        

   var columnDiv = component.dashboardColumn;    
   columnDiv.innerHTML = columnDiv.innerHTML + portlet;
   
}

function __mkxActivateDashboard(formulario, componente, fluxo, parametros) {   
  
  var component = $c(componente, formulario);
   
  $MEx(component.dashboardColumn).sortable({
    stop: function( event, ui ) {
      if(fluxo) {
         ebfFlowExecute(fluxo, parametros);
      }  
    }
  });
  $MEx(component.dashboardColumn).disableSelection();  

  
  $MEx( ".portlet" )
    .addClass( "ui-widget ui-widget-content ui-corner-all" )
    .find( ".portlet-header" )
    .addClass( "ui-widget-header ui-corner-all" )
    .prepend( "<span class='ui-icon ui-icon-minusthick'></span>")
    .end()
    .find( ".portlet-content" );

  $MEx( ".portlet-header .ui-icon" ).click(function() {
    
  });

  $MEx( ".column" ).disableSelection(); 
}


(function($){
  $.fn.hiddenDimension = function(){
    if (arguments.length && typeof arguments[0] == 'string') {
      var dimension = arguments[0]

      if (this.is(':visible')) return this[dimension]();

      var visible_container = this.closest(':visible');

      if (!visible_container.is('body')) {
        var
          container_clone = $('<div />')
            .append(visible_container.children().clone())
            .css({
              position: 'absolute',
              left:'-32000px',
              top: '-32000px',
              width: visible_container.width(),
              height: visible_container.height()
            })
            .appendTo(visible_container),
          element_index = $('*',visible_container).index(this),
          element_clone = $('*',container_clone).slice(element_index);
        
        element_clone.parentsUntil(':visible').show();
        
        var result = element_clone[dimension]();
        container_clone.remove();
        return result;
      } else {
        //TO-DO: support elements whose nearest visible ancestor is <body>
        return undefined
      }
    }
    return undefined //nothing implemented for this yet
  }
}(jQuery));
