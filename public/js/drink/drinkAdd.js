;
var DrinkAdd = {
    _addListener: function() {
        var self = this;
        $('#btnConfirm').click(function() {
            Drink.common.initDrinkInfo();
            self.commit();
        });
    },
    commit: function() {
        console.log(Drink.common.getDrinkDetail())
    	$.ajax({
            url: prefix + API.DRINK_INSERT,
            type: 'POST',
            dataType: 'json',
            data: Drink.common.getDrinkDetail(),
            success: function(res) {
                if (res.status === 200) {
                }else{
                }
                layer.alert(res.message);
            }
        })
    },
    init: function() {
        this._addListener();
    }
}

DrinkAdd.init();
