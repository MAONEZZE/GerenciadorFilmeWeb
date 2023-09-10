import "bootstrap";

import './tela-inicio.css';
import { FilmeService } from "../../services/filme.service";
import { Filme } from "../../models/filme";

class TelaInicio {
  private filmeService: FilmeService;
  private urlImg = 'https://image.tmdb.org/t/p/original';

  gridCards: HTMLDivElement;
  divCarrossel: HTMLDivElement;
  divImgsCarrossel: HTMLDivElement;

  tituloFilme: HTMLElement;
  descFilme: HTMLParagraphElement;

  inputBuscar: HTMLInputElement;
  formBuscar: HTMLFormElement;

  imgCardCarrossel: HTMLImageElement;
  filmesPopulares: Filme[] = [];


  constructor() {
    this.filmeService = new FilmeService();
    this.registrarElementos();
    this.registrarEventos();
    this.getFilmesPopulares();
    this.getFilmesCartaz();
    this.getFilmesMaisVotados();

  }

  registrarElementos() {
    this.gridCards = document.getElementById("divGridCard") as HTMLDivElement;

    this.divImgsCarrossel = document.getElementById("divImgsCarrossel") as HTMLDivElement;
    this.divCarrossel = document.getElementById("divCarrossel") as HTMLDivElement;

    this.tituloFilme = document.getElementById("filmeTitulo") as HTMLElement;
    this.descFilme = document.getElementById("filmeDesc") as HTMLParagraphElement;

    this.imgCardCarrossel = document.getElementById("imgCard") as HTMLImageElement;

    this.inputBuscar = document.getElementById("inputBuscar")as HTMLInputElement;
    this.formBuscar = document.getElementById("formBuscar") as HTMLFormElement;
  }

  registrarEventos() {
    this.divCarrossel.addEventListener('slide.bs.carousel', (event) => {
      this.mudarCarrossel(event)
    });

    this.formBuscar.addEventListener("submit", (sender) => this.buscar(sender));
  
  }

  private buscar(sender: Event): void {
    sender.preventDefault();

    if (!this.inputBuscar.value) return;

    const titulo = this.inputBuscar.value;
    this.inputBuscar.value = '';
    
    this.pesquisarFilmePorTitulo(titulo);
  }

  pesquisarFilmePorTitulo(titulo: string){
    const filme: Filme = this.filmeService.buscarFilmePorTitulo(titulo);
    let erro: Error = new Error();

    erro.message = 'Filme não Encontrado!';

    if(filme == null){
      this.exibirErro(erro);
    }
    else{
      this.redirecionarUser(filme.id);
    }
  }

  mudarCarrossel(event: any) {
    const index = event.to;

    let url = this.urlImg + this.filmesPopulares[index].imgBackdrop;

    this.imgCardCarrossel.src = url;
    this.tituloFilme.textContent = this.filmesPopulares[index].titulo;
    this.descFilme.textContent = this.filmesPopulares[index].descricao;
  }

  getFilmesPopulares() {
    this.filmeService.buscarFilmesPop()
    .then((listaFilmes: Filme[]) => this.iniciarCardCarrossel(listaFilmes))
    .then((listaFilmes: Filme[]) => this.gerarCarrossel(listaFilmes))
    .then((listaFilmes: Filme[]) => this.gerarGrid(listaFilmes, false, false))
    .catch((erro: Error) => this.exibirErro(erro));

  }

  getFilmesCartaz(){
    this.filmeService.buscarFilmesCartaz()
    .then((listaFilmes: Filme[]) => this.gerarGrid(listaFilmes, true, true))
    .catch((erro: Error) => this.exibirErro(erro));
  }

  getFilmesMaisVotados(){
    this.filmeService.buscarFilmesMaisVotados()
    .then((listaFilmes: Filme[]) => this.gerarGrid(listaFilmes, true, false))
    .catch((erro: Error) => this.exibirErro(erro));
  }

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

  gerarCarrossel(listaFilmes: Filme[]): Filme[] {
    this.divCarrossel.classList.add('click-img');
    const carroseis = this.divImgsCarrossel.childNodes;
    let i = 0;

    carroseis.forEach(car => {
      let img = car.firstChild as HTMLImageElement;
      img.src = this.urlImg + listaFilmes[i].imgPoster;
      i++;
    })

    return listaFilmes;
  }

  private redirecionarUser(id: number){
    window.location.href = `filme-detalhe.html?id=${id}`;
  }

  iniciarCardCarrossel(listaFilmes: Filme[]): Filme[] {
    this.filmesPopulares = listaFilmes;

    this.imgCardCarrossel.src = this.urlImg + listaFilmes[0].imgBackdrop;
    this.tituloFilme.textContent = listaFilmes[0].titulo;
    this.descFilme.textContent = listaFilmes[0].descricao;

    return listaFilmes;
  }

  criarSeparador(tipoDeFilmes: string){
    const separador = document.createElement("div");
    const tipo = document.createElement("h1");

    tipo.classList.add("fs-1", "fw-bold", "mb-3", "mt-4","letra");
    tipo.textContent = tipoDeFilmes;

    separador.classList.add("border-top", "border-warning", "mt-3", "mb-3");

    this.gridCards.appendChild(separador);
    this.gridCards.appendChild(tipo);
  }

  private gerarGrid(listaFilmes: Filme[], precisaDeLinha: boolean, estaEmCartaz: boolean) {
    let i = 0;

    if(precisaDeLinha){
      if(estaEmCartaz){
        this.criarSeparador('Filmes em Cartaz');
      }
      else{
        this.criarSeparador('Filmes mais Votados');
      }
    }

    for(let filme of listaFilmes){
      if(i > 5 && i != (listaFilmes.length - 2) && i != (listaFilmes.length - 1)){
        const card = this.gerarCards(filme);
        
        this.gridCards.appendChild(card);
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

}

window.addEventListener("load", () => new TelaInicio());
