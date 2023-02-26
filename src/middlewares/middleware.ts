import httpStatus from 'http-status';
import ApiError from '@/utils/ApiError';
import { NextFunction, Request, Response } from 'express';
import { statuses } from '@/utils/utils';
import { stat } from 'fs';

export const payloadValidation = async (req: Request, res: Response, next: NextFunction) => {
  const { player1, player2 } = req.body
  const messages = []

  try {
    if (player1 === "" || typeof player1 === 'undefined') messages.push('Player 1 is required!')
    if (player2 === "" || typeof player2 === 'undefined') messages.push('Player 2 is required!')

    if (messages.length !== 0) throw new ApiError (httpStatus.BAD_REQUEST, messages)

    next()
  } catch (err) {
    next(err)
  }
}

export const teamPayloadValidation = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body
  const messages = []

  try {
    if (name === "" || typeof name === 'undefined') messages.push('Player 1 is required!')

    if (messages.length !== 0) throw new ApiError (httpStatus.BAD_REQUEST, messages)

    next()
  } catch (err) {
    next(err)
  }
}

export const statusValidation = async (req: Request, res: Response, next: NextFunction) => {
  const { status } = req.body
  const messages = []

  try {
    const correctStatus = statuses.find((s: any) => s === status);
    if (!correctStatus) throw new ApiError(httpStatus.BAD_REQUEST, 'unknown status!')

    next()
  } catch (err) {
    next(err)
  }
}