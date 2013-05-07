/*global jQuery,marked,Editor*/
(function($) {
var editor = new Editor();
var toolbar = editor.options.toolbar;
toolbar.forEach(function(v, i ,arr){
  if(v === 'preview'){
    arr[i] = {
      name:'preview', 
      action:function(){
        var res = marked(editor.codemirror.getValue());
        $('#preview .content').html(res);
        $('#preview').show();
      }
    }
  }
});
editor.render();
var preview = $('<div id="preview">').append('<div class="content markdown"></div>').append('<div class="close fui-cross-16"></div>');
$('.CodeMirror').append(preview);
preview.find('.close').click(function(){
    preview.hide();
});
$(document).on('keyup', function(e){
  if(e.keyCode === 27){
    preview.hide();
  }
});
})(jQuery)
