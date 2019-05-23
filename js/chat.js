
// set cookie方法
function setCookie(name,value,Days = 30){
  var exp = new Date(); 
  exp.setTime(exp.getTime() + Days*24*60*60*1000); 
  document.cookie = name + "="+ escape (value) + "; path =/ ;expires=" + exp.toGMTString(); 
}
// get cookie 方法
function getCookie(c_name) {
  if(document.cookie.length > 0) {
    c_start = document.cookie.indexOf(c_name + "=");//获取字符串的起点
    if(c_start != -1) {
      c_start = c_start + c_name.length + 1;//获取值的起点
      c_end = document.cookie.indexOf(";", c_start);//获取结尾处
      if(c_end == -1) c_end = document.cookie.length;//如果是最后一个，结尾就是cookie字符串的结尾
      return decodeURI(document.cookie.substring(c_start, c_end));//截取字符串返回
    }
  }
  return "";
}
// 删除cookie 方法
function delCookie(name){
  var exp = new Date(); 
  exp.setTime(exp.getTime() - 1); 
  var cval=getCookie(name); 
  if(cval!=null) 
    document.cookie= name + "="+cval+";expires="+exp.toGMTString(); 
}


// 写入 用户浏览记录 localstorage
writeBrowserIn();
function writeBrowserIn(){
  var title = document.title;
  var href = window.location.href;
  // let myDate = new Date();
  // let time = myDate.getTime(); // 获取时间戳
  let tmp = new Array(); // 定义临时数组待命
  if(localStorage.browserIns){
    tmp = JSON.parse(localStorage.browserIns); // 获取并赋值给临时数组
    for(var i=0; i<tmp.length; i++){
      if(tmp[i].href == href){
        return;
      }
    }
  }
  if(tmp.length >= 10){
    tmp.shift();
  }
  tmp.push({"documentTitle" : title , "href" : href});
  // console.log(tmp);
  let obj = JSON.stringify(tmp);
  localStorage.setItem("browserIns",obj);
}

/////////////////////////// 在线客服

$(window).ready(function(){
  // 在页面添加客服窗口
  var chatHtmlData = "<div id='chat-tab-box' onclick=''><div id='chat-tab'><div class='chat-search'><input type='text' name='' id='chat-search-input' placeholder='your order number'><button id='order-search-btn'><img src='/qurpoe/public/static/img/search_bord.svg' alt='' /></button></div> <div class='chat-ti1'>OURPOE CUSTOMER SERVICE </div><div class='d-flex'><div class='chat-left'><div id='chat-content' class='chat-content chat-scroll'></div><div class='chat-input' ><div class='chat-lib'></div><textarea name='' id='chat-textarea' placeholder='Please enter your question'></textarea><div class='text-right'><button id='chat-close' class='chat-close' type='button' name='colse'>Close</button><button id='chat-send' class='chat-send' type='button' name='send'>Send</button></div></div></div><div class='chat-right chat-scroll'><div class='d-flex'></div><table class='chat-order-tab'></table><div class='orderstatus'></div><a class='chat-vip' href='/qurpoe/vip' target='_blank'></a></div></div></div></div>";
  $("body").append(chatHtmlData);
  
  $(".chat-vip").on("click",function(event){
    event.stopPropagation();
  })

  //获取操作系统 最新版本Windows 10
  //获取浏览器
  var BrowserIns = getOsInfo().version + "----" + getBrowerInfo().client.type + getBrowerInfo().client.version;
  // console.log(BrowserIns);

  // 搜索订单信息
  $("#order-search-btn").click(function(){
    // $(".chat-order-tab").html("");
    // $(".orderstatus").remove();
    $(".chat-vip").hide();
    orderNum = $("#chat-search-input").val();
    $.ajax({
      type : 'get',
      data : {"number" : orderNum},
      url : 'http://192.168.1.15/shop/admin/login/ajaxSelectOrder',
      success : function(result){
        // console.log(result);
        // 判断，输出
        let data = JSON.parse(result);
        console.log(data)
        if(result.status == 0){
          console.log("没有查找到该订单信息！");
        }
        else{
          let userInfoHtml = "";
          $.each(data.userinfo,function(key,val){
            userInfoHtml += "<tr><td>"+ key +"</td><td>"+ val +"</td></tr>";
          })
          // console.log(userInfoHtml);
          $(".chat-order-tab").html("<tr><td>game</td><td>"+ data.game +"</td></tr><tr><td>platform</td><td>"+ data.platform +"</td></tr><tr><td>service</td><td>"+ data.service +"</td></tr>"+ userInfoHtml);
          let orderStatusHtml = "";
          for(let i=0; i<data.news.length; i++){
            orderStatusHtml += "<li><p class='chat-order-time'>"+ data.news[i].time +"</p><p>"+ data.news[i].content +"</p></li>";
          }
          $(".orderstatus").html("<h5>ORDER STATUS<span></span></h5><ul>"+ orderStatusHtml +"</ul>");
        }
        // console.log("成功",result);
      }
    })
  })

  // 定位位置
  var chatHeight = ($(window).height() - $("#chat-tab").height()) / 2;
  var chatWidth = ($(window).width() - $("#chat-tab").width()) / 2;
  $("#chat-tab").css({"top": chatHeight , "left" : chatWidth});

  // 改变窗口大小时，重新定位
  $(window).resize(function(){
    var chatHeight = ($(window).height() - $("#chat-tab").height()) / 2;
    var chatWidth = ($(window).width() - $("#chat-tab").width()) / 2;
    $("#chat-tab").css({"top": chatHeight , "left" : chatWidth});
  })

  // 点击显示、隐藏
  $("#chat-btn").click(function(){
    $('#chat-tab-box').fadeToggle();
    setCookie("firstMsg","1",1);
    goBottom();
  })
  $(document).on('click','#chat-tab-box',function(){
    $("#chat-tab-box").fadeOut();
  });
  // 阻止冒泡
  $(document).on('click','#chat-tab',function(e){
      if (e && e.preventDefault){
          e.preventDefault();
      }else{
          //IE中阻止函数器默认动作的方式
          window.event.returnValue = false;
      }
      return false;
  });

  // 关闭按钮
  $("#chat-close").click(function(){
    $('#chat-tab-box').fadeOut();
  })

  // 可拖动
  $(".chat-ti1").bind("mousedown", function(oldeEent) {
    var olds = $("#chat-tab").position(); // 获取定位信息
    var oldMouseX = oldeEent.clientX; // 点下时鼠标的x坐标
    var oldMouseY = oldeEent.clientY; // 点下时鼠标的y位置
    $(document).bind("mousemove", function(event) {
      // x，y : 鼠标拖动的距离
      var x = oldMouseX - event.clientX;
      var y = oldMouseY - event.clientY;
      // 计算改变后的 定位
      var newX = olds.left - x;
      var newY = olds.top - y;
      // 计算 定位 临界值
      var maxW = $(window).width() - $("#chat-tab").width();
      var maxH = $(window).height() - $("#chat-tab").height();
      // 排除越界
      if (newX < 0) {
        newX = 0
      }
      if (newY < 0) {
        newY = 0
      }
      if(newX > maxW){
        newX = maxW
      }
      if(newY > maxH){
        newY = maxH
      }
        // div跟随鼠标拖动 （赋值定位）
      $("#chat-tab").css({"left" : newX , "top" : newY})
      // 鼠标松开以结束
      $(document).bind("mouseup", function(event) {
        $(document).unbind("mousemove")
      })
    })
  })

  // faq
  // $(".chat-faq li").click(function(){
  //   var faq;
  //   faq = $(this).text();
  //   $(".chat-input textarea").val(faq);
  // })

  // 初始化 用户信息
  var m_username = "Me"; // 默认name
  var m_headimg = ""; // 默认头像

  var chatUserId = getCookie("m_id");
  var chatUserName = getCookie("m_username");
  var chatUseremail = getCookie("m_email");
  var chatUserpwd = getCookie("m_pwd");
  var youkeId = getCookie("youke")

  var kefuImg = "http://192.168.1.15/qurpoe/public/static/img/favicon.ico";
  
  // 设定用户头像
  try {
    m_headimg = document.getElementById("headImg").src;
  }
  catch (error){
    m_headimg = "http://192.168.1.15/qurpoe/public/static/img/head_img/default.jpg"; // 默认头像
  }

  var fromid = "1111"; // 

  // 区分 会员、游客
  if(chatUserId.length > 0 && chatUseremail.length > 0 && chatUserpwd.length > 0){
    fromid = chatUserId; // 会员使用 会员id
    m_username = chatUserName
  }
  else{
    console.log("未登录,使用游客身份继续!")
      fromid = youkeId; // 游客使用 游客id
  }

  /************************* 创建并连接websocket服务器 ********/
  // 客户端 初始化
  var toid = 1;
  var wsUrl = "ws://162.253.155.115:8282";
  var ws = new WebSocket(wsUrl);
  
  ws.onerror = function(evt) {
    console.log("CONNECTED ERROR !");
  }

  //  ws.onmessage 被动接收信息
  ws.onmessage = function (ev) {
    // console.log(ev);
    if(ev.data){
      //var message = eval("("+ev.data+")");
      var message = JSON.parse(ev.data);
      // console.log(message);
      switch (message.type){
        case "init":
          var bild = '{"type":"bild" , "fromid":"'+fromid+'" , "email":"'+ chatUseremail +'" , "pwd": "'+ chatUserpwd +'" , "ykid":"' + youkeId + '"}';
          ws.send(bild);
          return;
        case "text":
          if(toid == message.fromid){
            $('#chat-content').append("<div class='chat-li chat-li-server d-flex'><div><img src='"+ kefuImg +"' alt=''></div><div class='chat-li-piv'><div class='chat-uname'>Customer service Staff</div><p>"+ message.data +"</p></div></div>");
            goBottom();
            writeInLocals(fromid,message.data,"server"); //传值
          }
          else if(fromid == message.fromid){
            appendMsg(message.data);
            goBottom();
          }
          return;
        case "out":
          // 身份验证失败！(搞事)!
          fromid = youkeId;
          m_username = "Me";
          console.log("out");
          // console.log(message.kefu_name);
          toid = setCookieKefu(message.kefu_name);
          firstMsg(message.data);
          return;
        case "ok":
          console.log("ok");
          toid = setCookieKefu(message.kefu_name);
          firstMsg(message.data);
          return;
      }
    }
  }
    self.setInterval(function () {
        var message = '{"data":"ping","type":"heartbeat","fromid":"'+fromid+'","toid":"'+toid+'","iswho":"0"}';
        ws.send(message);

    },30000);
  // sendMsg 主动发送信息
  function sendMsg(){
    var msg = $('#chat-textarea').val();
    if(msg.length > 0){ // 如果内容不为空 就发送
      
      var message = '{"data":"'+msg+'", "type":"say", "fromid":"'+fromid+'", "toid":"'+toid+'", "browserins":"'+BrowserIns+'", "history":'+ localStorage.browserIns +'}';
      ws.send(message);
      appendMsg(msg);
      $('#chat-textarea').val('');
      writeInLocals(fromid,msg,"local"); //传值
      goBottom();
      // console.log(toid,fromid);
    }
  }

  // 第一次发送消息提示
  function firstMsg(data){
    // console.log(getCookie("firstMsg").length);
    if(getCookie("firstMsg").length == 0){
      $('#chat-content').append("<div class='chat-li chat-li-server d-flex'><div><img src='"+ kefuImg +"' alt=''></div><div class='chat-li-piv'><div class='chat-uname'>system</div><p>"+ data +"</p></div></div>");
    }
  }

  // 消息写入到页面(自己发送的)
  function appendMsg(msg){
    $('#chat-content').append(
      "<div class='chat-li chat-li-user d-flex'><div class='chat-li-piv'><div class='chat-uname'>"+ m_username +"</div><p>"+ msg +"</p></div><div><img src='"+ m_headimg +"' alt=''></div></div>");
  }

  // 消息写入到页面(对方发送的)
  function appendCustomMsg(msg){
    $('#chat-content').append("<div class='chat-li chat-li-server d-flex'><div><img src='"+ kefuImg +"' alt=''></div><div class='chat-li-piv'><div class='chat-uname'>system</div><p>"+ msg +"</p></div></div>");
  }
  
  // 分配在线的客服
  function setCookieKefu(arr){
    // console.log(arr);
    let kefuKey ="";
    let kefuId = getCookie("kefuId");
    // alert(kefuId);
    let arr2 = []; // 在线客服 数组
    for (var i in arr) {
        arr2.push(arr[i]); //属性
    }
    if(kefuId.length >0){
      kefuKey = arr[kefuId];
      if(!kefuKey){
        kefuKey = arr2[getRandomNumberByRange(0 , arr2.length - 1)];
        setCookie("kefuId",kefuKey);
      }
    }
    else{
      kefuKey = arr2[getRandomNumberByRange(0 , arr2.length - 1)];
      setCookie("kefuId",kefuKey);
    }
    return kefuKey;
  }

  // 将消息写入 localstorage
  function writeInLocals(localId,content,server){
    let myDate = new Date();
    let time = myDate.getTime(); // 获取时间戳
    let tmp = new Array(); // 定义临时数组待命
    if(localStorage.chatHistory){
      tmp = JSON.parse(localStorage.chatHistory); // 获取并赋值给临时数组
    }
    if(tmp.length > 40){
      tmp.shift();
    }
    tmp.push({"time" : time, "localId" : localId , "content" : content , "server" : server});
    // console.log(tmp);
    let obj = JSON.stringify(tmp);
    localStorage.setItem("chatHistory",obj);
  }

  // 加载已存localstorage
  loadLocals();
  function loadLocals(){
    if(localStorage.chatHistory){
      let object = JSON.parse(localStorage.chatHistory);
      // console.log(object);
      for (const key in object) {
        let data = object[key];
        // 是当前账号的消息记录
        if(data.localId == fromid){
          if(data.server == "local"){
            // 是自己发送的
            appendMsg(data.content);
          }
          else{
            // 是客服发来的
            appendCustomMsg(data.content);
          }
        }
      }
    }
    goBottom();
  }

  // 生成随机数
  function getRandomNumberByRange(start, end) {
    return Math.round(Math.random() * (end - start) + start)
  }

  // 操作滚动条
  function goBottom(){
    $("#chat-content").scrollTop($("#chat-content")[0].scrollHeight)
    console.log("消息已更新:");
    return false;
  }

  // 点击发送按钮
  $('#chat-send').click(function () {
    sendMsg();
  });

  // 按下回车
  $(document).keydown(function(e){
    if(e.keyCode == 13){
      sendMsg();
      return false;
    }
  })
})



//****** */ 获取用户浏览器 操作系统
function getOsInfo() {
  var userAgent = navigator.userAgent.toLowerCase();
  var name = 'Unknown';
  var version = "Unknown";
  if(userAgent.indexOf("win") > -1) {
      name = "Windows";
      if(userAgent.indexOf("windows nt 5.0") > -1) {
          version = "Windows 2000";
      } else if(userAgent.indexOf("windows nt 5.1") > -1 || userAgent.indexOf("windows nt 5.2") > -1) {
          version = "Windows XP";
      } else if(userAgent.indexOf("windows nt 6.0") > -1) {
          version = "Windows Vista";
      } else if(userAgent.indexOf("windows nt 6.1") > -1 || userAgent.indexOf("windows 7") > -1) {
          version = "Windows 7";
      } else if(userAgent.indexOf("windows nt 6.2") > -1 || userAgent.indexOf("windows 8") > -1) {
          version = "Windows 8";
      } else if(userAgent.indexOf("windows nt 6.3") > -1) {
          version = "Windows 8.1";
      } else if(userAgent.indexOf("windows nt 6.2") > -1 || userAgent.indexOf("windows nt 10.0") > -1) {
          version = "Windows 10";
      } else {
          version = "Unknown";
      }
  } else if(userAgent.indexOf("iphone") > -1) {
      name = "Iphone";
  } else if(userAgent.indexOf("mac") > -1) {
      name = "Mac";
  } else if(userAgent.indexOf("x11") > -1 || userAgent.indexOf("unix") > -1 || userAgent.indexOf("sunname") > -1 || userAgent.indexOf("bsd") > -1) {
      name = "Unix";
  } else if(userAgent.indexOf("linux") > -1) {
      if(userAgent.indexOf("android") > -1) {
          name = "Android"
      } else {
          name = "Linux";
      }

  } else {
      name = "Unknown";
  }
  var os = new Object();
  os.name =  name;
  os.version = version;
      // document.write(os.version) `
  return os;

}
function getBrowerInfo(){
  var Browser = Browser || (function(window) {
      var document = window.document,
          navigator = window.navigator,
          agent = navigator.userAgent.toLowerCase(),
          //IE8+支持.返回浏览器渲染当前文档所用的模式
          //IE6,IE7:undefined.IE8:8(兼容模式返回7).IE9:9(兼容模式返回7||8)
          //IE10:10(兼容模式7||8||9)
          IEMode = document.documentMode,
          //chorme
          chrome = window.chrome || false,
          System = {
              //user-agent
              agent: agent,
              //是否为IE
              isIE: /trident/.test(agent),
              //Gecko内核
              isGecko: agent.indexOf("gecko") > 0 && agent.indexOf("like gecko") < 0,
              //webkit内核
              isWebkit: agent.indexOf("webkit") > 0,
              //是否为标准模式
              isStrict: document.compatMode === "CSS1Compat",
              //是否支持subtitle
              supportSubTitle: function() {
                  return "track" in document.createElement("track");
              },
              //是否支持scoped
              supportScope: function() {
                  return "scoped" in document.createElement("style");
              },

              //获取IE的版本号
              ieVersion: function() {
                  var rMsie  = /(msie\s|trident.*rv:)([\w.]+)/;
                  var ma = window.navigator.userAgent.toLowerCase()
                  var  match  = rMsie.exec(ma);
                  try {
                      return match[2];
                  } catch (e) {
                      //									console.log("error");
                      return IEMode;
                  }
              },
              //Opera版本号
              operaVersion: function() {
                  try {
                      if (window.opera) {
                          return agent.match(/opera.([\d.]+)/)[1];
                      } else if (agent.indexOf("opr") > 0) {
                          return agent.match(/opr\/([\d.]+)/)[1];
                      }
                  } catch (e) {
                      //									console.log("error");
                      return 0;
                  }
              }
          };

      try {
          //浏览器类型(IE、Opera、Chrome、Safari、Firefox)
          System.type = System.isIE ? "IE" :
              window.opera || (agent.indexOf("opr") > 0) ? "Opera" :
                  (agent.indexOf("chrome") > 0) ? "Chrome" :
                      //safari也提供了专门的判定方式
                      window.openDatabase ? "Safari" :
                          (agent.indexOf("firefox") > 0) ? "Firefox" :
                              'unknow';

          //版本号
          System.version = (System.type === "IE") ? System.ieVersion() :
              (System.type === "Firefox") ? agent.match(/firefox\/([\d.]+)/)[1] :
                  (System.type === "Chrome") ? agent.match(/chrome\/([\d.]+)/)[1] :
                      (System.type === "Opera") ? System.operaVersion() :
                          (System.type === "Safari") ? agent.match(/version\/([\d.]+)/)[1] :
                              "0";

          //浏览器外壳
          System.shell = function() {

              if (agent.indexOf("edge") > 0) {
                  System.version = agent.match(/edge\/([\d.]+)/)[1] || System.version;
                  return "edge浏览器";
              }
              //遨游浏览器
              if (agent.indexOf("maxthon") > 0) {
                  System.version = agent.match(/maxthon\/([\d.]+)/)[1] || System.version;
                  return "傲游浏览器";
              }
              //QQ浏览器
              if (agent.indexOf("qqbrowser") > 0) {
                  System.version = agent.match(/qqbrowser\/([\d.]+)/)[1] || System.version;
                  return "QQ浏览器";
              }

              //搜狗浏览器
              if (agent.indexOf("se 2.x") > 0) {
                  return '搜狗浏览器';
              }

              //Chrome:也可以使用window.chrome && window.chrome.webstore判断
              if (chrome && System.type !== "Opera") {
                  var external = window.external,
                      clientInfo = window.clientInformation,
                      //客户端语言:zh-cn,zh.360下面会返回undefined
                      clientLanguage = clientInfo.languages;

                  //猎豹浏览器:或者agent.indexOf("lbbrowser")>0
                  if (external && 'LiebaoGetVersion' in external) {
                      return '猎豹浏览器';
                  }
                  //百度浏览器
                  if (agent.indexOf("bidubrowser") > 0) {
                      System.version = agent.match(/bidubrowser\/([\d.]+)/)[1] ||
                          agent.match(/chrome\/([\d.]+)/)[1];
                      return "百度浏览器";
                  }
                  //360极速浏览器和360安全浏览器
                  if (System.supportSubTitle() && typeof clientLanguage === "undefined") {
                      //object.key()返回一个数组.包含可枚举属性和方法名称
                      var storeKeyLen = Object.keys(chrome.webstore).length,
                          v8Locale = "v8Locale" in window;
                      return storeKeyLen > 1 ? '360极速浏览器' : '360安全浏览器';
                  }
                  return "Chrome";
              }
              return System.type;
          };

          //浏览器名称(如果是壳浏览器,则返回壳名称)
          System.name = System.shell();
          //对版本号进行过滤过处理
          //	System.version = System.versionFilter(System.version);

      } catch (e) {
          //						console.log(e.message);
      }
      return {
          client: System
      };

  })(window);
  if (Browser.client.name == undefined || Browser.client.name=="") {
      Browser.client.name = "Unknown";
      Browser.client.version = "Unknown";
  }else if(Browser.client.version == undefined){
      Browser.client.version = "Unknown";
  }
  // document.write(Browser.client.name + " " + Browser.client.version);
  return Browser ;
}