import httpStatus from 'http-status';
import moment from 'moment';
import { MatchupCreation, Matchups } from '@/models/matchaup.model';
import { TeamService } from "@/services/TeamService";
import { redis } from "@/config/redis";
import ApiError from "@/utils/ApiError";
import { asyncRandomString } from '@/utils/utils';

/**
 * 
 * 
 * @export
 * @class MatchupService
 */
export class MatchupService {
    private duration: number = 2
    private teamService: TeamService;
    constructor() {
        this.teamService = new TeamService();
    }
    Create = async (dto: MatchupCreation): Promise<MatchupCreation> => {
        const gameId  = `${await asyncRandomString(6)}${Date.now()}`

        try {
            const games = JSON.parse(await redis.get('games'))

            if (!games) {
                await redis.set('games', JSON.stringify([{ gameId, ...dto }]))
            } else {
                games.push({ gameId, ...dto })
                await redis.set('games', JSON.stringify(games))
            }
            
            return dto
        } catch (error) {
            throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, error.message)
        }
    }

    GetGames = async () => {
        try {
            const games = JSON.parse(await redis.get('games'))
            if (!games) return { games: [] }

            for (const game of games) {
                const { team: p1 } = await this.teamService.GetSingleTeam(game.player1)
                const { team: p2 } = await this.teamService.GetSingleTeam(game.player2)
                game.player1 = p1.name
                game.player2 = p2.name
            }
            return { games }
        } catch (error) {
            throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, error.message)
        }
    }
    
    GetSingleGame = async (gameId: string) => {
        try {
            const games = JSON.parse(await redis.get('games'))
            if (!games) throw new ApiError(httpStatus.BAD_REQUEST, 'no games!')

            const game = games.find((game: any) => game.gameId === gameId);
            if (!game) throw new ApiError(httpStatus.BAD_REQUEST, 'game not found!')

            return { game }
        } catch (error) {
            throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, error.message)
        }
    }

    UpdateMatchStatus = async (payload: any) => {
        const { gameId, status } = payload
        
        try {
            const { game } = await this.GetSingleGame(gameId)
            if (!game) throw new ApiError(httpStatus.BAD_REQUEST, 'game not found!')

            const { games } = await this.GetGames()
            if (!games) throw new ApiError(httpStatus.BAD_REQUEST, 'no!')

            for (const g of games) {
                if (g.gameId === gameId) {
                    g.status = status
                    if (status === 'finished') {
                        const { teams } = await this.teamService.GetTeams()
                        if (g.p1Score > g.p2Score) {
                            teams.forEach((team: any) => {
                                if (team.teamId === g.player1) {
                                    team.points += 10
                                    return team
                                }
                            })
                        } else {
                            teams.forEach((team: any) => {
                                if (team.teamId === g.player2) {
                                    team.points += 10
                                    return team
                                }
                            })
                        }
                        await redis.set('teams', JSON.stringify(teams))
                    }
                }
            }

            await redis.set('games', JSON.stringify(games))

            return { game: { ...game, status } }
        } catch (error) {
            throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, error.message)
        }
    }

    UpdateScore = async (payload: any) => {
        const { gameId, p1Score, p2Score } = payload
        
        try {
            const { game } = await this.GetSingleGame(gameId)
            if (!game) throw new ApiError(httpStatus.BAD_REQUEST, 'game not found!')
            if (game.status !== 'ongoing') throw new ApiError(httpStatus.BAD_REQUEST, 'game already concluded!')

            const { games } = await this.GetGames()
            if (!games) throw new ApiError(httpStatus.BAD_REQUEST, 'no games!')

            games.forEach((g: any) => {
                if (g.gameId === gameId) {
                    g.p1Score = p1Score
                    g.p2Score = p2Score
                    return g
                }
            });

            await redis.set('games', JSON.stringify(games))
            return { game: { ...game, p1Score, p2Score } }
        } catch (error) {
            throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, error.message)
        }
    }
}

// games.forEach((game: any) => {
//     if ((new Date(Date.now()) >= new Date(`${game.matchDate}`)) && (new Date(Date.now()) < new Date(moment(game.matchDate).add(this.duration, 'h').toString()))) {
//         game.status = 'ongoing'
//         return game
//     }

//     if (new Date(moment(game.matchDate).add(this.duration, 'h').toString()) <= new Date(Date.now())) {
//         game.status = 'finished'
//         return game
//     }
// });