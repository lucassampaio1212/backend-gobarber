import { Request, Response } from 'express';
import { container } from 'tsyringe';

import  ListProviderMonthAvailabilit from '@modules/appointments/services/ListProviderMonthAvailabilityService';

export default class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const {provider_id} = request.params;
    const {month, year} = request.query;

    const ListProviderMonthAvailability = container.resolve( ListProviderMonthAvailabilit);

    const providers = await ListProviderMonthAvailability.execute({
      provider_id,
      month:Number(month),
      year: Number(year)
    });

    return response.json(providers);
  }
}
