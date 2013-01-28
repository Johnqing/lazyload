/*
* 调用:
*    Y.lazyload({
*        elem : [Y.$id(xx).getElementsByTagName('img'),Y.$id(xx2).getElementsByTagName('img')],
*        original : 'data-original',
*        container : 'document',
*        event : 'scroll',
*        fadeIn : true
*    });
* author:lq
* version : 0.1
* 备注：目前只支持scroll事件，后期添加事件拓展
*/
Y.lazyload = function(config){
    config = Y.extend({
        elem        :   'lazyload',
        original    :   'data-original', // String          存放图片真实地址的属性
        container   :   document,        // DOM / Selector 默认的容器为document，可自定义容器
        event       :   'scroll',   // String            触发事件类型，默认为window.onscroll事件                
        fadeIn      :   true,      // Boolean        是否使用fadeIn效果来显示                
    },config);
    var imgNodes = config.elem,
    imgArray = [],
    original = config.original,
    container = config.container['body'] || config.container['documentElement'],
    event = config.event,
    dataName = 'imglazyload_offset';        
    
    //遍历获取图片集合
    for(var j=0;j<imgNodes.length;j++){
        var oE = imgNodes[j];
        if(oE){
            for(var t=0;t<oE.length;t++){
                imgArray.push(oE[t]);    
            }    
        }    
    }
    //图片加载开始
    var loader = function( triggerElem, event ){
        var i = 0,ObjPoint, elem, lazySrc,
        top = (document.body.scrollTop || document.documentElement.scrollTop),height = document.documentElement.clientHeight;
        
        for( ; i < imgArray.length; i++ ){    
            elem = imgArray[i];
            if(elem.className=="imglazyload_offset"){continue;};
            lazySrc = elem.getAttribute( config.original );            
            if( !lazySrc || elem.src === lazySrc ){
                continue;
            }
            //当前图片的绝对位置
            ObjPoint = Y.getObjPoint(elem).y; 
            if(ObjPoint>=top&&ObjPoint<=(top+height)){
                // 加载图片
                elem.src = lazySrc;
                elem.className = dataName;
                //是否增加透明度变化
                if(!config.fadeIn) return ;
                Y.toFadeIn(elem);
            }
        }        
    };
    
    var fire = function( e ){
        loader( this, e.type );
    };
    // 绑定事件
    Y.attachEvent(window,event,fire);
    Y.attachEvent(window,'resize',fire);
    // 初始化
    loader();
    return this;    
};