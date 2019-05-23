
// 小屏停止滚动
if($(window).width()<992){
    $('.carousel').attr('data-ride','');
    // display = "main";
}
$(window).resize(function () {
    if($(window).width()<992){
        $('.carousel').attr('data-ride','');
    }
    else{
        $('.carousel').attr('data-ride','carousel');        
    }
});

// 搜索
$('.nav-search').click(function(){
    $(this).find('input').fadeIn("fast");
})

// 首页 选择商品
$(".scroll-cont-imgs .goodimg-div").click(function(){
    var index = $(".scroll-cont-imgs .goodimg-div").index(this);
    $(".scroll-cont-imgs .goodimg-div").removeClass("goodimg-click");
    $(this).addClass("goodimg-click");

    $(".cont-ins-s").hide();
    $($(".cont-ins-s")[index]).show();

    $(".cont-btns-s").hide();
    $($(".cont-btns-s")[index]).show();
})

// currency 通货 选择商品
$(".currency-box .cur-block").click(function(){
    var index = $(".currency-box .cur-block").index(this);
    $(".currency-box .cur-block").removeClass("cur-block-click");
    $(this).addClass("cur-block-click");

    // $(".cont-ins-s").hide();
    // $($(".cont-ins-s")[index]).show();

    // $(".cont-btns-s").hide();
    // $($(".cont-btns-s")[index]).show();
})

// build 翻页
$(".build-page li").click(function(){
    var index = $(".build-page li").index(this);
    $(".build-page li").removeClass("build-page-click");
    $(this).addClass("build-page-click");

    $(".build-s").hide();
    $($(".build-s")[index]).show();

    // $(".cont-btns-s").hide();
    // $($(".cont-btns-s")[index]).show();
})

// 发送评论
$("#comms").click(function(){
    $(this).hide();
    $(".on-comm").fadeIn();
})
$(".close-btn2").click(function(){
    $(this).parents(".on-comm").hide();
    $("#comms").fadeIn();
})

// vip
$(".vip-block2 ul li span").hover(function(){
    $(this).next().slideToggle();
})

// cart 购物车
// var a = $(".cart-li").length * 278.7;
// console.log(a);
$(".carts-scoll").width($(".cart-li").length * 278.7 +1);
$(".close-btn").click(function(){
    $(this).parents(".cart-li").hide('fast');
    var num = parseInt($("#cartNum").text());
    num--;
    $("#cartNum").text(num);
})

// tap-up 点击修改
$("#tap-up").click(function(){
    $('.plus').css("display","inline-block");
    $('.user-player input, .user-setting input').removeAttr("disabled");
    $('.user-player input, .user-setting input').addClass('input-border');
})

// addName 添加角色名
$(document).on("click","#addName",function(){
    $(this).before("<input class='input-border' type='text' value='' >")
})
// $('#addName').click(function(){
//     $(this).before("<input class='input-border' type='text' value='' >")
// })

// addTeam 添加服务器和角色
$('#addTeam').click(function(){
    $('.add-new').before("<div class='update-items'><p>Play role name: <input class='input-border' type='text' value='' >"
    + "<button id='addName' class='plus' type='button' style='display: inline-block;'></button></p><p>Server: <input class='input-border' type='text' value='' ></p></div>");
})

// view order
$(".user-order-scroll").width($(".user-order-li").length * 228 +925);
$(".view-order").click(function(){
    if($(this).parents(".user-order-li").find(".user-order-content").css("display")=="block"){
        $(this).parents(".user-order-li").width("228px").find(".user-order-content").hide();
        console.log("isShow")
    }else{
        $(".user-order-content").hide();
        $(".user-order-li").width("228px");
        // console.log($(this).parents(".user-order-li"));        
        // $(".user-order-box").scrollLeft(100);
        var width = $(this).parents(".user-order-box").width();
        $(this).parents(".user-order-li").width(width).find(".user-order-content").show();
    }
})