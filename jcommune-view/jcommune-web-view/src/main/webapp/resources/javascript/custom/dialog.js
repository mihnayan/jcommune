/*
 * Copyright (C) 2011  JTalks.org Team
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 */

/**
 * Constructor of dialogs
 */

var jDialog = {};

$(function () {
    //types of dialog
    jDialog.confirmType = 'confirm';
    jDialog.alertType = 'alert';
    jDialog.infoType = 'info';
    jDialog.options = {}
    jDialog.dialog;

    jDialog.rootPanelFunc = function () {
        var dialog = $(' \
        <form class="modal" id="' + jDialog.options.dialogId + '" tabindex="-1" role="dialog" \
                    aria-hidden="true"> \
            <div class="modal-header"> \
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> \
                <h3>' + jDialog.options.title + '</h3> \
            </div> \
            ' + jDialog.bodyContentFunc() + ' \
            ' + jDialog.footerContentFunc() + ' \
        </form> \
    ');

        return dialog;
    }

    jDialog.bodyContentFunc = function () {
        var body = '<div class="modal-body">';
        switch(jDialog.options.type){
            case jDialog.alertType :
            case jDialog.confirmType : {
                body += '<div class="dialog-message"><h4>' + jDialog.options.bodyMessage + '</h4></div>';
                break;
            }
            default : {
                body += jDialog.options.bodyContent;
                break;
            }
        }
        return body + '</div>';
    }

    jDialog.footerContentFunc = function () {
        var footer = '<div class="modal-footer">';
        switch(jDialog.options.type){
            case jDialog.alertType : {
                footer += '<button id="' + jDialog.options.alertDefaultBut + '" class="btn btn-primary">' + $labelOk
                       + '</button>';
                break;
            }
            default : {
                footer += jDialog.options.footerContent;
                break;
            }
        }

        return footer + '</div>';
    }

    //if user sets options with name which exists in default then default option overridden, else adds
    jDialog.defaultOptions = {
        "type": jDialog.infoType,
        "dialogId": '',
        //for header height
        "title": '&nbsp;',
        "rootPanelFunc": jDialog.rootPanelFunc,
        "bodyContentFunc": jDialog.bodyContentFunc,
        "footerContentFunc": jDialog.footerContentFunc,
        "bodyContent": '',
        //for confirm, alert types
        "bodyMessage": '',
        "footerContent": '',
        "maxWidth": 300,
        "maxHeight": 400,
        "overflow": "hidden",
        "overflowBody": "hidden",
        //first element focus
        "firstFocus": true,
        "tabNavigation": [],
        //contained selector of object (key of object), handler to object (value of object)
        "handlers": {},
        "handlersDelegate": {},
        "handlersLive": {},
        "dialogKeydown": Keymaps.defaultDialog,
        "alertDefaultBut": "alert-ok"
    }

    jDialog.createDialog = function (opts) {
        if(jDialog.dialog){
            jDialog.closeDialog();
        }
        //merge default options and users option
        jDialog.options = $.extend({}, jDialog.defaultOptions, opts);
        jDialog.dialog = jDialog.rootPanelFunc();

        //modal function is bootstrap
        jDialog.dialog.modal({
            "backdrop": "static",
            "keyboard": true,
            "show": true
        }).css(
            {"max-width": jDialog.options.maxWidth,
            "max-height": jDialog.options.maxHeight,
            "overflow" : jDialog.options.overflow}
        );

        jDialog.resizeDialog(jDialog.dialog);

        addHandlers();

        if(jDialog.options.fisrtFocus && jDialog.options.type == jDialog.infoType){
          jDialog.focusFirstElement();
        }

        // html5 placeholder emulation for old IE
        jDialog.dialog.find('input[placeholder]').placeholder();

        return jDialog.dialog;
    }

    jDialog.closeDialog = function(){
        jDialog.dialog.modal('hide');
        jDialog.dialog.remove();
    }

    /*
    * first elemnts it is element which have class "first",
    * or first "input" element, or first "button"
    */
    jDialog.focusFirstElement = function() {
       var firsts = ['.first', 'input:first', 'button:first']
       var first;

       $.each(firsts, function(idx, v){
           first = jDialog.dialog.find(v);
           if(first.length != 0){
             first.focus();
             return false;
           }
       });
    }

    //methods to dialogs
    jDialog.resizeDialog = function(dialog) {
        if (dialog) {
            dialog.css("margin-top", function () {
                return $(this).outerHeight() / 2 * (-1)
            });
            dialog.css("margin-left", function () {
                return $(this).outerWidth() / 2 * (-1)
            });
        }
    }

    /**
     * Enable all disabled elements
     * Remove previous errors
     * Show hidden hel text
     */
    jDialog.prepareDialog = function(dialog) {
        dialog.find('*').attr('disabled', false);
        dialog.find('._error').remove();
        dialog.find(".help-block").show();
        dialog.find('.control-group').removeClass('error');
    }

    /**
     * Show errors under fields with errors
     * Errors overrides help text (help text will be hidden)
     */
    jDialog.showErrors = function(dialog, errors, idPrefix, idPostfix) {
        ErrorUtils.removeAllErrorMessages();
        for (var i = 0; i < errors.length; i++) {
            var idField = '#' + idPrefix + errors[i].field + idPostfix;
            ErrorUtils.addErrorMessage(idField, errors[i].defaultMessage);
        }
        jDialog.resizeDialog(dialog);
    }



    var addHandlers = function () {
        $('.modal-backdrop').live('click', function (e) {
            jDialog.closeDialog();
        });

        jDialog.dialog.find('.close').bind('click', function (e) {
            jDialog.closeDialog();
        });

        jDialog.dialog.on('keydown', jDialog.options.dialogKeydown);

        if(jDialog.options.type == jDialog.alertType){
            tabNavigation([jDialog.options.alertDefaultBut]);
            $('#' + jDialog.options.alertDefaultBut).on('click', function(e){
                e.preventDefault();
                jDialog.closeDialog();
            })
        }

        $.each(jDialog.options.handlers, function(k, v){

           if(v == 'close'){
              $(k).on('click', function(e){
                  e.preventDefault();
                  jDialog.closeDialog();
              })
           }else{
               $.each(v, function(ke, ve){
                   $(k).on(ke, ve);
               })
           }
        })

        $.each(jDialog.options.handlersDelegate, function(k, v){
            if(v == 'close'){
                $(document).delegate(k, 'click', function(e){
                    e.preventDefault();
                    jDialog.closeDialog();
                })
            }else{
                $.each(v, function(ke, ve){
                    $(document).delegate(k, ke, ve);
                })
            }
        })

        $.each(jDialog.options.handlersLive, function(k, v){
            if(v == 'close'){
                $(document).live(k, 'click', function(e){
                    e.preventDefault();
                    jDialog.closeDialog();
                })
            }else{
                $.each(v, function(ke, ve){
                    $(document).live(k, ke, ve);
                })
            }
        })

        tabNavigation(jDialog.options.tabNavigation);
    }

    var tabNavigation = function(selectors){
        $.each(selectors, function(idx, v){
           var func = function (e) {
               if ((e.keyCode || e.charCode) == tabCode) {
                   e.preventDefault();
                   nextTabElm(selectors, idx).focus();
               }
           }
           $(v).on('keydown', func);
        });
    }

    var nextTabElm = function(els, curIdx){
      if(els.length == curIdx+1){
          return jDialog.dialog.find(els[0]);
      }else{
          return jDialog.dialog.find(els[curIdx + 1])
      }
    }
});
