import { redis } from "@/config/redis";
import { MatchupService } from "@/services/MatchupService";
import ApiError from "@/utils/ApiError";
import httpStatus from 'http-status';

export class MatchupController {
    private matchupService: MatchupService;
    constructor() {
        this.matchupService = new MatchupService();
    }

    /**
     * Create games
     * @route POST /matchup
     * @param {any} req
     * @param {any} res
     * @param {any} next
     * @returns {Promise<Object>}
     * @memberOf MatchupController
     */
    CreateMatchup = async (req: any, res: any, next: any) => {
        try {
            const create = await this.matchupService.Create({ ...req.body, p1Score: 0, p2Score: 0, status: 'not started' })

            res
            .status(httpStatus.CREATED)
            .json({
                code: httpStatus.CREATED,
                message: "User created",
                data: create
            });
        } catch (error) {
            next(error);
        }
    }


    /**
     * Get games
     * @route GET /matchup
     * @param {any} req
     * @param {any} res
     * @param {any} next
     * @returns {Promise<Object>}
     * @memberOf MatchupController
     */
    GetGames = async (req: any, res: any, next: any) => {
        try {
            res
            .status(httpStatus.OK)
            .json({
                code: httpStatus.OK,
                message: "All games",
                data: await this.matchupService.GetGames()
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get game
     * @route GET /mattchup/:gameId
     * @param {any} req
     * @param {any} res
     * @param {any} next
     * @returns {Promise<Object>}
     * @memberOf MatchupController
     */
    GetSingleGame = async (req: any, res: any, next: any) => {
        try {
            res
            .status(httpStatus.OK)
            .json({
                code: httpStatus.OK,
                message: "Get game",
                data: await this.matchupService.GetSingleGame(req.params.gameId)
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Put game
     * @route GET /matchup/status
     * @param {any} req
     * @param {any} res
     * @param {any} next
     * @returns {Promise<Object>}
     * @memberOf MatchupController
     */
    UpdateMatchStatus = async (req: any, res: any, next: any) => {
        try {
            res
            .status(httpStatus.OK)
            .json({
                code: httpStatus.OK,
                message: "Update game status",
                data: await this.matchupService.UpdateMatchStatus(req.body)
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Put game
     * @route GET /matchup/score/:gameId
     * @param {any} req
     * @param {any} res
     * @param {any} next
     * @returns {Promise<Object>}
     * @memberOf MatchupController
     */
    UpdateScore = async (req: any, res: any, next: any) => {
        try {
            res
            .status(httpStatus.OK)
            .json({
                code: httpStatus.OK,
                message: "Update game score",
                data: await this.matchupService.UpdateScore(req.body)
            });
        } catch (error) {
            next(error);
        }
    }
}