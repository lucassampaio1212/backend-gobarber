import { injectable, inject } from 'tsyringe';
import IAppointmentRepository from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointments';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheprovider';



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

    const cachedData = await this.cacheProvider.recove('asd');

    console.log(cachedData);

    const appointments = await this.appointmentsRepository.findAllInDayFromProvider({
      provider_id,
      day,
      month,
      year
    })

    return appointments

  }
}

export default ListProviderAppointmentsService;
