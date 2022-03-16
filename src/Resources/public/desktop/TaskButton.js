/**
 * @class Ext.ux.TaskBar.TaskButton
 * @extends Ext.Button
 */
Ext.ux.TaskBar.TaskButton = function(win, el, config){
    this.win = win;
    Ext.ux.TaskBar.TaskButton.superclass.constructor.call(this, Ext.apply({
        clickEvent:'mousedown',
        handler : function(){
            if(win.minimized || win.hidden){
                win.show();
            }else if(win === win.manager.getActive()){
                win.minimize();
            }else{
                win.toFront();
            }
        },
        iconCls: win.iconCls,
        renderTo: el,
        text: Ext.util.Format.ellipsis(win.title, 12)
    }, config));
};

Ext.extend(Ext.ux.TaskBar.TaskButton, Ext.Button, {
    onRender : function(){
        Ext.ux.TaskBar.TaskButton.superclass.onRender.apply(this, arguments);
        let self = this;
        self.cmenu = new Ext.menu.Menu({
            items: [{
                text: 'Restore',
                handler: function(){
                    if(!self.win.isVisible()){
                        self.win.show();
                    }else{
                        self.win.restore();
                    }
                },
                scope: self
            },{
                text: 'Minimize',
                handler: self.win.minimize,
                scope: self.win
            },{
                text: 'Maximize',
                handler: self.win.maximize,
                scope: self.win
            }, '-', {
                text: 'Close',
                handler: self.closeWin.createDelegate(this, this.win, true),
                scope: self.win
            }]
        });

        this.cmenu.on('beforeshow', function(){
            let items = this.cmenu.items.items;
            let w = this.win;
            items[0].setDisabled(w.maximized !== true && w.hidden !== true);
            items[1].setDisabled(w.minimized === true);
            items[2].setDisabled(w.maximized === true || w.hidden === true);
        }, this);

        this.el.on('contextmenu', function(e){
            e.stopEvent();
            if(!this.cmenu.el){
                this.cmenu.render();
            }
            let xy = e.getXY();

            // taskbar at top?
            let cmenuHeight = this.cmenu.el.getHeight(false);
            if(xy[1] < cmenuHeight){
                xy[1] += this.el.getHeight();
            }else{
                xy[1] -= cmenuHeight;
            }

            this.cmenu.showAt(xy);
        }, this);
    },

    closeWin : function(cMenu, e, win){
        if(!win.isVisible()){
            win.show();
        }else{
            win.restore();
        }
        win.close();
    }
});