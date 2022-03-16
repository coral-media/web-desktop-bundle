/*
 * Chartjs extension for Ext 3.4.x
 *
 * Copyright(c) Coral Media Solutions, LLC.
 * https://www.coralmediasolutions.com
 *
 * Ext JS - JavaScript Library
 * Copyright (c) 2006-2011, Sencha Inc.
 * All rights reserved.
 * licensing@sencha.com
 *
 * http://www.sencha.com/license
 *
 */

Ext.ns("Ext.ux");

/**
 * @class Ext.ux.Chartjs
 * @extends Ext.BoxComponent
 * @xtype chartjs
 */
Ext.ux.Chartjs = Ext.extend(Ext.BoxComponent, {
    autoEl : "canvas",

    type: null,
    data: null,
    options: {},

    afterRender: function() {
        Ext.ux.Chartjs.superclass.afterRender.call(this);

        let self = this;

        let el = Ext.getDom(this.id);
        let ctx = el.getContext("2d");
        Ext.applyIf(self.options, {
            responsive: true
        });
        // new Chart(ctx)[this.type](this.data, this.options);
        new Chart (ctx, {
            type: self.type,
            data: self.data,
            options: self.options
        });
    }
});

Ext.reg("chartjs", Ext.ux.Chartjs);