$(document).ready(function() {
    var id = localStorage.getItem("vendaId");
    var qtde;
    
    //função q colocar os valores nos campos
    function valueInput(value,id) {
        $("#"+id).val(value)
    }
    
    $("#valorTotal").text("0");
    
    function carregarItens(){
      console.log("carregar itens");
      $(".itensVenda").empty();
      
      $.ajax({
        url: "https://haskalpha-romefeller.c9users.io/itemvenda/venda/"+id,
        method: "GET",
        success: function(json){
          console.log("json do carregarItens" ,json);
          var soma = 0;
          json["result"].forEach(function(Element){
            var vltotal = Element[0].quantidade * Element[1].valorVenda;
            var row = 
                '<tr class="itensVenda" id="r'+Element[0].id+'">'
                +'  <td>'+Element[0].id+'</td>'
                +'  <td>'+Element[1].nome+'</td>'
                +'  <td>'+Element[0].quantidade+'</td>'
                +'  <td>'+Element[1].valorVenda.toFixed(2) +'</td>'
                +'  <td class="vltotal">'+ (Element[0].quantidade * Element[1].valorVenda).toFixed(2) +'</td>'

                +'  <td><i class="fa fa-times x" click="" id="a'+Element[0].id+'"></i></td>'
                +'</tr>';
          
            $("#item").append(row);
            soma += vltotal;
            console.log("valortotal", vltotal);
            console.log("soma ", soma);
            $("#valorTotal").val(soma.toFixed(2));
        });
        
      }});
    }
    
    carregarItens();
    
    function calculaQuantidade(){
      var qtde = parseFloat($("#quantidade").val());
        console.log("qtde", qtde);
        var vlprod = parseFloat($("#valorU").val());
        console.log("qtde", vlprod);
        var calculo = qtde * vlprod;
        if (isNaN(calculo)){
          calculo = 0;
        }
        $("#valorT").val((calculo).toFixed(2));
    }
    
    $(document).on('click', '.x', function(){
        
        var id = this.id;
        id = id.split("a");
        console.log(id);
        // $("#r"+id[1]).empty();
        $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/itemvenda/"+id[1],
          method: "DELETE",
          complete: function(){
            carregarItens();
          }
        });
    });
    
    $.ajax({
      url: "https://haskalpha-romefeller.c9users.io/venda/"+id,
      method: "GET",
      success: function(json){

        valueInput(id,"cd");
        // valueInput(parseFloat(json["venda"]["valor"]).toFixed(2),"valorTotal");
        valueInput(json["venda"]["dataEmissao"],"venda");
        valueInput(json["venda"]["dataVencimento"],"vencimento");
        $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/cliente",
          method: "GET",
          success: function(cli){
            cli['Cliente'].forEach(function(Element){
                var cliente = new Option(Element["nome"], Element["id"], true, true);
                $("#cliente").append(cliente);
            });
            var int = parseInt(json["venda"]["clienteId"]);
            $("#cliente").val(int);
        }});
        
        $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/funcionario",
          method: "GET",
          success: function(funcionario){
            funcionario["Funcionario"].forEach(function(Element){
                var estado = new Option(Element["nome"], Element["id"], true, true);
                $("#funcionario").append(estado);
            });
            var int = parseInt(json["venda"]["funcionarioId"]);
            $("#funcionario").val(int);
        }});
        
        $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/produto",
          method: "GET",
          success: function(produto){
            produto["result"].forEach(function(Element){
                var prod = new Option(Element[0]["nome"], Element[0]["id"], true, true);
                $("#produto").append(prod);
                $("#produto").val(0);
            });
        }});
        
    }});
    
    $(document).on('change', '#produto', function(event){
      console.log(event.target.value);
      $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/produto/"+event.target.value,
          method: "GET",
          success: function(produto){
            console.log(produto["produto"]["valorVenda"])
            valueInput(produto["produto"]["valorVenda"].toFixed(2), "valorU");
            localStorage.setItem("qtdeEstoque", produto["produto"]["quantidade"] );
            $("#quantidade").attr("placeholder", "Em estoque: " + localStorage.getItem("qtdeEstoque"));
            calculaQuantidade();
        }});
    });
    
    $(document).on('change', 'input', "#quantidade", function(event) {
      console.log("qtdeEstoque",localStorage.getItem("qtdeEstoque") );
      console.log("quantidadeval", $("#quantidade").val() );
        if(parseInt($("#quantidade").val()) > parseInt(localStorage.getItem("qtdeEstoque"))){
            qtde = false;
            $("#quantidade").css("border-color","red");
        }else{
          $("#quantidade").css("border-color","");
            qtde = true;
            calculaQuantidade(); 
        }
        console.log("qtde bool", qtde);
    })
    
    
    $(document).on('click', '.plus', function(){
        if(qtde){
          var produtoId =parseInt($("#produto").val());
          var quantidade = parseInt($("#quantidade").val());
          var vlt = parseFloat($("#valorT").val());
          var id = parseInt($("#cd").val());
          calculaQuantidade();
          
          
          var itemVenda = {
            "produtoId"  : produtoId,
            "quantidade" : quantidade,
            "valorItem"  : vlt,
            "vendaId"    : id
          };
          
          
          
          console.log("itemVenda antes ", itemVenda);
          itemVenda = JSON.stringify(itemVenda);
          console.log("itemVenda depois ", itemVenda);
          
             $.ajax({
              url: "https://haskalpha-romefeller.c9users.io/itemvenda",
              method: "POST",
              data: itemVenda,
              success: function(json){
                console.log(json);
                console.log("post efetuado!");
                carregarItens();
                
              }
          });
        }
    });
    
    
    function salvar(){
      
      var json = {
        "dataVencimento" : $("#vencimento").val(),
        "dataEmissao"  : $("#venda").val(),
        "valor"  :  parseFloat($("#valorTotal").val()),
        // "vendaId" : $("#cd").val(),
        "clienteId" : parseInt($("#cliente").val()),
        "funcionarioId" : parseInt($("#funcionario").val()),
        "concluida" : true
      };
     
     console.log("salvando esse json", json);
     
      $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/venda/"+$("#cd").val(),
          method: "PUT",
          data: JSON.stringify(json),
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