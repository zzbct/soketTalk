
window.onload = function() {
  var chart = new Chart()
  chart.init()
}

var Chart = function() {
   this.socket = null
}

Chart.prototype = {
   init: function() {
      var _this = this
      var loginMap = document.getElementsByClassName('loginwrap')[0]
      var chartMap = document.getElementsByClassName('chartwrap')[0]
      var login = document.getElementById('loginBtn')
      var send = document.getElementById('sendBtn')
      //建立到服务器的连接
      _this.socket = io.connect()
      chartMap.style.display = 'none'

      login.onclick = function() {
         var nickname = document.getElementById('nickname').value
         //检查昵称是否为空
         if(nickname.trim().length > 0) {

            document.getElementsByTagName('h4')[0].textContent = '正在提交英雄帖......'
              //发起login事件
             _this.socket.emit('login',nickname)
         }
        else {
           alert('大侠,请留名！！')
        }
      }

      send.onclick = function() {
         var msg = document.getElementById('inputArea').value
         if(msg.trim().length > 0) {
            _this.socket.emit('postMsg',msg)
         }
      }

      _this.socket.on('nickExisted', function() {
           document.getElementsByTagName('h4')[0].textContent = '名称被占用'; //显示昵称被占用的提示
       })
       _this.socket.on('loginSuccess', function() {
            loginMap.style.display = 'none'
            chartMap.style.display = 'block'
       })
       _this.socket.on('system',function(nickname,usersCount,type) {
           var msg = nickname + '  ' + (type === 'login'? '入池' : '出池')
           _this.printMsg('system',msg,'#FE4E4E')
           document.getElementById('userCount').textContent = '{' + usersCount + 'online' + '}'
       })
       _this.socket.on('getMsg',function(obj,msg) {
         _this.printMsg(obj,msg)
       })
   },
   printMsg: function(obj,msg,color) {
      var p = document.createElement('p')
      var date = new Date().toTimeString().substr(0,8)
      p.innerHTML = obj + '(' + date + '):  ' + msg
      p.style.color = color || '#24284B'
      document.getElementById('msgPool').appendChild(p)
   }
}