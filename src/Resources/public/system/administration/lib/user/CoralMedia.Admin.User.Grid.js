Ext.ns('CoralMedia.Admin.User');

CoralMedia.Admin.User.Grid = Ext.extend(Hydra.grid.GridPanel, {
    id: 'coral-media-admin-users',
    title: 'Users',
    sm: new Ext.grid.RowSelectionModel({singleSelect:true}),

    groupTooltipEditor: null,

    ownerModule: null,

    initComponent: function()
    {
        let self = this;
        self.resource = '/api/security/users';
        self.store = self.configureStore();
        self.tbar = self.configureToolBar().insertAt(4, ['-', {
            xtype: 'button',
            iconCls: 'user-group-properties-icon',
            handler: self.onEditGroupsClick,
            ref:'../editGroupsButton',
            itemId:'editGroupsButton',
            id:'coral-media-admin-user-groups',
            scope: this,
            disabled:true
        }]);
        self.bbar = self.configureBottomBar();

        self.cm = new Ext.grid.ColumnModel({
            defaults: {
                width: 120,
                sortable: true
            },
            columns: [
                {header: 'First Name', sortable: true, dataIndex: 'firstName', type: 'string'},
                {header: 'Last Name', sortable: true, dataIndex: 'lastName', type: 'string'},
                {header: 'Email', sortable: true, dataIndex: 'email', type: 'string'},
                {
                    header: 'Active', dataIndex: 'enabled',
                    xtype: 'actioncolumn',
                    width: 50,
                    items: [
                        {
                            icon: '/coralmediawebdesktop/desktop/resources/images/oxygen/16x16/task-delegate.png',
                            getClass: function(v, meta, rec) {  // Or return a class from a function
                                if (rec.get('enabled') == true) {
                                    return 'task-complete-icon';
                                } else {
                                    return 'task-reject-icon';
                                }
                            },
                            handler: function(grid, rowIndex, colIndex) {
                                let rec = grid.getStore().getAt(rowIndex);
                                console.info(grid);
                            }
                        }
                    ]
                }
            ]
        });

        CoralMedia.Admin.User.Grid.superclass.initComponent.call(this);

        self.groupTooltipEditor = new CoralMedia.Admin.User.TooltipEditor({
            grid:this,
            ownerModule:this.ownerModule,
            anchor:'bottom',
            target:'coral-media-admin-user-groups'
        });
    },

    onEditGroupsClick: function(button, event) {
        let record = this.getSelectionModel().getSelected();
        let self = this;
        if (!record || record.phantom === true) {
            return;
        }

        self.groupTooltipEditor.show(record, function (groupIds)
        {
            self.showMask('this.locale.messages.updating'  + '...');
            Ext.Ajax.request({
                callback:function (options, success, response)
                {
                    self.hideMask();
                    if (success)
                    {
                        let decoded = Ext.decode(response.responseText);
                        if (decoded.success === false)
                        {
                            Ext.MessageBox.alert(this.locale.messages.warning, this.locale.messages.error_ocurred_on_server);
                        }
                    }
                    else
                    {
                        Ext.MessageBox.alert(this.locale.messages.warning, this.locale.messages.error_lost_connection);
                    }
                }, params:{
                    iduser:record.data.iduser,
                    roles:Ext.encode(groupIds)
                },
                scope:this,
                url:'security/administration/users/update_roles'
            });
        }, this);
    },

    configureStore: function() {
        let self = this;
        return self.store||(
            new Ext.data.JsonStore({
                restful: true,
                proxy: new Ext.data.HttpProxy({
                    url:self.resource,
                    defaultHeaders: {'Content-Type': 'application/ld+json'}
                }),
                idProperty: 'id',
                totalProperty: 'hydra:totalItems',
                root: 'hydra:member',
                fields: ['firstName', 'lastName', 'email', 'enabled'],
                baseParams: {
                    page: 1
                },
                paramNames: {
                    page: 'page'
                }
            })
        );
    },

    setFormContainer: function (action, options) {
        let self = this;
        self.formContainer = new Ext.Window(Ext.apply({
            layout: 'fit',
            height: 320,
            width: 640,
            resizable: false,
            modal: true,
            title: action.charAt(0).toUpperCase() +
                action.slice(1) + ' User',
            items:[
                new CoralMedia.Admin.User.Form({
                    parentGrid: this,
                    action: action
                })
            ]
        }, options));
    },

    toggleButtons: function(status) {
        let self = this;
        if(status === true) {
            self.editGroupsButton.enable();
            self.deleteButton.enable();
            self.editButton.enable();
        }
        if(status === false) {
            self.deleteButton.disable();
            self.editButton.disable();
            self.editGroupsButton.disable();
        }
        CoralMedia.Admin.User.Grid.superclass.toggleButtons.call(this);
    }
});

