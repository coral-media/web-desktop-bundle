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
 */

Ext.app.Module = Ext.extend(Ext.util.Observable, {
    constructor: function (config) {
        this.addEvents({
            'actioncomplete': true
        });

        config = config || {};
        Ext.apply(this, config);
        Ext.app.Module.superclass.constructor.call(this);
    },
    /**
     * Read/Write {object}
     * Set this by calling setLocal().
     */
    locale: null,

    className: null,

    requires: null,

    addons: null,

    hasResources: false,

    /**
     * Read only. {object}
     * Override this with the launcher for your module.
     *
     * Example:
     *
     * {
     *    iconCls: 'pref-icon',
     *    shortcutIconCls: 'pref-shortcut-icon',
     *    text: 'Preferences',
     *    tooltip: '<b>Preferences</b><br />Allows you to modify your desktop'
     * }
     */
    launcher: null,
    /**
     * Read only. {boolean}
     * Ext.app.App uses this property to determine if the module has been loaded.
     */
    loaded: false,
    /**
     * Read only. {boolean}
     * Ext.app.App uses this property to determine if the module is currently being loaded.
     */
    isLoading: false,
    /**
     * Read only. {boolean}
     * Set to true if the module needs to run silent, meaning it does not have a user
     * interface and the user should not know it exists.
     * Ext.app.App uses this property.
     */
    silent: false,
    /**
     * Read only. {string}
     * Override this with the type of your module.
     * Example: 'system/preferences'
     */
    type: null,
    /**
     * Read only. {string}
     * Override this with the unique id of your module.
     */
    id: null,
    /**
     * Override this to initialize your module.
     * Is called by loadModuleComplete() of the Ext.app.App class.
     */
    init: Ext.emptyFn,
    /**
     * Override this function to create your module's window.
     */
    createWindow: Ext.emptyFn,
    /**
     * @param {object} locale
     *
     * Override this function to allow the locale to be set
     */
    setLocale: Ext.emptyFn,
    /**
     * @param {array} An array of request objects
     *
     * Override this function to handle requests from other modules.
     * Expect the passed in param to look like the following.
     *
     * {
     *    requests: [
     *       {
     *          action: 'createWindow',
     *          params: '',
     *          callback: this.myCallbackFunction,
     *          scope: this
     *       },
     *       { ... }
     *    ]
     * }
     *
     * View makeRequest() in App.js for more details.
     */
    handleRequest: Ext.emptyFn
});