import { isBefore, startOfHour, getHours, format } from 'date-fns';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointments';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheprovider';
import AppError from '../../../shared/errors/AppError';
import IAppointmentRepository from '../repositories/IAppointmentsRepository';
import { inject, injectable } from 'tsyringe';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';


interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
  provider: boolean;
}
@injectable()
class CreateAppointmentService {

  constructor (
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
    ) {

  }

  public async execute({provider_id,user_id,date,provider}: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date)

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("You can't create an appointment on a past date.");
    }

    if (user_id === provider_id) {
      throw new AppError("You can't create an appointment with yourself.");
    }

    if(getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17 ) {
      throw new AppError('You can only create an appointment between 8am and 5pm');
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(appointmentDate,provider_id)

   if (findAppointmentInSameDate) {
     throw new AppError('This appointment is already booked');
   }

   const appointment = await this.appointmentsRepository.create({provider_id,user_id,date:appointmentDate});

   const dateFormatted = format(appointment.date,  "dd/MM/yyyy 'às' HH:mm'h'");

   await this.notificationsRepository.create({
     recipient_id: provider_id,
     content: `Novo agendamento para dia ${dateFormatted}`
   });

   await this.cacheProvider.invalidate(
    `provider-appointments:${provider_id}:${format(
      appointmentDate,
      'yyyy-M-d',
    )}`,
  );


   return appointment;
  }
}
export default CreateAppointmentService;
