Ext.ns('Ext.ux.Grid');

Ext.ux.Grid.XBooleanColumn = Ext.extend(Ext.grid.ActionColumn, {
    constructor: function(cfg) {
        var me = this;
        cfg.items = [{
            icon: '/bundles/fluencycommondesktop/icons/resources/images/oxygen/24x24/user-online.png',
            handler: function(grid, rowIndex, colIndex, item) {
                grid.toggleActiveRecord(grid.getStore().getAt(rowIndex));
            }
        }
        ];
        cfg.renderer=function (value, metaData){
            if (value == true)
                metaData.attr = 'style="opacity: 1;"';
            else
                metaData.attr = 'style="opacity: 0.2;"';
            return '';
        };
        Ext.ux.Grid.XBooleanColumn.superclass.constructor.call(me, cfg);
    }
});

Ext.apply(Ext.grid.Column.types, {xbooleancolumn: Ext.ux.Grid.XBooleanColumn});