M139.namespace('M139.Dom.AddrFloatView', {
    AddrFloatView: M139.View.ViewBase.extend({
        initialize: function () {

        },
        className: 'zlBoxWapper',
        template: _.template($('#addr-float-template').html()),
        //keyup时
        events: {
            'keyup .zlSerachBox': 'SearchContact',
            'click .zlItemButton': 'SelectSingerContact',
            'click .zlGroupButton': 'SelectGroupContact'
        },
        render: function () {
            $(this.el).html(this.template(this.model));
            return this;
        },
        SearchContact: function () {
            this.Controller.SearchDataByKeyAction($(this.el).find('.zlSerachBox').val());
        },
        SelectSingerContact: function (event) {
            this.Controller.AddSingalContactAction(event.target.id);
        },
        SelectGroupContact: function (event) {
            this.Controller.AddGroupContactAction(event.target.id);
        }
    }),
    //分2个视图是因为要处理收索的功能.内联的视图el不需要外部设定 addrSerachFloat 是定义在主视图的模版中的
    AddrFloatSerachResultView: M139.View.ViewBase.extend({
        el: '#addrSerachFloat',
        initialize: function () {

        },
        className: 'zlBoxWapper',
        template: _.template($('#addr-float-search-template').html()),
        events: {
            'click .zlSearchItemButton': 'SelectSingerContact'
        },
        render: function () {
            $(this.el).html(this.template(this.model));
            return this;
        },
        SelectSingerContact: function (event) {
            this.Controller.AddSingalContactAction(event.target.id);
        }
    }),
    //
    AddrFloatSelectedView: M139.View.ViewBase.extend({
        el: '#addrSelectFloat',
        initialize: function () {

        },
        className: 'zlBoxWapper',
        template: _.template($('#addr-float-selected-template').html()),
        events: {
            'click .zlRemoveButton': 'RemoveSelect'
        },
        render: function () {
            $(this.el).html(this.template(this.model));
            return this;
        },
        RemoveSelect: function (event) {
            this.Controller.RemoveSingalContactAction(event.target.id);
        }
    })
});

