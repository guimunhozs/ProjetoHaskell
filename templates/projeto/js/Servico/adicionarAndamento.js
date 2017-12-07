$(document).ready(function(){
    
    var servicoId = localStorage.getItem("servicoId");
    
    console.log("servicoId", servicoId);
    
    $("#cd").val(servicoId);
    
    $("#dataInicio").val(dataAtual());

    $("#fechar").click(function() {
      window.location.replace("editarServico.html");
    });

    function salvar(){
      var funcionario = JSON.parse(localStorage.getItem("Dados_Funcionario"));
      var json = {
        "status": String($("#status").val()),
        "descricao": $("#descricao").val(),
        "funcionarioId":funcionario.Funcionario.id,//pegar id do usuário logado
        "nome": $("#nome").val(),
        "servicoId": parseInt(servicoId),
        "dateAndamento": $("#dataInicio").val(),
        "numero": 1,
        "valor": parseFloat($("#valor").val())
      };
      
      console.log("json " , json);
      
      $.ajax({
        url: "https://haskalpha-romefeller.c9users.io/andamento",
        method: "POST",
        data: JSON.stringify(json),
        success: function(){
          $('#success').modal({show: 'true'}); 
        },
        error: function(){
          $('#error').modal({show: 'false'});
        }
      });
    }
    
    $("#salvar").click(function() {
      salvar();
    });
});