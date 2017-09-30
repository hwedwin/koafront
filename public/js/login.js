$(function() {
    $('button[type=submit]').click(function(e) {
        e.preventDefault();
        var pass = true;
        $('.login-form input').each(function() {
            if ($(this).val().trim() == '') {
                alert('输入' + $(this).attr('placeholder'));
                pass = false;
                return false;
            }
        });
        if (!pass) {
            return false;
        }

        $.ajax({
            url: '/login',
            type: 'POST',
            data: {
                account: $('input[name=account]').val(),
                password: $('input[name=password]').val()
            },
            success: function(data) {
                if (data.status == 200) {
                    window.location.href = '/'
                } else {
                    alert(data.message)
                }
            }
        })
    })
});
