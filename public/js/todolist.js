//jQuery extension methods to make shortcuts for $.put / $.delete, similar to $.get / $.post
//Source: http://stepansuvorov.com/blog/2014/04/jquery-put-and-delete/

jQuery.each(["put", "delete"], function (i, method) {
    jQuery[method] = function (url, data, callback, type) {
        if (jQuery.isFunction(data)) {
            type = type || callback;
            callback = data;
            data = undefined;
        }

        return jQuery.ajax({
            url: url,
            type: method,
            dataType: type,
            data: data,
            success: callback
        });
    };
});

$(document).ready(function () {

    var removeBtnOnClick = function () {
        console.log("Removing todo...");
        var value = $(this).parent().parent().children("span").text();
        $.delete("/todo/" + value, function (response) {
            location.reload();
        })
    };

    var addBtnOnClick = function () {
        //Replace the Add button with an adding form
        $("#addbtn").parent().replaceWith('<div class="col-xs-5 col-xs-offset-1 col-sm-4 col-sm-offset-3"><input id="addinp" type="text" class="form-control"></div><div class="col-xs-3 col-sm-2"><button type="button" id="finalizeaddbtn" class="btn btn-success btn-block">Add</button></div><div class="col-xs-3 col-sm-2"><button type="button" id="canceladdbtn" class="btn btn-warning btn-block">Cancel</button></div>');

        //Handle cancellation
        $("#canceladdbtn").off();
        $("#canceladdbtn").on("click", function () {
            $("#canceladdbtn").parent().parent().replaceWith('<div class="form-group"><div class="col-xs-6 col-xs-offset-6 col-sm-2 col-sm-offset-9"><button type="button" id="addbtn" class="btn btn-success btn-block">Add ToDo</button></div></div>');
            $("#addbtn").on("click", addBtnOnClick);
        });

        //Handle confirmed addition
        $("#finalizeaddbtn").off();
        $("#finalizeaddbtn").on("click", function () {
            console.log("Adding new todo...");
            var value = $("#addinp").val();
            console.log(value);
            $.post("/todo/" + value, function (response) {
                location.reload();
            })
        });
    };

    $("#addbtn").off();
    $("#addbtn").on("click", addBtnOnClick);

    var editBtnOnClick = function () {
        //Only one element may be edited at any given point - automatically trigger the cancel-edit button if two are edited at once
        $(".btn-cancel-edit").trigger("click");

        //Get the current value
        var curval = $(this).parent().parent().children("span").text();
        console.log(curval);

        //Replace it with an editing form
        $(this).parent().parent().replaceWith('<div class="form-group"><div class="col-xs-5 col-xs-offset-1 col-sm-4 col-sm-offset-3"><input id="editinp" type="text" class="form-control" value="' + curval + '"></div><div class="col-xs-3 col-sm-2"><button type="button" id="finalizeeditbtn" class="btn btn-success btn-block">Done</button></div><div class="col-xs-3 col-sm-2"><button type="button" class="btn btn-warning btn-block btn-cancel-edit">Cancel</button></div></div>');

        //Handle cancellation
        $(".btn-cancel-edit").off();
        $(".btn-cancel-edit").on("click", function () {
            $(".btn-cancel-edit").parent().parent().replaceWith('<div class="form-group"><span class="col-xs-5 col-xs-offset-1 col-sm-4 col-sm-offset-3">' + curval + '</span><div class="col-xs-3 col-sm-2"><button type="button" class="btn btn-primary btn-block btn-remove">Remove</button></div><div class="col-xs-3 col-sm-2"><button type="button" class="btn btn-primary btn-block btn-edit">Edit</button></div></div>');

            $(".btn-edit").off();
            $(".btn-edit").on("click", editBtnOnClick);
            $(".btn-remove").off();
            $(".btn-remove").on("click", removeBtnOnClick);
        });

        //Handle confirmed editing

        $("#finalizeeditbtn").off();
        $("#finalizeeditbtn").on("click", function () {
            var newval = $("#editinp").val();
            console.log(newval);
            $.put("/todo/" + curval + "/" + newval, function (response) {
                location.reload();
            })
        });
    };

    $(".btn-edit").off();
    $(".btn-edit").on("click", editBtnOnClick);
    $(".btn-remove").off();
    $(".btn-remove").on("click", removeBtnOnClick);

    $("#dropbtn").on("click", function () {
        $.delete("/clear", function (response) {
            location.reload();
        })
    });
});