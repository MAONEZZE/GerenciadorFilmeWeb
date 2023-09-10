export class FilmeFavoritoService{
  private obterDados(){
    const dados = localStorage.getItem('api-filmes-favoritos');

    return dados? JSON.parse(dados): [];

  }

  favoritar(id: string){
    const dados = this.obterDados() as any[];
    
    const objString = {
      id: id
    }

    if(dados == null){
      localStorage.setItem('api-filmes-favoritos', JSON.stringify(objString));
    }
    else{
      let index = dados.findIndex((x: any) => x.id == objString.id);

      if(index == -1){
        dados.push(objString);
      }
      else{
        dados.splice(index, 1);
      }

      localStorage.setItem('api-filmes-favoritos', JSON.stringify(dados));
    }
  }

  obterListaFav(): any[]{
    return this.obterDados();
  }

  verificarFavorito(id: string): boolean{
    const dados = this.obterDados() as any[];

    return dados.find((x: any) => x.id == id) as boolean;
  }
}