 module.exports = Backbone.View.extend({
	initialize: function () {
        this.$input = this.$('input, textarea');
        this.$form = this.$('.report-form');
        this.$spinner = this.$('.js-inner-circles-loader');

        this.scrapeFormDataDebounce = _.debounce(function () {
            this.scrapeFormData();
        }, 1000); 

        this.$form.parsley(); 
        this.listenTo(this.model, 'data:sent', this.submitForm);
        this.listenTo(this.model, 'data:sent', this.hideSpinner);
        this.listenTo(this.model, 'data:sending', this.showSpinner);
	},
    events: {
        'submit form' : 'sendData' 
    }, 
    submitForm : function () {
        
        this.$form.off();
        this.$form.submit();
    },
    sendData: function () {
        if (!this.model.get('dataSent')) {
            this.model.trigger('data:sending');

            this.scrapeFormDataDebounce();
            return false;
        }       
    },
    scrapeFormData : function () {
        if (!this.$form.parsley().isValid()) {
            return;
        }

        var that = this;

        this.setTime();
        this.setRand();

        this.$input.each(function(input) {
            var el = that.$(this)[0];
            that.model.set(el.name, el.value);
        });

        this.model.submitQuery();
    }, 
    setTime : function () {
        var date = new Date(), 
            time = date.getTime();

        this.$('.js-time').val(time);        
    }, 
    setRand : function () {
        var rand = Math.random().toString(36).substring(7);

        this.$('.js-rand').val(rand);
    }, 
    hideSpinner : function () {
        this.$spinner.removeClass('show');
        this.$spinner.addClass('hide');
    }, 
    showSpinner : function () {
        this.$spinner.removeClass('hide');
        this.$spinner.addClass('show');
    }
});