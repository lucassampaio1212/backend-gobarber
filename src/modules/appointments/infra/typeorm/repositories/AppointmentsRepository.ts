import {getRepository, Repository} from 'typeorm';
import Appointment from '../entities/Appointments';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from "@modules/appointments/dtos/ICreateAppointmentDTO";


class AppointmentsRepository implements IAppointmentRepository {

  private ormRepository: Repository<Appointment> //criar essa variavel para fazer as manipulações de dados

  constructor() {
    this.ormRepository = getRepository(Appointment); // aqui eu pego ela com {this} e faço ela receber o valor de getRepository para ter todos os metados do typeORM
  }


  public async findByDate(date: Date): Promise< Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date },
    });

    return findAppointment;
  }

  public async create({provider_id,date}:ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      provider_id,
      date
    });
    await this.ormRepository.save(appointment);

    return appointment;
  }



}
export default AppointmentsRepository;
