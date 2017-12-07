$(document).ready(function() {
    var table = $('#example1').DataTable();
    
    var promisse1 = $.ajax("https://haskalpha-romefeller.c9users.io/cliente").promise();
    var promisse2 = $.ajax("https://haskalpha-romefeller.c9users.io/contasReceber").promise();
    
    Promise.all([promisse1,promisse2]).then(function(arr){
        console.log("array cliente" , arr[0]);
        console.log("array contas", arr[1]);
        var clientes = arr[0].Cliente;
        var contasReceber = arr[1].Conta;
        contasReceber.forEach(function(Element){
            Element.cliente = clientes.filter(function(cliente){
                return cliente.id == Element.clienteId;
        })[0]; //o [0] se faz necessário pois o filter retorna um array
            
            if ((dataValor(Element.dataVencimento) < dataValor(dataAtual())) && (Element.icPago == false)){
                table.row.add([
                    Element.id,    
                    Element.codigo,
                    Element.valor.toFixed(2),
                    Element.cliente.nome,
                    Element.dataVencimento,
                    "<div class='organiza'><i id='e"+Element.id +"' class='fa fa-window-close btnX'></i><i id='a"+Element.id+"' class='fa fa-pencil-square btnE'></i></div>"
                ]).draw(false).nodes().to$().attr("id","eq"+Element.id);
            }
        });
        
    });
    
    $(document).on('click', '.btnE', function(){
        var id = this.id;
        id = id.split("a");
        localStorage.setItem('contaId', id[1]);
        localStorage.setItem('tipoConta', "receber");
        window.location="../Conta/editarConta.html"; 
    });
    
    $(document).on('click', '.btnX', function(){
        var table = $('#example1').DataTable();
        var id = this.id;
        id = id.split("e");
        table.row("#eq"+id[1]).remove().draw();
        $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/conta/"+id[1],
          method: "DELETE"
        });
    });
});