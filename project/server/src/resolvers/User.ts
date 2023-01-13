import { IsEmail, IsString } from 'class-validator';
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import {
  createAccessToken,
  setRefreshTokenHeader,
  createRefreshToken,
  REFRESH_JWT_SECRET_KEY,
} from '../utils/jwt-auth';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import User from '../entities/User';
import { MyContext } from '../apollo/createApolloServer';
import GraphQLUpload from 'graphql-upload/GraphQLUpload';
import { FileUpload } from 'graphql-upload/Upload';
import { createWriteStream } from 'fs';

@ObjectType({ description: '액세스 토큰 새로고침 반환 데이터' })
class RefreshAccessTokenResponse {
  @Field() accessToken: string;
}

@InputType()
export class SignUpInput {
  @Field() @IsEmail() email: string;

  @Field() @IsString() username: string;

  @Field() @IsString() password: string;
}

@InputType({ description: '로그인 인풋 데이터' })
export class LoginInput {
  @Field() @IsString() emailOrUsername: string;

  @Field() @IsString() password: string;
}

@ObjectType({ description: '필드 에러 타입' })
class FieldError {
  @Field() field: string;

  @Field() message: string;
}

@ObjectType({ description: '로그인 반환 데이터' })
class LoginResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;

  @Field({ nullable: true })
  accessToken?: string;
}

@Resolver(User)
export class UserResolver {
  @UseMiddleware(isAuthenticated)
  @Mutation(() => Boolean)
  async uploadProfileImage(
    @Ctx() { verifiedUser }: MyContext,
    @Arg('file', () => GraphQLUpload)
    { createReadStream, filename }: FileUpload,
  ) {
    if (verifiedUser) {
      const realFileName = `${verifiedUser.userId}${filename}`;
      const filePath = `public/${realFileName}`;

      return new Promise((resolve, reject) => {
        createReadStream()
          .pipe(createWriteStream(filePath))
          .on('finish', async () => {
            await User.update(
              { id: verifiedUser.userId },
              { profileImage: realFileName },
            );
            return resolve(true);
          })
          .on('error', () => reject(new Error('file upload failed')));
      });
    }
  }

  @UseMiddleware(isAuthenticated)
  @Mutation(() => Boolean)
  async logout(@Ctx() { verifiedUser, res, redis }: MyContext) {
    if (verifiedUser) {
      setRefreshTokenHeader(res, '');
      await redis.del(String(verifiedUser.userId));
    }
    return true;
  }

  @UseMiddleware(isAuthenticated)
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext) {
    if (!ctx.verifiedUser) {
      return null;
    }

    return User.findOne({
      where: {
        id: ctx.verifiedUser.userId,
      },
    });
  }

  @Mutation(() => User)
  async signUp(@Arg('signUpInput') signUpInput: SignUpInput) {
    const { email, username, password } = signUpInput;

    const hashedPw = await argon2.hash(password);
    const newUser = User.create({
      email,
      username,
      password: hashedPw,
    });

    await User.insert(newUser);
    return newUser;
  }

  @Mutation(() => LoginResponse)
  public async login(
    @Arg('loginInput') loginInput: LoginInput,
    @Ctx() { res, redis }: MyContext,
  ): Promise<LoginResponse> {
    const { emailOrUsername, password } = loginInput;

    const user = await User.findOne({
      where: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });
    if (!user) {
      return {
        errors: [
          { field: 'emailOrUsername', message: '해당하는 유저가 없습니다.' },
        ],
      };
    }

    const isValid = await argon2.verify(user.password, password);

    if (!isValid) {
      return {
        errors: [
          { field: 'password', message: '비밀번호를 올바르게 입력해주세요.' },
        ],
      };
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    await redis.set(String(user.id), refreshToken);

    setRefreshTokenHeader(res, refreshToken);

    return { user, accessToken };
  }

  @Mutation(() => RefreshAccessTokenResponse, { nullable: true })
  async refreshAccessToken(
    @Ctx() { req, res, redis }: MyContext,
  ): Promise<RefreshAccessTokenResponse | null> {
    const refreshToken = req.cookies.refreshtoken;
    if (!refreshToken) return null;

    let tokenData: any = null;

    try {
      tokenData = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET_KEY || REFRESH_JWT_SECRET_KEY,
      );
    } catch (err) {
      return null;
    }

    if (!tokenData) return null;

    const storedRefreshToken = await redis.get(String(tokenData.userId));
    if (!storedRefreshToken) return null;
    if (!(storedRefreshToken === refreshToken)) return null;

    const user = await User.findOne({ where: { id: tokenData.userId } });
    if (!user) return null;

    const newAccessToken = createAccessToken(user);
    const newRefreshToken = createRefreshToken(user);

    await redis.set(String(user.id), newRefreshToken);

    res.cookie('refreshtoken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    return { accessToken: newAccessToken };
  }
}
