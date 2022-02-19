/*
 * Coral Desktop 0.1
 * Copyright(c) Coral Media Solutions, LLC.
 * https://www.coralmediasolutions.com
 */

CoralMedia.Admin.Nav = function(ownerModule){
    this.ownerModule = ownerModule;

    let data = {
        items: [
            { cls: 'qo-admin-members-icon', id: 'viewUsers', label: 'Users' },
            { cls: 'qo-admin-groups-icon', id: 'viewGroups', label: 'Groups' },
            { cls: 'qo-admin-privileges-icon', id: 'viewPrivileges', label: 'Privileges' }
            //, { cls: 'qo-admin-signups-icon', id: 'viewSignups', label: 'Signups' }
        ]
    };

    let dataView = new Ext.DataView({
        itemSelector: 'div.thumb-wrap',
        listeners: {
            'click': {
                fn: function(dataView, index, node){
                    let self = this;
                    let r = dataView.getRecord(node);
                    if(r && r.id){
                        let action = r.id;
                        self.ownerModule[action]();
                    }
                }
                , scope: this
            }
        }
        , overClass: 'x-view-over'
        , singleSelect: true
        , store: new Ext.data.JsonStore({
            data: data
            , fields: [ 'cls', 'id', 'label' ]
            , idProperty: 'id'
            , root: 'items'
        })
        , tpl: new Ext.XTemplate(
            '<tpl for=".">'
            , '<div class="thumb-wrap" id="{id}">'
            , '<div class="thumb {cls}"></div>'
            , '<span>{label}</span>'
            , '</div>'
            , '</tpl>'
            , '<div class="x-clear"></div>'
            //, { disableFormats: true }
        )
    });

    CoralMedia.Admin.Nav.superclass.constructor.call(this, {
        autoScroll: true
        , cls: 'qo-admin-nav'
        , items: dataView
        , title: 'Home'
    });
};

Ext.extend(CoralMedia.Admin.Nav, Ext.Panel);