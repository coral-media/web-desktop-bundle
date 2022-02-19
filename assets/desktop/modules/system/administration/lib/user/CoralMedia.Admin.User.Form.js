Ext.ns('CoralMedia.Admin.User');

CoralMedia.Admin.User.Form = Ext.extend(Hydra.form.FormPanel,{
    defaults:{
        anchor: '-20',
        msgTarget: 'side',
        xtype: 'textfield',
        allowBlank: false
    },

    padding: '10',
    action: null,
    /**
     * @var Ext.grid.GridPanel
     */
    parentGrid: null,
    jsonData: null,

    initComponent:function ()
    {
        let self = this;
        self.buttons = this.configureDefaultButtons();
        self.items = this.configureFormFields();
        CoralMedia.Admin.User.Form.superclass.initComponent.call(this);
        if (self.action === 'update') {
            self.jsonData  = self.parentGrid.getSelectionModel().getSelected().json;
            self.getForm().loadRecord(self.parentGrid.getSelectionModel().getSelected());
        }
        self.getForm().on('beforeaction', function (form, action) {
            if(action.type === 'jsonSubmit' && !Ext.isArray(form.getValues().roles)) {
                let params = form.getValues();
                action.overwriteParams = {roles: [params.roles]};
            }
        }, this)
    },

    configureFormFields: function () {
        let self = this;
        return self.items||([
            {
                xtype: 'hidden',
                name: 'enabled',
                value: true
            },
            {
                xtype: 'textfield',
                fieldLabel: 'First Name',
                name: 'firstName'
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Last Name',
                name: 'lastName'
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Email',
                name: 'email',
                vtype: 'email'
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Password',
                name: 'password',
                inputType: 'password'
            },
            new Ext.ux.form.SuperBoxSelect({
                fieldLabel: 'System Roles',
                emptyText: 'Select...',
                resizable: false,
                id: 'user-superbox-roles',
                name: 'roles',
                store: new Ext.data.ArrayStore({
                    fields: ['value', 'label'],
                    data: [
                        ['ROLE_USER', 'ROLE_USER'],
                        ['ROLE_API', 'ROLE_API'],
                        ['ROLE_ADMIN', 'ROLE_ADMIN'],
                        ['ROLE_SUPER_ADMIN', 'ROLE_SUPER_ADMIN']
                    ],
                    autoLoad: true
                }),
                mode: 'local',
                autoCreate: true,
                displayField: 'label',
                valueField: 'value',
                forceSelection : true,
                listeners: {
                    'afterrender': function (superbox) {
                        if (this.action === 'update')
                            superbox.setValue(this.jsonData.roles)
                    },
                    scope: this
                }
            })
        ])
    }
});