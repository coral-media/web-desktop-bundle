/**
 * Coral Desktop 0.1
 * Copyright(c) Coral Media Solutions, LLC.
 * licensing@qwikioffice.com
 *
 * http://www.qwikioffice.com/license
 */

/**
 * @class Ext.ux.TaskBar
 * @extends Ext.Container
 */
Ext.ux.TaskBar = Ext.extend(Ext.Container, {
   /**
    * @cfg {Boolean}
    * This feature is not finished!!!
    */
   autoHide: false,
   /**
    * @cfg {String}
    */
   buttonScale: 'medium',
   /**
    * @cfg {String} The position of the taskbar.  Defaults to 'bottom'
    * @options 'top', 'bottom'
    */
   position: 'bottom',
   /**
    * Read only.
    * @type {Ext.Desktop}
    */
   desktop: null,
   /**
    * Read only.
    * @type {Ext.ux.QuickStartPanel}
    */
   quickStartPanel: null,
   /**
    * Read only.
    * @type {Ext.Button}
    */
   startButton: null,
   /**
    * Read only.
    * @type {Ext.ux.TaskButtonsPanel}
    */
   taskButtonPanel: null,

   constructor : function(config){
      config = config || {};

      if(config.autoHide){
         this.autoHide = config.autoHide;
      }
      if(config.buttonScale){
         this.buttonScale = config.buttonScale;
      }
      if(config.position){
         this.position = config.position;
      }

      this.el = Ext.getBody().createChild({
         tag: 'div',
         cls: 'ux-taskbar ux-taskbar-' + this.position
      });
      if(this.autoHide){
         this.ghostEl = Ext.getBody().createChild({
            tag: 'div',
            cls: 'ux-ghost-taskbar ux-ghost-taskbar-' + this.position
         });
      }

      var startButtonConfig = Ext.apply({
         iconCls: 'icon-qwikioffice-24',
         region: 'west',
         split: true,
         text: 'Start',
         width: 90
      }, config.startButtonConfig || {});

      // maintain required start button config
      this.startButton = new Ext.Button(Ext.applyIf({
         cls: 'ux-startbutton',
         menu: new Ext.ux.StartMenu(config.startMenuConfig || {}),
         menuAlign: this.position === 'top' ? 'tl-bl' : 'bl-tl',
         scale: this.buttonScale
      }, startButtonConfig));

      // sync height to button
      this.startButton.on('afterRender', function(btn){
         var h = btn.getHeight();
         this.el.setHeight(h);
         if(this.autoHide){
            this.ghostEl.setHeight(h);
         }
      }, this);

      this.quickStartPanel = new Ext.ux.QuickStartPanel(Ext.apply({
         region: 'west',
         split: true,
         width: 120
      }, config.quickstartConfig || {}));
      this.quickStartPanel.taskbar = this;

      this.taskButtonPanel = new Ext.ux.TaskButtonsPanel({
         region: 'center'
      });

      Ext.ux.TaskBar.superclass.constructor.call(this, {
         el: this.el,
         items: [
            this.startButton,
            {
               items: [
                  this.quickStartPanel,
                  this.taskButtonPanel
               ],
               layout: 'border',
               region: 'center',
               xtype: 'container'
            }
         ],
         layout: 'border'
      });
   },

   // override

   initComponent : function(){
      Ext.ux.TaskBar.superclass.initComponent.call(this);

      this.el = Ext.get(this.el) || Ext.getBody();
      // need this to set height by button height
      //this.el.setHeight = Ext.emptyFn;
      this.el.setWidth = Ext.emptyFn;
      this.el.setSize = Ext.emptyFn;
      this.el.setStyle({
         overflow:'hidden',
         margin:'0',
         border:'0 none'
      });
      this.el.dom.scroll = 'no';
      this.allowDomMove = false;
      this.autoWidth = true;
      this.autoHeight = true;
      Ext.EventManager.onWindowResize(this.fireResize, this);
      this.renderTo = this.el;

      if(this.autoHide){
         this.el.on('mouseout', function(e, t, o){
            if(this.autoHide && !this.startButton.menu.isVisible()){
               var y = e.browserEvent.clientY;
               var hide = this.position === 'bottom' ? y < this.desktop.getViewHeight() : y >= this.getHeight();
               if(hide){
                  this.hide();
                  this.ghostEl.show();
                  this.desktop.layout();
               }
            }
         },this);

         this.ghostEl.on('mouseenter', function(){
            if(this.autoHide){
               this.ghostEl.hide();
               this.show();
               this.desktop.layout();
            }
         },this);
      }
   },

   fireResize : function(w, h){
      this.fireEvent('resize', this, w, h, w, h);
   },

   // added methods

   setActiveButton : function(btn){
      this.taskButtonPanel.setActiveButton(btn);
   },

   /**
    * @param {Ext.Window}
    */
   addTaskButton : function(win){
      return this.taskButtonPanel.add(win, { scale: this.buttonScale });
   },

   /**
    * @param {Ext.Button}
    */
   removeTaskButton : function(btn){
      this.taskButtonPanel.remove(btn);
   },

   /**
    * @param {Object}
    */
   addQuickStartButton : function(config){
      return this.quickStartPanel.add(Ext.apply(config, { scale: this.buttonScale }));
   },

   /**
    * @param {Ext.Button}
    */
   removeQuickStartButton : function(btn){
      this.quickStartPanel.remove(btn);
   }
});