import {getRepository, Repository, Raw} from 'typeorm';
import Appointment from '../entities/Appointments';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from "@modules/appointments/dtos/ICreateAppointmentDTO";
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';


class AppointmentsRepository implements IAppointmentRepository {

  private ormRepository: Repository<Appointment> //criar essa variavel para fazer as manipulações de dados

  constructor() {
    this.ormRepository = getRepository(Appointment); // aqui eu pego ela com {this} e faço ela receber o valor de getRepository para ter todos os metados do typeORM
  }


  public async findByDate(date: Date, provider_id: string): Promise< Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date, provider_id },
    });

    return findAppointment;
  }

  public async findAllInMonthFromProvider({provider_id,month,year}: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');
    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(dateFieldName =>
          `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`
          ) ,
      }
    })
    return appointments;
  }
  public async findAllInDayFromProvider({provider_id,month,year,day}: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');
    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(dateFieldName =>
          `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
      relations: ['users']
    })
    return appointments;
  }

  public async create({provider_id,date,user_id}:ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      provider_id,
      user_id,
      date,
    });
    await this.ormRepository.save(appointment);

    return appointment;
  }



}
export default AppointmentsRepository;
