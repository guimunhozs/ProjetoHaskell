$(document).ready(function() {
    var id = localStorage.getItem("produtoId");
    
    //função q colocar os valores nos campos
    function valueInput(value,id) {
        $("#"+id).val(value)
    }
    
    $.ajax({
      url: "https://haskalpha-romefeller.c9users.io/produto/"+id,
      method: "GET",
      success: function(json){
         var prod = json;
         console.log(prod)
        valueInput(id,"cd");
        valueInput(prod["produto"]["nome"],"nome");
        valueInput(prod["produto"]["marca"],"marca");
        valueInput(prod["produto"]["quantidadeMin"],"qtdM");
        valueInput(prod["produto"]["quantidade"],"qtd");
        valueInput(parseFloat(prod["produto"]["valorVenda"]).toFixed(2),"vlV");
        valueInput(parseFloat(prod["produto"]["valorCusto"]).toFixed(2),"vlC");

        $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/fornecedor/",
          method: "GET",
          success: function(json){
            console.log(json['result']);
            json['result'].forEach(function(Element){
              console.log(Element);
                var estado = new Option(Element[0]["nome"], Element[0]["id"], true, true);
                $("#fornecedor").append(estado);
            });
            var int = parseInt(prod["produto"]["fornecedorId"]);
            $("#fornecedor").val(int);
        }});
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
          url: "https://haskalpha-romefeller.c9users.io/produto/"+$("#cd").val(),
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

});