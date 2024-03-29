import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { CutVote } from '../entities/CutVote';
import { MyContext } from '../apollo/createApolloServer';
import { isAuthenticated } from '../middlewares/isAuthenticated';
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

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated)
  async vote(
    @Arg('cutId', () => Int) cutId: number,
    @Ctx() { verifiedUser }: MyContext,
  ) {
    if (verifiedUser) {
      const { userId } = verifiedUser;
      const alreadyVoted = await CutVote.findOne({
        where: {
          cutId,
          userId,
        },
      });
      if (alreadyVoted) {
        await alreadyVoted.remove();
        return true;
      }
      const vote = CutVote.create({ cutId, userId });
      await vote.save();
      return true;
    }
    return false;
  }

  @FieldResolver(() => Film, { nullable: true })
  film(@Root() cut: Cut) {
    return ghibliData.films.find((film) => film.id === cut.filmId);
  }

  @FieldResolver(() => Int)
  async votesCount(@Root() cut: Cut, @Ctx() { cutVoteLoader }: MyContext) {
    const cutVotes = await cutVoteLoader.load({ cutId: cut.id });
    return cutVotes.length;
  }

  @FieldResolver(() => Boolean)
  async isVoted(
    @Root() cut: Cut,
    @Ctx() { cutVoteLoader, verifiedUser }: MyContext,
  ) {
    if (verifiedUser) {
      const votes = await cutVoteLoader.load({ cutId: cut.id });
      return votes.some((vote) => vote.userId === verifiedUser.userId);
    }
    return false;
  }
}
