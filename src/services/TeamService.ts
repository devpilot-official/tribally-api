import httpStatus from 'http-status';
import { redis } from "@/config/redis";
import ApiError from "@/utils/ApiError";
import { asyncRandomString } from '@/utils/utils';
import { CreateTeam, UpdateTeamPoint } from '@/models/team.model';

/**
 * 
 * 
 * @export
 * @class TeamService
 */
export class TeamService {
    Create = async (dto: CreateTeam): Promise<CreateTeam> => {
        const teamId  = `${await asyncRandomString(4)}${Date.now()}-${dto.name}`.toLowerCase()

        try {
            const teams = JSON.parse(await redis.get('teams'))

            if (!teams) {
                await redis.set('teams', JSON.stringify([{ teamId, ...dto }]))
            } else {
                teams.push({ teamId, ...dto })
                await redis.set('teams', JSON.stringify(teams))
            }
            
            return dto
        } catch (error) {
            throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, error.message)
        }
    }

    GetTeams = async () => {
        try {
            const teams = JSON.parse(await redis.get('teams'))
            if (!teams) return { teams: [] }

            teams.sort((prevTeam: any, nextTeam: any) => parseFloat(nextTeam.points) - parseFloat(prevTeam.points));

            return { teams }
        } catch (error) {
            throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, error.message)
        }
    }
    
    GetSingleTeam = async (teamId: string) => {
        try {
            const teams = JSON.parse(await redis.get('teams'))
            if (!teams) throw new ApiError(httpStatus.BAD_REQUEST, 'no teams!')

            const team = teams.find((team: any) => team.teamId === teamId);
            if (!team) throw new ApiError(httpStatus.BAD_REQUEST, 'team not found!')

            return { team }
        } catch (error) {
            throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, error.message)
        }
    }

    UpdateTeam = async (payload: UpdateTeamPoint) => {
        const { teamId, points } = payload
        
        try {
            const teams = JSON.parse(await redis.get('teams'))
            if (!teams) throw new ApiError(httpStatus.BAD_REQUEST, 'teams record not available!')

            const team = teams.find((team: any) => team.teamId === teamId);
            if (!team) throw new ApiError(httpStatus.BAD_REQUEST, 'team not found!')
            
            teams.forEach((t: any) => {
                if (t.teamId === teamId) {
                    t.points += points
                    return t
                }
            })

            await redis.set('teams', JSON.stringify(teams))
            return { team }
        } catch (error) {
            throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, error.message)
        }
    }
}