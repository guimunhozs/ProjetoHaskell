$(document).ready(function() {
    
    $.ajax({
      url: "https://haskalpha-romefeller.c9users.io/fornecedor/",
      method: "GET",
      success: function(fornecedor){
        fornecedor["result"].forEach(function(Element){
            var estado = new Option(Element[0]["nome"], Element[0]["id"], true, true);
            $("#fornecedor").append(estado);
        });
        $("#fornecedor").val(0);
    }});
    
    function gerarConta(){
      var codigo = ("000000000" + (Math.floor((Math.random() * 999999999)) + 1)).slice(-9);
      var jsonConta = {
        "dataEmissao": dataAtual(),
        "dataVencimento": dataCinco(),
        "historico": "Conta referente a compra de " + parseInt($("#qtd").val()) + " itens de " +  $("#nome").val() + " da marca " + $("#marca").val()  ,
        "clienteId": null,
        "fornecedorId": parseInt($("#fornecedor").val()),
        "icPagarReceber": true,
        "icPago": false,
        "valor": parseInt($("#qtd").val()) * parseFloat($("#vlC").val()) ,
        "codigo": codigo
      };
      $.ajax({
        url: "https://haskalpha-romefeller.c9users.io/conta",
        method: "POST",
        data: JSON.stringify(jsonConta),
        success: function(){
          console.log("gerou conta!");
        },
        
        error: function(){
          console.log("Não gerou conta!");
        }
      });
      
      console.log("jsonConta", jsonConta);
    }
    

    function salvar(){
     var nome = $("#nome").val();
      var marca = $("#marca").val();
      var quantidadeMinima = parseInt($("#qtdM").val());
      var quantidade = parseInt($("#qtd").val());
      var valorVenda = parseFloat($("#vlV").val());
      var valorCusto = parseFloat($("#vlC").val());
      var excluido = "false";
      var fornecedorId = parseInt($("#fornecedor").val());

      var json = '{"nome":"'+nome+'",'
               + '"marca":"'+marca+'",'
               + '"quantidadeMin":'+quantidadeMinima+','
               + '"quantidade":'+quantidade+','
               + '"valorVenda":'+valorVenda+','
               + '"valorCusto":'+valorCusto+','
               + '"excluido": false,'
               + '"fornecedorId":'+fornecedorId
               + '}';
      console.log(json);
    
      $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/produto/",
          method: "POST",
          data: json,
          success: function(result){
            gerarConta();
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