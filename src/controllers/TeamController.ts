import { redis } from "@/config/redis";
import { TeamService } from "@/services/TeamService";
import ApiError from "@/utils/ApiError";
import httpStatus from 'http-status';

export class TeamController {
    private teamService: TeamService;
    constructor() {
        this.teamService = new TeamService();
    }

    /**
     * Create team
     * @route POST /team
     * @param {any} req
     * @param {any} res
     * @param {any} next
     * @returns {Promise<Object>}
     * @memberOf TeamController
     */
    CreateTeam = async (req: any, res: any, next: any) => {
        try {
            const create = await this.teamService.Create({ ...req.body, points: 0 })

            res
            .status(httpStatus.CREATED)
            .json({
                code: httpStatus.CREATED,
                message: "Team created",
                data: create
            });
        } catch (error) {
            next(error);
        }
    }


    /**
     * Get team
     * @route GET /team
     * @param {any} req
     * @param {any} res
     * @param {any} next
     * @returns {Promise<Object>}
     * @memberOf TeamController
     */
    GetTeams = async (req: any, res: any, next: any) => {
        try {
            res
            .status(httpStatus.OK)
            .json({
                code: httpStatus.OK,
                message: "All teams",
                data: await this.teamService.GetTeams()
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get team
     * @route GET /mattchup/:teamId
     * @param {any} req
     * @param {any} res
     * @param {any} next
     * @returns {Promise<Object>}
     * @memberOf TeamController
     */
    GetSingleTeam = async (req: any, res: any, next: any) => {
        try {
            res
            .status(httpStatus.OK)
            .json({
                code: httpStatus.OK,
                message: "Get game",
                data: await this.teamService.GetSingleTeam(req.params.teamId)
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * PUT team
     * @route GET /mattchup/:teamId
     * @param {any} req
     * @param {any} res
     * @param {any} next
     * @returns {Promise<Object>}
     * @memberOf TeamController
     */
    UpdateTeam = async (req: any, res: any, next: any) => {
        try {
            res
            .status(httpStatus.OK)
            .json({
                code: httpStatus.OK,
                message: "Team updated",
                data: await this.teamService.UpdateTeam(req.body)
            });
        } catch (error) {
            next(error);
        }
    }
}