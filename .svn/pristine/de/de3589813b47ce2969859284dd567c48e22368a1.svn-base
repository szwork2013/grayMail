/*本类实现对元素的拖放，通用代码,依赖于工具类Utils.js(为了兼容firefox的event)*/
/**
 * 拖放管理类。通用代码,依赖于工具类Utils.js(为了兼容firefox的event)。
 * <pre>示例：<br>
 * <br>DragManager(document.getElementById("o"),document.getElementById("h"));
 * </pre>
 * @param {Object} o 必选参数，拖放的对象。
 * @param {Object} handleObj 必选参数，拖放手柄对象。
 * @return {无返回值}
 */
	function DragManager(o,handleObj){
		this.onDragStart=null;
		this.onDragMove=null;
		this.onDragEnd=null;
		this.orignX=0;
		this.orignY=0;
		var min_x=0,min_y=0,
		max_x=$(document.body).width()-$(o).width(),
		max_y=$(document.body).height()-$(o).height();
		var manager=this;
		var offset=[];
		//o.attachEvent("onmousedown",drag_mouseDown);
		if(handleObj){
		    handleObj.onmousedown=drag_mouseDown;
		}else{
		    o.onmousedown=drag_mouseDown;
		}
		this.startDrag=function(e){
			var x,y;
			e=Utils.getEvent();
			if(window.event){
				x=event.clientX+document.body.scrollLeft;
				y=event.clientY+document.body.scrollTop;
			}else{
				x=e.pageX;
				y=e.pageY;
			}
	
	
			if (o.setCapture) {	//在窗口以外也能响应鼠标事件
				o.setCapture();
			}else if (window.captureEvents) {
				window.captureEvents(Event.MOUSEDOWN | Event.MOUSEMOVE | Event.MOUSEUP);
			}
					
			var postion=Utils.findPosition(o);
			if(postion[0]==0){
				offset=[0,0];
			}else{
				offset=[x-postion[0],y-postion[1]];
			}

			//window.status=x+","+y;
			if(manager.onDragStart){
				manager.onDragStart({x:x,y:y});
			}
			Utils.addEvent(document,"onmousemove",drag_mouseMove);
			Utils.addEvent(document,"onmouseup",drag_mouseUp);
			Utils.stopEvent(e);//阻止事件泡冒
		}
		this.stopDrag=function(){
			if (o.releaseCapture){
				o.releaseCapture();
			}
			else if (window.captureEvents) {
				window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
			}

			if(manager.onDragEnd){
				manager.onDragEnd();
			}
			
			Utils.removeEvent(document,"onmousemove",drag_mouseMove);
			Utils.removeEvent(document,"onmouseup",drag_mouseUp);

		}
		
		function drag_mouseMove(e){
			var newX,newY;
			if(window.event){
				newX=event.clientX+document.body.scrollLeft;
				newY=event.clientY+document.body.scrollTop;
			}else{
				newX=e.pageX;
				newY=e.pageY;
			}
			var _x=newX-offset[0];
			var _y=newY-offset[1];
			if(_x<0){
			    _x=0;
			}else if(_x>max_x){
			    _x=max_x;
			}
			if(_y<0){
			    _y=0;
			}else if(_y>max_y){
			    _y=max_y;
			}
			o.style.left = _x+"px";
			o.style.top = _y+"px";
			
			if(manager.onDragMove){
				manager.onDragMove({x:newX,y:newY});
			}
		}
		function drag_mouseDown(e){
			manager.startDrag(e);
		}
		function drag_mouseUp(e){
			manager.stopDrag(e);
		}
		this.getOffset=function(o,isPoint){
			var w=isPoint?1:o.offsetWidth;//是1个像素的点
			var h=isPoint?1:o.offsetHeight;
			for(var r = {l: o.offsetLeft, t: o.offsetTop, r: w, b:h};
				o = o.offsetParent; r.l += o.offsetLeft, r.t += o.offsetTop);
				return r.r += r.l, r.b += r.t, r;
		}
		
		//碰撞检测
		this.hitTest=function(o, l){
			for(var b, s, r = [], a = this.getOffset(o), j = isNaN(l.length), i = (j ? l = [l] : l).length; i;
			b = this.getOffset(l[--i],true), (a.l == b.l || (a.l > b.l ? a.l <= b.r : b.l <= a.r))
			&& (a.t == b.t || (a.t > b.t ? a.t <= b.b : b.t <= a.b)) && (r[r.length] = l[i]));
			return j ? !!r.length : r;
		};
		
	};