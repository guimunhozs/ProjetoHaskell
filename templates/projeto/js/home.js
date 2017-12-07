$(document).ready(function() {
    
    var qtdeTotalProdutos;
    var qtdeProdutos;
    
    var qtdeTotalContasReceber;
    var qtdeContasReceber;
    
    var qtdeTotalContasPagar;
    var qtdeContasPagar;
    
    var qtdeTotalServicos;
    var qtdeServicos;
    
    $.ajax({
     url: "https://haskalpha-romefeller.c9users.io/produto",
     method: "GET",
     success:function(json){
         qtdeTotalProdutos = 0;
         qtdeProdutos = 0;
         console.log("json ", json);
         console.log("json.result ", json.result);
         json.result.forEach(function(Element){
             qtdeTotalProdutos++;
             if (Element[0].quantidadeMin > Element[0].quantidade){
                 qtdeProdutos++;
             }
             
         });
         $("#qtProdutosMin").text(qtdeProdutos);
         
         if(qtdeProdutos == 0){
            $("#produtosIcon").removeClass("bg-aqua").addClass("bg-green")
         }else if (qtdeProdutos >= (qtdeTotalProdutos * 0.3)){
             $("#produtosIcon").removeClass("bg-aqua").addClass("bg-red");
         }else {
             $("#produtosIcon").removeClass("bg-aqua").addClass("bg-yellow");
         }
     }
    });
    
    $.ajax({
     url: "https://haskalpha-romefeller.c9users.io/contasPagar",
     method: "GET",
     success:function(json){
         qtdeTotalContasPagar = 0;
         qtdeContasPagar = 0;
         console.log("json ", json);
         console.log("json.result ", json.Conta);
         json.Conta.forEach(function(Element){
             qtdeTotalContasPagar++;
             if ((dataValor(Element.dataVencimento) < dataValor(dataAtual())) && (Element.icPago == false)){
                 qtdeContasPagar++;
             }
             
         });
         $("#qtContasPagar").text(qtdeContasPagar);
         
         if(qtdeContasPagar == 0){
            $("#pagarIcon").removeClass("bg-aqua").addClass("bg-green")
         }else if (qtdeContasPagar >= (qtdeTotalContasPagar * 0.3)){
             $("#pagarIcon").removeClass("bg-aqua").addClass("bg-red");
         }else {
             $("#pagarIcon").removeClass("bg-aqua").addClass("bg-yellow");
         }
     }
    });
    
    $.ajax({
     url: "https://haskalpha-romefeller.c9users.io/contasReceber",
     method: "GET",
     success:function(json){
         qtdeTotalContasReceber = 0;
         qtdeContasReceber = 0;
         console.log("json ", json);
         console.log("json.result ", json.Conta);
         json.Conta.forEach(function(Element){
             qtdeTotalContasReceber++;
             if ((dataValor(Element.dataVencimento) < dataValor(dataAtual())) && (Element.icPago == false)){
                 qtdeContasReceber++;
             }
             
         });
         $("#qtContasReceber").text(qtdeContasReceber);
         
         if(qtdeContasReceber == 0){
            $("#receberIcon").removeClass("bg-aqua").addClass("bg-green")
         }else if (qtdeContasReceber >= (qtdeTotalContasReceber * 0.3)){
             $("#receberIcon").removeClass("bg-aqua").addClass("bg-red");
         }else {
             $("#receberIcon").removeClass("bg-aqua").addClass("bg-yellow");
         }
     }
    });
    
    $.ajax({
     url: "https://haskalpha-romefeller.c9users.io/servico",
     method: "GET",
     success:function(json){
         qtdeTotalServicos = 0;
         qtdeServicos = 0;
         console.log("json ", json);
         console.log("json.result ", json.Conta);
         json.result.forEach(function(Element){
             qtdeTotalServicos++;
             if (Element[0].dataFinal == null){
                 qtdeServicos++;
             }
             
         });
         $("#qtServicos").text(qtdeServicos);
         
        //  if(qtdeServicos == 0){
        //     $("#servicoIcon").removeClass("bg-aqua").addClass("bg-green")
        //  }else if (qtdeContasReceber >= (qtdeTotalContasReceber * 0.3)){
        //      $("#servicoIcon").removeClass("bg-aqua").addClass("bg-red");
        //  }else {
        //      $("#servicoIcon").removeClass("bg-aqua").addClass("bg-yellow");
        //  }
     }
    });
    
});