var GlobalUtils = {
	uploadFile: function(formId, suc, objId) {
        var loadId = layer.load();
        var allSmallerThan200kb = true;
        var allLargerThan50kb = true;
        var filesObj = $(objId)[0].files;
        for (var attr in filesObj) {
            var size = filesObj[attr].size;
            if (size > 205000) {
                allSmallerThan200kb = false;
            }
            if (size < 52000) {
                allLargerThan50kb = false;
            }
        }
        if (!allSmallerThan200kb || !allLargerThan50kb) {
            layer.close(loadId);
            layer.alert("上传的图片中，有图片大于200KB或小于50KB，请修改后重新上传。");
            // return;
        }
        //上传
        this.uploadFileBCE(formId, suc, loadId,objId);
    },
    uploadFileBCE: function(formId, suc, loadId,objId) {
        if (formId) {
	       var formData = new FormData(document.querySelector(formId));
            console.log(formData.get('file'))

        }else{
            var formData = new FormData();
            formData.append('file',$(objId)[0].files[0])
            console.log(formData.get('file'))
        }
	    $.ajax({
	        url: API.UPLOAD_FILE_BCE,
	        type: 'POST',
	        data: formData,
	        async: true,
	        cache: false,
	        contentType: false,
	        processData: false,
	        success: function(res) {
	            suc(res, loadId);
	        },
	        error: function(err) {
	            console.error(err, "与服务器通信发生错误。");
	            layer.alert("与服务器通信发生错误。");
	        }
	    });
	}
}