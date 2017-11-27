$(document).ready(function() {
    
    $.ajax({
      url: "https://haskalpha-romefeller.c9users.io/estado",
      method: "GET",
      success: function(estados){
        estados["estados"].forEach(function(Element){
            var estado = new Option(Element["nome"], Element["id"], true, true);
            $("#estado").append(estado);
        });
        $("#estado").val(0);
    }});
    
// luis voud errubar o serviço para testar uma coisa
    function salvar(){
      var nome = $("#nome").val();
      var logradouro = $("#logradouro").val();
      var cep = $("#cep").val();
      var cpf = $("#cpf").val();
      var rg = $("#rg").val();
      var telefone = $("#telefone").val();
      var email = $("#email").val();
      var bairro = $("#bairro").val();
      var excluido = false;
      var cidadeId = parseInt($("#cidade").val());
      var estadoId = parseInt($("#estado").val());
      var senha = $("#senha").val();
      var senha2 =  $("#senha2").val();
      var nivel = parseInt($("#nivel").val());
      var dataNascimento = $("#dataNascimento").val();
    
        //if (senha == senha2){
      var json = {
        "nome" : nome,
        "logradouro" : logradouro,
        "cep" : cep,
        "rg" : rg,
        "telefone" : telefone,
        "email" : email,
        "bairro" : bairro,
        "excluido" : excluido,
        "cpf" : cpf,
        "cidadeId" : cidadeId,
        "estadoId" : estadoId,
        "senha" : senha,
        "nivel" : nivel,
        "dataNascimento" : dataNascimento
      };
      
      console.log(json);
      
      json = JSON.stringify(json);
      
      console.log(json);
            
      $.ajax({
        url: "https://haskalpha-romefeller.c9users.io/funcionario",
        method: "POST",
        data: json,
        success: function(result){
          $('#success').modal({show: 'true'}); 
        },
        error: function(result){
          $('#error').modal({show: 'false'});
        }
      });
       // }
    
      $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/funcionario",
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
    
    
    $("#estado").change(function(){
      $('#cidade').empty();
      var cidade = new Option("Selecione uma cidade", 0, true, true);
      $("#cidade").append(cidade);
      $.ajax({
        url: "https://haskalpha-romefeller.c9users.io/cidade/estado/"+$("#estado").val(),
        method: "GET",
        success: function(cidades){
          cidades["cidade"].forEach(function(Element){
              cidade = new Option(Element["nome"], Element["id"], true, true);
              $("#cidade").append(cidade);
          });
          $("#cidade").val(0);
      }});
    });
});