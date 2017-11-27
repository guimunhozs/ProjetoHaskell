$(document).ready(function() {
    var id = localStorage.getItem("equipamentoId");
    
    //função q colocar os valores nos campos
    function valueInput(value,id) {
        $("#"+id).val(value)
    }
    
    $.ajax({
      url: "https://haskalpha-romefeller.c9users.io/equipamento/"+id,
      method: "GET",
      success: function(json){
         var equipamento = json;
         console.log(equipamento)
        valueInput(id,"cd");
        valueInput(equipamento["Equipamento"]["nome"],"nome");
        valueInput(equipamento["Equipamento"]["marca"],"marca");
        valueInput(equipamento["Equipamento"]["modelo"],"modelo");
        valueInput(parseInt(equipamento["Equipamento"]["voltagem"]),"tensao");
        valueInput(equipamento["Equipamento"]["patrimonio"],"patrimonio");

        $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/cliente/",
          method: "GET",
          success: function(json){
            console.log(json['Cliente']);
            json['Cliente'].forEach(function(Element){
              console.log(Element);
                var cliente = new Option(Element["nome"], Element["id"], true, true);
                $("#cliente").append(cliente);
            });
            var int = parseInt(equipamento["Equipamento"]["clienteId"]);
            $("#cliente").val(int);
        }});
        
        var excluido = false;
      console.log(excluido);
    }});
    
    function salvar(){
      var nome = $("#nome").val();
      var marca = $("#marca").val();
      var modelo = ($("#modelo").val());
      var voltagem = $("#tensao").val();
      var patrimonio = ($("#patrimonio").val());
      var excluido = false;
      console.log(excluido);
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
          url: "https://haskalpha-romefeller.c9users.io/equipamento/"+$("#cd").val(),
          method: "PUT",
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