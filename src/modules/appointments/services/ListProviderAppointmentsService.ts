import { injectable, inject } from 'tsyringe';
import IAppointmentRepository from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointments';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheprovider';
import { classToClass } from 'class-transformer';



interface IRequest {
  provider_id: string;
  month: number;
  year: number;
  day: number;
}
@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ provider_id , month, year, day }: IRequest): Promise<Appointment[]> {

    const cacheKey = `provider-appointments:${provider_id}:${year}-${month}-${day}`;

    let appointments = await this.cacheProvider.recover<Appointment[]>(
      cacheKey,
    );

    if (!appointments) {
      appointments = await this.appointmentsRepository.findAllInDayFromProvider(
        {
          provider_id,
          day,
          month,
          year,
        },
      );
    }

    await this.cacheProvider.save(cacheKey, classToClass(appointments));

    return appointments;
  }
}

export default ListProviderAppointmentsService;
