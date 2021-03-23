import { Request, Response } from 'express';
import { container } from 'tsyringe';

import  ListProviderDayAvailabilit from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const {day, year,month} = request.query;

    const listProviderDayAvailability = container.resolve(ListProviderDayAvailabilit);

    const providers = await listProviderDayAvailability.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });

    return response.json(providers);
  }
}
