import "bootstrap";

import './filme-detalhe.css';
import { FilmeService } from "../../services/filme.service";
import { Filme } from "../../models/filme";
import { FilmeUnitario } from "../../models/filmeUnitario";
import { FilmeFavoritoService } from "../../services/filme-favoritos.service";

export class DetalheFilme {
  private filmeFavoritoService: FilmeFavoritoService;
  private filmeService: FilmeService;
  private urlImg = 'https://image.tmdb.org/t/p/original';
  private urlPesquisaId = new URLSearchParams(window.location.search);

  gridCards: HTMLDivElement;
  divGeneros: HTMLDivElement;
  iconeCoracao: HTMLElement;

  imgPoster: HTMLImageElement;
  iframeTrailer: HTMLIFrameElement;
  descricaoFilme: HTMLElement;

  totalVotos: HTMLParagraphElement;
  dataLancamento: HTMLElement;
  titulo: HTMLElement;

  divItemCarrosselTreiler: HTMLDivElement;
  creditoAtores: HTMLParagraphElement;
  creditoEscritores: HTMLParagraphElement;
  creditoDiretor: HTMLParagraphElement;

  constructor() {
    this.filmeFavoritoService = new FilmeFavoritoService();
    this.filmeService = new FilmeService();
    this.registrarElementos();
    this.registrarEventos();
    this.pegarFilmePelaUrl();
    this.escolherFilmesAleatorios();
  }

  private gerarGrid(listaFilmes: Filme[]) {
    let i = 0;

    for(let filme of listaFilmes){
      if(i <= 5){
        const card = this.gerarCards(filme);
        
        this.gridCards.appendChild(card);

        if(i == 5){
          return
        }
      }
      i++;
    }
  }

  private gerarCards(filme: Filme): HTMLDivElement {
    const divcoluna = document.createElement("div");
    const divCard = document.createElement("div");
    const imgCard = document.createElement("img");
    const textoCard = document.createElement("p");

    divcoluna.classList.add("col-6", "col-md-4", "col-lg-2", "mt-2");
    divCard.classList.add("d-grid", "gap-2", "text-center");
    imgCard.classList.add("img-fluid", "rounded-3", "click-img");
    textoCard.classList.add("fs-5", "link-warning", "text-decoration-none");

    imgCard.src = this.urlImg + filme.imgPoster;
    textoCard.textContent = filme.titulo;

    divCard.appendChild(imgCard);
    divCard.appendChild(textoCard);
    divcoluna.appendChild(divCard);

    divCard.addEventListener("click", () => {
      this.redirecionarUser(filme.id);
    });

    return divcoluna;
  }

  private pegarCreditos(filme: FilmeUnitario): void{
    let j = 0;
    for(let i = 0; i < filme.creditoTrabalhadores.length; i++){
      if(filme.creditoTrabalhadores[i].known_for_department == 'Directing'){
        this.creditoDiretor.textContent +=  filme.creditoTrabalhadores[i].name + ', ';
      }
      else if(filme.creditoTrabalhadores[i].known_for_department == 'Writing'){
        this.creditoEscritores.textContent +=  filme.creditoTrabalhadores[i].name + ', ';
      }
    }

    for(let i = 0; i < 6; i++){
      if(filme.creditoAtores[i].known_for_department == 'Acting') {
        this.creditoAtores.textContent +=  filme.creditoAtores[i].name + ', ';
      }
    }
  }

  private gerarCarrosselTreiler(filme: FilmeUnitario): void{
    for(let i = 0; i < filme.videoTreiler.length; i++){
      const divItem = document.createElement('div');
      const iframe = document.createElement('iframe');

      divItem.classList.add("carousel-item", "active", "h-100", "click-img");

      iframe.classList.add("rounded-3", "w-100", "h-100", "click-img");
      iframe.frameBorder = "0";
      iframe.allowFullscreen = true;
      iframe.src = 'https://www.youtube.com/embed/' + filme.videoTreiler[i].key;

      divItem.appendChild(iframe);
      console.log(divItem)
      this.divItemCarrosselTreiler.appendChild(divItem);
    }
  }

  private criarGeneros(filme: FilmeUnitario): void{
    for(let i = 0; i < filme.genero.length; i++){
      const gen = document.createElement('div');

      gen.classList.add("badge", "rounded-pill", "fs-5", "bg-warning", "text-dark");
      gen.textContent = filme.genero[i].name;

      this.divGeneros.classList.add("row", "gy-3");
      this.divGeneros.appendChild(gen);
    }
  }

  private redirecionarUser(id: number){
    window.location.href = `filme-detalhe.html?id=${id}`;
  }

  pegarFilmePelaUrl(){
    const id = this.urlPesquisaId.get("id") as string;

    const ehFavorito = this.filmeFavoritoService.verificarFavorito(id);

    if(ehFavorito){
      this.iconeCoracao.classList.replace('bi-heart', 'bi-heart-fill');
    }
    else{
      this.iconeCoracao.classList.replace('bi-heart-fill', 'bi-heart');
    }
    
    this.pesquisarPorId(id);
  }

  pesquisarPorId(id: string){
    this.filmeService.buscarPorId(id)
    .then(res => this.exibirFilme(res))
    .catch(erro => this.exibirErro(erro));
  }

  exibirFilme(filme: FilmeUnitario): void{
    this.criarGeneros(filme);
    this.gerarCarrosselTreiler(filme);
    this.pegarCreditos(filme);
    this.iconeCoracao.classList.add('click-img');

    this.imgPoster.src = 'https://image.tmdb.org/t/p/w500' + filme.imgPoster;
    this.descricaoFilme.textContent = filme.descricao;

    this.totalVotos.textContent = filme.totalVotos + ' votos';
    this.dataLancamento.textContent = filme.dataLancamento;

    this.titulo.textContent = filme.titulo;
  }

  registrarElementos(){
    this.gridCards = document.getElementById("divGridCard") as HTMLDivElement;
    this.iconeCoracao = document.getElementById("iconeCoracao") as HTMLDivElement;

    this.divGeneros = document.getElementById("divGeneros") as HTMLDivElement;
    this.imgPoster = document.getElementById("imgPoster") as HTMLImageElement;

    this.iframeTrailer = document.getElementById("iframeTrailer") as HTMLIFrameElement;
    this.descricaoFilme = document.getElementById("descricaoFilme") as HTMLElement;

    this.totalVotos = document.getElementById("totalVotos") as HTMLParagraphElement;
    this.dataLancamento = document.getElementById("dataLancamento") as HTMLElement;

    this.titulo = document.getElementById("titulo") as HTMLElement;
    this.divItemCarrosselTreiler = document.getElementById("divItemCarrosselTreiler") as HTMLDivElement;

    this.creditoAtores = document.getElementById("atores") as HTMLParagraphElement;
    this.creditoEscritores = document.getElementById("escritores") as HTMLParagraphElement;
    this.creditoDiretor = document.getElementById("diretor") as HTMLParagraphElement;
  }

  registrarEventos(){
    this.iconeCoracao.addEventListener('click', () => this.adicionarFavoritos());
  }

  adicionarFavoritos(){
    if(this.iconeCoracao.classList.contains('bi-heart')){
      this.iconeCoracao.classList.replace('bi-heart', 'bi-heart-fill');
    }
    else{
      this.iconeCoracao.classList.replace('bi-heart-fill', 'bi-heart');
    }

    const id = this.urlPesquisaId.get("id") as string;

    this.filmeFavoritoService.favoritar(id);
  }

  async escolherFilmesAleatorios(){
    let index = Math.floor(Math.random() * 2);
    let response: Filme[];

    switch(index){
      case 0: 
        response = await this.filmeService.buscarFilmesPop();
        this.gerarGrid(response);
        break;

      case 1: 
        response = await this.filmeService.buscarFilmesCartaz();
        this.gerarGrid(response);
        break;

      case 2: 
        response = await this.filmeService.buscarFilmesMaisVotados();
        this.gerarGrid(response);
        break;
    }
  }

  // private buscar(sender: Event): void {
  //   sender.preventDefault();

  //   if (!this.inputBuscar.value) return;

  //   const titulo = this.inputBuscar.value;
  //   this.inputBuscar.value = '';
    
  //   this.pesquisarFilmePorTitulo(titulo, true);
  // }

  exibirErro(erro: Error): void{
    const divNotificacao = document.createElement('div'); 
    
    divNotificacao.textContent = erro.message;
    
    divNotificacao.classList.add('notificacao');

    divNotificacao.addEventListener('click', (sender: Event) => {
      (sender.target as HTMLElement).remove()
    });
      
    document.body.appendChild(divNotificacao);

    setTimeout(() => {
      divNotificacao.remove();
    }, 5000);
  }

}

window.addEventListener('load', () => new DetalheFilme());