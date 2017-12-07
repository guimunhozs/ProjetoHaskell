$(document).ready(function() {
    
    $.ajax({
      url: "https://haskalpha-romefeller.c9users.io/cliente",
      method: "GET",
      success: function(json){
        json["Cliente"].forEach(function(Element){
            var estado = new Option(Element["nome"], Element["id"], true, true);
            $("#cliente").append(estado);
        });
        $("#cliente").val(0);
    }});
    
    function getDataFinal(){
        if($("#dataSaida").val() == ""){
          return null;
        }else{
          return $("#dataSaida").val();
        }
    }
    
    $("#imprimir").click(function() {
      window.location.replace("../recibo.html");
    });
    
    function gerarAndamento(){
      var funcionario = JSON.parse(localStorage.getItem("Dados_Funcionario"));
      var json = {
        "status" : "1",
        "descricao" : $("#descricaoTecnico").val() ,
        "valor" : parseFloat($("#valor").val()),
        "numero" : 1,
        "dateAndamento" : $("#dataEntrada").val(),
        "nome" : $("#nome").val(),
        "funcionarioId" : funcionario.Funcionario.id, // pegar funcionario do login
        "servicoId" : parseInt(localStorage.getItem("servId"))
      };
      console.log("json do andamento ", json);
      $.ajax({
        url: "https://haskalpha-romefeller.c9users.io/andamento",
        method: "POST",
        data: JSON.stringify(json),
        success: function(){
          console.log("salvou andamento");
          $('#success').modal({show: 'true'}); 
        },
        error: function(){
          console.log("nao salvou andamento");
          $('#error').modal({show: 'false'});
        }
      });
    }

    function salvar(){
      var diagnosticoCliente = $("#descricaoCliente").val();
      var nome = $("#nome").val();
      var valor = parseFloat($("#valor").val());
      var dataInicial = $("#dataEntrada").val();
      var status = 1;
      var equipamentoId = parseInt($("#equipamento").val());
      var diagnosticoTecnico = $("#descricaoTecnico").val();
      var observacaoEntrada = $("#descricaoEntrada").val();
      var dataFinal = getDataFinal();
      
      console.log("dataFinal", dataFinal);
      
      
      
      json = {
          "diagnosticoCliente": diagnosticoCliente,
          "dataFinal": dataFinal,
          "status": status,
          "equipamentoId": equipamentoId,
          "nome": nome,
          "diagnosticoTecnico": diagnosticoTecnico,
          "observacaoEntrada": observacaoEntrada,
          "valor": valor,
          "dataInicial": dataInicial
        }
        
        console.log("json servico ", json);
        
        json = JSON.stringify(json);
        
        console.log("json servico stringfado ", json);
        
        $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/servico",
          method:"POST",
          data: json,
          success: function(response){
            localStorage.setItem("servId", response.servicoId );
            gerarAndamento();
            console.log("deu certo!");
          },
          error: function(){
            console.log("Falhou!");
          }
        });
      // $.ajax({
      //     url: "https://haskalpha-romefeller.c9users.io/produto/",
      //     method: "POST",
      //     data: json,
      //     success: function(result){
      //       $('#success').modal({show: 'true'}); 
      //     },
      //     error: function(result){
      //       $('#error').modal({show: 'false'})
      //     }
      // });
    }
    
    $("#salvar").click(function() {
      salvar();
    });
    
    $("#cliente").change(function(){
      console.log("inicio da funcao, value ",$("#cliente").val() );
      $('#equipamento').empty();
      var equipamento = new Option("Selecione um Equipamento", 0, true, true);
      $("#equipamento").append(equipamento);
      
      $.ajax({
        url: "https://haskalpha-romefeller.c9users.io/equipamento/cliente/"+ ($("#cliente").val()),
        method: "GET",
        success: function(equipamentos){
          console.log("inicio do ajax");
          equipamentos["Equipamento"].forEach(function(Element){
            console.log("ajax element", Element);
              equip = new Option(Element.nome, Element.id, true, true);
              $("#equipamento").append(equip);
          });
          $("#equipamento").val(0);
      }});
    });
});