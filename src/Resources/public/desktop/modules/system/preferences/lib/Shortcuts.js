/*
 * Coral Desktop 0.1
 * Copyright(c) Coral Media Solutions, LLC.
 * https://www.coralmediasolutions.com
 */

QoDesk.QoPreferences.Shortcuts = Ext.extend(Ext.Panel, {
   constructor : function(config){
      // constructor pre-processing
      config = config || {};
      let self = this;
      self.ownerModule = config.ownerModule;

      // this config
      Ext.applyIf(config, {
         border: false
         , buttons: [
            {
               // disabled: !self.ownerModule.app.isAllowedTo('saveShortcut', this.ownerModule.id)
               handler: onSave,
               scope: self,
               text: self.ownerModule.locale.button.save.text
            }
            , {
               handler: onClose
               , scope: self
               , text: self.ownerModule.locale.button.close.text
            }
         ]
         , cls: 'pref-card'
         , items: [
            {
               bodyStyle: 'padding:0 5px 0 0'
               , border: false
               , html: 'Selected applications will be available as a desktop Shortcut.  Don\'t forget to click the \'Save\' button.'
               , region: 'center'
               , xtype: 'panel'
            }
            , new QoDesk.QoPreferences.CheckTree({
               launcherKey: 'shortcut',
               listeners: {
                  'checkchange': { fn: onCheckChange, scope: this }
               }
               , ownerModule: config.ownerModule
               , region: 'west'
            })
         ]
         , layout: 'border'
         , title: this.ownerModule.locale.title.shortcuts
      });

      QoDesk.QoPreferences.Shortcuts.superclass.constructor.apply(this, [config]);
      // constructor post-processing

      function onClose(){
         let self = this;
         self.ownerModule.win.close();
      }

      function onSave(){
         let self = this;
         this.buttons[0].disable();
         self.ownerModule.save({
            method: 'saveShortcut'
            , callback: function(){
               self.buttons[0].enable();
            }
            , callbackScope: this
            , ids: Ext.encode(self.ownerModule.app.getDesktop().getLauncher('shortcut'))
         });
      }

      function onCheckChange(node, checked){
         let self = this;
         if(node.leaf && node.id){
            if(checked){
               self.ownerModule.app.getDesktop().addShortcut(node.id, true);
            }else{
               self.ownerModule.app.getDesktop().removeShortcut(node.id, true);
            }
         }
      }
   }
});