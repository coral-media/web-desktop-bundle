Ext.ns('Ext.ux');

Ext.ux.TooltipEditor = Ext.extend(Ext.ToolTip, {
    /**
     * @cfg {Ext.grid.GridPanel}
     */
    grid:null,
    /**
     * @cfg {String}
     */
    treeLoader: null,
    /**
     * Read only.  The record being edited.
     */
    record:null,

    initComponent:function ()
    {
        this.saveButton = new Ext.Button({
            handler:this.onSaveClick,
            scope:this,
            text: 'Save',
            iconCls:'document-save-icon'
        });

        this.tree = new Ext.tree.TreePanel({
            animate:false,
            autoScroll:true,
            buttons:[
                this.saveButton
            ],
            frame:true, height:250,
            iconCls:'document-edit-icon',
            lines:false,
            listeners:{
                'checkchange':{
                    fn:this.onTreeCheckChange,
                    scope:this
                },
                'expandnode':{
                    fn:this.onTreeNodeExpand,
                    scope:this
                }
            },
            loader:this.treeLoader,
            rootVisible:false,
            root:new Ext.tree.AsyncTreeNode({
                text:'Privilege',
                id: 'tooltip-tree-root-node'
            }),
            title:'Edit',
            width:250
        });

        Ext.apply(this, {
            autoHeight:true,
            autoHide:false,
            autoWidth:true,
            items:this.tree,
            layout:'fit'
        });

        Ext.ux.TooltipEditor.superclass.initComponent.call(this);
        // this.addClass('fluency-admin-tooltip-editor');
    },

    initEvents:function ()
    {
        Ext.ux.TooltipEditor.superclass.initEvents.call(this);
        this.grid.on('destroy', function ()
        {
            this.hide();
            this.destroy();
        }, this);
        this.grid.getSelectionModel().on('selectionchange', function ()
        {
            if (!this.hidden)
            {
                this.hide();
            }
        }, this, { buffer:150 });
    },

    /**
     * Override.
     * Shows this tooltip at the currently selected grid row XY position.
     *
     * @param {Ext.data.Record} record The record to edit.
     * @param {Function} cb
     * @param {Object} scope
     */
    show:function (record, cb, scope)
    {
        if (record)
        {
            this.record = record;

            if (cb)
            {
                this.callback = cb;
            }
            if (scope)
            {
                this.scope = scope;
            }

            this.saveButton.disable();
//            this.alignToTarget();
        }

        if(this.anchor){
            // pre-show it off screen so that the el will have dimensions
            // for positioning calcs when getting xy next
            this.showAt([-1000,-1000]);
            this.origConstrainPosition = this.constrainPosition;
            this.constrainPosition = false;
            this.anchor = this.origAnchor;
        }
        this.showAt(this.getTargetXY());

        if(this.anchor){
            this.anchorEl.show();
            this.syncAnchor();
            this.constrainPosition = this.origConstrainPosition;
        }else{
            this.anchorEl.hide();
        }

    },
    reloadTree:function ()
    {
        if (this.tree.root.isLoading())
        {
            Ext.Ajax.abort(this.tree.getLoader().transId);
            this.tree.root.loading = false;
        }
        this.tree.root.reload();
    },
    hide:function ()
    {
        this.record = null;
        if (this.body.isMasked())
        {
            this.body.unmask();
        }
        Ext.ux.TooltipEditor.superclass.hide.call(this);
    },

    onTreeCheckChange:function (node, checked)
    {
        // if parent node is unchecked, check it
        if (checked && node.parentNode)
        {
            var ui = node.parentNode.getUI();
            if (ui.isChecked() === false)
            {
                ui.toggleCheck(true);
            }
        }
        // if node is unchecked, uncheck its children
        else if (node.hasChildNodes())
        {
            node.eachChild(function (child)
            {
                var ui = child.getUI();
                if (ui.isChecked() === true)
                {
                    ui.toggleCheck(false);
                }
            }, this);
        }
        // something needs to be checked to save
        this.saveButton.setDisabled(!this.tree.getChecked().length > 0);
    },
    onTreeNodeExpand:function (node)
    {
//        if (node.id !== this.tree.root.id && node.hasChildNodes() && node.getUI().isChecked() === false)
//        {
//            node.eachChild(function (child)
//            {
//                var ui = child.getUI();
//                if (ui.isChecked() === true)
//                {
//                    ui.toggleCheck(false);
//                }
//            }, this);
//        }
    },

    /**
     * Override this function.
     */
    onSaveClick:function ()
    {
        this.hide();
    }
});