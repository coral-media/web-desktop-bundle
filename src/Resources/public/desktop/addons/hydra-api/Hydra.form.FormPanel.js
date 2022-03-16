Ext.ns('Hydra.form');

Hydra.form.FormPanel = Ext.extend(Ext.form.FormPanel, {

    configureDefaultButtons:function()
    {
        let self = this;
        return self.buttons||([
            {
                xtype:'button',
                scope:this,
                iconCls: 'document-save-icon',
                handler: self.onSaveClick,
                text: 'Save',
                ref: '../saveButton'

            },
            {
                xtype:'button',
                scope:this,
                iconCls: 'dialog-ok-apply-icon',
                handler: self.onApplyClick,
                text: 'Apply',
                ref: '../applyButton'
            },
            {
                xtype:'button',
                scope:this,
                iconCls: 'dialog-cancel-icon',
                handler: self.onCancelClick,
                text: 'Cancel',
                ref: '../cancelButton'
            }
        ]);
    },

    onSaveClick:function(button, event)
    {
        let self = this;
        self.getForm().doAction('jsonSubmit', {
            url: (self.action === 'update')?self.jsonData['@id']: self.parentGrid.resource,
            method: (self.action === 'update')?'PATCH':'POST',
            headers: {
                'Content-Type': (self.action === 'update')?'application/merge-patch+json':'application/ld+json;charset=utf-8'
            },
            clientValidation: true,
            success: function(form, action) {
                self.parentGrid.getStore().reload({
                    callback:function(records, options, success) {
                        self.parentGrid.getView().refresh(true);
                    },scope:this,
                });
                self.onCancelClick(button, event);
            },
            scope:this
        });
    },

    onApplyClick:function(button, event)
    {
        let self = this;
        self.getForm().doAction('jsonSubmit', {
            url: (self.action === 'update')?self.jsonData['@id']: self.parentGrid.resource,
            method: (self.action === 'update')?'PATCH':'POST',
            headers: {
                'Content-Type': (self.action === 'update')?'application/merge-patch+json':'application/ld+json;charset=utf-8'
            },
            clientValidation: true,
            success: function(form, action) {
                self.parentGrid.getStore().reload({
                    callback:function(records, options, success) {
                        self.parentGrid.getView().refresh(true);
                    },scope:this
                });
                if (self.action === 'create') {
                    form.reset();
                }
            },
            scope:this
        });
    },

    onCancelClick:function(button, event)
    {
        let self = this;
        self.ownerCt.hide();
        self.ownerCt.destroy();
    }
});