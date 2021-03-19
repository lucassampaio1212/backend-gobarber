import { Request, Response } from 'express';
import { container } from 'tsyringe';

import  ListProviderDayAvailabilit from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const {provider_id, day, year,month} = request.body;

    const listProviderDayAvailability = container.resolve(ListProviderDayAvailabilit);

    const providers = await listProviderDayAvailability.execute({
      provider_id,
      day,
      month,
      year
    });

    return response.json(providers);
  }
}
