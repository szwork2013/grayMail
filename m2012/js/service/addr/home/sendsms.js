

/**
 * 完成跳转，到发短/彩信/传真的流程控制处理
 */
(function(){

    //显示下一步对话框
    function NextBox(option) {

        var onError = function(summary, e) {
            var el = top.FF.current.$el;
            var txtError = el.find("#divError");
            if (txtError.length > 0) {
                txtError.text(summary);
            } else {
                el.find(".formLine").append('<li><div id="divError" name="divError" style="color:red;padding-left:100px">' + summary + '</div></li>');
            }
            e.cancel = true;
        };

        var dialog = top.FF.prompt(option.title, option.message, "",  function(num, e) {
            num = num.trim();

            if (!num) {
                onError((option.nullArgError || PageMsg['warn_mobile']), e);
                return;
            }

            if ($.isFunction(option.next)) {
                option.next(num, onError, e);
            }
        });

        return dialog;
    }

    //保存最近联系人为通讯录联系人
    function saveLastContact(info, success) {
        // {addrContent: "email", addrType: "E", addrName: "username"}

        var _info = { name: info.addrName };
        switch (info.addrType) {
            case "E": {
                _info.email = info.addrContent;
                break;
            }
            case "M": {
                _info.mobile = info.addrContent;
                break;
            }
            case "F": {
                _info.fax = info.addrContent;
                break;
            }
        }

        top.M2012.Contacts.API.addContacts(_info, function (result) {
            if (result.success) {
                top.M139.UI.TipMessage.show("添加成功", { delay: 3000 });
                success(result.contacts.SerialId);
            } else {
                top.FF.alert(result.error || result.msg);
            }
        });
    }

    //根据一个serialId，得到一个手机号，只针对，已保存联系人。
    function fetchMobile(serialId, onMobileFetch) {

        var contact = top.$App.getModel("contacts").getContactsById(serialId);
        if (!contact) {
            return;
        }

        if (contact.getFirstMobile()) {
            onMobileFetch(contact.getFirstMobile());

        } else {
            var _title = PageMsg['warn_mobiletitle'];
            var _message = PageMsg['warn_mobile'];

            var nextBox = new NextBox({
                title: _title,
                message: _message,
                next: function(value, onerror, e) {
                    var info = {
                        SerialId: serialId,
                        AddrFirstName: contact.name,
                        MobilePhone: value
                    };

                    var _info = new top.ContactsInfo(info);
                    var vdResult = _info.validateDetails(true);
                    if (!vdResult.success) {
                        onerror(vdResult.msg, e);
                        return;
                    }
                    _info = null;
                    vdResult = null;

                    top.Contacts.ModContactsField(serialId, info, false, function(result) {
                        if (result.success) {
                            onMobileFetch(value);
                        } else {
                            onerror(result.msg, e);
                        }
                        top.addBehaviorExt({ actionId: 26016, thingId: 2, moduleId: 19 });
                    });
                }
            });
        }
    }

    //根据一个serialId，得到一个传真号码，只针对，已保存联系人。
    function fetchFax(serialId, onFaxFetch) {

        var contact = top.$App.getModel("contacts").getContactsById(serialId);
        if (!contact) {
            return;
        }

        if (contact.getFirstFax()) {
            onFaxFetch(contact.getFirstFax());

        } else {
            var _title = PageMsg.warn_faxtitle;
            var _message = PageMsg.warn_fax;
            var _error = PageMsg.error_faxIllegal;

            var nextBox = new NextBox({
                title: _title,
                message: _message,
                nullArgError: _error,
                next: function(value, onerror, e) {

                    var _info = new top.ContactsInfo({
                        SerialId: serialId,
                        AddrFirstName: contact.name,
                        BusinessFax: value
                    });

                    var vdResult = _info.validateDetails(true);
                    if (!vdResult.success) {
                        onerror(vdResult.msg, e);
                        return;
                    }
                    _info = null;
                    vdResult = null;

                    //OPTIMIZE: 因为字段保存接口不支持传真，所以只能先读到所有字段再修改保存。
                    top.Contacts.getContactsInfoById(serialId, function(result) {
                        if (!result.success) {
                            onerror(result.msg, e);
                            return;
                        }

                        var info = result.contactsInfo;
                        info.BusinessFax = value;
                        info.OverWrite = "1";

                        top.Contacts.editContactDetails(info, function(_result) {
                            if (_result.success) {
                                onFaxFetch(value);
                                nextBox.close();
                            } else {
                                onerror(_result.msg, e);
                            }
                        });
                    });

                    e.cancel = true;
                }
            });
        }
    }

    function redirectSMS(receiver, params) {
        window.top.Links.show("sms", "&mobile=" + receiver + (params || ''));
    }

    function redirectMMS(receiver, params) {
        senNewMMS(receiver);
    }

    function redirectFax(receiver) {
        Tool.hideControlBar();
        window.top.Links.show("fax", "&to=" + receiver);

        top.Utils.waitForReady("top.frames['fax'].contentWindow.document.getElementById('tbRMobile').value='" + receiver + "'");
        top.addBehaviorExt({ actionId: 26014, thingId: 2, moduleId: 19 });
    }

    function singleMobileSend(serialId, onredirect, params) {
        fetchMobile(serialId, function(value){
            if (onredirect) onredirect(value, params);
            top.addBehaviorExt({ actionId: 26014, thingId: 10, moduleId: 19 });
        });
    }

    function singleFaxSend(serialId, onredirect) {
        fetchFax(serialId, function(value){
            if (onredirect) onredirect(value);
        });
    }

    //有三个来源，四种情况
    //1、选择联系人 > 发送菜单 > 发短/彩信  redirectSMS(param)
    //2、联系人页卡 > 发短信  sendSMS($domObj)
    //3、直接点击联系人的手机号 （未考虑） sendSMS(domObj)
    //4、最近/紧密联系人点发短/彩信 (分已保存/未保存)  sendSMS(serialId) / sendSMS({addrContent:"mobile/email",addrType:'E/M',addrName:"name"})

    window.sendSMS = function(obj, params){

        //检测对应功能是否对互联网用户开放
        if (top.$User && !top.$User.checkAvaibleForMobile()) {
            return;
        }

        var serialId = Tool.getRowContactsId(obj);
        if (serialId == null) {
            var contact = top.$App.getModel("contacts").getContactsById(obj);
            if (contact) {
                serialId = contact.SerialId;
            }
            contact = null;
        }

        //有serialId，可以判定是已保存的联系人，可取手机号发送
        if (serialId) {
            singleMobileSend(serialId, redirectSMS, params);
        } else {
            //没有，则未保存，进添加联系人流程，后再取手机号发送
            saveLastContact(obj, function(_serialId) {
                singleMobileSend(_serialId, redirectSMS, params);
            });
        }
    }

    window.sendMMS = function(obj) {

        //检测对应功能是否对互联网用户开放
        if (top.$User && !top.$User.checkAvaibleForMobile()) {
            return;
        }

        var serialId = Tool.getRowContactsId(obj);
        if (serialId == null) {
            var contact = top.$App.getModel("contacts").getContactsById(obj);
            if (contact) {
                serialId = contact.SerialId;
            }
            contact = null;
        }

        //有serialId，可以判定是已保存的联系人，可取手机号发送
        if (serialId) {
            singleMobileSend(serialId, redirectMMS);
        } else {
            //没有，则未保存，进添加联系人流程，后再取手机号发送
            saveLastContact(obj, function(_serialId) {
                singleMobileSend(_serialId, redirectMMS);
            });
        }
    }

    window.sendFax = function(obj) {

        //检测对应功能是否对互联网用户开放
        if (top.$User && !top.$User.checkAvaibleForMobile()) {
            return;
        }

        var serialId = Tool.getRowContactsId(obj);
        if (serialId == null) {
            var contact = top.$App.getModel("contacts").getContactsById(obj);
            if (contact) {
                serialId = contact.SerialId;
            }
            contact = null;
        }

        //有serialId，可以判定是已保存的联系人，可取手机号发送
        if (serialId) {
            singleFaxSend(serialId, redirectFax);
        } else {
            //没有，则未保存，进添加联系人流程，后再取手机号发送
            saveLastContact(obj, function(_serialId) {
                singleFaxSend(_serialId, redirectFax);
            });
        }
    }

})();