/**
 * Coral Desktop 0.1
 * Copyright(c) Coral Media Solutions, LLC.
 * https://www.coralmediasolutions.com
 */

QoDesk.QoPreferences.Background = Ext.extend(Ext.Panel, {
    constructor: function (config) {
        // constructor pre-processing
        config = config || {};

        this.ownerModule = config.ownerModule;

        let desktop = this.ownerModule.app.getDesktop();

        this.grid = new QoDesk.QoPreferences.Grid({
            border: true
            , cls: 'pref-card-subpanel pref-wallpaper-groups'
            , margins: '0 5 0 5'
            , mode: 'wallpapers'
            , ownerModule: this.ownerModule
            , region: 'center'
        });

        let wpp = this.ownerModule.app.getDesktop().getBackground().wallpaperPosition;
        let tileRadio = createRadio('tile', wpp === 'tile', 90, 40);
        let centerRadio = createRadio('center', wpp === 'center', 200, 40);
        let stretchRadio = createRadio('stretch', wpp === 'stretch', 310, 40);

        let position = new Ext.FormPanel({
            border: false
            , height: 100
            , items: [
                {x: 15, y: 15, xtype: 'label', text: this.ownerModule.locale.label.wallpaperPosition},
                {
                    border: false
                    ,
                    items: {
                        border: false,
                        html: '<img class="pref-bg-pos-tile" src="' + Ext.BLANK_IMAGE_URL +
                            '" width="64" height="44" border="0" alt="" />'
                    }
                    ,
                    x: 15
                    ,
                    y: 40
                },
                tileRadio,
                {
                    border: false
                    ,
                    items: {
                        border: false,
                        html: '<img class="pref-bg-pos-center" src="' +
                            Ext.BLANK_IMAGE_URL + '" width="64" height="44" border="0" alt="" />'
                    }
                    ,
                    x: 125
                    ,
                    y: 40
                },
                centerRadio,
                {
                    border: false
                    ,
                    items: {
                        border: false,
                        html: '<img class="pref-bg-pos-stretch" src="' +
                            Ext.BLANK_IMAGE_URL + '" width="64" height="44" border="0" alt="" />'
                    }
                    ,
                    x: 235
                    ,
                    y: 40
                },
                stretchRadio,
                {x: 362, y: 15, xtype: 'label', text: this.ownerModule.locale.label.backgroundColor}
                , {
                    border: false
                    , items: new Ext.Button({
                        iconCls: 'pref-bg-color-icon'
                        , handler: onChangeBgColor
                        , scope: this
                        //, text: this.ownerModule.locale.button.backgroundColor.text
                    })
                    , x: 363
                    , y: 40
                }
            ]
            , layout: 'absolute'
            , region: 'south'
            , split: false
        });

        // this config
        Ext.applyIf(config, {
            border: false
            , buttons: [
                {
                    // disabled: this.ownerModule.app.isAllowedTo('saveBackground', this.ownerModule.id) ? false : true
                    handler: onSave,
                    scope: this,
                    text: this.ownerModule.locale.button.save.text
                },
                {
                    handler: onClose
                    , scope: this
                    , text: this.ownerModule.locale.button.close.text
                }
            ]
            , cls: 'pref-card'
            , items: [
                this.grid
                , position
            ]
            , layout: 'border'
            , title: this.ownerModule.locale.title.background
        });

        QoDesk.QoPreferences.Background.superclass.constructor.apply(this, [config]);

        // constructor post-processing

        function createRadio(value, checked, x, y) {
            if (value) {
                let radio = new Ext.form.Radio({
                    name: 'position'
                    , inputValue: value
                    , checked: checked
                    , x: x
                    , y: y
                });
                radio.on('check', togglePosition, radio);
                return radio;
            }
            return null;
        }

        function onChangeBgColor() {
            let hex = this.ownerModule.app.getDesktop().getBackground().backgroundcolor;
            let dialog = new Ext.ux.ColorDialog({
                closeAction: 'close'
                , iconCls: 'pref-bg-color-icon'
                , listeners: {
                    'cancel': {fn: onColorCancel.createDelegate(this, [hex]), scope: this},
                    'select': {fn: onColorSelect, scope: this, buffer: 350},
                    'update': {fn: onColorSelect, scope: this, buffer: 350}
                }
                , manager: this.ownerModule.app.getDesktop().getManager()
                , resizable: false
                , title: 'Pick A Background Color'
                , modal: true
                , plugins: new Ext.plugin.ModalNotice()
            });
            dialog.show(hex);
        }

        function onColorSelect(p, hex) {
            desktop.setBackgroundColor(hex);
        }

        function onColorCancel(hex) {
            desktop.setBackgroundColor(hex);
        }

        function onClose() {
            this.ownerModule.win.close();
        }

        function onSave() {
            let background = this.ownerModule.app.getDesktop().getBackground();
            let data = {
                backgroundColor: background.backgroundcolor
                , wallpaperId: background.wallpaper.id
                , wallpaperPosition: background.wallpaperPosition
            };

            this.buttons[0].disable();
            this.ownerModule.save({
                method: 'saveBackground'
                , callback: function () {
                    this.buttons[0].enable();
                }
                , callbackScope: this
                , data: Ext.encode(data)
            });
        }

        function togglePosition(field, checked) {
            if (checked === true) {
                desktop.setWallpaperPosition(field.inputValue);
            }
        }
    }

    // overrides

    , afterRender: function () {
        QoDesk.QoPreferences.Background.superclass.afterRender.call(this);

        this.on('show', this.loadGrid, this, {single: true});
    }

    // added methods

    , loadGrid: function () {
        this.grid.store.load();
    }
});