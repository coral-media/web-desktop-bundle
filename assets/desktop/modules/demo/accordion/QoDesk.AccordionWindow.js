QoDesk.AccordionWindow = Ext.extend(Ext.app.Module, {
    id: 'demo-accordion',
    type: 'demo/accordion',

    /**
     * Initialize this module.
     * This function is called at startup (page load/refresh).
     */
    init: function () {
        this.locale = {
            "launcher": {
                "text": "Accordion Window"
                , "tooltip": "<b>Accordion Window</b><br />A window with an accordion layout"
            }
            , "button": {
                "add": {
                    "tooltip": "Add a new user"
                }
                , "connect": {
                    "tooltip": "<b>Rich Tooltips</b><br />Let your users know what they can do!"
                }
                , "remove": {
                    "tooltip": "Remove the selected user"
                }
            }
            , "html": {
                "moreStuff": "<p>Something useful would be in here.</p>"
                , "myStuff": "<p>Something useful would be in here.</p>"
                , "settings": "<p>Something useful would be in here.</p>"
            }
            , "notification": {
                "loading": {
                    "msg": "Loading..."
                }
            }
            , "title": {
                "moreStuff": "Even More Stuff"
                , "myStuff": "My Stuff"
                , "onlineUsers": "Online Users"
                , "settings": "Settings"
                , "window": "Accordion Window"
            }
        }
    },

    /**
     * Create this modules window here.
     */
    createWindow: function () {
        let desktop = this.app.getDesktop();
        let win = desktop.getWindow('acc-win');
        let locale = this.locale;

        if (!win) {
            win = desktop.createWindow({
                id: 'acc-win',
                title: this.locale.title.window,
                width: 250,
                height: 400,
                iconCls: 'acc-icon',
                shim: false,
                animCollapse: false,
                constrainHeader: true,
                maximizable: false,
                taskbuttonTooltip: this.locale.launcher.tooltip,

                tbar: [{
                    tooltip: this.locale.button.connect.tooltip,
                    iconCls: 'demo-acc-connect'
                }, '-', {
                    tooltip: this.locale.button.add.tooltip,
                    iconCls: 'demo-acc-user-add'
                }, ' ', {
                    tooltip: this.locale.button.remove.tooltip,
                    iconCls: 'demo-acc-user-delete'
                }],

                layout: 'accordion',
                layoutConfig: {
                    animate: false
                },

                items: [
                    new Ext.tree.TreePanel({
                        border: false,
                        id: 'im-tree',
                        title: this.locale.title.onlineUsers,
                        loader: new Ext.tree.TreeLoader(),
                        rootVisible: false,
                        lines: false,
                        autoScroll: true,
                        useArrows: true,
                        tools: [{
                            id: 'refresh',
                            on: {
                                click: function () {
                                    const tree = Ext.getCmp('im-tree');
                                    tree.body.mask(locale.notification.loading.msg, 'x-mask-loading');
                                    tree.root.reload();
                                    tree.root.collapse(true, false);
                                    setTimeout(function () { // mimic a server call
                                        tree.body.unmask();
                                        tree.root.expand(true, true);
                                    }, 1000);
                                }
                            }
                        }],
                        root: new Ext.tree.AsyncTreeNode({
                            text: 'Hidden Root',
                            children: [{
                                text: 'Friends',
                                expanded: true,
                                children: [{
                                    text: 'Jack',
                                    iconCls: 'user',
                                    leaf: true
                                }, {
                                    text: 'Brian',
                                    iconCls: 'user',
                                    leaf: true
                                }, {
                                    text: 'Jon',
                                    iconCls: 'user',
                                    leaf: true
                                }]
                            }, {
                                text: 'Family',
                                expanded: true,
                                children: [{
                                    text: 'Kelly',
                                    iconCls: 'user-girl',
                                    leaf: true
                                }, {
                                    text: 'Sara',
                                    iconCls: 'user-girl',
                                    leaf: true
                                }, {
                                    text: 'Zack',
                                    iconCls: 'user-kid',
                                    leaf: true
                                }, {
                                    text: 'John',
                                    iconCls: 'user-kid',
                                    leaf: true
                                }]
                            }]
                        })
                    }), {
                        border: false,
                        title: this.locale.title.settings,
                        html: this.locale.html.settings,
                        autoScroll: true
                    }, {
                        border: false,
                        title: this.locale.title.moreStuff,
                        html: this.locale.html.moreStuff
                    }, {
                        border: false,
                        title: this.locale.title.myStuff,
                        html: this.locale.html.myStuff
                    }
                ]
            });
        }
        win.show();
    }
});