var appList = {
    pageIndex: 0,
    pageSize: 20,
    keyword: '',
    template: `
        <div class="span2 m-drink-item" data-id="{{data-id}}">
            <div class="thumbnail">
              <img data-src="holder.js/300x200" alt="200x200" src="{{img-src}}" style="height: 200px;">
              <div class="caption">
                <h4>{{data-name}}</h4>
                <p>{{data-shortname}}</p>
                <p><a href="{{data-edit}}" class="btn blue">编辑</a> <a href="#" class="btn red btn-delete">删除</a></p>
              </div>
            </div>
        </div>
    `,
    init: function() {
        this.bindListener()
        this.requestData()
    },

    generateItem: function(data) {
        var html = ''
        for (var i = 0; i < data.length; i++) {
            var item = data[i]
            if ((i+1) % 6 == 1) {
                html += '<div class="row-fluid">'
            }
            html += this.template.replace(/{{img-src}}/g,item.imgPath)
                                .replace(/{{data-name}}/g,item.name)
                                .replace(/{{data-edit}}/g,'/drink/edit/'+item.id)
                                .replace(/{{data-id}}/g,item.id)
                                .replace(/{{data-shortname}}/g,item.shortName);
            if ((i+1) % 6 == 0) {
                html += '</div>'
            }
        }
        return html
    },

    requestData: function() {
        $.ajax({
            url: prefix+API.DRINK_LIST,
            data: this.createRequestParams(),
            dataType: 'json',
            type: 'POST',
            success: this.requestSuccess.bind(this),
            error: this.requestFail
        })
    },

    requestSuccess: function(res) {
        if (res.status === 200) {
            $('#m-drink-list').html(this.generateItem(res.data))
        }else{
            layer.alert(res.message)
        }
    },

    requestFail: function(e) {
        layer.alert(e)
    },

    createRequestParams: function() {
        return {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            keyword: this.keyword
        }
    },

    bindListener: function() {
        var self = this; 
        $('.pagination a').click(function() {
            if ($(this).parent().hasClass('disabled')) {return;}
            var text = $(this).text().trim();
            if (text === '上一页') {
                self.pageIndex--
            }else if (text === '下一页') {
                self.pageIndex++
            }else{
                self.pageIndex = parseInt(text, 10)
            }
            self.requestData()
        });

        $('body').on('click','.m-drink-item .btn-delete',function(){
            self.deleteDrinkItem($(this).attr('data-id'))
        });
    },

    deleteDrinkItem: function(id) {
        $.ajax({
            url: prefix+API.DRINK_DELETE_ONE,
            data: {id:id},
            dataType: 'json',
            type: 'POST',
            success: function(res){
                layer.alert(res.message);
                if (res.status === 200) {
                    window.location.reload()
                }else{
                }
            },
            error: function() {

            }
        })
    }
}

$(function(){
    appList.init();
})