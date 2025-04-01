const baseUrl = "https://charadas-api-livid.vercel.app";
const aleatorio = "/charadas";
let respostaCharada = '';
let respostaUsuario = '';

async function getCharada() {
    try{
        const charada = await fetch(baseUrl+aleatorio);
        console.log(charada);
        const charadaJson = await charada.json();
        console.log(charadaJson.pergunta);
        //Trazer a pergunta do Back-end
        document.getElementById("charada-pergunta").innerText = charadaJson.pergunta
        //Guardando a resposta 
        respostaCharada = charadaJson.resposta
        console.log(respostaCharada);

 // Adiciona evento ao botão "Ver resposta"
document.getElementById("ver-resposta").addEventListener("click", function() {
    // Pegando a resposta digitada pelo usuário
    let respostaUsuario = document.getElementById("input-resposta").value;
    
    // Convertendo para letras minúsculas e removendo espaços extras
    respostaUsuario = respostaUsuario.toLowerCase().trim();
    let respostaCerta = respostaCharada.toLowerCase().trim();
    
    // Pegando a div onde será mostrada a resposta
    let respostaContainer = document.getElementById("resposta-container");

    // Comparando a resposta do usuário com a correta
    if (respostaUsuario === respostaCerta) {
        respostaContainer.innerHTML = "<p style='color: green; font-weight: bold;'>Correto! 🎉</p>";
    } else if (respostaUsuario !== "" && respostaCerta.includes(respostaUsuario)) {
        respostaContainer.innerHTML = "<p style='color: orange; font-weight: bold;'>Quase lá! 🤔 A resposta correta é: " + respostaCharada + "</p>";
    } else {
        respostaContainer.innerHTML = "<p style='color: red; font-weight: bold;'>Errado! ❌ A resposta correta é: " + respostaCharada + "</p>";
    }
});
        
    }catch (error){
        console.log("Erro ao chamar a API: "+error);
    } 
}
getCharada()