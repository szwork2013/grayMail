
/************* 播放列表类 **************/

;(function() {

	function noop() {};

	function $id(id) {
		return typeof id === 'string' ? document.getElementById(id) : id;
	}

	var PlayList = function(options) {

		var props = ["id", "order", "loop", "onPlayChange", "onAddRecord", "onRemoveRecord", "onUpdateRecord", "onClearRecord"];
		for(var i=0, len=props.length; i < len; i++) {
			key = props[i];
			options.hasOwnProperty(key) && (this[key] = options[key]);
		}
		
		this._list = [];	// 播放数据集
		this._curr = -1;	// 当前歌曲索引
		this._map = {};
		this.box = $id(this.id);
	};

	PlayList.prototype = {

		order: 'seq',	// 播放顺序 ("seq", "rand", "single")

		loop: false,	// 循环开关

		onPlayChange: noop,

		onAddRecord: noop,

		onRemoveRecord: noop,

		/*
		* 添加一条播放数据
		*/
		addItem: function(rec) {
			var list = this._list;
			var map = this._map;
			var i, id, len;

			id = rec && rec.id;

			if(!rec || rec.id == undefined) return false;

			if(map[rec.id] !== true) {
				list.push(rec);
				map[rec.id] = true;	// 标记已存在此播放记录
				this.onAddRecord(rec);
				return true;
			}/* else {
				// 替换旧的数据(几乎不会用到)
				for(i=0,len=list.length; i < len; i++) {
					if(list[i].id === rec.id) {
						var old = list.splice(i, 1, rec);
						this.onUpdateRecord(rec, old);
					}
				}
				console.assert( i < len, "[ERROR] 数据不同步");
			}*/
			return false;
		},

		/* 批量添加播放记录(去重) */
		addBatch: function(ary) {
			var prev_len = this.length();
			for(var i=0,len=ary.length; i<len; i++) {
				this.addItem(ary[i]);
			}
			return this.length() - prev_len;
		},

		/* 得到列表长度 */
		length: function() {
			return this._list.length;
		},

		getPos: function(){
			return this._curr;
		},

		getCurrent: function() {
			return this._list[this._curr];
		},

		setCurrent: function(index){
			var list = this._list;
			var prev;

			index = index | 0;

			if(this.length() == 0 || this._curr == index) {
				return false;
			}

			prev = list[this._curr];
			this._curr = index;
			this.onPlayChange(list[index], prev);
			return true;
		},

		/*
		* set current record by id
		*/
		setCurrentById: function(id) {
			var list = this._list;
			for(var i=0, len=list.length; i < len; i++) {
				if(list[i].id == id) {		// "12" == 12 // true
					return this.setCurrent(i);
				}
			}
			return false;
		},

		/*
		* prev record
		*/
		prev: function() {
			var len, obj, prev;

			if((len = this.length()) == 0) {
				return null;
			}

			if(this.order === "rand") {
				return this.rand();
			}

			if(this.loop == false && this._curr <= 0) {
				return null;
			}

			return this.select((len - 1 + this._curr) % len);
		},

		/**
		* @inner
		*/
		select: function(index) {
			var prev, curr;

			prev = this._list[this._curr];	// 下标为负不会出错
			this._curr = index;
			curr = this._list[this._curr];
			this.onPlayChange(curr, prev);	// update view
			return curr;
		},

		/*
		* next record
		*/
		next: function() {
			var len;

			if((len = this.length()) == 0) {
				return null;
			}

			if(this.order === "rand") {
				return this.rand();
			}
			
			if(this.loop == false && this._curr >= len-1) {
				return null;
			}

			return this.select((this._curr + 1) % len);
		},

		/*
		* @inner ?
		* @unrealized
		* get a random record
		*/
		// todo 随机不重复
		rand: function () {
			var len;

			if((len = this.length()) == 0) {
				return null;
			}

			// todo: 判断 != 当前
			rand = Math.random() * len | 0;
			return this.select(rand);
		},

		/*
		* del a record by index ( not id )
		* remove the current record if no argument was passed.
		*/
		remove: function (index) {
			var obj;

			console.log("index = " + index);
			if(typeof index !== "number" || index < 0) {
				index = this._curr;
			}

			//console.assert(this.box === $id(this.id));

			obj = this._list[index];
			if(!obj) return false;

			this._list.splice(index, 1);
			delete this._map[obj.id];

			if(index === this._curr) {
				this._curr = -1;
				//this.next();	// todo 是否调用？
				if(this.order === "rand"){
					this.rand();
				} else {
					this.setCurrent(index);
				}
				// todo 先remove回调还是先设置_curr？
				this.onRemoveRecord(obj, true);
			} else {
				(index < this._curr) && --this._curr;
				this.onRemoveRecord(obj, false);
			}
			
			return true;
		},

		/*
		* remove a record by id
		*/
		removeById: function(id) {
			var list = this._list;
			for(var i=0, len=list.length; i < len; i++) {
				if(list[i].id == id) {		// "12" == 12 // true
					return this.remove(i);
				}
			}
			return false;
		},

		/**
		* 更新某项
		*/
		update: function(obj) {
			var list = this._list;
			var id = obj.id;
			var old = null;
			for(var i=0, len=list.length; i < len; i++) {
				if(list[i].id == id) {
					old = list.splice(i, 1, obj);
					this.onUpdateRecord(obj, old);
					return true;
				}
			}
			return false;
		},

		/*
		* sort the list
		*/
		sort: function(comparator) {
			this._list.sort(comparator);
			//this.onSort();
		},

		/*
		* 清空播放列表数据
		*/
		clear: function() {
			this._list = [];
			this._curr = -1;
			this._map = {};
			this.onClearRecord();
		}
	};
	window.PlayList = PlayList;
})();
