/**
 * @author Nicolas CARPi <nicolas.carpi@curie.fr>
 * @copyright 2012 Nicolas CARPi
 * @see https://www.elabftw.net Official website
 * @license AGPL-3.0
 * @package elabftw
 */
(function() {
  "use strict";

  $(document).ready(function() {
    // TEAMS
    var Teams = {
      controller: "app/controllers/SysconfigAjaxController.php",
      create: function() {
        document.getElementById("teamsCreateButton").disabled = true;
        var name = $("#teamsName").val();
        $.post(this.controller, {
          teamsCreate: true,
          teamsName: name
        }).done(function(data) {
          Teams.destructor(data);
        });
      },
      update: function(id) {
        document.getElementById("teamsUpdateButton_" + id).disabled = true;
        var name = $("#teamName_" + id).val();
        var orgid = $("#teamOrgid_" + id).val();
        $.post(this.controller, {
          teamsUpdate: true,
          teamsUpdateId: id,
          teamsUpdateName: name,
          teamsUpdateOrgid: orgid
        }).done(function(data) {
          Teams.destructor(data);
        });
      },
      destroy: function(id) {
        document.getElementById("teamsDestroyButton_" + id).disabled = true;
        $.post(this.controller, {
          teamsDestroy: true,
          teamsDestroyId: id
        }).done(function(data) {
          Teams.destructor(data);
        });
      },
      destructor: function(json) {
        notif(json);
        if (json.res) {
          $("#teamsDiv").load("sysconfig.php #teamsDiv");
        }
      }
    };

    $(document).on("keyup", ".teamNameInput", function() {
      document.getElementById(
        "teamsUpdateButton_" + $(this).data("id")
      ).disabled = false;
    });

    $(document).on("click", "#teamsCreateButton", function() {
      Teams.create();
    });
    $(document).on("click", ".teamsUpdateButton", function() {
      Teams.update($(this).data("id"));
    });
    $(document).on("click", ".teamsDestroyButton", function() {
      Teams.destroy($(this).data("id"));
    });
    $(document).on("click", ".teamsArchiveButton", function() {
      notif({ msg: "Feature not yet implemented :)", res: true });
    });

    // MAIL METHOD in a function because is also called in document ready
    function toggleMailMethod(method) {
      switch (method) {
        case "sendmail":
          $("#smtp_config").hide();
          $("#sendmail_config").show();
          break;
        case "smtp":
          $("#smtp_config").show();
          $("#sendmail_config").hide();
          break;
        default:
          $("#smtp_config").hide();
          $("#sendmail_config").hide();
          $("#general_mail_config").hide();
      }
    }
    $(document).on("change", "#selectMailMethod", function() {
      toggleMailMethod($(this).val());
    });

    // MASS MAIL
    $(document).on("click", "#massSend", function() {
      $("#massSend").prop("disabled", true);
      $("#massSend").text("Sending…");
      $.post("app/controllers/SysconfigAjaxController.php", {
        massEmail: true,
        subject: $("#massSubject").val(),
        body: $("#massBody").val()
      }).done(function(json) {
        notif(json);
        if (json.res) {
          $("#massSend").text("Sent!");
        } else {
          $("#massSend").prop("disabled", false);
          $("#massSend").css("background-color", "#e6614c");
          $("#massSend").text("Error");
        }
      });
    });

    // TEST EMAIL
    $(document).on("click", "#testemailButton", function() {
      var email = $("#testemailEmail").val();
      document.getElementById("testemailButton").disabled = true;
      $("#testemailButton").text("Sending…");
      $.post("app/controllers/SysconfigAjaxController.php", {
        testemailSend: true,
        testemailEmail: email
      }).done(function(json) {
        notif(json);
        if (json.res) {
          $("#massSend").text("Sent!");
          document.getElementById("testemailButton").disabled = false;
        } else {
          $("#testemailButton").text("Error");
          $("#testemailButton").css("background-color", "#e6614c");
        }
      });
    });

    $(document).on("click", "#editSmtpPassword", function() {
      $("#hidden_smtp_password").toggle();
    });

    // we need to add this otherwise the button will stay disabled with the browser's cache (Firefox)
    var input_list = document.getElementsByTagName("input");
    for (var i = 0; i < input_list.length; i++) {
      var input = input_list[i];
      input.disabled = false;
    }
    // honor already saved mail_method setting and hide unused options accordingly
    toggleMailMethod($("#selectMailMethod").val());

    $(document).on("click", ".idpsDestroy", function() {
      const elem = $(this);
      if (confirm($(this).data("confirm"))) {
        $.post("app/controllers/SysconfigAjaxController.php", {
          idpsDestroy: true,
          id: $(this).data("id")
        }).done(function(json) {
          notif(json);
          if (json.res) {
            elem.closest("div").hide(600);
          }
        });
      }
    });

    tinymce.init({
      mode: "specific_textareas",
      editor_selector: "mceditable",
      browser_spellcheck: true,
      skin_url: "app/css/tinymce",
      height: "500",
      plugins:
        "table searchreplace code fullscreen insertdatetime paste charmap lists advlist save image imagetools link pagebreak hr",
      pagebreak_separator: "<pagebreak>",
      toolbar1:
        "undo redo | styleselect bold italic underline | alignleft aligncenter alignright alignjustify | superscript subscript | bullist numlist outdent indent | forecolor backcolor | charmap | codesample | link",
      removed_menuitems: "newdocument, image",
      image_caption: false,
      content_style: ".mce-content-body {font-size:10pt;}",
      language: "en_GB"
    });
  });
})();
