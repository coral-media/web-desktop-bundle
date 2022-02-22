Ext.ns('CoralMedia.Admin.Group');

CoralMedia.Admin.Group.Form = Ext.extend(Hydra.form.FormPanel,{
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
        CoralMedia.Admin.Group.Form.superclass.initComponent.call(this);
        if (self.action === 'update') {
            self.jsonData  = self.parentGrid.getSelectionModel().getSelected().json;
            self.getForm().loadRecord(self.parentGrid.getSelectionModel().getSelected());
        }
    },

    configureFormFields: function () {
        let self = this;
        return self.items||([
            {
                xtype: 'textfield',
                fieldLabel: 'Name',
                name: 'name'
            },
            {
                xtype: 'textarea',
                fieldLabel: 'Description',
                name: 'description'
            }
        ])
    }
});