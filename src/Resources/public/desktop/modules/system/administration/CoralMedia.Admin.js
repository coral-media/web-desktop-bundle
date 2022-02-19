/*
 * Coral Desktop 0.1
 * Copyright(c) Coral Media Solutions, LLC.
 * https://www.coralmediasolutions.com
 */

CoralMedia.Admin = Ext.extend(Ext.app.Module, {
    id: 'system-administration',
    type: 'system/administration',
    requires: [
        'app/system/administration/lib/CoralMedia.Admin.Nav',
        'app/system/administration/lib/user/CoralMedia.Admin.User.TooltipEditor',
        'app/system/administration/lib/user/CoralMedia.Admin.User.Grid',
        'app/system/administration/lib/user/CoralMedia.Admin.User.Form',
        'app/system/administration/lib/group/CoralMedia.Admin.Group.Grid',
        'app/system/administration/lib/group/CoralMedia.Admin.Group.Form'
    ],
    addons: [
        'hydra-api',
        'superbox-select',
        'tooltip-editor',
        // 'xboolean-column'
    ],

    actions: null,
    defaults: { winHeight: 600, winWidth: 800 },
    tabPanel: null,
    win: null,

    createWindow : function(){
        let desktop = this.app.getDesktop();
        let self = this;
        self.win = desktop.getWindow(self.id);

        let h = parseInt(desktop.getWinHeight() * 0.9);
        let w = parseInt(desktop.getWinWidth() * 0.7);
        if(h > self.defaults.winHeight){ h = self.defaults.winHeight; }
        if(w > self.defaults.winWidth){ w = self.defaults.winWidth; }

        let winWidth = w;
        let winHeight = h;

        if(!self.win){
            self.tabPanel = new Ext.TabPanel({
                activeTab:0
                , border: false
                , items: new CoralMedia.Admin.Nav(this)
            });

            self.win = desktop.createWindow({
                animCollapse: false,
                cls: 'qo-win',
                constrainHeader: true,
                id: self.id,
                height: winHeight,
                iconCls: 'qo-admin-icon',
                items: [
                    self.tabPanel
                ],
                layout: 'fit',
                shim: false,
                taskbuttonTooltip: '<b>Control Center</b><br />Allows you to administer your desktop',
                title: 'Control Center',
                width: winWidth
            });
        }

        this.win.show();
    },

    openTab : function(tab){
        if(tab){
            this.tabPanel.add(tab);
        }
        this.tabPanel.setActiveTab(tab);
    },

    viewUsers : function(){
        let tab = this.tabPanel.getItem('coral-media-admin-users');
        if(!tab){
            tab = new CoralMedia.Admin.User.Grid({ ownerModule: this });
            this.openTab(tab);
        }else{
            this.tabPanel.setActiveTab(tab);
        }
    },

    viewGroups : function(){
        let tab = this.tabPanel.getItem('coral-media-admin-groups');
        if(!tab){
            tab = new CoralMedia.Admin.Group.Grid({ ownerModule: this });
            this.openTab(tab);
        }else{
            this.tabPanel.setActiveTab(tab);
        }
    },

    showMask : function(msg){
        this.win.body.mask(msg+'...', 'x-mask-loading');
    },

    hideMask : function(){
        this.win.body.unmask();
    }
});