$(document).ready(function() {
    
    //função q colocar os valores nos campos
    function valueInput(value,id) {
        $("#"+id).val(value)
    }
    
    $.ajax({
      url: "https://haskalpha-romefeller.c9users.io/estado/",
      method: "GET",
      success: function(estados){
        estados["estados"].forEach(function(Element){
            var estado = new Option(Element["nome"], Element["id"], true, true);
            $("#estado").append(estado);
        });
        $("#estado").val(0);
    }});
    

    function salvar(){
      var nome = $("#razao").val();
      var logradouro = $("#logradouro").val();
      var cep = $("#cep").val();
      var cnpj = $("#cnpj").val();
      var contato = $("#nomeContato").val();
      var telefone = $("#tell").val();
      var email = $("#email").val();
      var bairro = $("#bairro").val();
      var excluido = "false";
      var complemento = $("#complemento").val();
      var cidadeId = parseInt($("#cidade").val());
      var estadoId = parseInt($("#estado").val());
      
      var json = '{"nome":"'+nome+'",'
               + '"logradouro":"'+logradouro+'",'
               + '"cep":"'+cep+'",'
               + '"cnpj":"'+cnpj+'",'
               + '"contato":"'+contato+'",'
               + '"telefone":"'+telefone+'",'
               + '"email":"'+email+'",'
               + '"bairro":"'+bairro+'",'
               + '"excluido": false,'
               + '"complemento":"'+complemento+'",'
               + '"cidadeId":'+cidadeId+','
               + '"estadoId":'+estadoId+''
               + '}';
      console.log(json);
    
      $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/fornecedor/",
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