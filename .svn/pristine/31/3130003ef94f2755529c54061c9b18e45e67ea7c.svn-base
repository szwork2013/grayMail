(function (jQuery, Backbone, _, M139) {
    var $ = jQuery;
    M139.namespace("M2012.AndAddr.ContactInfo.View", Backbone.Model.extend({
        initialize: function () {
            var contactInfo = new M2012.AndAddr.ContactInfo.Model();
            this.model = contactInfo;
        },
        render: function () {
            var self = this;
            self.model.getDataSource(function (res) {
                var render = _.template($("#info-tmpl").html());
                var html = render(res);
                $("#pnlclone").html(html);
            })
        }
    }));
    new M2012.AndAddr.ContactInfo.View().render();
})(jQuery, Backbone, _, M139);
