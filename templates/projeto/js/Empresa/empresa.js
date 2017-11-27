$(document).ready(function() {
    var id = 1;
    
    //função q colocar os valores nos campos
    function valueInput(value,id) {
        $("#"+id).val(value);
    }
    
    $.ajax({
      url: "https://haskalpha-romefeller.c9users.io/empresa",
      method: "GET",
      success: function(json){
         var empresa = json;
         console.log(empresa);
        valueInput(empresa["empresa"][0]["nome"],"nome");
        valueInput(empresa["empresa"][0]["cnpj"],"cnpj");
        valueInput(empresa["empresa"][0]["nomeFantasia"],"nomeFantasia");
        valueInput(empresa["empresa"][0]["telefone"],"telefone");
        valueInput(empresa["empresa"][0]["cep"],"cep");
        valueInput(empresa["empresa"][0]["logradouro"],"logradouro");
        valueInput(empresa["empresa"][0]["bairro"],"bairro");
        valueInput(empresa["empresa"][0]["email"],"email");

        $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/estado/",
          method: "GET",
          success: function(json){
            console.log(json['estados']);
            json['estados'].forEach(function(Element){
                var estado = new Option(Element["nome"], Element["id"], true, true);
                $("#estado").append(estado);
            });
            var int = parseInt(empresa["empresa"][0]["estadoId"]);
            $("#estado").val(int);
        }});
        
        $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/cidade",
          method: "GET",
          success: function(json){
            console.log(json['cidades']);
            json['cidades'].forEach(function(Element){
                var cidade = new Option(Element["nome"], Element["id"], true, true);
                $("#cidade").append(cidade);
            });
            var int = parseInt(empresa["empresa"][0]["cidadeId"]);
            $("#cidade").val(int);
          }
        });
      }});  

    function carregaContas(){
      $(".bancos").empty();
      
      $.ajax({
        url: "https://haskalpha-romefeller.c9users.io/dadosbancarios",
        method: "GET",
        success: function(json){
          console.log(json)
          json["DadosBancarios"].forEach(function(Element){
            var row = 
                '<tr class="bancos" id="r'+Element['id']+'">'
                +'  <td>'+Element['id']+'</td>'
                +'  <td>'+Element['nome']+'</td>'
                +'  <td>'+Element['banco']+'</td>'
                +'  <td>'+Element['agencia']+'</td>'
                +'  <td>'+Element['contaCorrente']+'</td>'
                +'  <td>'+Element['nossoNumero']+'</td>'
                +'  <td>'+Element['cedente']+'</td>'
                +'  <td><i class="fa fa-times x" click="" id="a'+Element['id']+'"></i></td>'
                +'</tr>'
          
            $("#example1").append(row);
        });
        
      }});
    }
    
    $(document).on('click', '.x', function(){
        var serv = JSON.parse(localStorage.getItem("servico"));
        
        var id = this.id;
        id = id.split("a");
        console.log(id);
        $("#r"+id[1]).remove();
        $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/dadosbancarios/"+id[1],
          method: "DELETE"
        });
    });
    
    carregaContas();
    
    function adicionarConta(){
      
      var nome = $("#nomeBanco").val();
      var banco = $("#codigoBanco").val();
      var agencia = $("#agencia").val();
      var contaCorrente = $("#contaCorrente").val();
      var nossoNumero = $("#nossoNumero").val();
      var cedente = $("#cedente").val();
      
      json = {
        "nome" : nome,
        "banco" : banco,
        "agencia" : agencia,
        "contaCorrente" : contaCorrente,
        "nossoNumero" : nossoNumero,
        "cedente" : cedente
      }
      
        json = JSON.stringify(json);
        
        $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/dadosbancarios",
          method: "POST",
          data: json,
          success: function(result) {
            carregaContas()
          },
          error: function(result){
              $('#error').modal({show: 'false'})
            }
        });
    }
    
    function salvar(){
      var nome = $("#nome").val();
      var logradouro = $("#logradouro").val();
      var cep = $("#cep").val();
      var cnpj = $("#cnpj").val();
      var nomeFantasia = $("#nomeFantasia").val();
      var telefone = $("#telefone").val();
      var email = $("#email").val();
      var bairro = $("#bairro").val();
      var cidadeId = parseInt($("#cidade").val());
      var estadoId = parseInt($("#estado").val());
    
        //if (senha == senha2){
      var json = {
        "nome" : nome,
        "logradouro" : logradouro,
        "cep" : cep,
        "logradouro" : logradouro,
        "telefone" : telefone,
        "email" : email,
        "bairro" : bairro,
        "cnpj" : cnpj,
        "cidadeId" : cidadeId,
        "estadoId" : estadoId,
        "nomeFantasia": nomeFantasia
      };
      
      console.log(json);
      
      json = JSON.stringify(json);
      
      console.log("json em string");
      
      console.log(json);
    
      $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/empresa/"+id,
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
    
    $("#adicionar").click(function(){
      adicionarConta();
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