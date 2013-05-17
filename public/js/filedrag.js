/* global $*/
/*
filedrag.js - HTML5 File Drag & Drop demonstration
Featured on SitePoint.com
Developed by Craig Buckler (@craigbuckler) of OptimalWorks.net
*/
(function() {

  // getElementById
  function $id(id) {
    return document.getElementById(id);
  }

   var timer;
  // output information
  function output(msg) {
    var m = $id("messages");
    m.innerHTML = msg + m.innerHTML;
    $(m).removeClass('hide');
    if(timer){
      clearTimeout(timer);
    }
    timer = setTimeout(function() {
      $(m).addClass('hide');
    }, 3000);
  }


  // file drag hover
  function fileDragHover(e) {
    e.stopPropagation();
    e.preventDefault();
  }


  // file selection
  function FileSelectHandler(e) {
    $('#dropbox').removeClass('dragover');
    // cancel event and hover styling
    fileDragHover(e);

    // fetch FileList object
    var files = e.target.files || e.dataTransfer.files;
    for (var i = 0, f; i < files.length ; i++) {
      f = files[i];
      //check file size
      if(f.size > 2*1024*1024){
        return output( "文件不得大于2Mb: " + f.name);
      }
      if(!/^image/.test(f.type)){
        return output("文件不是合法图片文件: " + f.name);
      }
      //parseFile(f);
      uploadFile(f);
    }
  }


  // output file information
  function parseFile(file) {
    var reader;
    // display an image
    if (file.type.indexOf("image") === 0) {
      reader = new FileReader();
      reader.onload = function(e) {
        output(
          "<p><strong>" + file.name + ":</strong><br />" +
          '<img src="' + e.target.result + '" /></p>'
        );
      }
      reader.readAsDataURL(file);
    }

    // display text
    if (file.type.indexOf("text") === 0) {
      reader = new FileReader();
      reader.onload = function(e) {
        output(
          "<p><strong>" + file.name + ":</strong></p><pre>" +
          e.target.result.replace(/</g, "&lt;").replace(/>/g, "&gt;") +
          "</pre>"
        );
      }
      reader.readAsText(file);
    }

  }


  // upload JPEG files
  function uploadFile(file) {
    var xhr = new XMLHttpRequest();
    if (xhr.upload && /^image/.test(file.type) ) {

      // create progress bar
      var o = $id("progress");
      var progress = o.appendChild(document.createElement("p"));
      progress.innerHTML = "正在上传： " + file.name


      // progress bar
      xhr.upload.addEventListener("progress", function(e) {
        var pc = parseInt(100 - (e.loaded / e.total * 100), 10);
        progress.style.backgroundPosition = pc + "% 0";
      }, false);

      // file received/failed
      xhr.onreadystatechange = function(e) {
        if (xhr.readyState === 4) {
          var res = JSON.parse(xhr.responseText);
          progress.className = (xhr.status === 200 ? "success" : "failure");
          //$(progress).remove();
          if(xhr.status === 200 && res.success === true){
            $(progress).addClass("success").html("已上传：" + file.name);
            addText(file.name, res.filepath);
          }else{
            $(progress).addClass("failure").html("上传失败：" + file.name);
          }
        }
      };

      // start upload
      var fd = new FormData();
      fd.append('uploadingFile', file);
      fd.append('date', (new Date()).toString());
      xhr.open("POST", $id("upload").action);
      xhr.send(fd);
    }

  }

  function addText(filename, filepath){
    var textarea = $('#comment textarea');
    var append = '![' + filename + '](' + filepath + ')';
    var val  = textarea.val();
    textarea.val(val + append);
  }
  // initialize
  function init() {

    var fileselect = $id("fileselect"),
      filedrag = $id("dropbox");

    // file select
    fileselect.addEventListener("change", FileSelectHandler, false);

    // is XHR2 available?
    var xhr = new XMLHttpRequest();
    if (xhr.upload) {

      // file drop
      filedrag.addEventListener("dragover", fileDragHover, false);
      filedrag.addEventListener("dragenter", function(e) {
          fileDragHover(e);
          $(filedrag).addClass('dragover');
      }, false);
      filedrag.addEventListener("dragleave", function(e) {
          fileDragHover(e);
          $(filedrag).removeClass('dragover');
      }, false);
      filedrag.addEventListener("drop", FileSelectHandler, false);

    }

    var uploadlink = $id("fileupload");
    uploadlink.addEventListener("click", function (e) {
      if(fileselect){
        fileselect.click();
      }
      e.preventDefault();
    }, false)

  }

  // call initialization file
  if (window.File && window.FileList && window.FileReader) {
    init();
  }


})();
