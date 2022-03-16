Ext.namespace("Hydra.form.Action");

Hydra.form.Action.JsonSubmit = function(form, options) {
    Hydra.form.Action.JsonSubmit.superclass.constructor.call(this, form, options);
};

/**
 * We are extending the default Action Submit...
 */
Ext.extend(Hydra.form.Action.JsonSubmit, Ext.form.Action.Submit, {
    type: 'jsonSubmit',

    overwriteParams: {},

    run : function() {
        let o = this.options;
        let method = this.getMethod();
        let isGet = method == 'GET';
        if (o.clientValidation === false || this.form.isValid()) {
            let encodedParams = Ext.encode(Ext.apply(this.form.getValues(), this.overwriteParams));

            Ext.Ajax.request(Ext.apply(this.createCallback(o), {
                url:this.getUrl(isGet),
                method: method,
                waitMsg: "Please wait while saving",
                waitTitle: "Please wait",
                headers: o.headers || {'Content-Type': 'application/ld+json'},
                params: o.params || String.format('{0}', encodedParams),
                isUpload: this.form.fileUpload
            }));
            if (o.submitEmptyText === false) {
                Ext.each(emptyFields, function(f) {
                    if (f.applyEmptyText) {
                        f.applyEmptyText();
                    }
                });
            }
        } else if (o.clientValidation !== false) { // client validation failed
            this.failureType = Ext.form.Action.CLIENT_INVALID;
            this.form.afterAction(this, false);
        }
    },

    success : function(response){
        let result = this.processResponse(response);
        if(result === true || result.success || response.status === 200 || response.status === 201){
            this.form.afterAction(this, true);
            return;
        }
        if(result.errors){
            this.form.markInvalid(result.errors);
        }
        this.failureType = Ext.form.Action.SERVER_INVALID;
        this.form.afterAction(this, false);
    }
});

Ext.apply(Ext.form.Action.ACTION_TYPES, {
    'jsonSubmit' : Hydra.form.Action.JsonSubmit
});