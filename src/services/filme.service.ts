import { API_KEY } from "../../secrets";
import { Filme } from "../models/filme";
import { FilmeUnitario } from "../models/filmeUnitario";

export class FilmeService {
  private listaFilmesGerais: Filme[] = [];
  private urlPesquisaId: string = 'https://api.themoviedb.org/3/movie/';

  async buscarFilmesPop(): Promise<Filme[]> {
    const resposta = await fetch('https://api.themoviedb.org/3/movie/popular?language=pt-BR', this.obterHeader())
    //Caso não coloque nenhum metodo no fetch, por padrão é GET

    return this.obterResposta(resposta);
  }

  async buscarFilmesMaisVotados() {
    const resposta = await fetch('https://api.themoviedb.org/3/movie/top_rated?language=pt-BR', this.obterHeader())
    return this.obterResposta(resposta);
  }

  async buscarFilmesCartaz() {
    const resposta = await fetch('https://api.themoviedb.org/3/movie/upcoming?language=pt-BR', this.obterHeader())
    return this.obterResposta(resposta);
  }

  async buscarFilme(endPoint: string){
    const resposta = await fetch(`https://api.themoviedb.org/3/${endPoint}?language=pt-BR`, this.obterHeader())
    return this.obterResposta(resposta);
  }

  async obterResposta(res: Response): Promise<Filme[]> {
    if (res.ok) {
      const obj = await res.json();
      return this.mapearFilme(obj);
    }
    throw new Error('Não foi posivel retornar os filmes!');
  }

  obterHeader() {
    return {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
      }
    }
  }

  async buscarPorId(id: string): Promise<FilmeUnitario>{
    const sufixo = '?append_to_response=images,videos,credits&language=pt-BR&include_image_language=en,null';

    const response = await fetch(this.urlPesquisaId + id + sufixo, this.obterHeader());

    return this.obterRespostaUnitaria(response);
  }

  async obterRespostaUnitaria(res: Response): Promise<FilmeUnitario> {
    if (res.ok) {
      const obj = await res.json();
      return this.mapearFilmeUnitario(obj);
    }
    throw new Error('Não foi posivel retornar o filme!');
  }

  buscarFilmePorTitulo(titulo: string): Filme{
    for(let filme of this.listaFilmesGerais){
      if(titulo == filme.titulo){
        return filme;
      }
    }
    return new Filme;
  }

  mapearFilmeUnitario(res: any): FilmeUnitario{
    let filmeObj: FilmeUnitario =
    {
      id: res.id,
      titulo: res.title,
      imgPoster: res.poster_path,
      descricao: res.overview,
      videoTreiler: res.videos.results,
      dataLancamento: res.release_date,

      genero: res.genres? res.genres: res.genre_ids,
      creditoAtores: res.credits.cast,
      creditoTrabalhadores: res.credits.crew,
      mediaVotos: res.vote_average,
      totalVotos: res.vote_count
    }
    return filmeObj;
  }

  mapearFilme(obj: any): Filme[] {
    const listaFilmes: Filme[] = [];

    obj.results.map((res: any) => {
      
      const filme = {
        id: res.id,
        titulo: res.title,
        imgBackdrop: res.backdrop_path,
        imgPoster: res.poster_path,
        descricao: res.overview,
      }
      listaFilmes.push(filme);
      this.listaFilmesGerais.push(filme);
    });

    return listaFilmes;
  }

}