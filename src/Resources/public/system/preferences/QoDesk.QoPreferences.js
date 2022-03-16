/*
 * Coral Desktop 0.1
 * Copyright(c) Coral Media Solutions, LLC.
 * https://www.coralmediasolutions.com
 */

Ext.namespace("QoDesk", "Ext.plugin");

QoDesk.QoPreferences = Ext.extend(Ext.app.Module, {
    id: 'system-preferences',
    type: 'coralmediawebdesktop/system/preferences',
    cardHistory: ['pref-win-card-1'],

    requires: [
        'app/coralmediawebdesktop/system/preferences/lib/Appearance',
        'app/coralmediawebdesktop/system/preferences/lib/AutoRun',
        'app/coralmediawebdesktop/system/preferences/lib/Background',
        'app/coralmediawebdesktop/system/preferences/lib/CheckTree',
        'app/coralmediawebdesktop/system/preferences/lib/Grid',
        'app/coralmediawebdesktop/system/preferences/lib/Nav',
        'app/coralmediawebdesktop/system/preferences/lib/QuickStart',
        'app/coralmediawebdesktop/system/preferences/lib/Shortcuts'
    ],

    addons: [
        'hex-field',
        'color-picker',
        'explorer-view',
        'modal-notice'
    ],

    init: function () {
        this.locale = {
            "launcher": {
                "text": "Desktop Preferences"
                , "tooltip": "<b>Desktop Preferences</b><br />Allows you to modify your desktop"
            }
            , "button": {
                "back": {
                    "text": "Back"
                }
                , "backgroundColor": {
                    "text": "Background Color"
                }
                , "close": {
                    "text": "Close"
                }
                , "fontColor": {
                    "text": "Font Color"
                }

                , "next": {
                    "text": "Next"
                }
                , "save": {
                    "text": "Save"
                }
            }
            , "connection": {
                "lost": {
                    "msg": "Lost connection to server."
                    , "title": "Error"
                }
            }
            , "error": {
                "msg": "Errors encountered on the server."
                , "title": "Error"
            }
            , "data": {
                "nav": [
                    {
                        "cls": "icon-pref-shortcut"
                        , "id": "viewShortcuts"
                        , "text": "Shortcuts"
                        , "description": "Choose which applications appear in your shortcuts"
                    }
                    , {
                        "cls": "icon-pref-autorun"
                        , "id": "viewAutoRun"
                        , "text": "Auto Run"
                        , "description": "Choose which applications open automatically once logged in"
                    }
                    , {
                        "cls": "icon-pref-quickstart"
                        , "id": "viewQuickstart"
                        , "text": "Quick Start"
                        , "description": "Choose which applications appear in your Quick Start panel"
                    }
                    , {
                        "cls": "icon-pref-appearance"
                        , "id": "viewAppearance"
                        , "text": "Window Color and Appearance"
                        , "description": "Fine tune window color and style of your windows"
                    }
                    , {
                        "cls": "icon-pref-wallpaper"
                        , "id": "viewWallpapers"
                        , "text": "Desktop Background"
                        , "description": "Choose from available wallpapers or colors to decorate you desktop"
                    }
                ]
            }
            , "html": {
                "autorun": "Selected applications will load and run automatically when you sign in.  Don\"t forget to click the \"Save\" button.<br /><br /><b>Note:</b><br />The more applications selected, the longer startup will take."
                , "quickstart": "Selected applications will be available from the Quick Start panel.  Don\"t forget to click the \"Save\" button."
            }
            , "label": {
                "backgroundColor": "Choose a background color"
                , "fontColor": "Choose a font color"
                , "transparency": "Taskbar Opacity"
                , "wallpaperPosition": "How should the wallpaper be positioned?"
            }
            , "notification": {
                "saved": {
                    "msg": "Save complete."
                    , "title": "Finished"
                }
                , "saving": {
                    "msg": "Saving your data..."
                    , "title": "Please wait"
                }
            }
            , "title": {
                "appearance": "Window Color And Appearance"
                , "autorun": "Auto Run"
                , "background": "Desktop Background"
                , "quickstart": "Quick Start"
                , "shortcuts": "Shortcuts"
                , "window": "Desktop Preferences"
            }
        };
    },

    createWindow: function () {
        let d = this.app.getDesktop();
        this.win = d.getWindow(this.id);

        let h = parseInt(d.getWinHeight() * 0.9);
        let w = parseInt(d.getWinWidth() * 0.9);
        if (h > 500) {
            h = 480;
        }
        if (w > 580) {
            w = 580;
        }

        if (this.win) {
            this.win.setSize(w, h);
        } else {
            this.contentPanel = new Ext.Panel({
                activeItem: 0
                , border: false
                , items: [
                    new QoDesk.QoPreferences.Nav({
                        ownerModule: this
                        , id: 'pref-win-card-1'
                    })
                    , new QoDesk.QoPreferences.Shortcuts({
                        ownerModule: this
                        , id: 'pref-win-card-6'
                    })
                    , new QoDesk.QoPreferences.AutoRun({
                        ownerModule: this
                        , id: 'pref-win-card-5'
                    })
                    , new QoDesk.QoPreferences.QuickStart({
                        ownerModule: this
                        , id: 'pref-win-card-2'
                    })
                    , new QoDesk.QoPreferences.Appearance({
                        ownerModule: this
                        , id: 'pref-win-card-3'
                    })
                    , new QoDesk.QoPreferences.Background({
                        ownerModule: this
                        , id: 'pref-win-card-4'
                    })
                ]
                , layout: 'card'
                , tbar: [
                    {
                        disabled: true
                        , handler: this.navHandler.createDelegate(this, [-1])
                        , id: 'back'
                        , scope: this
                        , text: this.locale.button.back.text
                    }
                    , {
                        disabled: true
                        , handler: this.navHandler.createDelegate(this, [1])
                        , id: 'next'
                        , scope: this
                        , text: this.locale.button.next.text
                    }
                ]
            });

            this.win = d.createWindow({
                animCollapse: false,
                constrainHeader: true,
                maximizable: false,
                resizable: false,
                id: this.id
                , height: h
                , iconCls: 'qo-pref-icon'
                , items: this.contentPanel
                , layout: 'fit'
                , shim: false
                , taskbuttonTooltip: this.locale.launcher.tooltip
                , title: this.locale.title.window
                , width: w
            });

            this.layout = this.contentPanel.getLayout();
        }

        this.win.show();
    }

    , handleButtonState: function () {
        var cards = this.cardHistory;
        var activeId = this.layout.activeItem.id;
        var items = this.contentPanel.getTopToolbar().items;
        var back = items.get(0);
        var next = items.get(1);

        for (var i = 0, len = cards.length; i < len; i++) {
            if (cards[i] === activeId) {
                if (i <= 0) {
                    back.disable();
                    next.enable();
                } else if (i >= (len - 1)) {
                    back.enable();
                    next.disable();
                } else {
                    back.enable();
                    next.enable();
                }
                break;
            }
        }
    }

    , navHandler: function (index) {
        var cards = this.cardHistory;
        var activeId = this.layout.activeItem.id;
        var nextId;

        for (var i = 0, len = cards.length; i < len; i++) {
            if (cards[i] === activeId) {
                nextId = cards[i + index];
                break;
            }
        }

        this.layout.setActiveItem(nextId);
        this.handleButtonState();
    }

    , save: function (params) {
        let self = this;
        let desktop = self.app.getDesktop();
        let notifyWin = desktop.showNotification({
            html: self.locale.notification.saving.msg
            , title: self.locale.notification.saving.title
        });
        let callback = params.callback || null;
        let callbackScope = params.callbackScope || this;

        params.moduleId = this.id;

        Ext.Ajax.request({
            url: self.app.connection + '/preference/save'
            // Could also pass the module id and method in the querystring like this
            // instead of in the params config option.
            //
            // url: this.app.connection+'?modulId='+this.id+'&method=myMethod'
            , params: params
            , success: function (o) {
                if (o && o.responseText && Ext.decode(o.responseText).success) {
                    saveComplete(this.locale.notification.saved.title, this.locale.notification.saved.msg);
                } else {
                    saveComplete(this.locale.error.title, this.locale.error.msg);
                }
            }
            , failure: function () {
                saveComplete(this.locale.connection.lost.title, this.locale.connection.lost.msg);
            }
            , scope: this
        });

        function saveComplete(title, msg) {
            notifyWin.setIconClass('icon-done');
            notifyWin.setTitle(title);
            notifyWin.setMessage(msg);
            desktop.hideNotification(notifyWin);

            if (callback) {
                callback.call(callbackScope);
            }
        }
    }

    , viewCard: function (card) {
        this.layout.setActiveItem(card);
        var h = this.cardHistory;
        if (h.length > 1) {
            h.pop();
        }
        h.push(card);
        this.handleButtonState();
    }
});