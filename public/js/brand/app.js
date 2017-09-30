var handleEditableTables = function() {

    function restoreRow(oTable, nRow) {
        var aData = oTable.fnGetData(nRow);
        var jqTds = $('>td', nRow);

        for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
            oTable.fnUpdate(aData[i], nRow, i, false);
        }

        oTable.fnDraw();
    }

    function editRow(oTable, nRow) {
        var aData = oTable.fnGetData(nRow);
        var jqTds = $('>td', nRow);
        jqTds[0].innerHTML = '<input type="text" class="m-wrap small" value="' + aData[0] + '">';
        // jqTds[1].innerHTML = '<input type="text" class="m-wrap small" value="' + aData[1] + '">';

        jqTds[1].innerHTML = '<select value="'+aData[1]+'"><option value="1" selected>白酒</option><option value="2">红酒</option><option value="3">啤酒</option><option value="4">其他</option></select>';

        jqTds[2].innerHTML = '<input type="text" class="m-wrap small u-file-choose" value="' + aData[2] + '">';
        jqTds[3].innerHTML = '<input type="text" class="m-wrap small" value="' + aData[3] + '">';
        // jqTds[4].innerHTML = '<input type="text" class="m-wrap small" value="' + aData[4] + '">';
        jqTds[4].innerHTML = '<select value="'+aData[4]+'"><option value="1" selected>正常</option><option value="2">下线</option></select>';
        jqTds[5].innerHTML = '<a class="edit" href="">Save</a>';
        jqTds[6].innerHTML = '<a class="cancel" href="">Cancel</a>';
    }

    function saveRow(oTable, nRow) {
        var jqInputs = $('input', nRow);
        var jqSelect = $('select', nRow);
        oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
        oTable.fnUpdate(jqSelect[0].value, nRow, 1, false);
        oTable.fnUpdate(jqInputs[1].value, nRow, 2, false);
        oTable.fnUpdate(jqInputs[2].value, nRow, 3, false);
        oTable.fnUpdate(jqSelect[1].value, nRow, 4, false);
        oTable.fnUpdate('<a class="edit" href="">Edit</a>', nRow, 5, false);
        oTable.fnUpdate('<a class="delete" href="">Delete</a>', nRow, 6, false);
        oTable.fnDraw();
    }

    function cancelEditRow(oTable, nRow) {
        var jqInputs = $('input', nRow);
        var jqSelect = $('select', nRow);
        oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
        oTable.fnUpdate(jqSelect[0].value, nRow, 1, false);
        oTable.fnUpdate(jqInputs[1].value, nRow, 2, false);
        oTable.fnUpdate(jqInputs[2].value, nRow, 3, false);
        oTable.fnUpdate(jqSelect[1].value, nRow, 4, false);
        oTable.fnUpdate('<a class="edit" href="">Edit</a>', nRow, 5, false);
        oTable.fnDraw();
    }

    oTable = $('#sample_editable_1').dataTable();
    jQuery('#sample_editable_1_wrapper .dataTables_filter input').addClass("m-wrap medium"); // modify table search input
    jQuery('#sample_editable_1_wrapper .dataTables_length select').addClass("m-wrap xsmall"); // modify table per page dropdown

    var nEditing = null;

    $('#sample_editable_1_new').click(function(e) {
        e.preventDefault();
        var aiNew = oTable.fnAddData(['', '', '', '','',
            '<a class="edit" href="">Edit</a>', '<a class="cancel" data-mode="new" href="">Cancel</a>'
        ]);
        var nRow = oTable.fnGetNodes(aiNew[0]);
        editRow(oTable, nRow);
        nEditing = nRow;
    });

    $('#sample_editable_1 a.delete').live('click', function(e) {
        e.preventDefault();

        if (confirm("Are you sure to delete this row ?") == false) {
            return;
        }

        var nRow = $(this).parents('tr')[0];
        oTable.fnDeleteRow(nRow);
        deleteBrand($(this).parents('tr').attr('data-id'))
    });

    $('#sample_editable_1 a.cancel').live('click', function(e) {
        e.preventDefault();
        if ($(this).attr("data-mode") == "new") {
            var nRow = $(this).parents('tr')[0];
            oTable.fnDeleteRow(nRow);
        } else {
            restoreRow(oTable, nEditing);
            nEditing = null;
        }
    });

    $('#sample_editable_1 a.edit').live('click', function(e) {
        e.preventDefault();

        /* Get the row as a parent of the link that was clicked on */
        var nRow = $(this).parents('tr')[0];

        if (nEditing !== null && nEditing != nRow) {
            /* Currently editing - but not this row - restore the old before continuing to edit mode */
            restoreRow(oTable, nEditing);
            editRow(oTable, nRow);
            nEditing = nRow;
        } else if (nEditing == nRow && this.innerHTML == "Save") {
            /* Editing this row and want to save it */
            saveRow(oTable, nEditing);
            // alert("Updated! Do not forget to do some ajax to sync with backend :)");
            var currentData = oTable.fnGetData();
            currentData = currentData[oTable.fnGetNodes().indexOf(nEditing)]
            var id = $(nEditing).attr('data-id')
            if (id) {
                updateData(currentData,id,nEditing)
            }else{
                pushData(currentData)
            }
            nEditing = null;
        } else {
            /* No edit in progress - let's start one */
            editRow(oTable, nRow);
            nEditing = nRow;
        }
    });

    function pushData(currentData) {
        $.ajax({
            url: prefix + API.BRAND_INSERT,
            type: 'POST',
            dataType: 'json',
            data: {
                brandName: currentData[0],
                categoryId: currentData[1],
                logo: currentData[2],
                info: currentData[3],
                state: currentData[4]
            },
            success: function(data) {
                layer.alert(data.message)
            }
        })
    }

    function updateData(currentData,id,cur) {    
        $.ajax({
            url: prefix + API.BRAND_UPDATE,
            type: 'POST',
            dataType: 'json',
            data: {
                id: id,
                brandName: currentData[0],
                categoryId: currentData[1],
                logo: currentData[2],
                info: currentData[3],
                state: currentData[4]
            },
            success: function(data) {
                layer.alert(data.message)
            }
        })
    }

    function deleteBrand(id) {
        $.ajax({
            url: prefix + API.BRAND_DELETE,
            type: 'POST',
            dataType: 'json',
            data: {
                id: id
            },
            success: function(data) {
                console.log(data)
                if (data.status === 200) {
                    layer.alert('删除成功')
                }else{
                    layer.alert('删除失败')
                }
            }
        })
    }




    var fileInput = null;
    $('body').on('click','.u-file-choose',function(e){
        e.preventDefault();
        fileInput = this;
        $("#u-brand-logo").click();
    })

    function listenLogoFile() {
        $('body').append('<form id="logo-form"><input type="file" id="u-brand-logo" name="file" style="width: 0;"></form>')

        // $("#u-brand-logo").unbind();
        $("#u-brand-logo").on('change', function() {
            GlobalUtils.uploadFile('#logo-form', function(data,loadId) {
                if (data.status === 200) {
                    var fileArr = data.data
                    $(fileInput).val(fileArr[0]);
                    layer.close(loadId)
                }else{
                    layer.alert(data.message)
                }
            }, '#u-brand-logo');
        });
    }

    listenLogoFile();
}

var requestBrandData = function() {
    var template = `
        <tr class="" data-id="{{id}}">
            <td>{{brandName}}</td>
            <td>{{categoryId}}</td>
            <td>{{logo}}</td>
            <td class="center">{{info}}</td>
            <td class="center">{{state}}</td>
            <td><a class="edit" href="javascript:;">Edit</a></td>
            <td><a class="delete" href="javascript:;">Delete</a></td>
        </tr>
    `

    var formatData = function(arr){
        var html = ''
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            html += template.replace(/{{brandName}}/g,item.brandName)
                            .replace(/{{categoryId}}/g,Config.drinkCategoryMap[item.categoryId])
                            .replace(/{{logo}}/g,item.logo)
                            .replace(/{{info}}/g,item.info)
                            .replace(/{{state}}/g,item.state == '1' ? '正常' : '未上线')
                            .replace(/{{id}}/g,item.id)
        }
        return html;
    }

    $.ajax({
        url: prefix + API.BRAND_LIST,
        type: 'POST',
        dataType: 'json',
        data: {
        },
        success: function(res) {
            if (res.status === 200) {
                $('#m-brand-list').append(formatData(res.data))
                handleEditableTables();
            }else{
                alert(res.message)
            }
        }
    })
}

requestBrandData();
