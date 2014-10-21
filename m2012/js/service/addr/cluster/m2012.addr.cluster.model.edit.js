
(function ($, _, M) {
    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Cluster.Model.Edit";

    M.namespace(_class, superClass.extend({
        name: _class,
        

        initialize: function (options) {

            return superClass.prototype.initialize.apply(this, arguments);
        },


        queryCluster: function(clusterId, fnResult){
            /**
            < QueryCluster >
	            < ClusterID></ ClusterID>
            </ QueryCluster >
            */
            var reqBody = {
                QueryCluster: {
                    ClusterID: clusterId
                }
            };

            setTimeout(function () {
                //mock
                fnResult({
                    "ResultCode":"0",
                    "ResultMsg":"Operate successful",
                    "ClusterName":"apple",
                    "MembersNum":"3",
                    "Members":[
                    {"Name":"a","Mail":"a@139.com","Sponsor":"2"},
                    {"Name":"b","Mail":"b@139.com","Sponsor":"2"},
                    {"Name":"c","Mail":"c@139.com","Sponsor":"2"}]
                });
            }, 100);
        },
        /**
         *编辑群组
         */
        updateCluster: function (options, fnResult) {
        
        },
        /**
         *添加群组
         */
        addCluster: function (options, fnResult) {
            /*
                <AddCluster>
	                <SponsorMail></SponsorMail>
                    <ClusterName></ClusterName>
                    <Members>
	                    <SerialId></SerialId>
	                    <MemberMail></MemberMail>
                    </Members>
                    <Members>
	                    <SerialId></SerialId>
	                    <MemberMail></MemberMail>
                    </Members>
                </AddCluster>
            */
            var members = [];
            var reqBody = {
                AddCluster: {
                    SponsorMail: options.email,
                    ClusterName: options.name,
                    Members: members
                }
            }
            for (var i = 0; i < options.items.length; i++) {
                var item = options.items[i];
                members.push({
                    SerialId: item.serialId,
                    MemberMail: item.addr
                });
            }
            console.log(M139.Text.Xml.obj2xml2(reqBody));
        }
    }));
})(jQuery, _, M139);
