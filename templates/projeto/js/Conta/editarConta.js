$(document).ready(function() {
    var id = localStorage.getItem("contaId");
    var tipoConta = localStorage.getItem("tipoConta");
    verificaTipo();
    
    //função q colocar os valores nos campos
    function valueInput(value,id) {
        $("#"+id).val(value)
    }
    
    //console.log("tipo conta" , tipoConta);
    function verificaTipo(){
     // console.log("verificar tipo");
      if (tipoConta == "pagar"){
          caminho = "contasPagar/";
          $("#lblClienteFornecedor").text("Fornecedor");
          $("#optClienteFornecedor").text("Selecione um fornecedor");
      }else{
          caminho = "contasReceber/";
          $("#lblClienteFornecedor").text("Cliente");
          $("#optClienteFornecedor").text("Selecione um cliente");
      }
    }

    $.ajax({
      url: "https://haskalpha-romefeller.c9users.io/" + caminho + id,
      method: "GET",
      success: function(json){
         var conta = json;
         //console.log(conta)
        valueInput(id,"cd");
        valueInput(conta["Conta"]["codigo"],"codigoDoc");
        valueInput(conta["Conta"]["historico"],"descricao");
        valueInput(parseFloat(conta["Conta"]["valor"]).toFixed(2),"valor");
        valueInput(conta["Conta"]["dataEmissao"],"dataEmissao");
        valueInput(conta["Conta"]["dataVencimento"],"dataVencimento");
        if(conta["Conta"]["icPago"]){
          $("#toggle-two").bootstrapToggle('on')
        }else{
          $("#toggle-two").bootstrapToggle('off')
        }
        if(conta["Conta"]["icPagarReceber"]){
          $("#toggle-two2").bootstrapToggle('off')
          getFornecedores(conta["Conta"]["fornecedorId"]);
        }else{
          $("#toggle-two2").bootstrapToggle('on')
          getClientes(conta["Conta"]["clienteId"]);
        }
        
    }});
    
    function getClientes(int){
      $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/cliente",
          method: "GET",
          success: function(json){
            console.log(json['Cliente']);
            json['Cliente'].forEach(function(Element){
              console.log(Element);
                var cliente = new Option(Element["nome"], Element["id"], true, true);
                $("#ClienteFornecedor").append(cliente);
            });
            $("#ClienteFornecedor").val(int);
        }});
    }
    
    function getFornecedores(int){
      $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/fornecedor",
          method: "GET",
          success: function(json){
            console.log(json['result']);
            json['result'].forEach(function(Element){
              console.log(Element);
                var fornecedor = new Option(Element[0]["nome"], Element[0]["id"], true, true);
                $("#ClienteFornecedor").append(fornecedor);
            });
            $("#ClienteFornecedor").val(int);
        }});
    }
    
    $("#salvar").click(function() {

      var json = {
        "historico"       : $("#descricao").val(),
        "codigo"          : $("#codigoDoc").val(),
        "dataEmissao"     : $("#dataEmissao").val(),
        "dataVencimento"  : $("#dataVencimento").val()==""?null:$("#dataVencimento").val(),
        "valor"           : parseFloat($("#valor").val()),
        "icPagarReceber"  : localStorage.getItem("tipoConta") == "pagar"?true:false,
        "icPago"          : $("#toggle-two").prop('checked'),
        "clienteId"       : localStorage.getItem("tipoConta") == "pagar"?null:parseInt($("#ClienteFornecedor").val()),
        "fornecedorId"    : localStorage.getItem("tipoConta") == "pagar"?parseInt($("#ClienteFornecedor").val()):null
      };
      
     
      
      
      $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/conta/"+$("#cd").val(),
          method: "PUT",
          data: JSON.stringify(json),
          success: function(result){
            $('#success').modal({show: 'true'}); 
          },
          error: function(result){
            $('#error').modal({show: 'false'})
          }
      });
      
    });

});