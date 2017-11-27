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