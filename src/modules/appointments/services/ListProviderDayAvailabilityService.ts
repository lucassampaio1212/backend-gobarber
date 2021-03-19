import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';
//import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';
import IAppointmentRepository from '../repositories/IAppointmentsRepository';


interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type Iresponse = Array<{
  hour: number;
  available: boolean;
}>

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentRepository,
  ) {}

  public async execute({ provider_id , month, year, day }: IRequest): Promise<Iresponse> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider({
      provider_id,
      day,
      month,
      year
    });

    const hourStart = 8;

    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + hourStart,
    );

    const currentDate = new Date(Date.now());

    const availability = eachHourArray.map(hour => {
      const hasAppointmentInHour = appointments.find(
        appointment => getHours(appointment.date) === hour,
      );
      const compareDate = new Date(year, month - 1, day, hour);
      return {
        hour,
        available: !hasAppointmentInHour && isAfter(compareDate, currentDate),
      };
    });

    return availability;
  }

}
export default ListProviderDayAvailabilityService;
