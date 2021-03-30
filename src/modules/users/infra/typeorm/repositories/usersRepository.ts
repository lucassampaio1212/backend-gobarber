import ICreateUserDTO from "@modules/users/dtos/ICreateUserDTO";
import IFindAllProvidersDTO from "@modules/users/dtos/IFindAllProvidersDTO";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import { getRepository, Not, Repository } from "typeorm";
import User from "../entities/User";

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User> //criar essa variavel para fazer as manipulações de dados

  constructor() {
    this.ormRepository = getRepository(User); // aqui eu pego ela com {this} e faço ela receber o valor de getRepository para ter todos os metados do typeORM
  }
  public async findByID(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);

    return user;
  }
  public async findByEmail(email: string): Promise<User | undefined> {
     const user = await this.ormRepository.findOne({
       where: { email }
     });

     return user;
  }

  public async findAllProviders({provider}: IFindAllProvidersDTO): Promise<User[]>{
    let users: User[];
     users = await this.ormRepository.find({
      where: {
        provider: true,
      }
    })

    if(provider) {
      users = await this.ormRepository.find({
        where: {
          provider: Not(false)
        }
      })
    }else {
      users = await this.ormRepository.find();
    }

    return users;

  }

 public async create({name,email,password,provider}: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({
      name,
      email,
      password,
      provider,
    });

    await this.ormRepository.save(user);
    return user;
  }
  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user)
  }


}
export default UsersRepository;
