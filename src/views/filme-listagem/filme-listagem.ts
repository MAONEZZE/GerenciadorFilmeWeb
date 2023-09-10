import 'bootstrap';

import './filme-listagem.css';
import { Filme } from "../../models/filme";
import { FilmeService } from "../../services/filme.service";
import { FilmeFavoritoService } from '../../services/filme-favoritos.service';
import { FilmeUnitario } from '../../models/filmeUnitario';
import { FilmeBase } from '../../models/filmeBase';

class FilmesCartaz{
  private filmeService: FilmeService;
  private filmeFavoritoService: FilmeFavoritoService;
  private urlImg = 'https://image.tmdb.org/t/p/original';

  gridCards: HTMLDivElement;
  
  constructor(){
    this.filmeFavoritoService = new FilmeFavoritoService();
    this.filmeService = new FilmeService();
    this.registrarElementos();
    this.registrarEventos();
    this.getFilmes();
  }

  private redirecionarUser(id: number){
    window.location.href = `filme-detalhe.html?id=${id}`;
  }

  private gerarGrid(listaFilmes: Filme[]) {

    for(let filme of listaFilmes){
      const card = this.gerarCards(filme);
      
      this.gridCards.appendChild(card);
    }
  }

  private async pegarFilmes(arrayIdFilmeFav: any[]){
    for (let i = 0; i < arrayIdFilmeFav.length; i++){
      const filme: FilmeUnitario = await this.filmeService.buscarPorId(arrayIdFilmeFav[i].id);

      const card = this.gerarCards(filme);
      
      this.gridCards.appendChild(card);
    }
  }

  private gerarCards(filme: FilmeBase): HTMLDivElement {
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

  registrarElementos(){
    this.gridCards = document.getElementById("divGridCard") as HTMLDivElement;
  }

  registrarEventos(){

  }

  getFilmes(){
    
    const url = new URLSearchParams(window.location.search);

    const tipoBusca = url.get('tipo');

    this.obterTitulo(tipoBusca!);

    if(tipoBusca != 'filmeFavoritos'){
      this.filmeService.buscarFilme(tipoBusca!)
      .then((listaFilmes: Filme[]) => this.gerarGrid(listaFilmes))
      .catch((erro: Error) => this.exibirErro(erro));
    }
  }

  obterTitulo(tipoBusca: string){
    const titulo = document.getElementById("tituloPagina") as HTMLElement;

    switch(tipoBusca){
      case 'movie/popular':
        titulo.textContent = 'Filmes Populares';
        break;

      case 'movie/top_rated':
        titulo.textContent = 'Filmes Mais Votados';
        break;

      case 'movie/upcoming':
        titulo.textContent = 'Filmes em Cartaz';
        break;

      case 'filmeFavoritos':
        titulo.textContent = 'Filmes Favoritos';
        const arrayIdFilmeFav = this.filmeFavoritoService.obterListaFav();
        this.pegarFilmes(arrayIdFilmeFav);
        break;
    }

    titulo.classList.add("fs-1", "fw-bold", "mb-3");
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
}

window.addEventListener('load', () => new FilmesCartaz());