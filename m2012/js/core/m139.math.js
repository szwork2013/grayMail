


;(function(MiniQuery)
{


/***********************************************************************************************************
*   数学工具
*/
MiniQuery.Math = 
{
    /**
    * 产生指定闭区间的随机整数。
    */
    randomInt: function(minValue, maxValue)
    {
        if(minValue === undefined && maxValue === undefined) // 此时为  Math.randomInt()
        {
            //先称除小数点，再去掉所有前导的 0，最后转为 number
            return Number(String(Math.random()).replace('.', '').replace(/^0*/g, ''));
        }
        else if(maxValue === undefined)
        {
            maxValue = minValue;    //此时相当于 Math.randomInt(minValue)
            minValue = 0;
        }
        
        var count = maxValue - minValue + 1;
        return Math.floor(Math.random() * count + minValue);
    },
    
    /**
    * 圆形求模方法。
    * 即用圆形链表的方式滑动一个数，返回一个新的数。
    * 可指定圆形链表的长度(size) 和滑动的步长(step)，滑动步长的正负号指示了滑动方向
    */
    slide: function(index, size, step)
    {
        step = step || 1; //步长默认为1
        
        index += step;
        if(index >= 0)
        {
            return index % size;
        }
        
        return (size - (Math.abs(index) % size)) % size;
    },
    
    /**
    * 下一个求模数
    */
    next: function(index, size)
    {
        return MiniQuery.Math.slide(index, size, 1);
    },
    
    /**
    * 上一个求模数
    */
    previous: function(index, size, step)
    {
        return MiniQuery.Math.slide(index, size, -1);
    },
    
    parseInt: function(string)
    {
        return parseInt(string, 10);
    }
};



 
})(window.M139);