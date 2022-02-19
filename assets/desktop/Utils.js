/**
 * @class Array
 */
Ext.applyIf(Array.prototype, {

    /**
     * Inserts argument at specified index. Supports merging
     * for Array type arguments and chaining for single value arguments.
     * @param index
     * @returns {Array}
     */
    insertAt: function(index) {
        index = Math.min(index, this.length);
        arguments.length > 1
        && this.splice.apply(this, [index, 0].concat([].pop.call(arguments)))
        && this.insertAt.apply(this, arguments);
        return this;
    }
});