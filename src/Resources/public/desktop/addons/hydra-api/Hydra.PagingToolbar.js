Ext.ns('Hydra');
Hydra.PagingToolbar = Ext.extend(Ext.PagingToolbar, {

    tmpCursor: 0,

    onLoad : function(store, r, o){
        if(!this.rendered){
            this.dsLoaded = [store, r, o];
            return;
        }
        let p = this.getParams();
        this.cursor = (o.params && o.params[p.page]) ? this.tmpCursor : 0;
        let d = this.getPageData(), ap = d.activePage, ps = d.pages;

        this.afterTextItem.setText(String.format(this.afterPageText, d.pages));
        this.inputItem.setValue(ap);
        this.first.setDisabled(ap == 1);
        this.prev.setDisabled(ap == 1);
        this.next.setDisabled(ap == ps);
        this.last.setDisabled(ap == ps);
        this.refresh.enable();
        this.updateInfo();
        this.fireEvent('change', this, d);
    },

    doLoad : function(start){
        let o = {}, pn = this.getParams();
        this.tmpCursor = start;
        let page = Math.floor(start/this.pageSize);
        o[pn.page] = page+1;
        if(this.fireEvent('beforechange', this, o) !== false){
            this.store.load({params:o});
        }
    }
});
Ext.reg('hydra-paging', Hydra.PagingToolbar);