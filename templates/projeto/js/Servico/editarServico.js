$(document).ready(function() {
    var id = localStorage.getItem("servicoId");
    
    var vlInicial = 0.0;
    
    //função q colocar os valores nos campos
    function valueInput(value,id) {
        $("#"+id).val(value)
    }
    
    function getDataFinal(){
        if($("#dataT").val() == ""){
          return null;
        }else{
          return $("#dataT").val();
        }
    }
    
    $.ajax({
      url: "https://haskalpha-romefeller.c9users.io/servico/"+id,
      method: "GET",
      success: function(json){
         var serv = json;
         //guardar no local storage para ermianr o salvar
         localStorage.setItem("servico", JSON.stringify(serv));
         console.log(serv)
        valueInput(id,"cd");
        valueInput(serv["Servico"]["nome"],"nome");
        valueInput(serv["Cliente"]["nome"],"cliente");
        valueInput(parseFloat(serv["Servico"]["valor"]).toFixed(2),"vlF");
        valueInput(serv["Equipamento"]["nome"],"equipamento");
        valueInput(serv["Servico"]["dataInicial"],"dataI");
        valueInput(serv["Servico"]["dataFinal"],"dataF");
        valueInput(serv["Servico"]["observacaoEntrada"],"descEntrada");
        valueInput(serv["Servico"]["diagnosticoCliente"],"descCliente");
        valueInput(serv["Servico"]["diagnosticoTecnico"],"descTecnico");
        
        $(".andamentos").empty();
        serv.Andamento.forEach(function(element){
          
          var row = 
                '<tr class="andamentos" id="r'+element[0].id+'">'
                +'  <td>'+ element[0].nome +'</td>'
                +'  <td>'+ element[0].dateAndamento+'</td>'
                +'  <td class="vlServ">'+element[0].valor.toFixed(2)+'</td>'
                +'  <td>'+ element[1].nome+'</td>'
                +'  <td><i class="fa fa-times x" click="" id="a'+element[0].id+'"></i></td>'
                +'</tr>';
          
            $("#andamento").append(row);
            
            calculoValorServico();
        });
        
    }});
    
    function calculoValorServico(){
      var valorestotais =0;
      $(".vlServ").each(function(elemento) {
            valorestotais += parseFloat(this.innerHTML);
            console.log("valores totais dentro do each", valorestotais);
        });
        console.log("valores fora do each". valorestotais);
        $("#valorTotal").val(valorestotais.toFixed(2));
    }
    
    $(document).on('click', '.x', function(){
        var id = this.id;
        id = id.split("a");
        $("#r"+id[1]).remove();
        calculoValorServico();
        var index=0;
        var serv = JSON.parse(localStorage.getItem("servico"));
        serv["Andamento"].forEach(function(Element,Index){
              if(Element[0]["id"] == id[1]){
                //console.log("removeu")
                serv["Andamento"].splice(Index,1);
              }
              //console.log(Element[0]["id"], Index)
        });
        var valor = 0 ;
        serv["Andamento"].forEach(function(Element){
          console.log(Element)
            valor += parseFloat(Element[0]["valor"]);
        });
        valueInput(parseFloat(valor).toFixed(2),"vlF");
        localStorage.setItem("servico",JSON.stringify(serv));
        
        $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/andamento/"+id[1],
          method: "DELETE",
          success: function(){
          }
        });
    });
    
    $(document).on('click', '#adcAndamento', function(){
      window.location="../Servico/adicionarAndamento.html";
    });
    
    
    function salvar(){
      var serv = localStorage.getItem("servico");
      serv = JSON.parse(serv);
      var valor = 0;
      var andamento = serv["Andamento"];
      console.log(serv["Andamento"]);
      // andamento.forEach(function(Element){
      //   console.log(Element)
      //     valor += parseFloat(Element[0]["valor"]);
      // });

      // console.log(valor);
      
      var json = {
        "nome"                : serv["Servico"].nome,
        "diagnosticoCliente"  : serv["Servico"].diagnosticoCliente,
        "diagnosticoTecnico"  : $("#descTecnico").val(),
        "observacaoEntrada"   : serv["Servico"].observacaoEntrada,
        "dataInicial"         : $("#dataI").val(),
        "dataFinal"           : getDataFinal(),
        "status"              : 1,
        "valor"               : parseFloat($("#valorTotal").val()),
        "equipamentoId"       : parseInt(serv["Servico"].equipamentoId)
      };
     
      $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/servico/"+$("#cd").val(),
          method: "PUT",
          data: JSON.stringify(json),
          success: function(result){
            $('#success').modal({show: 'true'}); 
          },
          error: function(result){
            $('#error').modal({show: 'false'});
          }
      });
    }
    
    $("#salvar").click(function() {
      salvar();
    });

});