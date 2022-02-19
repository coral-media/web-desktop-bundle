/*
 * Coral Desktop 0.1
 * Copyright(c) Coral Media Solutions, LLC.
 * https://www.coralmediasolutions.com
 */

QoDesk.QoPreferences.AutoRun = Ext.extend(Ext.Panel, {
   constructor : function(config){
      // constructor pre-processing
      config = config || {};

      this.ownerModule = config.ownerModule;

      // this config
      Ext.applyIf(config, {
         border: false,
         buttons: [
            {
               // disabled: this.ownerModule.app.isAllowedTo('saveAutorun', this.ownerModule.id) ? false : true
               handler: onSave,
               scope: this,
               text: this.ownerModule.locale.button.save.text
            }
            , {
               handler: onClose
               , scope: this
               , text: this.ownerModule.locale.button.close.text
            }
         ],
         cls: 'pref-card',
         items: [
            {
               bodyStyle: 'padding:0 5px 0 0'
               , border: false
               , html: this.ownerModule.locale.html.autorun
               , region: 'center'
               , xtype: 'panel'
            }
				, new QoDesk.QoPreferences.CheckTree({
               launcherKey: 'autorun',
               listeners: {
                  'checkchange': { fn: onCheckChange, scope: this }
               }
               , ownerModule: config.ownerModule
               , region: 'west'
            })
         ],
         layout: 'border',
         title: this.ownerModule.locale.title.autorun
      });

      QoDesk.QoPreferences.AutoRun.superclass.constructor.apply(this, [config]);
      // constructor post-processing

      function onClose(){
         this.ownerModule.win.close();
      }

      function onSave(){
         let self = this;
         self.buttons[0].disable();
         self.ownerModule.save({
            method: 'saveAutorun',
            callback: function(){
               self.buttons[0].enable();
            },
            callbackScope: self,
            ids: Ext.encode(self.ownerModule.app.getDesktop().getLauncher('autorun'))
         });
      }

      function onCheckChange(node, checked){
         let self = this;
         if(node.leaf && node.id){
            if(checked){
               self.ownerModule.app.desktop.addAutoRun(node.id);
            }else{
               self.ownerModule.app.desktop.removeAutoRun(node.id);
            }
         }
      }
   }
});