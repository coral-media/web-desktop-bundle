/**
 * Coral Desktop 0.1
 * Copyright(c) Coral Media Solutions, LLC.
 * https://www.coralmediasolutions.com
 *
 * NOTE:
 * This code is based on code from the original Ext JS desktop demo and qWikiOffice 1.0
 * I have made many modifications/additions.
 *
 * Ext JS - JavaScript Library
 * Copyright (c) 2006-2011, Sencha Inc.
 * All rights reserved.
 * licensing@sencha.com
 *
 * http://www.sencha.com/license
 *
 */

Ext.app.App = function (config) {
    Ext.apply(this, config);

    this.addEvents({
        'ready': true,
        'beforeunload': true,
        'moduleactioncomplete': true
    });

    Ext.onReady(this.initApp, this);
};

Ext.extend(Ext.app.App, Ext.util.Observable, {
    /**
     * @cfg {Object} A config object to be applied to Ext.Desktop.
     */
    desktopConfig: null,
    /**
     * @cfg {Object} The member info.
     * Example: { group: 'demo', name: 'Todd Murdock' }
     */
    memberInfo: null,
    /**
     * @cfg {Array} An array of the module definitions.
     * The definitions are used until the module is loaded on demand.
     * * Example:
     * [
     *    {
     *       "id": "demo-accordion",
     *       "type": "demo/accordion",
     *       "className": "QoDesk.AccordionWindow",
     *       "launcher": {
     *          "iconCls":"acc-icon",
     *          "shortcutIconCls":"demo-acc-shortcut",
     *          "text":"Accordion Window",
     *          "tooltip":"A window with an accordion layout"
     *       },
     *       "launcherPaths": {
     *          "StartMenu": "/"
     *       }
     *    },
     *       ...
     */
    modules: null,
    /**
     * @cfg {Object/Array}
     */
    plugins: null,
    /**
     * @cfg {Object} The members privileges.
     * * Example:
     * {
     *    "qo-preferences": { "viewThemes": 1, "viewWallpapers": 1 },
     *    "demo-layout":1,
     *    "demo-grid":1,
     *    "demo-bogus":1,
     *    "demo-tabs":1,
     *    "demo-accordion":1
     * }
     */
    privileges: null,
    /**
     * Read-only. This app's ready state
     * @type boolean
     */
    isReady: false,
    /**
     * Read-only. The url of this app's server connection
     *
     * Allows a module to connect to its server script without knowing the path.
     * Example ajax call:
     *
     * Ext.Ajax.request({
     *    url: this.app.connection,
     *    // Could also pass the module id in the querystring like this.
     *    // url: this.app.connection+'?id='+this.id,
     *    params: {
     *	      id: this.id
     *	      ...
     *	   },
     *	   success: function(){
     *	      ...
     *	   },
     *	   failure: function(){
     *       ...
     *    },
     *	   scope: this
     *	});
     */
    connection: '/desktop',
    /**
     * Read-only. The queue of requests to run once a module is loaded
     */
    requestQueue: [],

    apiToken: null,

    init: Ext.emptyFn,

    initApp: function () {
        this.init();
        this.preventBackspace();

        // the user interface
        this.desktop = new Ext.Desktop(Ext.applyIf({
            app: this
        }, this.desktopConfig));

        // init plugins
        if (this.plugins) {
            if (Ext.isArray(this.plugins)) {
                for (var i = 0, len = this.plugins.length; i < len; i++) {
                    this.plugins[i] = this.initPlugin(this.plugins[i]);
                }
            } else {
                this.plugins = this.initPlugin(this.plugins);
            }
        }

        Ext.EventManager.on(window, 'beforeunload', this.onBeforeUnload, this);
        this.fireEvent('ready', this);
        this.isReady = true;
    },

    initPlugin: function (p) {
        if (p.ptype && !Ext.isFunction(p.init)) {
            p = Ext.ComponentMgr.createPlugin(p);
        } else if (Ext.isString(p)) {
            p = Ext.ComponentMgr.createPlugin({
                ptype: p
            });
        }
        p.init(this);
        return p;
    },

    /**
     * @param {string} v The id or moduleType you want returned
     * @param {Function} cb The Function to call when the module is ready/loaded
     * @param {object} scope The scope in which to execute the function
     */
    requestModule: function (v, cb, scope) {
        let m = this.getModule(v);
        if (m) {
            if (m.loaded === true) {
                cb.call(scope, m);
            } else {
                if (cb && scope) {
                    this.requestQueue.push({id: m.id, callback: cb, scope: scope});
                    this.loadModule(m);
                }
            }
        }
    },

    /**
     * @param {Ext.app.Module} m The module
     */
    loadModule: function (m) {

        if (m.isLoading) {
            return false;
        }

        let self = this;
        let id = m.id;
        let moduleName = m.launcher.text;
        let notifyWin = this.desktop.showNotification({
            html: 'Loading ' + moduleName + '...'
            , title: 'Please wait'
        });

        m.isLoading = true;

        requirejs(['app/' + m.type + '/' + m.className], function () {
            if (m.hasResources === true) {
                let cssFile = requirejs.toUrl('app/') + m.type + '/resources/styles.css';
                Ext.util.CSS.swapStyleSheet('css-' + m.id, cssFile);
                Ext.util.CSS.refreshCache();
            }
            require(['domReady!'], function (doc) {
                notifyWin.setIconClass('icon-done');
                notifyWin.setTitle('Finished');
                notifyWin.setMessage(moduleName + ' loaded.');
                self.desktop.hideNotification(notifyWin, 3000);
                notifyWin = null;
                self.loadModuleComplete(true, id);
            });
        });
        return true;
    },

    loadAddonsForModule: function (module) {
        Ext.each(module.addons, function (item, index) {
            requirejs(Ext.app.Addons[item].files, function () {
                if (Ext.app.Addons[item].hasResources === true) {
                    let cssFile = requirejs.toUrl('addons/') + item + '/resources/styles.css';
                    Ext.util.CSS.swapStyleSheet('css-' + item, cssFile);
                    Ext.util.CSS.refreshCache();
                }
                require(['domReady!'], function (doc) {
                    return true;
                });
            });
        });
    },

    /**
     * @param {boolean} success
     * @param {string} id
     *
     * Will be called when a module is loaded.
     * If a request for this module is waiting in the
     * queue, it as executed and removed from the queue.
     */
    loadModuleComplete: function (success, id) {
        let self = this;
        if (success === true && id) {
            let m = this.instantiateModule(id);
            if (m) {
                if (m.addons !== null) {
                    self.loadAddonsForModule(m);
                }
                requirejs(m.requires, function () {
                    require(['domReady!'], function (doc) {
                        m.isLoading = false;
                        m.loaded = true;
                        m.init();
                        m.on('actioncomplete', this.onModuleActionComplete, this);
                        let q = self.requestQueue;
                        let nq = [];
                        let found = false;

                        for (let i = 0, len = q.length; i < len; i++) {
                            if (found === false && q[i].id === id) {
                                found = q[i];
                            } else {
                                nq.push(q[i]);
                            }
                        }

                        self.requestQueue = nq;

                        if (found) {
                            found.callback.call(found.scope, m);
                        }
                    });
                });
            }
        }
    },

    /**
     * Private
     * @param {string} id
     */
    instantiateModule: function (id) {
        let p = this.getModule(id); // get the placeholder

        if (p && p.loaded === false) {
            if (eval('typeof ' + p.className) === 'function') {
                let m = eval('new ' + p.className + '()');
                m.app = this;

                let ms = this.modules;
                for (let i = 0, len = ms.length; i < len; i++) { // replace the placeholder with the module
                    if (ms[i].id === m.id) {
                        Ext.apply(m, ms[i]); // transfer launcher properties
                        ms[i] = m;
                    }
                }

                return m;
            }
        }
        return null;
    },

    /**
     * @param {string} v The id or moduleType you want returned
     */
    getModule: function (v) {
        let ms = this.modules;

        for (let i = 0, len = ms.length; i < len; i++) {
            if (ms[i].id === v || ms[i].moduleType === v) {
                return ms[i];
            }
        }

        return null;
    },

    /**
     * @param {Ext.app.Module} m The module to register
     */
    registerModule: function (m) {
        if (!m) {
            return false;
        }
        this.modules.push(m);
        m.launcher.handler = this.desktop.launchWindow.createDelegate(this.desktop, [m.id]);
        m.app = this;
        return true;
    },

    /**
     * @param {string} id or moduleType
     * @param {array} requests An array of request objects
     *
     * Example:
     * this.app.makeRequest('module-id', {
     *    requests: [
     *       {
     *          method: 'createWindow',
     *          params: '',
     *          callback: this.myCallbackFunction,
     *          scope: this
     *       },
     *       { ... }
     *    ]
     * });
     */
    makeRequest: function (id, requests) {
        if (id !== '' && requests) {
            var m = this.requestModule(id, function (m) {
                if (m) {
                    m.handleRequest(requests);
                }
            }, this);
        }
    },

    /**
     * @param {string} method The module method
     * @param {string} id The module id property
     */
    isAllowedTo: function (method, id) {
        if (method !== '' && id != '') {
            var p = this.privileges;
            if (p[id] && Ext.isArray(p[id]) && p[id].indexOf(method) !== -1) {
                return true;
            }
        }
        return false;
    },

    getDesktop: function () {
        return this.desktop;
    },

    /**
     * @param {Function} fn The function to call after the app is ready
     * @param {object} scope The scope in which to execute the function
     */
    onReady: function (fn, scope) {
        if (!this.isReady) {
            this.on('ready', fn, scope);
        } else {
            fn.call(scope, this);
        }
    },

    onBeforeUnload: function (e) {
        if (this.fireEvent('beforeunload', this) === false) {
            e.stopEvent();
        }
    },

    /**
     * Prevent the backspace (history -1) shortcut
     */
    preventBackspace: function () {
        var map = new Ext.KeyMap(document, [{
            key: Ext.EventObject.BACKSPACE,
            stopEvent: false,
            fn: function (key, e) {
                var t = e.target.tagName;
                if (t != "INPUT" && t != "TEXTAREA") {
                    e.stopEvent();
                }
            }
        }]);
    },

    /**
     * @param {Ext.app.Module} module
     * @param {object} data
     * @param {object} options
     *
     * It may be benificial for a system module to register all (or some) module
     * activity in the database.
     *
     * Example usage:
     *
     * this.app.on('moduleactioncomplete', this.onModuleActionComplete, this);
     *
     * onModuleActionComplete : function(app, module, params, options){
     *    	if(module && params){
     *
     *    		if(typeof options === 'object'){
     *    			var keepExisting = options.keepExisting || false;
     *    		}
     *
     *    		Ext.Ajax.request({
     *				url: this.app.connection
     *				, params: {
     *					action: 'registerModuleAction'
     *					, id: this.id
     *					, actionModuleId: module.id
     *					, actionData: typeof params.data == 'object' ? Ext.encode(params.data) : params.data
     *					, actionDesc: params.description
     *					, keepExisting: keepExisting || false
     *				}
     *				, failure: function(response,options){
     *					// failed
     *				}
     *				, success: function(o){
     *					// success
     *				}
     *				, scope: this
     *			});
     * 		}
     * }
     */
    onModuleActionComplete: function (module, data, options) {
        this.fireEvent('moduleactioncomplete', this, module, data, options);
    }
});