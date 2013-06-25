/*
* 调用:
* imgLazyLoad(imgNodes, {
*   original: 'data-original',
*   container: 'document',
*   event: 'scroll'
* });
* @author: johnqing
* @version: 0.1
*/
(function(window){
      var doc = window.document,
      extend = function(define, source) {
          for (var property in source) define[property] = source[property];
          return define;
      },
      on = function(element, type, handler) {
          element.addEventListener ? element.addEventListener(type, handler, false) : element.attachEvent("on" + type, handler);
      },
      gId = function(id){
          return doc.getElementById(id);
      },
      getObjPoint = function(o){
          var x=y=0;
          do {
              x += o.offsetLeft || 0;
              y += o.offsetTop  || 0;
              o = o.offsetParent;
          } while (o);

          return {'x':x,'y':y};
      };
      /**
      * 默认配置
      * @type {Object}
      */
      var defineConfig = {
        dataOriginal: 'data-original',
        container: doc,
        event: 'scroll',
        callback: function(){}
      };
      window.imgLazyLoad = function(target, opts){
          opts = extend(defineConfig, opts);

          var imgArray = [],
              dataName = 'img_offset',
              container = opts.container['body'] || opts.container['documentElement'];

          for (var i = 0; i < target.length; i++) {
            var imgNode = target[i];
            if(imgNode){
              for (var j = 0; j < imgNode.length; j++) {
                imgArray.push(imgNode[j]);
              }
            }
          }

          //
          var loader = function(){
              var i = 0,
                ObjPoint, 
                elem, 
                lazySrc,
                top = container.scrollTop,
                height = container.clientHeight;
              
              for( ; i < imgArray.length; i++ ){    
                  elem = imgArray[i];

                  if(elem.className == dataName){continue;};

                  lazySrc = elem.getAttribute(opts.original);

                  if( !lazySrc || elem.src === lazySrc ){
                      continue;
                  }

                  //当前图片的绝对位置
                  ObjPoint = getObjPoint(elem).y; 
                  if(ObjPoint >= top && ObjPoint <= (top+height)){
                      // 加载图片
                      elem.src = lazySrc;
                      elem.className = dataName;
                      opts.callback && opts.callback();
                  }
              }        
          };
          // 绑定事件
          on(window, opts.event, loader);
          on(window, 'resize', loader);
          // 初始化
          loader();
          return this;
      }    
  }(this));
