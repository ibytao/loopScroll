(function($){
var loopScroll = function(content, options){
    var $u = $('ul',content),
        $first = $u.find('li:first').clone(),
        $last = $u.find('li:last').clone(),
        $second = $u.find('li:eq(1)').clone();

    $u.append($first)
    $u.prepend($last)
    $u.append($second)

    var $l = $('li',$u).css('float','left');
    var params = {
        '$u'     : $u,
        '$l'     : $l,
        'len'    : $l.length,
        'loaded' : true,
        'i'      : 1,
        '$i'     : $(options.index, content)
    }
    this.options = $.extend({}, params, options);
    this.init()
}

loopScroll.prototype = {
    init : function(){
            var options = this.options, me = this;
            options.$l.find('img').load(function(){
                    if(options.loaded){
                    var w = options.w = options.$l.width();
                    options.$u.width( w * options.len ).css( 'left', -w );
                    options.$l.css('opacity',0.5).eq(1).css('opacity',1);
                    me.run();
                    options.loaded = false;
                    }
                    })
            this.bind()
        },

    run : function(){
            var options = this.options, me = this;
            options.cle && clearInterval(options.cle);
            options.cle = setInterval(function(){
                    options.i++
                    if( options.i >= options.len-1){
                    options.i = 1
                    options.$u.css('left',-options.w)
                    arguments.callee()
                    }else{
                    scrollImg.call( options )
                    }

                    },options.speed);
        },

    bind : function(){
            var options = this.options, me = this;
            if( options.mouseWheel ){
                options.$u.mouseover( function(){ clearInterval(options.cle) } )
                    .mouseout( function(){ me.run() } )
            }
            $(options.btnNext).click($.proxy( nextHandle, options ))
                $(options.btnPrev).click($.proxy( prevHandle, options ))
                //$(options.btnNext).mouseout( function(){ me.run() } )
                //$(options.btnPrev).mouseout( function(){ me.run() } )
        }
}

 var nextHandle = function(){
     clearInterval(this.cle) 
         this.$u.stop(true, false)
         if(this.i == (this.len-2)){
             this.i = 1;
             this.$u.css('left',-this.w);
         } 
     //console.log(new Date().getSeconds())
     this.i++;
     scrollImg.call( this )
         return false;
 }

 var prevHandle = function(){
     clearInterval(this.cle)
         this.$u.stop(true, false)

         if( this.i == 1 ){
             this.i = this.len-2;
             this.$u.css('left',-this.w*(this.i))
         }

     this.i--;
     scrollImg.call( this )
         return false;
 }

 var scrollImg = function(){
     this.$l.eq(this.i-1).animate({'opacity':0.5},500)
         this.$l.eq(this.i).animate({'opacity':1},500);
     this.$u.stop(true, true).animate( { 'left': -this.w*this.i }, 800,function(){

             });
     this.$i.find('a').eq(this.i-1).addClass( this.index_class )
         .siblings().removeClass( this.index_class );


     //this.i == this.len-1 && $('a:eq(0)',this.$i).addClass( this.index_class ).siblings().removeClass( this.index_class );
 }

 $.fn.loopScroll = function(option){
     var defaults = {
              btnNext     : ".next_btn",
              btnPrev     : ".pre_btn",
              index       : ".img_count",
              index_class : 'active',
              mouseWheel  : true,
              speed       : 4000
     }

     return this.each(function(){
             var $this    = $(this)
             ,data    = $this.data('loopScroll')
             ,options = $.extend({}, defaults, $this.data(), typeof option == 'object' && option)
             if (!data) $this.data('loopScroll', (data = new loopScroll(this, options)))
             })
 }

})(jQuery)
