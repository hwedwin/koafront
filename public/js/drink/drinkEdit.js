;
var DrinkEdit = {
    id: '',
    imgTemplate: `
            <div class="fileupload fileupload-item fileupload-exists" data-provides="fileupload"><input type="hidden" value="" name="">
                <div class="fileupload-new thumbnail" style="width: 200px; height: 150px;">
                   <img src="http://www.placehold.it/200x150/EFEFEF/AAAAAA&amp;text=no+image" alt="">
                </div>
                <div class="fileupload-preview fileupload-exists thumbnail" style="max-width: 200px; max-height: 150px; line-height: 20px;">
                <img src="{{img-src}}" style="max-height: 150px;">
                </div>
                <div>
                   <span class="btn btn-file"><span class="fileupload-new">Select image</span>
                   <span class="fileupload-exists">Change</span>
                   <input type="file" class="default"></span>
                   <a href="#" class="btn fileupload-exists" data-dismiss="fileupload">Remove</a>
                </div>
             </div>
    `,
    _addListener: function() {
        var self = this;
        $('#btnConfirm').click(function() {
            Drink.common.initDrinkInfo();
            self.commit();
        });
    },
    commit: function() {
        var drinkData = Drink.common.getDrinkDetail();
        drinkData.id = this.id
        console.log(drinkData)
        $.ajax({
            url: prefix + API.DRINK_UPDATE,
            type: 'POST',
            dataType: 'json',
            data: drinkData,
            success: function(res) {
                if (res.status === 200) {
                }else{
                }
                layer.alert(res.message);
            }
        })
    },
    init: function() {
        this.requestData();
        this._addListener();
    },
    requestData: function() {
        var self = this;
        var urls = window.location.href.split('/');
        self.id = urls[urls.length-1];
        $.ajax({
            url: prefix + API.DRINK_FIND_ONE,
            type: 'POST',
            dataType: 'json',
            data: {id: self.id},
            success: function(res) {
                if (res.status === 200) {
                    self.updateDrinkData(res.data);
                }else{
                    layer.alert(res.message);
                }
            }
        })
    },
    updateDrinkData: function(data) {
        //品牌
        $('#categorySelect option[value='+data.categoryId+']').attr('selected',true)
        $('#brandSelect option[value='+data.brandId+']').attr('selected',true)

        console.log(data)
        $('#goodsGroupTitleInput_edit').val(data.name) //名字
        $('#goodsGroupTitleInput_edit').val(data.shortName) //名字
        $('#goodsGroupOrginInput_edit').val(data.origin) //产地
        $('#goodsGroupLevelInput_edit').val(data.level) //等级
        $('#goodsGroupStandardInput_edit').val(data.standard) //规格
        $('#goodsGroupRecipeInput_edit').val(data.recipe) //原料
        $('#goodsGroupExpireInput_edit').val(data.expire) //保质期
        $('#goodsGroupTasteInput_edit').val(data.taste) //口味
        $('#goodsGroupStorageInput_edit').val(data.storage) //保存方式
        $('#goodsGroupDateInput_edit').val(data.pruduceDate) //生产日期
        $('#goodsGroupAlcoholicInput_edit').val(data.alcoholic) //酒精度
        $('#goodsGroupFactoryInput_edit').val(data.factory) //生产厂家
        $('#maxCountInput_edit').val(data.maxStorage) //库存
        $('#originCountInput_edit').val(data.validStorage)//可用库存
        $('#limitInput_edit').val(data.limitBuy) //限购
        $('#expressFeeInput_edit').val(data.expressFee)//邮费
        $('#originPriceInput_edit').val(data.originPrice) //吊牌价
        $('#retailPriceInput_edit').val(data.retailPrice)//原价
        $('#supplyPriceInput_edit').val(data.supplyPrice)//出货价
        $('#commissionInput_edit').val(data.commission)//佣金

        //是否上架
        $('#publishState input').attr('checked',false) 
        $('#publishState input').parent().removeClass('checked') 
        $('#publishState input[value='+data.saleState+']').attr('checked',true) 
        $('#publishState input[value='+data.saleState+']').parent().addClass('checked') 
        Drink.common.ckEditor.setData(data.detail)

        //设置图片
        this.generateImages(data.imgPaths)
        this.generateLogo(data.imgPath)
    },

    generateImages: function(images) {
        var html = ''
        for (var i = 0; i < images.length; i++) {
            var src = images[i]
            html += this.imgTemplate.replace(/{{img-src}}/g,src)
        }
        $('#drink-images .fileupload-list').prepend(html)
    },
    generateLogo: function(image) {
        var html = this.imgTemplate.replace(/{{img-src}}/g,image)
        $('#drink-logo .fileupload-list').html(html)
    }
}

// DrinkEdit.init();
