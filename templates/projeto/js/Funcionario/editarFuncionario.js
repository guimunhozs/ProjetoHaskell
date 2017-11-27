$(document).ready(function() {
    var id = localStorage.getItem("funcionarioId");
    
    //função q colocar os valores nos campos
    function valueInput(value,id) {
        $("#"+id).val(value)
    }
    
    $.ajax({
      url: "https://haskalpha-romefeller.c9users.io/funcionario/"+id,
      method: "GET",
      success: function(json){
         var funcionario = json;
         console.log(funcionario)
        valueInput(id,"cd");
        valueInput(funcionario["Funcionario"]["nome"],"nome");
        valueInput(funcionario["Funcionario"]["cpf"],"cpf");
        valueInput(funcionario["Funcionario"]["rg"],"rg");
        valueInput(funcionario["Funcionario"]["dataNascimento"],"dataNascimento");
        valueInput(funcionario["Funcionario"]["telefone"],"telefone");
        valueInput(funcionario["Funcionario"]["cep"],"cep");
        valueInput(funcionario["Funcionario"]["logradouro"],"logradouro");
        valueInput(funcionario["Funcionario"]["bairro"],"bairro");
        valueInput(funcionario["Funcionario"]["email"],"email");
        valueInput(funcionario["Funcionario"]["nivel"],"nivel");
        valueInput(funcionario["Funcionario"]["senha"],"senha");
        valueInput(funcionario["Funcionario"]["senha"],"senha2");

        $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/estado/",
          method: "GET",
          success: function(json){
            console.log(json['estados']);
            json['estados'].forEach(function(Element){
              console.log(Element);
                var estado = new Option(Element["nome"], Element["id"], true, true);
                $("#estado").append(estado);
            });
            var int = parseInt(funcionario["Funcionario"]["estadoId"]);
            $("#estado").val(int);
        }});
        
        $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/cidade",
          method: "GET",
          success: function(json){
            console.log(json['cidades']);
            json['cidades'].forEach(function(Element){
              console.log(Element);
                var cidade = new Option(Element["nome"], Element["id"], true, true);
                $("#cidade").append(cidade);
            });
            var int = parseInt(funcionario["Funcionario"]["cidadeId"]);
            $("#cidade").val(int);
        }});
        
        var excluido = false;
      console.log(excluido);
    }});
    
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
          url: "https://haskalpha-romefeller.c9users.io/funcionario/"+$("#cd").val(),
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