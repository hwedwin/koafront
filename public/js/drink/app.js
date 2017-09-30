window.Drink = window.Drink || {};

$(function() {
    Drink.common.init()
});

Drink.common = {
    ckEditor: null,
    drinkInfo: {},
    initDrinkInfo: function() {
        var drinkInfo = this.drinkInfo
        var pass = true
        $('input[type=text][required=true],input[type=number][required=true]').each(function() {
            if ($(this).val().trim() === '') {
                pass = false
                console.log(this)
                layer.alert("请输入" + $(this).attr('placeholder'))
                return false
            }
        })
        if (!pass) {
            return false;
        }
        drinkInfo.isDelete = 0;
        drinkInfo.categoryId = $('#categorySelect').val() //种类id
        drinkInfo.brandId = $('#brandSelect').val() //品牌id

        drinkInfo.brandName = $('#brandSelect option:selected').text().trim();//品牌名
        drinkInfo.categoryName = $('#categorySelect option:selected').text().trim();//种类id

        drinkInfo.name = $('#goodsGroupTitleInput_edit').val() //名字
        drinkInfo.shortName = $('#goodsGroupTitleInput_edit').val() //名字
        drinkInfo.origin = $('#goodsGroupOrginInput_edit').val() //产地
        drinkInfo.level = $('#goodsGroupLevelInput_edit').val() //等级
        drinkInfo.standard = $('#goodsGroupStandardInput_edit').val() //规格
        drinkInfo.recipe = $('#goodsGroupRecipeInput_edit').val() //原料
        drinkInfo.expire = $('#goodsGroupExpireInput_edit').val() //保质期
        drinkInfo.taste = $('#goodsGroupTasteInput_edit').val() //口味
        drinkInfo.storage = $('#goodsGroupStorageInput_edit').val() //保存方式
        drinkInfo.pruduceDate = $('#goodsGroupDateInput_edit').val() //生产日期
        drinkInfo.alcoholic = $('#goodsGroupAlcoholicInput_edit').val() //酒精度
        drinkInfo.factory = $('#goodsGroupFactoryInput_edit').val() //生产厂家
        drinkInfo.maxStorage = parseInt($('#maxCountInput_edit').val(), 10) //库存
        drinkInfo.validStorage = parseInt($('#originCountInput_edit').val(), 10) //可用库存
        drinkInfo.limitBuy = parseInt($('#limitInput_edit').val(), 10) //限购
        drinkInfo.expressFee = parseFloat($('#expressFeeInput_edit').val()) //邮费
        drinkInfo.originPrice = parseFloat($('#originPriceInput_edit').val()) //吊牌价
        drinkInfo.retailPrice = parseFloat($('#retailPriceInput_edit').val()) //原价
        drinkInfo.supplyPrice = parseFloat($('#supplyPriceInput_edit').val()) //出货价
        drinkInfo.commission = parseFloat($('#commissionInput_edit').val()) //佣金
        drinkInfo.saleState = parseInt($('#publishState input[name="saleState"]:checked ').val()); //是否上架
        drinkInfo.detail = this.getDrinkInfo();
        console.log(drinkInfo)
            //图片
        var imgPaths = this.getImgList();
        if (imgPaths.length < 1) {
            layer.alert('请上传商品图片');
            return false;
        }
        drinkInfo.imgPaths = imgPaths;
        drinkInfo.imgPath = this.getLogo();
        console.log(drinkInfo)
    },

    getDrinkDetail: function() {
        return this.drinkInfo;
    },

    getLogo: function() {
        var src;
        if ($('#drink-logo .fileupload .fileupload-preview img').length>0) {
            src = $('#drink-logo .fileupload .fileupload-preview img').attr('src');
        }
        return src;
    },
    getImgList: function() {
        var list = [];
        $('#drink-images .fileupload').each(function(){
            var src = $(this).find('.fileupload-preview img').attr('src');
            if (src) {
                list.push(src)
            }
        });
        return list;
    },
    init: function() {
        this.initBrand();
        this.initFileListener();
        // this.bindLogoChoose();
        this.initEditor();
    },

    initEditor: function() {
        this.ckEditor = CKEDITOR.replace('drinkInfo');
    },

    getDrinkInfo: function() {
        return this.ckEditor.getData();
    },

    addNewFileuploadBox: function() {
        var template = `<div class="fileupload fileupload-new fileupload-item" data-provides="fileupload">
                            <div class="fileupload-new thumbnail" style="width: 200px; height: 150px;">
                               <img src="http://www.placehold.it/200x150/EFEFEF/AAAAAA&amp;text=no+image" alt="">
                            </div>
                            <div class="fileupload-preview fileupload-exists thumbnail" style="max-width: 200px; max-height: 150px; line-height: 20px;"></div>
                            <div>
                               <span class="btn btn-file"><span class="fileupload-new">Select image</span>
                               <span class="fileupload-exists">Change</span>
                               <input type="file" class="default"></span>
                               <a href="#" class="btn fileupload-exists" data-dismiss="fileupload">Remove</a>
                            </div>
                         </div>`;
        $('#drink-images .fileupload-list').append(template);
    },
    bindLogoChoose: function() {
        $('body').on('click','.fileupload .fileupload-preview img',function() {
            $('.fileupload .fileupload-preview').removeClass('is-choose');
            $(this).parent().addClass('is-choose');
        });
    },
    initFileListener: function() {
        var top = this;
        $('body').on('change','.fileupload .btn-file input[type=file]',function() {
            var uploadEl = this;
            if (uploadEl.files.length < 1) {return false;}
            GlobalUtils.uploadFile(null, function(data,loadId) {
                if (data.status === 200) {
                    var fileArr = data.data
                    console.log($(uploadEl).parents('.fileupload').find('.fileupload-preview img'))
                    $(uploadEl).parents('.fileupload').find('.fileupload-preview img').attr('src',fileArr[0])
                    if ($(uploadEl).parents('.control-group').attr('id') === 'drink-images') {
                        top.addNewFileuploadBox();
                    }
                    layer.close(loadId)
                }else{
                    layer.alert(data.message)
                }
            }, this);
            return false;
        })
    },
    initBrand: function() {
        var formatData = function(arr) {
            var html = ''
            for (var i = 0; i < arr.length; i++) {
                var item = arr[i];
                html += '<option value="'+item.id+'">'+item.brandName+'</option>'
            }
            return html;
        }
        $.ajax({
            url: prefix + API.BRAND_LIST,
            type: 'POST',
            dataType: 'json',
            success: function(res) {
                if (res.status === 200) {
                    $('#brandSelect').html(formatData(res.data));
                    if (typeof DrinkEdit !== 'undefined') {
                        DrinkEdit.init();
                    }
                } else {
                    layer.alert(res.message)
                }
            }
        })
    }
}
