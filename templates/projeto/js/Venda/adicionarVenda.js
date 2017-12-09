$(document).ready(function() {
    var qtde;
    var itensVenda =[];
    var produtos = [];
    var idItensVenda =0;
    $("#valorTotal").val(0);
    
    $("#dateV").val(dataAtual());
    
    $("#vencimento").val(dataAtual());
    //função q colocar os valores nos campos
    function valueInput(value,id) {
        $("#"+id).val(value)
    }
    
    function recarregar(){
      console.log("botao fchar");
      document.location.reload(true);
      window.location.reload(true);
    }
    
    $("#fechar").click(function(){
      recarregar();
    });
    
    function calculaTotal(){
        console.log(".vltotal", $(".vltotal") );
        var valorestotais= 0;
        console.log("valorestotais", valorestotais);
        // valorestotais = $(".vltotal").map(function(element){
        //     console.log("element.innertext", element[0].innerText);
        //     return element.innerText;
        // });
        // console.log("valores totais map", valorestotais);
        // console.log("vltotal class", $(".vltotal"));
        $(".vltotal").each(function(elemento) {
            valorestotais += parseFloat(this.innerHTML);
            console.log("valores totais dentro do each", valorestotais);
        });
        
        $("#valorTotal").val(valorestotais.toFixed(2));
        
        console.log("valorestotais ", valorestotais);
    }
    
    $("#valorTotal").text("0");
    
    // function carregarItens(){
    //   console.log("carregar itens");
    //   $(".itensVenda").empty();
      
    //   $.ajax({
    //     url: "https://haskalpha-romefeller.c9users.io/itemvenda/venda/"+id,
    //     method: "GET",
    //     success: function(json){
    //       console.log("json do carregarItens" ,json);
    //       var soma = 0;
    //       json["result"].forEach(function(Element){
    //         var vltotal = Element[0].quantidade * Element[1].valorVenda;
    //         var row = 
    //             '<tr class="itensVenda" id="r'+Element[0].id+'">'
    //             +'  <td>'+Element[0].id+'</td>'
    //             +'  <td>'+Element[1].nome+'</td>'
    //             +'  <td>'+Element[0].quantidade+'</td>'
    //             +'  <td>'+Element[1].valorVenda.toFixed(2) +'</td>'
    //             +'  <td class="vltotal">'+ (Element[0].quantidade * Element[1].valorVenda).toFixed(2) +'</td>'

    //             +'  <td><i class="fa fa-times x" click="" id="a'+Element[0].id+'"></i></td>'
    //             +'</tr>';
          
    //         $("#item").append(row);
    //         soma += vltotal;
    //         console.log("valortotal", vltotal);
    //         console.log("soma ", soma);
    //         $("#valorTotal").val(soma.toFixed(2));
    //     });
        
    //   }});
    // }
    
    // carregarItens();
    
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
        $("#r"+id[1]).empty();
        itensVenda.splice(id);
        console.log("length depos do splice", itensVenda);
        calculaTotal();
    });
    
    // $.ajax({
    //   url: "https://haskalpha-romefeller.c9users.io/venda/"+id,
    //   method: "GET",
    //   success: function(json){

    //     valueInput(id,"cd");
    //     // valueInput(parseFloat(json["venda"]["valor"]).toFixed(2),"valorTotal");
    //     valueInput(json["venda"]["dataEmissao"],"venda");
    //     valueInput(json["venda"]["dataVencimento"],"vencimento");
        $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/cliente",
          method: "GET",
          success: function(cli){
            cli['Cliente'].forEach(function(Element){
                var cliente = new Option(Element["nome"], Element["id"], true, true);
                $("#cliente").append(cliente);
            });
            $("#cliente").val(0);
        }});
        
        // $.ajax({
        //   url: "https://haskalpha-romefeller.c9users.io/funcionario",
        //   method: "GET",
        //   success: function(funcionario){
        //     funcionario["Funcionario"].forEach(function(Element){
        //         var estado = new Option(Element["nome"], Element["id"], true, true);
        //         $("#funcionario").append(estado);
        //     });
        //     var int = parseInt(json["venda"]["funcionarioId"]);
        //     $("#funcionario").val(int);
        // }});
        
        $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/produto",
          method: "GET",
          success: function(produto){
            produto["result"].forEach(function(Element){
                produtos.push(Element);
                var prod = new Option(Element[0]["nome"], Element[0]["id"], true, true);
                $("#produto").append(prod);
                $("#produto").val(0);
            });
        }});
        
    // }});
    
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
            $("#quantidade").val(null);
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
    });
    
    
    $(document).on('click', '.plus', function(){
        if((qtde) && ( $("#produto").val() != 0) && ( $("#quantidade").val() > 0)){
          var produtoId =parseInt($("#produto").val());
          var quantidade = parseInt($("#quantidade").val());
          var vlu = parseFloat($("#valorU").val());
          var vlt = parseFloat($("#valorT").val());
          var id = parseInt($("#cd").val());
          calculaQuantidade();
          
          
          var itemVenda = {
            "produtoId"  : produtoId,
            "quantidade" : quantidade,
            "valorItem"  : vlt,
            "vendaId"    : null
          };
          
          itensVenda[++idItensVenda]= itemVenda;
          console.log("length depois do push ",itensVenda);
          
           var row = 
                '<tr class="itensVenda" id="r'+idItensVenda+'">'
                +'  <td>'+ idItensVenda +'</td>'
                +'  <td>'+$("#produto :selected").text()+'</td>'
                +'  <td>'+quantidade+'</td>'
                +'  <td>'+vlu.toFixed(2) +'</td>'
                +'  <td class="vltotal">'+vlt.toFixed(2) +'</td>'

                +'  <td><i class="fa fa-times x" click="" id="a'+idItensVenda+'"></i></td>'
                +'</tr>';
          
            $("#item").append(row);
            
            calculaTotal();
          
          
          
        //   console.log("itemVenda antes ", itemVenda);
        //   itemVenda = JSON.stringify(itemVenda);
        //   console.log("itemVenda depois ", itemVenda);
          
        //      $.ajax({
        //       url: "https://haskalpha-romefeller.c9users.io/itemvenda",
        //       method: "POST",
        //       data: itemVenda,
        //       success: function(json){
        //         console.log(json);
        //         console.log("post efetuado!");
        //         carregarItens();
                
              }
          });
    //     }
    // });
    
    
    function salvar(){
      
      var funcionario = JSON.parse(localStorage.getItem("Dados_Funcionario"));
      console.log("dados funcionario", funcionario);
      var json = {
        "dataVencimento" : $("#vencimento").val(),
        "dataEmissao"  : $("#dateV").val(),
        "valor"  :  parseFloat($("#valorTotal").val()),
        // "vendaId" : $("#cd").val(),
        "clienteId" : parseInt($("#cliente").val()),
        "funcionarioId" :  funcionario.Funcionario.id, //pegar pelo login
        "concluida" : true
      };
     
     console.log("salvando esse json", json);
     
      $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/venda/",
          method: "POST",
          data: JSON.stringify(json),
          success: function(response){
              console.log("lista de itensvenda", itensVenda);
            console.log("response", response.vendaId);
            localStorage.setItem("vendaId", response.vendaId);
            salvarItensVenda();
            gerarConta(json);
            $('#success').modal({show: 'true'}); 
            $("#imprimir").click(function(){
              window.location="../reciboVenda.html";
            });
          },
          error: function(response){
            $('#error').modal({show: 'false'});
          }
      });
    }
    
    function salvarItensVenda(){
        console.log("o id ", localStorage.getItem("vendaId"));
        itensVenda = itensVenda.map(function(element){
             element.vendaId = parseInt(localStorage.getItem("vendaId"));
             return element;
        });
        
        itensVenda.forEach(function(element){
            console.log("olha ai o element ", element);
            var json = JSON.stringify(element);
                $.ajax({
                  url: "https://haskalpha-romefeller.c9users.io/itemvenda",
                  method: "POST",
                  data: json,
                  success: function(response){
                      console.log("salvou primeiro item ", element);
                      console.log("Produtos ", produtos);
                      console.log("Itens venda ",element);
                      produtos = produtos.map(function(prod){
                        if (prod[0].id == element.produtoId){
                          console.log("prod dentro do map ", prod);
                          prod[0].quantidade -= element.quantidade;
                        }
                        return prod;
                      });
                      console.log("produtos pos map ", produtos);
                      atualizaEstoque();
                  },
                  error: function(response){
                      console.log("É, deu rui ", element);
                  }
              });
        });
        
      function atualizaEstoque(){
        produtos.forEach(function(element){
          var produtoId = element[0].id;
          
          var json = {
            "marca": element[0].marca,
            "excluido": element[0].excluido,
            "valorCusto": element[0].valorCusto,
            "quantidadeMin": element[0].quantidadeMin,
            "nome": element[0].nome,
            "fornecedorId": element[0].fornecedorId,
            "quantidade": element[0].quantidade,
            "valorVenda": element[0].valorVenda
          }
          console.log("json do estoque", json);
          json = JSON.stringify(json);
          console.log("json string estoque" , json);
          
          $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/produto/" + produtoId,
          method: "PUT",
          data: json,
          success: function(response){
            console.log("atualizou estoque!");
          },
          error: function(response){
            console.log("nao atualizou estoque :(");
          }
      });
          
          
        });
      }
    //     $.ajax({
    //       url: "https://haskalpha-romefeller.c9users.io/venda/",
    //       method: "POST",
    //       data: JSON.stringify(json),
    //       success: function(response){
              
    //       },
    //   });
    }
    
    function gerarConta(json){
      var codigo = ("000000000" + (Math.floor((Math.random() * 999999999)) + 1)).slice(-9);
      console.log("json do gerarConta", json);
      console.log("json parseado", json);
      var jsonConta = {
        "dataEmissao": json.dataEmissao,
        "dataVencimento": json.dataVencimento,
        "historico": "Conta referente a venda de código: " + localStorage.getItem("vendaId"),
        "clienteId": json.clienteId,
        "fornecedorId": null,
        "icPagarReceber": false,
        "icPago": false,
        "valor": json.valor,
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
    
    $("#salvar").click(function() {
      if ($("#valorTotal").val() >0){
        salvar();    
      }else{
        $('#error').modal({show: 'false'});
      }
      
    });

});