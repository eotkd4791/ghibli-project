import { Arg, FieldResolver, Int, Query, Resolver, Root } from 'type-graphql';
import { Cut } from '../entities/Cut';
import { Film } from '../entities/Film';
import ghibliData from '../data/ghibli';

@Resolver(Cut)
export class CutResolver {
  @Query(() => [Cut])
  cuts(@Arg('filmId', () => Int) filmId: Film['id']) {
    return ghibliData.cuts.filter((cut) => cut.filmId === filmId);
  }

  @Query(() => Cut, { nullable: true })
  cut(@Arg('cutId', () => Int) cutId: number) {
    return ghibliData.cuts.find((cut) => cut.id === cutId);
  }

  @FieldResolver(() => Film, { nullable: true })
  film(@Root() cut: Cut) {
    return ghibliData.films.find((film) => film.id === cut.filmId);
  }
}
