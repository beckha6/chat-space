$(function(){
  function buildHTML(message){
    var image = (message.image.url) ?  `<img class= "lower-message__image" src= ${ message.image.url }>` : "";
    var content = message.content ? `${message.content}`: "";
    var html = `<div class="main__messages__message" data-message-id = "${message.id}">
                  <div class="main__messages__message__upper-info" >
                      <div class="main__messages__message__upper-info--talker">
                          ${ message.user_name }
                      </div>
                      <div class="main__messages__message__upper-info--data">
                          ${ message.created_at }
                      </div>
                  </div>
                  <div class="main__messages__message__text">
                    <div class="lower-message_content">
                    ${ content }
                    </div>
                    ${ image }
               </div>`
        return html; 
    }
  
  $('#new_message').on('submit',function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
      })
      .done(function(data){
        var html = buildHTML(data);
        $('.main__messages').append(html);
        $("#new_message")[0].reset();
        $('.main__messages').animate({ scrollTop: $('.main__messages')[0].scrollHeight})
      })
      .fail(function(){
        alert('error')
      })
      .always(function(){
        $('.main__form__new__input-box__form__submit').prop('disabled',false);
      })
  })
  var reloadMessages = function() {
    if (window.location.href.match(/\/groups\/\d+\/messages/)){
    var last_message_id = $(".main__messages__message:last").data("message-id");
    $.ajax({
      url: 'api/messages',
      type: 'get',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages) {
      var insertHTML = '';
      messages.forEach(function (message){
        insertHTML = buildHTML(message);
        $('.main__messages').append(insertHTML);
      })
      })
    .fail(function() {
      alert('自動更新に失敗しました');
      });
    }
  };
  setInterval(reloadMessages, 5000);
});
