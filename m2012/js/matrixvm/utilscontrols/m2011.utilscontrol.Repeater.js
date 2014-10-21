/**
 * ģ����࣬ʵ��������asp.net�����ݰ󶨣�ģ���л��ơ�
 * <pre>ʾ����<br>
 * <br>Repeater(document.getElementById('TemplateID'));
 * </pre>
 * @param {Object} obj ��ѡ������ģ�����������ID
 * @return {�޷���ֵ}
 */
function Repeater(obj){	
	this.HtmlTemplate=null;
	this.HeaderTemplate=null;
	this.FooterTemplate=null;
	this.ItemTemplate;
	this.ItemTemplateOrign;
	this.SeparateTemplate;
	this.Functions=null;
	this.DataSource=null;
	this.ItemContainer;
	this.ItemDataBound=null;
	this.RenderMode=0;	//0��ͬ����Ⱦ������һ������װ��1.�첽��Ⱦ��50��������һ��
	this.RenderCallback=null;
	this.Element;	
	RP=this;
	this.Instance=null;
	this.DataRow=null;	//��ǰ������
	if (typeof(obj) != undefined) {
		if (typeof(obj) == "string") {
			this.Element = document.getElementById(obj);
		}
		else {
			this.Element = obj;
		}
		//n=findChild(obj,"name","item");
		

	}

	this.DataBind = function() {
	    if (this.DataSource.length == 0) {
	        return;
	    }
	    if (this.HtmlTemplate == null) {
	        this.HtmlTemplate = this.Element.innerHTML;
	    }
	    //this.ItemTemplate=this.HtmlTemplate.match(/(<!--item\s+start-->)([\r\n\w\W]+)(<!--item\s+end-->)/ig)[0];
	    var re = /(<!--item\s+start-->)([\r\n\w\W]+)(<!--item\s+end-->)/i;
	    //re.exec(this.HtmlTemplate);
	    var match = this.HtmlTemplate.match(re);
	    this.ItemTemplateOrign = match[0];
	    this.ItemTemplate = match[2];

	    reg1 = /\$\w+\s?/ig;
	    reg2 = /\@(\w+)\s?\((.*?)\)/ig;
	    var result = new Array();
	    for (var i = 0; i < this.DataSource.length; i++) {
	        var dataRow = this.DataSource[i];
	        dataRow["index"] = i;//׷������
	        this.DataRow = dataRow; //���õ�ǰ������
	        var row = this.ItemTemplate;

	        row = row.replace(reg2, function($0, $1, $2) { //�滻����
	            var name = $1.trim();
	            var paramList = $2.split(",");
	            var param = new Array();
	            for (var i = 0; i < paramList.length; i++) {
	                param.push(dataRow[paramList[i]]);
	            }
	            if (RP.Functions[name]) {
	                //return RP.Functions[name](param);
	                var context = RP;
	                if (RP.Instance) {
	                    RP.Instance.DataRow = dataRow;
	                    context = RP.Instance;
	                }
	                return RP.Functions[name].apply(context, param)
	            }


	        });
	        row = row.replace(reg1, function($0) { //�滻����
	            m = $0.substr(1).trim();
				if(dataRow[m]!=undefined){
					return dataRow[m];
				}else{
					return "$"+m;
				}
	            

	        });

	        var itemArgs = {	//�¼�����
	            index: i,
	            data: dataRow,
	            html: row
	        };
	        if (this.ItemDataBound) {	//�Ƿ��������а��¼�
	            var itemRet = this.ItemDataBound(itemArgs);
	            if (itemRet) {
	                row = itemRet;
	            }
	        }
	        result.push(row);
	    }
	    this.Render(result);



	};

	this.Render = function(result) {
	    if (!this.RenderCallback) {
            var str = result.join("");

            //��Ϊjscript 5.5���� String.prototype.replace(pattern, replacement)
            //���pattern��������ʽ, replacement�����е�$&��ʾ���ʽ��ƥ����ַ���
            //��: replace(/\d/g, "$&cm") �ͱ�ʾ��ÿһ������׷����cm��
            //��������Ķ�html��replace���ͻ���str���� $& ��λ�ò���������ItemTemplateOrign
            //������Ҫ��$��ת�� $$ ��ʾһ�� $������ʱ���Է��ʼ�����Ϊ $<b>$ test</b> ������
            if ('0'.replace('0',"$&")==='0'){
                str = str.replace(/\$/ig,"$$$$");
            }

	        var html = "";
	        if (this.HtmlTemplate) {
	            html = this.HtmlTemplate.replace(this.ItemTemplateOrign, str);
	        } else {
	            html = this.ItemTemplate.replace(this.ItemTemplateOrign, str);
	        }
	        if (this.HeaderTemplate)
	            html = this.HeaderTemplate + html;
	        if (this.FooterTemplate) {
	            html = html + this.FooterTemplate;
	        }
	        if(this.onRender){
	        	this.onRender(this.Element,html);
	        }else{
	        	this.Element.innerHTML = html;
	        }
	    } else {
	        var n = 0;
	        var el = this.Element;
	        var rowObj = null;
	        var args = { index: 0, element: el, html: "", rowCount: result.length };
            function exeCallBack(){
                //el.innerHTML=RP.HtmlTemplate.replace(RP.ItemTemplate,result[0]);
                args.index = n;
                args.element = el;
                args.html = result[n];
                RP.RenderCallback(args);
            }
			/*oldMode
	        var intervalId = setInterval(function() {
	            if (n < result.length) {
	                //el.innerHTML=RP.HtmlTemplate.replace(RP.ItemTemplate,result[0]);
	                args.index = n;
	                args.element = el;
	                args.html = result[n];
	                RP.RenderCallback(args);
	                n++;
	            } else {
	                clearInterval(intervalId);
	            }
	        }, 50);*/
            if (RP.Instance.RenderMode) {
                var intervalId = setInterval(function(){
                    if (n < result.length) {
                        exeCallBack();
                        n++;
                    }
                    else {
                        clearInterval(intervalId);
                    }
                }, 50);
            }
            else {
                while (n < result.length) {
                    exeCallBack();
                    n++;
                }
            }
	    }
	}		
}

Object.extend = function(A, $) {
    for (var _ in $) {
        A[_] = $[_];
    }
    return A;
};
//Object.extend(Repeater.prototype,DataList)
/**
 * DataList�ؼ��࣬������Repeater
 * <pre>ʾ����<br>
 * <br>DataList(document.getElementById('ListID'));
 * </pre>
 * @param {Object} obj ��ѡ������ģ�����������ID
 * @return {�޷���ֵ}
 */
function DataList(obj){
	this.Layout=1;	// 0Ϊʹ��div���ַ�ʽ, 1Ϊʹ��table���ַ�ʽ��
	this.RepeatColumns=5;
	this.ItemTemplate=null;
	this.id="table_list";
	this.Style_Cell=null;
	this.ulClassName="";
	this.RenderMode=0;//��Ⱦģʽ��0ͬ����1�첽50����
	var rp=new Repeater(obj),
	DL=this,
	table=document.createElement("table"),
	tr=null,
	ul=null;
	this.DataSource=null;
	this.Functions=null;
	this.DataRow=null;	//��ǰ������
	function renderTable(arg){
		var td = document.createElement("td");
	    td.innerHTML = arg.html;
	    if (DL.Style_Cell) {
	        td.className = DL.Style_Cell;
	    }
	    if (arg.index == 0) {	//��һ������
	        var table = document.createElement("table");
	        var tbody = document.createElement("tbody");
	        tr = document.createElement("tr");
	        table.appendChild(tbody);
	        tbody.appendChild(tr);
	        rp.Element.appendChild(table);
	        table.id = DL.id;
	        tr.appendChild(td);
	    } else if (arg.index == arg.rowCount - 1) {	//���һ������
	        tr.appendChild(td);
	    } else if (arg.index % DL.RepeatColumns == 0) {	//����
	        tbody = tr.parentNode;
	        tr = document.createElement("tr");
	        tbody.appendChild(tr);
	        tr.appendChild(td);
	    } else {
	        tr.appendChild(td);
	    }
	}
	function renderLiList(arg){
		if(arg.index==0)
		{
			ul=document.createElement("ul");
			ul.className=DL.ulClassName||"dataUl";
			rp.Element.appendChild(ul);
			ul.innerHTML=arg.html;
		}
		else
		{
			var html=ul.innerHTML;
			ul.innerHTML=html+arg.html;
		}
	}
	rp.RenderCallback = function(arg) {
		if(DL.Layout)
		{
			renderTable(arg);
		}
		else{
			renderLiList(arg);
		}
	    /*
var td = document.createElement("td");
	    td.innerHTML = arg.html;
	    if (DL.Style_Cell) {
	        td.className = DL.Style_Cell;
	    }

	    if (arg.index == 0) {	//��һ������
	        var table = document.createElement("table");
	        var tbody = document.createElement("tbody");
	        tr = document.createElement("tr");
	        table.appendChild(tbody);
	        tbody.appendChild(tr);
	        rp.Element.appendChild(table);
	        table.id = DL.id;
	        tr.appendChild(td);
	    } else if (arg.index == arg.rowCount - 1) {	//���һ������
	        tr.appendChild(td);
	    } else if (arg.index % DL.RepeatColumns == 0) {	//����
	        tbody = tr.parentNode;
	        tr = document.createElement("tr");
	        tbody.appendChild(tr);
	        tr.appendChild(td);
	    } else {
	        tr.appendChild(td);
	    }
*/


	};
	this.DataBind = function() {
	    var arr = new Array();
	    //arr.push("<table>");
	    arr.push("<!--item start-->");
	    arr.push(this.ItemTemplate);
	    arr.push("<!--item end-->");
	    //arr.push("</table>");
	    rp.HtmlTemplate = arr.join("");

	    rp.DataSource = this.DataSource;
	    rp.Functions = DL.Functions;
	    rp.Instance = DL;
	    rp.DataBind();

	};
	
	
}

