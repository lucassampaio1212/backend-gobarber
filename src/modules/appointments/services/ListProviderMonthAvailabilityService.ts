import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate } from 'date-fns';
import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';
import IAppointmentRepository from '../repositories/IAppointmentsRepository';


interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type Iresponse = Array<{
  day: number;
  available: boolean;
}>

@injectable()
class ListProviderMonthAvailabilit {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentRepository,
  ) {}

  public async execute({ provider_id , month, year }: IRequest): Promise<Iresponse> {

    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider({
      provider_id,
      month,
      year,
    });

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1)); // ESSA VARIAVEL VAI RECEBER OS NUMERO DE DIA DO MES

    const eachDayArray = Array.from(
      {
        length: numberOfDaysInMonth,
      },
      (_, index) => index + 1,
    ); // E ESSA VARIAVEL VAI MOSTRA UMA LISTA COM TODOS OS DIAS DO MES

    const availability = eachDayArray.map(day => {
      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });

      return {
        day,
        available: appointmentsInDay.length < 10,
      };
    });

    return availability;

  }
}

export default ListProviderMonthAvailabilit;
