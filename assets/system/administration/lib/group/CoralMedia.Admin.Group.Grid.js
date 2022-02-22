Ext.ns('CoralMedia.Admin.Group');

CoralMedia.Admin.Group.Grid = Ext.extend(Hydra.grid.GridPanel, {
    id: 'coral-media-admin-groups',
    title: 'Groups',
    sm: new Ext.grid.RowSelectionModel({singleSelect:true}),

    initComponent: function()
    {
        let self = this;
        self.resource = '/api/security/groups';
        self.store = self.configureStore();
        self.tbar = self.configureToolBar();
        self.bbar = self.configureBottomBar();
        self.cm = new Ext.grid.ColumnModel({
            defaults: {
                width: 120,
                sortable: true
            },
            columns: [
                {header: 'Name', sortable: true, dataIndex: 'name', type: 'string'},
                {header: 'Description', sortable: true, dataIndex: 'description', type: 'string'}
            ]
        });

        CoralMedia.Admin.Group.Grid.superclass.initComponent.call(this);
    },

    configureStore: function() {
        let self = this;
        return self.store||(
            new Ext.data.JsonStore({
                restful: true,
                proxy: new Ext.data.HttpProxy({url:self.resource}),
                idProperty: 'id',
                totalProperty: 'hydra:totalItems',
                root: 'hydra:member',
                fields: ['name', 'description'],
                baseParams: {
                    page: 1
                },
                paramNames: {
                    page: 'page'
                }
            })
        );
    },

    configureBottomBar: function() {
        let self = this;
        return this.bbar||(
            new Hydra.PagingToolbar({
                pageSize: 15,
                store: self.store,
                displayInfo: true
            })
        );
    },

    setFormContainer: function (action, options) {
        let self = this;
        self.formContainer = new Ext.Window(Ext.apply({
            layout: 'fit',
            height: 220,
            width: 320,
            resizable: false,
            modal: true,
            title: action.charAt(0).toUpperCase() +
                action.slice(1) + ' Group',
            items:[
                new CoralMedia.Admin.Group.Form({
                    parentGrid: this,
                    action: action
                })
            ]
        }, options));
    }
});

