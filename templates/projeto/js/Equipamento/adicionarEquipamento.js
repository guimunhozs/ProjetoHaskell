$(document).ready(function() {
    
    $.ajax({
      url: "https://haskalpha-romefeller.c9users.io/cliente",
      method: "GET",
      success: function(cliente){
        cliente["Cliente"].forEach(function(Element){
            var cliente = new Option(Element["nome"], Element["id"], true, true);
            $("#cliente").append(cliente);
        });
        $("#cliente").val(0);
    }});
    

    function salvar(){
      var nome = $("#nome").val();
      var marca = $("#marca").val();
      var voltagem = $("#tensao").val();
      var patrimonio = ($("#patrimonio").val());
      var excluido = false;
      var clienteId = parseInt($("#cliente").val());

      var json = {
          "nome" : nome,
          "marca" : marca,
          "voltagem" : voltagem,
          "patrimonio" : patrimonio,
          "excluido" : excluido,
          "clienteId" : clienteId
      };
      
      json = JSON.stringify(json);
    
      $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/equipamento/",
          method: "POST",
          data: json,
          success: function(result){
            $('#success').modal({show: 'true'}); 
          },
          error: function(result){
            $('#error').modal({show: 'false'})
          }
      });
    }
    
    $("#salvar").click(function() {
      salvar();
    });
});