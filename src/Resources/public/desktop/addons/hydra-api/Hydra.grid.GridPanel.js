Ext.ns('Hydra.grid');
Hydra.grid.GridPanel = Ext.extend(Ext.grid.GridPanel, {
    stripeRows: true,
    viewConfig: {
        forceFit: true
    },
    loadMask: true,
    resource: '/',

    formContainer: null,

    initComponent: function()
    {
        let self = this;

        Hydra.grid.GridPanel.superclass.initComponent.call(this);

        self.getSelectionModel().on('rowselect', self.onRowSelect, this);
        self.getSelectionModel().on('rowdeselect', self.onRowDeSelect, this);

        self.getStore().load();
    },

    configureStore: function() {
    },

    configureToolBar: function() {
        let self = this;
        return self.tbar||([
            {
                xtype: 'button',
                iconCls: 'list-add-icon',
                handler: self.onAddClick,
                ref:'../addButton',
                itemId:'addButton',
                scope: this
            },
            {
                xtype: 'button',
                iconCls: 'document-edit-icon',
                handler: self.onEditClick,
                ref:'../editButton',
                itemId:'editButton',
                scope: this,
                disabled:true
            },'-',
            {
                xtype: 'button',
                iconCls: 'edit-delete-icon',
                handler: self.onDeleteClick,
                ref:'../deleteButton',
                itemId:'deleteButton',
                scope: this,
                disabled: true
            },'->',
            {
                xtype: 'button',
                iconCls: 'document-export-icon',
                handler: Ext.emptyFn,
                ref:'../exportButton',
                itemId:'exportButton',
                scope: this
            }
        ]);
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

    showMask: function (msg)
    {
        this.body.mask(msg, 'x-mask-loading');
    },

    hideMask: function ()
    {
        this.body.unmask();
    },

    toggleButtons: function(status)
    {
        let self = this;
        if(status === true) {
            self.deleteButton.enable();
            self.editButton.enable();
        }
        if(status === false) {
            self.deleteButton.disable();
            self.editButton.disable();
        }
    },

    onRowSelect:function(sm, rowIndex, record){
        this.toggleButtons(true);
    },

    onRowDeSelect:function(sm, rowIndex, record){
        this.toggleButtons(false);
    },

    setFormContainer: function(action, options) {
        return Ext.emptyFn;
    },

    onAddClick:function(button, event)
    {
        this.setFormContainer('create', {iconCls:button.iconCls});
        this.formContainer.show();
    },

    onEditClick:function(button, event)
    {
        this.setFormContainer('update', {iconCls:button.iconCls});
        this.formContainer.show();
    },

    onDeleteClick:function (button, event)
    {
        let self = this;
        let resource = self.getSelectionModel().getSelected().json['@id'];

        Ext.MessageBox.confirm('Are you sure? Please confirm',
            'Are you sure you want to delete selected record?', function (btn) {
                if (btn === "yes")
                {
                    this.showMask('Deleting' + '...');

                    Ext.Ajax.request({
                        callback:function (options, success, response)
                        {
                            this.hideMask();
                            if (response.status === 204) {
                                self.getSelectionModel().clearSelections();
                                self.getStore().load();
                            } else {
                                Ext.MessageBox.alert(
                                    'Error', response.statusMessage
                                );
                            }
                        },
                        method: 'DELETE',
                        scope:this,
                        url: resource
                    });
                }
            }, this);
    },

    onExportClick:function (button, event) {
    }
});