/*
 * Coral Desktop 0.1
 * Copyright(c) Coral Media Solutions, LLC.
 * https://www.coralmediasolutions.com
 */

QoDesk.QoPreferences.Grid = Ext.extend(Ext.grid.GridPanel, {
    mode: null // wallpapers or themes
    , ownerModule: null

    , constructor: function (config) {
        // constructor pre-processing
        config = config || {};

        this.ownerModule = config.ownerModule;
        this.mode = config.mode;

        let reader = new Ext.data.JsonReader({
            fields: ['id', 'name', 'thumbnail', 'file']
            , id: 'id'
            , root: this.mode //'wallpapers'
        });

        let largeIcons = new Ext.Template(
            '<div class="x-grid3-row ux-explorerview-item ux-explorerview-large-item" unselectable="on">' +
            '<table class="ux-explorerview-icon" cellpadding="0" cellspacing="0">' +
            '<tr><td align="center"><img src="{thumbnail}"></td></tr></table>' +
            '<div class="ux-explorerview-text"><div class="x-grid3-cell x-grid3-td-name" unselectable="on">{name}</div></div></div>'
        );

        // this config
        Ext.applyIf(config, {
            columns: [{header: 'Name', sortable: true, dataIndex: 'name'}]
            , enableDragDrop: false
            , hideHeaders: true
            , sm: new Ext.grid.RowSelectionModel({
                listeners: {
                    'rowselect': {fn: this.onRowSelect, scope: this}
                }
                , singleSelect: true
            })
            , store: new Ext.data.Store({
                listeners: {
                    'load': {fn: this.selectRecord, scope: this}
                }
                , reader: reader
                , sortInfo: {field: 'name', direction: 'ASC'}
                , url: config.ownerModule.app.connection +
                    (this.mode === 'themes' ? '/themes' : '/wallpapers')

            })
            , view: new Ext.ux.grid.ExplorerView({
                //, view: new Ext.ux.grid.GroupingExplorerView({
                rowTemplate: largeIcons
                , forceFit: true
                //, groupTextTpl: '{text} ({[values.rs.length]})'
                //, showGroupName: false
            })
        });

        QoDesk.QoPreferences.Grid.superclass.constructor.apply(this, [config]);
        // constructor post-processing

        this.desktop = this.ownerModule.app.getDesktop();
    }

    // added methods

    , onRowSelect: function (sm, index, record) {
        let r = record;
        let d = r.data;
        let id;
        let desktop = this.ownerModule.app.getDesktop();

        if (this.mode === 'themes') {
            id = desktop.getAppearance().theme.id;
        } else {
            id = desktop.getBackground().wallpaper.id;
        }

        if (parseInt(id) !== parseInt(r.id)) {
            if (r && r.id && d.name) {
                config = {
                    id: r.id
                    , name: d.name
                    , file: d.file
                };

                if (this.mode === 'themes') {
                    this.desktop.setTheme(config);
                } else {
                    this.desktop.setWallpaper(config);
                }
            }
        }
    }

    , selectRecord: function () {
        let id;
        let desktop = this.ownerModule.app.getDesktop();

        if (this.mode === 'themes') {
            id = desktop.getAppearance().theme.id;
        } else {
            id = desktop.getBackground().wallpaper.id;
        }

        this.selModel.selectRecords([this.store.getById(id)]);
    }
});