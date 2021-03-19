import CreateAppointmentService from "@modules/appointments/services/CreateAppointmentService";
import { parseISO } from "date-fns";
import { Request, Response } from "express";
import { container } from "tsyringe";


export default class AppointmetsController {
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const user_id = request.user.id;
      const { provider_id, date } = request.body;
      const parsedDate = parseISO(date);
      const createAppointment = container.resolve(CreateAppointmentService)

      const appointments = await createAppointment.execute({ date: parsedDate, provider_id,user_id });

      return response.json(appointments);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  }
}
